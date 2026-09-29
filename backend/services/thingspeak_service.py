import requests


THINGSPEAK_URL = "https://api.thingspeak.com/channels/3285964/feeds.json?results=1"


def get_latest_sensor_data():
    response = requests.get(THINGSPEAK_URL, timeout=10)
    response.raise_for_status()

    data = response.json()

    if not data.get("feeds"):
        raise ValueError("No sensor data available from ThingSpeak")

    feed = data["feeds"][0]

    return {
        "temperature": float(feed["field1"]),
        "humidity": float(feed["field2"]),
        "co2": float(feed["field3"]),
        "light": float(feed["field5"]),
        "timestamp": feed["created_at"],
        "entry_id": feed["entry_id"]
    }