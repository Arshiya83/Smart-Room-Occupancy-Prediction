# Smart Room Occupancy Prediction

## Machine Learning-Based Smart Room Occupancy Prediction for Energy-Efficient Building Management

Smart Room Occupancy Prediction is a machine learning-based system that predicts whether a room is **Occupied** or **Unoccupied** using environmental sensor data.

The system combines a trained machine learning model with a backend prediction API and a frontend dashboard for monitoring occupancy, environmental conditions, analytics, and energy-saving recommendations.

---

## 📌 Project Overview

Building energy consumption can be reduced by adapting room operation according to occupancy.

This project uses environmental parameters such as:

- Temperature
- Humidity
- Light
- CO₂
- Humidity Ratio

to predict room occupancy.

Based on the predicted occupancy status, the system provides an energy recommendation:

- **Occupied → Normal Operation**
- **Unoccupied → Energy-Saving Mode**

The system provides recommendations based on predictions; it does not directly control physical electrical devices.

---

## 🎯 Objectives

- Predict room occupancy using environmental sensor data.
- Apply machine learning classification algorithms.
- Compare the performance of multiple ML models.
- Provide occupancy predictions through a backend API.
- Display predictions and sensor information through a web dashboard.
- Generate energy-saving recommendations based on occupancy.
- Maintain prediction history for analysis.

---

## 📊 Dataset

The project uses the **UCI Occupancy Detection Dataset**.

Dataset source:

https://archive.ics.uci.edu/dataset/357/occupancy-detection

### Input Features

| Feature | Description |
|---|---|
| Temperature | Room temperature |
| Humidity | Relative humidity |
| Light | Light intensity |
| CO₂ | CO₂ concentration |
| HumidityRatio | Humidity ratio |

### Target

**Occupancy**

- `0` → Unoccupied
- `1` → Occupied

---

## 🤖 Machine Learning Models

The project implements and evaluates the following classification algorithms:

1. Logistic Regression
2. K-Nearest Neighbors (KNN)
3. Decision Tree
4. Support Vector Machine (SVM)

The trained model and preprocessing components are stored in the backend `models/` directory.

---

## 🔧 Data Preprocessing

The machine learning pipeline includes:

- Data quality checking
- Missing-value verification
- Feature selection
- Target preparation
- Feature scaling / normalization
- Train-test preparation
- Model training
- Model comparison

Feature scaling is particularly important for algorithms such as KNN, Logistic Regression, and SVM.

---

## 📈 Model Evaluation

The models are evaluated using classification metrics such as:

- Accuracy
- Precision
- Recall
- F1-Score
- Confusion Matrix
- ROC-AUC

Model comparison results are stored in:

`backend/models/model_comparison.csv`

---

## 🧠 Trained Model

The backend contains the trained machine learning components:

```text
backend/models/
├── feature_info.pkl
├── smartroom_scaler.pkl
├── smartroom_voting_model.pkl
└── model_comparison.csv
