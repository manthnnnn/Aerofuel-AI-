import requests
import json
import csv
import os

def download_airports():
    url = "https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv"
    print("Downloading airports data...")
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        lines = response.text.splitlines()
        reader = csv.DictReader(lines)
        
        airports = []
        for row in reader:
            # Filter for large and medium airports to keep file size manageable and relevant
            if row["type"] in ["large_airport", "medium_airport"] and row["iata_code"]:
                airports.append({
                    "name": row["name"],
                    "iata": row["iata_code"],
                    "city": row["municipality"],
                    "country": row["iso_country"],
                    "lat": float(row["latitude_deg"]),
                    "lon": float(row["longitude_deg"])
                })
        
        out_path = os.path.join(os.path.dirname(__file__), 'data', 'airports.json')
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, 'w') as f:
            json.dump(airports, f)
        print(f"Successfully saved {len(airports)} airports to {out_path}")
    except Exception as e:
        print(f"Failed to download airports: {e}")

if __name__ == "__main__":
    download_airports()
