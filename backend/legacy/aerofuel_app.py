import streamlit as st
import pandas as pd
import joblib

model = joblib.load("aerofuel_model.pkl")

st.set_page_config(page_title="AeroFuel AI", layout="centered")
st.title("🛫 AeroFuel AI - Flight Fuel Optimizer")
st.markdown("Estimate fuel consumption based on flight details using AI/ML")

distance = st.slider("Flight Distance (km)", 300, 3000, 1200, 50)
altitude = st.slider("Altitude (ft)", 25000, 40000, 35000, 500)
payload = st.slider("Payload (kg)", 5000, 20000, 8000, 500)
efficiency = st.slider("Engine Efficiency", 0.70, 0.95, 0.85, 0.01)

def predict_fuel(flight_km, altitude_ft, payload_kg, efficiency):
    input_data = pd.DataFrame([{
        'Flight_Distance_km': flight_km,
        'Altitude_ft': altitude_ft,
        'Payload_kg': payload_kg,
        'Engine_Efficiency': efficiency
    }])
    prediction = model.predict(input_data)[0]
    return round(prediction, 2)

if st.button("Estimate Fuel Consumption"):
    result = predict_fuel(distance, altitude, payload, efficiency)
    st.success(f"✈️ Estimated Fuel: {result} Liters")
