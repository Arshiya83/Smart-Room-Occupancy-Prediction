import random
import time
import requests

CHANNEL_ID = 3500681
WRITE_API_KEY = "TUIA10V05WLBNJ2X"
THINGSPEAK_URL = "https://api.thingspeak.com/update"
INTERVAL_SECONDS = 16
READINGS_PER_STATE = 5

print("=" * 60)
print("SmartRoom AI - Simulated IoT Sensor Feed")
print(f"Target Channel : {CHANNEL_ID}")
print(f"Cycle          : {READINGS_PER_STATE} Occupied -> {READINGS_PER_STATE} Unoccupied")
print(f"Interval       : {INTERVAL_SECONDS} seconds")
print("Press Ctrl+C to stop simulation.")
print("=" * 60 + "\n")


def generate_sensor_values(state):
    """
    Generate realistic classroom sensor values based on simulated room state.
    Note: State is only used to generate realistic physical environment features.
    The ML model will independently infer occupancy later.
    """
    if state == "Occupied":
        # OCCUPIED profile:
        # Higher human metabolic CO2, normal workspace lighting, room temperature
        temperature = round(random.uniform(21.0, 26.0), 2)
        humidity = round(random.uniform(35.0, 60.0), 2)
        co2 = round(random.uniform(700.0, 1200.0), 2)
        light = round(random.uniform(300.0, 900.0), 2)
    else:
        # UNOCCUPIED profile:
        # Baseline ambient CO2, minimal/extinguished lights, ambient setback temperature
        temperature = round(random.uniform(20.0, 25.0), 2)
        humidity = round(random.uniform(30.0, 55.0), 2)
        co2 = round(random.uniform(400.0, 600.0), 2)
        light = round(random.uniform(0.0, 100.0), 2)

    return temperature, humidity, co2, light


def run_simulation():
    states = ["Occupied", "Unoccupied"]
    current_state_idx = 0
    readings_count = 0

    while True:
        simulated_state = states[current_state_idx]
        temperature, humidity, co2, light = generate_sensor_values(simulated_state)

        # Send ONLY physical sensor measurements (field1-field4).
        # Simulated state is NOT sent, ensuring genuine ML classification.
        params = {
            "api_key": WRITE_API_KEY,
            "field1": temperature,
            "field2": humidity,
            "field3": co2,
            "field4": light
        }

        try:
            response = requests.get(
                THINGSPEAK_URL,
                params=params,
                timeout=10
            )

            if response.status_code == 200 and response.text.strip() != "0":
                entry_id = response.text.strip()
                print(
                    f"Sent successfully | Simulated State={simulated_state} | "
                    f"Temp={temperature} °C | Humidity={humidity} % | "
                    f"CO2={co2} ppm | Light={light} lux | Entry={entry_id}"
                )
                readings_count += 1

                # Alternate states after READINGS_PER_STATE successful uploads
                if readings_count >= READINGS_PER_STATE:
                    readings_count = 0
                    current_state_idx = (current_state_idx + 1) % len(states)
                    next_state = states[current_state_idx]
                    print(f"--> Switching simulated state to: {next_state}\n")
            else:
                print(
                    f"ThingSpeak rejected update (Rate limit or channel error): "
                    f"HTTP {response.status_code} - Body: {response.text.strip()}"
                )

        except Exception as e:
            print(f"Error sending data to ThingSpeak: {e}")

        time.sleep(INTERVAL_SECONDS)


if __name__ == "__main__":
    try:
        run_simulation()
    except KeyboardInterrupt:
        print("\nSimulation stopped.")