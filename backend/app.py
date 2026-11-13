
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Dhanu%77",
        database="sentinelshield_db"
    )

def calculate_threat(anomaly):

    threat_scores = {
        "NORMAL": 0,
        "PERSON_DETECT": 40,
        "FUEL_THEFT": 75,
        "VIBRATION_DETECT": 85
    }

    score = threat_scores.get(anomaly, 0)

    if score >= 70:
        level = "HIGH"
    elif score >= 30:
        level = "MEDIUM"
    else:
        level = "LOW"

    return score, level


@app.route("/energy", methods=["GET"])
def receive_data():

    machine_id = request.args.get("machine_id", type=int)
    fuel = request.args.get("Fuel", type=float)
    distance = request.args.get("Distance", type=float)
    anomaly = request.args.get("anomaly", default="NORMAL")

    if machine_id is None or fuel is None or distance is None:
        return jsonify({"error": "Missing data"}), 400

    score, level = calculate_threat(anomaly)

    db = get_db()
    cursor = db.cursor()

    sql = """
    INSERT INTO sensor_readings
    (machine_id, fuel_level, distance, anomaly,
     threat_score, threat_level)
    VALUES (%s, %s, %s, %s, %s, %s)
    """

    values = (
        machine_id, fuel, distance,
        anomaly, score, level
    )

    cursor.execute(sql, values)
    db.commit()

    cursor.close()
    db.close()

    return jsonify({
        "message": "Data received successfully",
        "fuel": fuel,
        "distance": distance,
        "anomaly": anomaly,
        "threat_score": score,
        "threat_level": level
    })


@app.route("/latest", methods=["GET"])
def latest_data():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM sensor_readings
        ORDER BY id DESC LIMIT 1
    """)

    result = cursor.fetchone()

    cursor.close()
    db.close()

    return jsonify(result or {})


@app.route("/history", methods=["GET"])
def history():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM sensor_readings
        ORDER BY id DESC LIMIT 100
    """)

    results = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(results)

@app.route("/analytics", methods=["GET"])
def analytics():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM sensor_analytics
        ORDER BY generated_at DESC, id DESC
        LIMIT 1
    """)

    result = cursor.fetchone()

    cursor.close()
    db.close()

    return jsonify(result or {})



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
