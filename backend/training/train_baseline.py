import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib

import os
dataset_path = os.path.join(os.path.dirname(__file__), "..", "data", "aerofuel_10000_dataset.csv")
data = pd.read_csv(dataset_path)

# 2. Define features and target
X = data[
    [
        "flight_distance_km",
        "aircraft_weight_kg",
        "num_engines",
        "engine_thrust_lbf",
        "cruise_speed_kmph",
        "cruise_altitude_ft"
    ]
]

y = data["fuel_consumed_kg"]

# 3. Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 4. ML pipeline
pipeline = Pipeline(
    steps=[
        ("scaler", StandardScaler()),
        (
            "model",
            RandomForestRegressor(
                n_estimators=200,
                max_depth=15,
                random_state=42,
                n_jobs=-1
            ),
        ),
    ]
)

# 5. Train model
pipeline.fit(X_train, y_train)

# 6. Evaluate model
y_pred = pipeline.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print("Model Evaluation Results:")
print(f"MAE  : {mae:.2f} kg")
print(f"RMSE : {rmse:.2f} kg")
print(f"R²   : {r2:.4f}")

# 7. Save trained model
joblib.dump(pipeline, "aerofuel_model.pkl")

print("Model saved as aerofuel_model.pkl")
