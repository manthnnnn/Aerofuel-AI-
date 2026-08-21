import json
import os
from datetime import datetime
import tempfile

DEFAULT_HISTORY_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'history.json')
TMP_HISTORY_FILE = os.path.join(tempfile.gettempdir(), 'aerofuel_history.json')

def get_history_file_for_write():
    # If in read-only environment like Vercel Lambda, write to /tmp
    try:
        test_dir = os.path.dirname(DEFAULT_HISTORY_FILE)
        os.makedirs(test_dir, exist_ok=True)
        test_file = os.path.join(test_dir, '.write_test')
        with open(test_file, 'w') as f:
            f.write('ok')
        os.remove(test_file)
        return DEFAULT_HISTORY_FILE
    except (OSError, PermissionError):
        return TMP_HISTORY_FILE

def save_prediction(flight_data, prediction, co2):
    target_file = get_history_file_for_write()
    history = load_history()
    
    entry = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "flight_data": flight_data,
        "prediction": float(prediction),
        "co2": float(co2)
    }
    history.insert(0, entry)
    # Keep last 50 entries
    history = history[:50]
    
    try:
        with open(target_file, 'w') as f:
            json.dump(history, f, indent=2)
    except Exception as e:
        print(f"Warning: Could not save prediction history: {e}")

def load_history():
    # Try loading from /tmp first (newest serverless entries)
    if os.path.exists(TMP_HISTORY_FILE):
        try:
            with open(TMP_HISTORY_FILE, 'r') as f:
                return json.load(f)
        except Exception:
            pass

    # Fallback to bundled data/history.json
    if os.path.exists(DEFAULT_HISTORY_FILE):
        try:
            with open(DEFAULT_HISTORY_FILE, 'r') as f:
                return json.load(f)
        except Exception:
            return []
    return []
