from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
import csv
from datetime import datetime

from services.thingspeak_service import get_latest_sensor_data


# --------------------------------------------------
# Flask application
# --------------------------------------------------

app = Flask(__name__)
CORS(app)


# --------------------------------------------------
# File paths
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "smartroom_voting_model.pkl"
)

SCALER_PATH = os.path.join(
    BASE_DIR,
    "models",
    "smartroom_scaler.pkl"
)

METRICS_PATH = os.path.join(
    BASE_DIR,
    "models",
    "model_comparison.csv"
)

HISTORY_PATH = os.path.join(
    BASE_DIR,
    "prediction_history.csv"
)


# --------------------------------------------------
# Load ML model and scaler
# --------------------------------------------------

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)


FEATURES = [
    "Temperature",
    "Humidity",
    "CO2",
    "Light"
]


# --------------------------------------------------
# Prediction function
# --------------------------------------------------

def predict_occupancy(temperature, humidity, co2, light):

    input_data = pd.DataFrame(
        [[temperature, humidity, co2, light]],
        columns=FEATURES
    )

    scaled_data = scaler.transform(input_data)

    prediction = int(model.predict(scaled_data)[0])

    probabilities = model.predict_proba(scaled_data)[0]

    confidence = float(probabilities[prediction])

    if prediction == 1:
        occupancy = "Occupied"
        recommendation = "Normal operation recommended"
    else:
        occupancy = "Unoccupied"
        recommendation = "Energy-saving mode recommended"

    return {
        "occupancy": occupancy,
        "confidence": round(confidence * 100, 2),
        "recommendation": recommendation,
        "model": "Voting Ensemble"
    }


# --------------------------------------------------
# Prediction history cleanup and migration
# --------------------------------------------------

def cleanup_prediction_history():

    if not os.path.exists(HISTORY_PATH) or os.path.getsize(HISTORY_PATH) == 0:
        return

    try:
        df = pd.read_csv(HISTORY_PATH)
        if df.empty:
            return

        if "entry_id" not in df.columns:
            df.insert(1, "entry_id", "")

        rows_with_id = df[df["entry_id"].astype(str).str.strip().ne("") & df["entry_id"].notna()]
        rows_without_id = df[df["entry_id"].astype(str).str.strip().eq("") | df["entry_id"].isna()]

        cleaned_parts = []
        if not rows_without_id.empty:
            sensor_cols = [c for c in ["temperature", "humidity", "co2", "light", "occupancy"] if c in rows_without_id.columns]
            if sensor_cols:
                mask = (rows_without_id[sensor_cols] != rows_without_id[sensor_cols].shift()).any(axis=1)
                cleaned_without = rows_without_id[mask]
            else:
                cleaned_without = rows_without_id
            cleaned_parts.append(cleaned_without)

        if not rows_with_id.empty:
            cleaned_with = rows_with_id.drop_duplicates(subset=["entry_id"], keep="first")
            cleaned_parts.append(cleaned_with)

        if cleaned_parts:
            final_df = pd.concat(cleaned_parts, ignore_index=True)
            target_cols = [
                "timestamp",
                "entry_id",
                "temperature",
                "humidity",
                "co2",
                "light",
                "occupancy",
                "confidence",
                "recommendation",
                "model"
            ]
            cols_to_use = [c for c in target_cols if c in final_df.columns]
            final_df = final_df[cols_to_use]
            final_df.to_csv(HISTORY_PATH, index=False)
            print(f"[SmartRoom] Verified prediction history: {len(final_df)} unique records.")
    except Exception as e:
        print(f"[SmartRoom] History cleanup warning: {e}")


# Run safe history cleanup/migration on module load
cleanup_prediction_history()


# --------------------------------------------------
# Save prediction history (only new entry_id)
# --------------------------------------------------

def save_prediction_history(sensor_data, prediction):

    entry_id = sensor_data.get("entry_id")
    if entry_id is None:
        return

    entry_id_str = str(entry_id).strip()
    file_exists = os.path.exists(HISTORY_PATH)

    # 1. Read existing prediction_history.csv if it exists
    # 2. Check whether current ThingSpeak entry_id already exists
    # 3. If it already exists, do NOT append another row
    if file_exists and os.path.getsize(HISTORY_PATH) > 0:
        try:
            with open(HISTORY_PATH, "r", newline="", encoding="utf-8") as file:
                reader = csv.reader(file)
                header = next(reader, None)
                if header and "entry_id" in header:
                    entry_idx = header.index("entry_id")
                    for row in reader:
                        if len(row) > entry_idx and str(row[entry_idx]).strip() == entry_id_str:
                            return
        except Exception as e:
            print(f"[SmartRoom] Error checking prediction history: {e}")

    # 4. If it is new, append exactly one row
    write_header = not file_exists or os.path.getsize(HISTORY_PATH) == 0

    with open(HISTORY_PATH, "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)

        if write_header:
            writer.writerow([
                "timestamp",
                "entry_id",
                "temperature",
                "humidity",
                "co2",
                "light",
                "occupancy",
                "confidence",
                "recommendation",
                "model"
            ])

        writer.writerow([
            datetime.now().isoformat(),
            entry_id,
            sensor_data["temperature"],
            sensor_data["humidity"],
            sensor_data["co2"],
            sensor_data["light"],
            prediction["occupancy"],
            prediction["confidence"],
            prediction["recommendation"],
            prediction["model"]
        ])


# --------------------------------------------------
# Health API
# --------------------------------------------------

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "status": "online",
        "message": "Smart Room backend is running"
    })


# --------------------------------------------------
# Manual prediction API
# --------------------------------------------------

@app.route("/api/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Request body is required"
            }), 400

        required_fields = [
            "temperature",
            "humidity",
            "co2",
            "light"
        ]

        missing_fields = [
            field
            for field in required_fields
            if field not in data
        ]

        if missing_fields:

            return jsonify({
                "error": "Missing required fields",
                "missing": missing_fields
            }), 400

        result = predict_occupancy(
            float(data["temperature"]),
            float(data["humidity"]),
            float(data["co2"]),
            float(data["light"])
        )

        return jsonify(result)

    except ValueError:

        return jsonify({
            "error": "Sensor values must be numeric"
        }), 400

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# --------------------------------------------------
# Live ThingSpeak prediction API
# --------------------------------------------------

@app.route("/api/live", methods=["GET"])
def live_prediction():

    try:

        sensor_data = get_latest_sensor_data()

        prediction = predict_occupancy(
            sensor_data["temperature"],
            sensor_data["humidity"],
            sensor_data["co2"],
            sensor_data["light"]
        )

        # Save the live prediction
        save_prediction_history(
            sensor_data,
            prediction
        )

        return jsonify({
            "sensor_data": sensor_data,
            "prediction": prediction
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# --------------------------------------------------
# Model metrics API
# --------------------------------------------------

@app.route("/api/metrics", methods=["GET"])
def metrics():

    try:

        metrics_data = pd.read_csv(METRICS_PATH)

        return jsonify(
            metrics_data.to_dict(orient="records")
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# --------------------------------------------------
# Prediction history API
# --------------------------------------------------

@app.route("/api/history", methods=["GET"])
def history():

    try:

        if not os.path.exists(HISTORY_PATH):

            return jsonify([])

        history_data = pd.read_csv(HISTORY_PATH)
        history_data = history_data.fillna("")

        return jsonify(
            history_data.to_dict(orient="records")
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# --------------------------------------------------
# Start server
# --------------------------------------------------

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )