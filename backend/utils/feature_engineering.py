import pandas as pd
import numpy as np

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Given a dataframe with the 6 base features, computes additional derived features.
    Base features expected:
    - flight_distance_km
    - aircraft_weight_kg
    - num_engines
    - engine_thrust_lbf
    - cruise_speed_kmph
    - cruise_altitude_ft
    """
    df = df.copy()
    
    # Avoid division by zero
    epsilon = 1e-6
    
    # 1. Total Engine Thrust
    df['total_thrust_lbf'] = df['engine_thrust_lbf'] * df['num_engines']
    
    # 2. Power-to-weight ratio
    df['power_to_weight_ratio'] = df['total_thrust_lbf'] / (df['aircraft_weight_kg'] + epsilon)
    
    # 3. Estimated flight duration (hours)
    df['estimated_flight_duration_hr'] = df['flight_distance_km'] / (df['cruise_speed_kmph'] + epsilon)
    
    # 4. Engine load index (Weight supported per lbf of thrust)
    df['engine_load_index'] = df['aircraft_weight_kg'] / (df['total_thrust_lbf'] + epsilon)
    
    # 5. Speed efficiency score (speed achieved per unit thrust)
    df['speed_efficiency_score'] = df['cruise_speed_kmph'] / (df['total_thrust_lbf'] + epsilon)
    
    # 6. Environmental stress / Performance index
    df['performance_index'] = (df['cruise_speed_kmph'] * df['cruise_altitude_ft']) / (df['aircraft_weight_kg'] + epsilon)
    
    return df
