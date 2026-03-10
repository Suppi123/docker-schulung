"""
Weather API Proxy - Backend for Docker Schulung
Proxies weather data from Open-Meteo (no API key required).
"""

import os
import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"


def get_coordinates(city_name: str) -> dict | None:
    """Get coordinates for a city using Open-Meteo Geocoding API."""
    response = requests.get(
        GEOCODING_URL,
        params={"name": city_name, "count": 1},
        timeout=10,
    )
    response.raise_for_status()
    data = response.json()
    results = data.get("results", [])
    if not results:
        return None
    return results[0]


def get_weather(lat: float, lon: float, timezone: str = "auto") -> dict:
    """Get weather forecast from Open-Meteo API."""
    response = requests.get(
        FORECAST_URL,
        params={
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
            "daily": "temperature_2m_max,temperature_2m_min,weather_code",
            "forecast_days": 5,
            "timezone": timezone,
        },
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint for Docker."""
    return jsonify({"status": "ok"})


@app.route("/weather", methods=["GET"])
def weather():
    """
    Get weather for a city.
    Query param: city (e.g. ?city=Berlin)
    """
    city = request.args.get("city", "").strip()
    if not city:
        return jsonify({"error": "Missing 'city' query parameter"}), 400

    try:
        location = get_coordinates(city)
        if not location:
            return jsonify({"error": f"No location found for '{city}'"}), 404

        lat = location["latitude"]
        lon = location["longitude"]
        timezone = location.get("timezone", "auto")
        location_name = location.get("name", city)
        country = location.get("country", "")

        forecast = get_weather(lat, lon, timezone)

        # Simplify response for frontend
        current = forecast.get("current", {})
        daily = forecast.get("daily", {})

        return jsonify({
            "location": {
                "name": location_name,
                "country": country,
                "latitude": lat,
                "longitude": lon,
            },
            "current": {
                "temperature": current.get("temperature_2m"),
                "humidity": current.get("relative_humidity_2m"),
                "wind_speed": current.get("wind_speed_10m"),
                "weather_code": current.get("weather_code"),
            },
            "forecast": [
                {
                    "date": daily["time"][i],
                    "temp_max": daily["temperature_2m_max"][i],
                    "temp_min": daily["temperature_2m_min"][i],
                    "weather_code": daily["weather_code"][i],
                }
                for i in range(min(5, len(daily.get("time", []))))
            ],
        })
    except requests.RequestException as e:
        return jsonify({"error": f"Weather API error: {str(e)}"}), 502


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
