from fpdf import FPDF
import io
import base64
from datetime import datetime

class OrderPDF(FPDF):
    def header(self):
        # Logo
        # self.image('logo.png', 10, 8, 33)
        # Arial bold 15
        self.set_font('Arial', 'B', 15)
        # Move to the right
        self.cell(80)
        # Title
        self.cell(30, 10, 'Restaurant Drive-Thru', 0, 0, 'C')
        # Line break
        self.ln(20)

    def footer(self):
        # Position at 1.5 cm from bottom
        self.set_y(-15)
        # Arial italic 8
        self.set_font('Arial', 'I', 8)
        # Page number
        self.cell(0, 10, 'Page ' + str(self.page_no()) + '/{nb}', 0, 0, 'C')

def generate_order_pdf(order):
    """
    Generate a PDF receipt for an order
    
    Args:
        order (dict): The order information
        
    Returns:
        str: Base64 encoded PDF
    """
    pdf = OrderPDF()
    pdf.alias_nb_pages()
    pdf.add_page()
    
    # Set font
    pdf.set_font("Arial", "B", 16)
    
    # Header
    pdf.cell(0, 10, f"Order Receipt #{order['order_id']}", 0, 1, "C")
    pdf.set_font("Arial", "", 12)
    pdf.cell(0, 10, f"Order Date: {order['timestamp']}", 0, 1, "C")
    pdf.cell(0, 10, f"Estimated Ready Time: {order['estimated_ready_time']}", 0, 1, "C")
    pdf.line(10, 40, 200, 40)
    
    # Order items
    pdf.ln(5)
    pdf.set_font("Arial", "B", 12)
    pdf.cell(80, 10, "Item", 1)
    pdf.cell(20, 10, "Qty", 1)
    pdf.cell(40, 10, "Unit Price", 1)
    pdf.cell(40, 10, "Total", 1)
    pdf.ln()
    
    pdf.set_font("Arial", "", 12)
    for item in order['items']:
        pdf.cell(80, 10, item['name'], 1)
        pdf.cell(20, 10, str(item['quantity']), 1)
        pdf.cell(40, 10, f"${item['price']:.2f}", 1)
        pdf.cell(40, 10, f"${item['price'] * item['quantity']:.2f}", 1)
        pdf.ln()
    
    # Totals
    pdf.ln(5)
    pdf.set_font("Arial", "B", 12)
    pdf.cell(140, 10, "Subtotal:", 0, 0, "R")
    pdf.cell(40, 10, f"${order['total']:.2f}", 0, 1, "R")
    
    if 'discount' in order:
        pdf.cell(140, 10, f"Discount ({order['discount']['name']}):", 0, 0, "R")
        pdf.cell(40, 10, f"-${order['discount']['amount']:.2f}", 0, 1, "R")
        pdf.cell(140, 10, "Total After Discount:", 0, 0, "R")
        pdf.cell(40, 10, f"${order['discounted_total']:.2f}", 0, 1, "R")
    
    # Footer
    pdf.ln(10)
    pdf.set_font("Arial", "I", 10)
    pdf.multi_cell(0, 10, "Thank you for your order! We appreciate your business.\n"
                         f"Order ID: {order['order_id']}", 0, "C")
    
    # Get PDF as base64 string
    pdf_buffer = io.BytesIO()
    pdf.output(pdf_buffer)
    pdf_data = base64.b64encode(pdf_buffer.getvalue()).decode('utf-8')
    
    return pdf_data
