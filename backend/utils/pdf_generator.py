from fpdf import FPDF
import os
from datetime import datetime

class PDF(FPDF):
    def header(self):
        self.set_font("helvetica", 'B', 16)
        self.set_text_color(15, 23, 42)
        self.cell(0, 10, "AeroFuel AI Enterprise - Flight Report", align="C")
        self.ln(20)
        
    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", 'I', 8)
        self.set_text_color(148, 163, 184)
        self.cell(0, 10, f"Generated automatically on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", align="C")

def generate_pdf_report(prediction, co2, flight_data, filename="flight_report.pdf"):
    pdf = PDF()
    pdf.add_page()
    
    # Title
    pdf.set_font("helvetica", 'B', 14)
    pdf.cell(0, 10, "Prediction Summary")
    pdf.ln(10)
    
    # Results
    pdf.set_font("helvetica", '', 12)
    pdf.cell(0, 10, f"Estimated Fuel Consumption: {prediction:,.2f} kg")
    pdf.ln(8)
    pdf.cell(0, 10, f"Estimated CO2 Emissions: {co2:,.2f} kg")
    pdf.ln(15)
    
    # Flight Params
    pdf.set_font("helvetica", 'B', 14)
    pdf.cell(0, 10, "Flight Parameters")
    pdf.ln(10)
    
    pdf.set_font("helvetica", '', 12)
    for k, v in flight_data.items():
        pdf.cell(0, 8, f"{k}: {v}")
        pdf.ln(8)
        
    pdf.ln(10)
    pdf.set_font("helvetica", 'I', 10)
    pdf.multi_cell(0, 8, "This report was generated using the AeroFuel AI gradient boosting model. Values are estimations and should not be used as the sole basis for flight planning.")
    
    # Ensure dir exists
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    pdf.output(filename)
    return filename
