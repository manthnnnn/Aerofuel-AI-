import pandas as pd
import numpy as np
import joblib
import json
import os
import time

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, mean_absolute_percentage_error
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

from xgboost import XGBRegressor
from lightgbm import LGBMRegressor
from catboost import CatBoostRegressor

import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from utils.feature_engineering import engineer_features

def main():
    dataset_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'aerofuel_10000_dataset.csv'))
    if not os.path.exists(dataset_path):
        # Fallback to root or un-suffixed path
        dataset_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'aerofuel_10000_dataset'))

    data = pd.read_csv(dataset_path)

    # Base features and target
    base_features = [
        "flight_distance_km",
        "aircraft_weight_kg",
        "num_engines",
        "engine_thrust_lbf",
        "cruise_speed_kmph",
        "cruise_altitude_ft"
    ]
    target = "fuel_consumed_kg"

    # Feature Engineering
    print("Applying feature engineering...")
    data = engineer_features(data)
    
    # All features after engineering
    X = data.drop(columns=[target] + [col for col in data.columns if col not in base_features and col not in engineer_features(data[base_features]).columns], errors='ignore')
    # Filter to only ensure we have the right features
    temp_df = engineer_features(data[base_features])
    X = temp_df
    y = data[target]

    print(f"Features used for training: {list(X.columns)}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    models = {
        "RandomForest": RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
        "XGBoost": XGBRegressor(n_estimators=100, random_state=42, n_jobs=-1),
        "LightGBM": LGBMRegressor(n_estimators=100, random_state=42, n_jobs=-1),
        "CatBoost": CatBoostRegressor(n_estimators=100, random_state=42, verbose=0),
        "GradientBoosting": GradientBoostingRegressor(n_estimators=100, random_state=42)
    }

    best_model_name = None
    best_model_pipeline = None
    best_rmse = float('inf')
    metrics_report = {}

    print("Training models...")
    for name, model in models.items():
        print(f"  Training {name}...")
        start_train = time.time()
        
        pipeline = Pipeline(steps=[
            ("scaler", StandardScaler()),
            ("model", model)
        ])
        
        pipeline.fit(X_train, y_train)
        train_time = time.time() - start_train
        
        start_pred = time.time()
        y_pred = pipeline.predict(X_test)
        pred_time = time.time() - start_pred

        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        mape = mean_absolute_percentage_error(y_test, y_pred)
        
        metrics_report[name] = {
            "MAE": round(mae, 2),
            "RMSE": round(rmse, 2),
            "R2": round(r2, 4),
            "MAPE": round(mape, 4),
            "Training_Time_s": round(train_time, 2),
            "Prediction_Time_s": round(pred_time, 4)
        }

        print(f"    {name} -> RMSE: {rmse:.2f} | R2: {r2:.4f}")

        if rmse < best_rmse:
            best_rmse = rmse
            best_model_name = name
            best_model_pipeline = pipeline

    print(f"\nBest Model: {best_model_name} (RMSE: {best_rmse:.2f})")

    # Save model and metrics
    os.makedirs("models", exist_ok=True)
    model_path = os.path.join("models", "best_model.pkl")
    joblib.dump(best_model_pipeline, model_path)
    
    metrics_path = os.path.join("models", "model_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics_report, f, indent=4)

    # Save feature names for reference
    with open(os.path.join("models", "features.json"), "w") as f:
        json.dump(list(X.columns), f, indent=4)

    print("Model and metrics saved successfully.")

if __name__ == "__main__":
    main()
