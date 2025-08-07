from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import faiss
import json
import time
import google.generativeai as genai
from datetime import datetime
import os
from sentence_transformers import SentenceTransformer
import uuid
from flask_cors import CORS
import re
from fpdf import FPDF
import io
import base64

app = Flask(__name__)
CORS(app)

# Configuration
API_KEYS = [
"AIzaSyA-D6KwRjDO6jvUa-0MbVvVTfFwHe91E7I",
"AIzaSyAqVw0Fkx1lffQOwWRNEYjNlIpH8BsAqXI",
"AIzaSyCL_HtogzE_ZI7KIY8pNw_Nw4KOaiy5DAk",
"AIzaSyDsK3-aIAuBencpVmL3EgbF71i_-rB_t-g",
"AIzaSyDBm2o1hufbJhHqBWBtC_rb251pL-_EDI8",
"AIzaSyDGLqesa7FfvCFa_FyOsLysEa_FXVEwM9k",
"AIzaSyD20nBniSee1lb-5pZXXjEajEbCz26E5lY",
"AIzaSyCt7aWH1s6ZaCOqClH7cfhkd97fEI4LJmg",
"AIzaSyD9c-eygFvzVfGmxT0LFdsAMMmBddhIUX8",
"AIzaSyA4oCmSXt9BuxbuNCK_Rdkq76GMG7GqTfU",
"AIzaSyD73DoFzJKj95u07Ohjk87bRNee4FtGVTo",
"AIzaSyBtZ3HvnpOKrFjQm5dWymglhWXnCSlsFe8",
"AIzaSyBvx01oGy7qAqYSDeoDj15BIhOAu6WXM6Y",
"AIzaSyAKvDQ1qLQY15nrvHtLygDGvz_i1NpK1nM"
    # os.getenv("GEMINI_API_KEY_1"),
    # os.getenv("GEMINI_API_KEY_2"),
    # os.getenv("GEMINI_API_KEY_3"),
    # os.getenv("GEMINI_API_KEY_4"),
    # os.getenv("GEMINI_API_KEY_5"),
    # os.getenv("GEMINI_API_KEY_6"),
    # os.getenv("GEMINI_API_KEY_7"),
    # os.getenv("GEMINI_API_KEY_8"),
    # os.getenv("GEMINI_API_KEY_9"),
    # os.getenv("GEMINI_API_KEY_10"),
    # os.getenv("GEMINI_API_KEY_11"),
    # os.getenv("GEMINI_API_KEY_12"),
    # os.getenv("GEMINI_API_KEY_13"),
    # os.getenv("GEMINI_API_KEY_14"),
]

# Track failed API keys
FAILED_API_KEYS = set()

# Function to get a valid API key
def get_valid_api_key():
    for api_key in API_KEYS:
        if api_key and api_key not in FAILED_API_KEYS:
            return api_key
    
    # If all keys have been marked as failed, reset and try again
    if len(FAILED_API_KEYS) > 0 and len(FAILED_API_KEYS) >= len(API_KEYS):
        FAILED_API_KEYS.clear()
        return get_valid_api_key()
    
    raise ValueError("No valid API keys available")

# Set up Gemini
current_api_key = get_valid_api_key()
genai.configure(api_key=current_api_key)
model = genai.GenerativeModel('gemini-1.5-pro')

# Initialize the embedding model
def load_embedding_model():
    return SentenceTransformer('all-MiniLM-L6-v2')

embedding_model = load_embedding_model()

# Sample menu data (in a real app, this would come from a database)
def load_menu_data():
    return pd.DataFrame({
        'id': range(1, 21),
        'name': [
            'Margherita Pizza', 'Veggie Supreme Pizza', 'BBQ Chicken Pizza', 
            'Caesar Salad', 'Greek Salad', 'Garden Salad', 
            'Spaghetti Bolognese', 'Vegetable Pasta', 'Seafood Pasta',
            'Chocolate Cake', 'Tiramisu', 'Cheesecake',
            'Espresso', 'Cappuccino', 'Iced Coffee',
            'Garlic Bread', 'Bruschetta', 'Mozzarella Sticks',
            'Coca-Cola', 'Sprite'
        ],
        'category': [
            'Pizza', 'Pizza', 'Pizza',
            'Salad', 'Salad', 'Salad',
            'Pasta', 'Pasta', 'Pasta',
            'Dessert', 'Dessert', 'Dessert',
            'Beverage', 'Beverage', 'Beverage',
            'Appetizer', 'Appetizer', 'Appetizer',
            'Beverage', 'Beverage'
        ],
        'price': [
            12.99, 14.99, 15.99,
            8.99, 9.99, 7.99,
            13.99, 12.99, 16.99,
            6.99, 7.99, 7.99,
            3.99, 4.99, 4.99,
            5.99, 6.99, 7.99,
            2.99, 2.99
        ],
        'description': [
            'Classic pizza with tomato sauce, mozzarella, and basil',
            'Pizza topped with bell peppers, onions, mushrooms, olives, and tomatoes',
            'Pizza with BBQ chicken, red onions, and cilantro',
            'Romaine lettuce, croutons, parmesan, and Caesar dressing',
            'Mixed greens, feta, olives, cucumbers, and Greek dressing',
            'Fresh mixed greens with seasonal vegetables and dressing',
            'Spaghetti with rich meat sauce and parmesan',
            'Pasta with mixed vegetables in marinara sauce',
            'Pasta with shrimp, mussels, and calamari in garlic sauce',
            'Rich chocolate cake with ganache frosting',
            'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
            'Creamy New York style cheesecake',
            'Strong Italian espresso shot',
            'Espresso with steamed milk and foam',
            'Chilled coffee served over ice',
            'Toasted bread with garlic butter and herbs',
            'Toasted bread topped with diced tomatoes, basil, and olive oil',
            'Fried mozzarella sticks with marinara sauce',
            'Classic cola soft drink',
            'Lemon-lime soft drink'
        ],
        'dietary_info': [
            'vegetarian',
            'vegetarian',
            'contains meat',
            'vegetarian',
            'vegetarian',
            'vegetarian, vegan',
            'contains meat',
            'vegetarian',
            'contains seafood',
            'vegetarian, contains gluten',
            'vegetarian, contains gluten',
            'vegetarian, contains gluten',
            'vegetarian, vegan',
            'vegetarian',
            'vegetarian',
            'vegetarian, contains gluten',
            'vegetarian, contains gluten',
            'vegetarian, contains gluten',
            'vegetarian, vegan',
            'vegetarian, vegan'
        ],
        'preparation_time': [
            15, 18, 18, 
            5, 5, 5, 
            12, 12, 15, 
            5, 5, 5, 
            2, 3, 3, 
            8, 10, 10, 
            1, 1
        ],
        'popular': [
            True, True, True, 
            True, False, False, 
            True, False, True, 
            True, True, True, 
            False, True, False, 
            True, False, True, 
            True, True
        ]
    })

menu_df = load_menu_data()

# Build FAISS index for menu items
def build_faiss_index(menu_df):
    # Create item descriptions for embedding
    item_texts = []
    for _, row in menu_df.iterrows():
        text = f"{row['name']} - {row['description']} - {row['category']} - {row['dietary_info']}"
        item_texts.append(text)
    
    # Generate embeddings
    embeddings = embedding_model.encode(item_texts)
    
    # Convert to float32 (required by FAISS)
    embeddings = np.array([embedding for embedding in embeddings]).astype('float32')
    
    # Build FAISS index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)
    
    return index, embeddings

index, embeddings = build_faiss_index(menu_df)

# Load discount data
def load_discount_data():
    return [
        {
            'id': 1,
            'name': 'Happy Hour',
            'description': '20% off all beverages between 3PM-5PM',
            'discount_type': 'percentage',
            'discount_value': 20,
            'min_order_value': 0,
            'eligible_categories': ['Beverage'],
            'days_valid': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            'start_time': '15:00',
            'end_time': '17:00',
            'code': 'HAPPY20'
        },
        {
            'id': 2,
            'name': 'Family Feast',
            'description': '$10 off orders over $50',
            'discount_type': 'amount',
            'discount_value': 10,
            'min_order_value': 50,
            'eligible_categories': ['All'],
            'days_valid': ['All'],
            'start_time': '00:00',
            'end_time': '23:59',
            'code': 'FAMILY10'
        },
        {
            'id': 3,
            'name': 'Pizza Wednesday',
            'description': 'Buy one pizza, get second at half price',
            'discount_type': 'special',
            'discount_value': 50,
            'min_order_value': 0,
            'eligible_categories': ['Pizza'],
            'days_valid': ['Wednesday'],
            'start_time': '00:00',
            'end_time': '23:59',
            'code': 'PIZZA50'
        },
        {
            'id': 4,
            'name': 'Dessert Delight',
            'description': '15% off all desserts',
            'discount_type': 'percentage',
            'discount_value': 15,
            'min_order_value': 0,
            'eligible_categories': ['Dessert'],
            'days_valid': ['Monday', 'Tuesday', 'Sunday'],
            'start_time': '00:00',
            'end_time': '23:59',
            'code': 'SWEET15'
        },
        {
            'id': 5,
            'name': 'First-Time Customer',
            'description': '10% off your first order',
            'discount_type': 'percentage',
            'discount_value': 10,
            'min_order_value': 0,
            'eligible_categories': ['All'],
            'days_valid': ['All'],
            'start_time': '00:00',
            'end_time': '23:59',
            'code': 'WELCOME10'
        }
    ]

discounts = load_discount_data()

# Load daily specials
def load_daily_specials():
    return {
        'Monday': {
            'name': 'Meatless Monday',
            'description': 'All vegetarian dishes at 15% discount',
            'featured_item': 'Veggie Supreme Pizza'
        },
        'Tuesday': {
            'name': 'Pasta Tuesday',
            'description': 'All pasta dishes come with free garlic bread',
            'featured_item': 'Spaghetti Bolognese'
        },
        'Wednesday': {
            'name': 'Pizza Wednesday',
            'description': 'Buy one pizza, get second at half price',
            'featured_item': 'BBQ Chicken Pizza'
        },
        'Thursday': {
            'name': 'Thirsty Thursday',
            'description': 'All beverages are buy one get one free',
            'featured_item': 'Iced Coffee'
        },
        'Friday': {
            'name': 'Family Friday',
            'description': 'Free dessert with orders over $40',
            'featured_item': 'Chocolate Cake'
        },
        'Saturday': {
            'name': 'Sampler Saturday',
            'description': '20% off all appetizers',
            'featured_item': 'Mozzarella Sticks'
        },
        'Sunday': {
            'name': 'Sweet Sunday',
            'description': '25% off all desserts',
            'featured_item': 'Tiramisu'
        }
    }

daily_specials = load_daily_specials()

# Initialize session state
session_state = {
    'chat_history': [],
    'current_order': [],
    'order_id': str(uuid.uuid4())[:8],
    'previous_orders': [],
    'applied_discount': None,
    'is_first_time_customer': True
}

# Search menu items based on query
def search_menu_items(query, top_k=5):
    # Convert query to embedding
    query_embedding = embedding_model.encode([query]).astype('float32')
    
    # Search in FAISS index
    distances, indices = index.search(query_embedding, top_k)
    
    # Get matching items
    results = []
    for i in indices[0]:
        if i < len(menu_df):
            results.append(menu_df.iloc[i].to_dict())
    
    return results

# Get applicable discounts for the current order
def get_applicable_discounts(order_items):
    # If no items in order, no discounts apply
    if not order_items:
        return []
    
    applicable = []
    total_value = sum(item['price'] * item['quantity'] for item in order_items)
    categories_in_order = set(menu_df.loc[menu_df['id'] == item['id'], 'category'].iloc[0] for item in order_items)
    current_day = datetime.now().strftime("%A")
    current_time = datetime.now().strftime("%H:%M")
    
    for discount in discounts:
        # Check minimum order value
        if total_value < discount['min_order_value']:
            continue
            
        # Check day validity
        if 'All' not in discount['days_valid'] and current_day not in discount['days_valid']:
            continue
            
        # Check time validity
        if current_time < discount['start_time'] or current_time > discount['end_time']:
            continue
            
        # Check category eligibility
        if 'All' not in discount['eligible_categories']:
            if not any(category in discount['eligible_categories'] for category in categories_in_order):
                continue
        
        # Special handling for first-time customer discount
        if discount['code'] == 'WELCOME10' and not session_state['is_first_time_customer']:
            continue
            
        # Special handling for "buy one get one" type discounts
        if discount['code'] == 'PIZZA50':
            pizza_count = sum(item['quantity'] for item in order_items 
                             if menu_df.loc[menu_df['id'] == item['id'], 'category'].iloc[0] == 'Pizza')
            if pizza_count < 2:
                continue
        
        applicable.append(discount)
    
    return applicable

# Apply discount to order
def apply_discount(order, discount):
    total = order['total']
    discount_amount = 0
    
    if discount['discount_type'] == 'percentage':
        discount_amount = total * (discount['discount_value'] / 100)
    elif discount['discount_type'] == 'amount':
        discount_amount = discount['discount_value']
    elif discount['discount_type'] == 'special' and discount['code'] == 'PIZZA50':
        # Handle buy one get one half off for pizzas
        pizza_items = [item for item in order['items'] 
                      if menu_df.loc[menu_df['id'] == item['id'], 'category'].iloc[0] == 'Pizza']
        if len(pizza_items) >= 2:
            # Sort by price to discount the cheaper one
            pizza_items.sort(key=lambda x: x['price'])
            discount_amount = pizza_items[0]['price'] * 0.5
    
    # Cap the discount at the total order value
    discount_amount = min(discount_amount, total)
    
    # Update order with discount
    order['discount'] = {
        'name': discount['name'],
        'code': discount['code'],
        'amount': discount_amount
    }
    order['discounted_total'] = total - discount_amount
    
    return order

# Process user query with Gemini
def process_query(user_query, chat_history):
    # Declare model and current_api_key as global to fix UnboundLocalError
    global model, current_api_key
    
    # Check for order completion keywords
    completion_keywords = ['finalize', 'finalise', 'finish order', 'complete order', 
                           'place order', 'submit order', 'checkout', 'pay', 'done ordering']
    
    # If the query contains completion keywords, trigger order completion
    if any(keyword in user_query.lower() for keyword in completion_keywords):
        order = complete_order()
        if order:
            report = generate_order_report(order)
            # Remove PDF generation from here
            return report, [{"type": "complete"}]
        else:
            return "Your order is empty. Please add some items before completing your order.", []
    
    # Format chat history
    formatted_history = "\n".join([f"{'User' if msg['role'] == 'user' else 'Assistant'}: {msg['content']}" for msg in chat_history[-5:] if chat_history])
    
    # Search for relevant menu items
    menu_items = search_menu_items(user_query)
    menu_context = json.dumps([{k: v for k, v in item.items() if k != 'id'} for item in menu_items])
    
    # Current order context
    order_context = []
    if session_state['current_order']:
        order_context = [f"{item['quantity']}x {item['name']} (${item['price']} each)" for item in session_state['current_order']]
    order_context_str = "Current order: " + ", ".join(order_context) if order_context else "Current order: Empty"
    
    # Get applicable discounts
    applicable_discounts = get_applicable_discounts(session_state['current_order'])
    discount_context = "No applicable discounts available." if not applicable_discounts else "Available discounts:\n" + "\n".join([
        f"• {d['name']}: {d['description']} (Code: {d['code']})" for d in applicable_discounts
    ])
    
    # Get today's special
    today = datetime.now().strftime("%A")
    today_special = daily_specials.get(today, {'name': 'No special today', 'description': ''})
    special_context = f"Today's Special ({today}):\n• {today_special['name']} - {today_special['description']}"
    
    # Create prompt for Gemini with enhanced formatting instructions
    prompt = f"""You are an AI assistant for a restaurant ordering system. Help the customer with their order in an engaging and conversational way.

Recent conversation:
{formatted_history}

Current user query: {user_query}

{order_context_str}

{special_context}

{discount_context}

Most relevant menu items:
{menu_context}

You can handle:
1. Questions about menu items, ingredients, preparation time, and dietary restrictions
2. Recommendations based on customer preferences
3. Adding items to the order (respond with ADD_TO_ORDER: [item_name], [quantity])
4. Removing items from the order (respond with REMOVE_FROM_ORDER: [item_name])
5. Clearing the order (respond with CLEAR_ORDER)
6. Completing the order (respond with COMPLETE_ORDER)
7. Applying a discount code (respond with APPLY_DISCOUNT: [discount_code])

FORMATTING GUIDELINES:
- Use bullet points (•) when listing multiple items, options, or steps
- Use bold formatting with ** for important information like prices, discounts, or special offers
- Structure your response with clear sections using headings (##) where appropriate
- Include emoji where appropriate to make your response engaging (like 🍕 for pizza, 🥗 for salad)
- Make your responses conversational, friendly, and enthusiastic
- For recommendations, explain WHY they would be good choices based on the context
- Always highlight specials and promotions clearly
- Always give answer in strictly markdown format 

For specific actions, use the special commands listed above followed by your natural response.
"""

    # Get response from Gemini with retry mechanism
    response = make_gemini_request(prompt)
    
    # Process any special commands in the response
    commands = []
    response_text = response.text
    
    if "ADD_TO_ORDER:" in response_text:
        parts = response_text.split("ADD_TO_ORDER:")
        command_part = parts[1].split("\n")[0].strip()
        item_name, quantity = command_part.rsplit(",", 1)
        item_name = item_name.strip()
        quantity = int(quantity.strip())
        commands.append({"type": "add", "item": item_name, "quantity": quantity})
        
        # Remove the command from the response
        response_text = response_text.replace(f"ADD_TO_ORDER: {command_part}", "")
    
    if "REMOVE_FROM_ORDER:" in response_text:
        parts = response_text.split("REMOVE_FROM_ORDER:")
        item_name = parts[1].split("\n")[0].strip()
        commands.append({"type": "remove", "item": item_name})
        
        # Remove the command from the response
        response_text = response_text.replace(f"REMOVE_FROM_ORDER: {item_name}", "")
    
    if "CLEAR_ORDER" in response_text:
        commands.append({"type": "clear"})
        
        # Remove the command from the response
        response_text = response_text.replace("CLEAR_ORDER", "")
    
    if "COMPLETE_ORDER" in response_text:
        commands.append({"type": "complete"})
        
        # Remove the command from the response
        response_text = response_text.replace("COMPLETE_ORDER", "")
        
    if "APPLY_DISCOUNT:" in response_text:
        parts = response_text.split("APPLY_DISCOUNT:")
        discount_code = parts[1].split("\n")[0].strip()
        commands.append({"type": "discount", "code": discount_code})
        
        # Remove the command from the response
        response_text = response_text.replace(f"APPLY_DISCOUNT: {discount_code}", "")
    
    # Format response text with Markdown
    response_text = response_text.strip().replace("\n", "\n\n")
    
    return response_text, commands

# Make a request to Gemini with retry logic for handling API key failures
def make_gemini_request(prompt, max_retries=5):
    global model, current_api_key, FAILED_API_KEYS
    
    retries = 0
    while retries < max_retries:
        try:
            # Attempt to generate content with current API key
            response = model.generate_content(prompt)
            return response
        except Exception as e:
            print(f"API key failed: {current_api_key}. Error: {str(e)}")
            # Mark current key as failed
            FAILED_API_KEYS.add(current_api_key)
            
            # Try to get a new valid key
            try:
                current_api_key = get_valid_api_key()
                genai.configure(api_key=current_api_key)
                model = genai.GenerativeModel('gemini-1.5-pro')
                print(f"Switched to API key: {current_api_key}")
                retries += 1
            except ValueError:
                # No more keys available
                print("No more API keys available")
                raise ValueError("All API keys have failed. No working keys available.") from e
    
    raise ValueError(f"Failed to get response after {max_retries} attempts with different API keys")

# Add item to order
def add_to_order(item_name, quantity):
    # Search for the item in the menu
    matching_items = menu_df[menu_df['name'].str.lower() == item_name.lower()]
    
    if not matching_items.empty:
        item = matching_items.iloc[0]
        
        # Check if item is already in order
        for order_item in session_state['current_order']:
            if order_item['name'].lower() == item_name.lower():
                order_item['quantity'] += quantity
                # Notify chatbot about the cart update
                session_state['chat_history'].append({
                    'role': 'system',
                    'content': f'Cart updated: {quantity}x {item_name} added.'
                })
                return True
        
        # Add new item to order
        session_state['current_order'].append({
            'id': item['id'],
            'name': item['name'],
            'price': item['price'],
            'quantity': quantity,
            'preparation_time': item['preparation_time']
        })
        # Notify chatbot about the cart update
        session_state['chat_history'].append({
            'role': 'system',
            'content': f'Cart updated: {quantity}x {item_name} added.'
        })
        return True
    else:
        # Try fuzzy matching
        similar_items = search_menu_items(item_name, top_k=1)
        if similar_items:
            item = similar_items[0]
            
            # Check if item is already in order
            for order_item in session_state['current_order']:
                if order_item['name'].lower() == item['name'].lower():
                    order_item['quantity'] += quantity
                    # Notify chatbot about the cart update
                    session_state['chat_history'].append({
                        'role': 'system',
                        'content': f'Cart updated: {quantity}x {item_name} added.'
                    })
                    return True
            
            # Add new item to order
            session_state['current_order'].append({
                'id': item['id'],
                'name': item['name'],
                'price': item['price'],
                'quantity': quantity,
                'preparation_time': item['preparation_time']
            })
            # Notify chatbot about the cart update
            session_state['chat_history'].append({
                'role': 'system',
                'content': f'Cart updated: {quantity}x {item_name} added.'
            })
            return True
    
    return False

# Remove item from order
def remove_from_order(item_name):
    for i, item in enumerate(session_state['current_order']):
        if item['name'].lower() == item_name.lower():
            session_state['current_order'].pop(i)
            return True
    return False

# Clear the order
def clear_order():
    session_state['current_order'] = []
    session_state['order_id'] = str(uuid.uuid4())[:8]

# Complete the order
def complete_order():
    if session_state['current_order']:
        # Calculate order details
        items = session_state['current_order']
        total = sum(item['price'] * item['quantity'] for item in items)
        max_prep_time = max(item['preparation_time'] for item in items)
        
        # Calculate estimated ready time
        preparation_end_time = datetime.now().timestamp() + (max_prep_time * 60)
        estimated_ready_time = datetime.fromtimestamp(preparation_end_time).strftime("%H:%M:%S")
        
        # Create order summary
        order = {
            'order_id': session_state['order_id'],
            'items': items.copy(),
            'total': total,
            'preparation_time': max_prep_time,
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'status': 'Confirmed',
            'estimated_ready_time': estimated_ready_time  # Add this key
        }
        
        # Apply discount if any
        if session_state['applied_discount']:
            order = apply_discount(order, session_state['applied_discount'])
            session_state['applied_discount'] = None
        
        # Add to previous orders
        session_state['previous_orders'].append(order)
        
        # User is no longer a first-time customer
        session_state['is_first_time_customer'] = False
        
        # Clear current order
        session_state['current_order'] = []
        session_state['order_id'] = str(uuid.uuid4())[:8]
        
        return order
    
    return None

# Generate PDF function should be replaced or removed
def generate_order_pdf(order):
    # Instead of generating PDF, just return order data
    return json.dumps(order)

# Enhanced order report generation with better formatting
def generate_order_report(order):
    preparation_end_time = datetime.now().timestamp() + (order['preparation_time'] * 60)
    estimated_ready_time = datetime.fromtimestamp(preparation_end_time).strftime("%H:%M:%S")
    
    report = f"""
## 🎉 Your Order is Confirmed! #{order['order_id']}

**Order Time:** {order['timestamp']}
**Estimated Ready Time:** {estimated_ready_time} (approximately {order['preparation_time']} minutes)

### 📋 Items Ordered:
"""
    
    for item in order['items']:
        report += f"• **{item['quantity']}x** {item['name']} - **${item['price'] * item['quantity']:.2f}**\n"
    
    report += f"""
### 💰 Order Summary:
• **Subtotal:** ${order['total']:.2f}
"""

    if 'discount' in order:
        report += f"""• **Discount Applied:** {order['discount']['name']} (Code: {order['discount']['code']})
• **Discount Amount:** -${order['discount']['amount']:.2f}
• **Total After Discount:** ${order['discounted_total']:.2f}
"""
    else:
        report += f"• **Total Amount:** ${order['total']:.2f}\n"

    report += f"""
### 📱 Track Your Order
You can check the status of your order using your order ID: **{order['order_id']}**

### 🙏 Thank You!
We appreciate your business and look forward to serving you again soon!
A PDF receipt has been generated for your records.
"""
    
    return report

@app.route('/process_query', methods=['POST'])
def handle_process_query():
    data = request.json
    user_query = data.get('query', '')
    session_state['chat_history'].append({'role': 'user', 'content': user_query})
    response_text, commands = process_query(user_query, session_state['chat_history'])
    
    # Add AI response to chat history
    session_state['chat_history'].append({'role': 'assistant', 'content': response_text})
    
    return jsonify({'response': response_text, 'commands': commands})

@app.route('/add_to_order', methods=['POST'])
def handle_add_to_order():
    data = request.json
    item_name = data.get('item_name', '')
    quantity = data.get('quantity', 1)
    success = add_to_order(item_name, quantity)
    return jsonify({'success': success})

@app.route('/remove_from_order', methods=['POST'])
def handle_remove_from_order():
    data = request.json
    item_name = data.get('item_name', '')
    success = remove_from_order(item_name)
    return jsonify({'success': success})

@app.route('/clear_order', methods=['POST'])
def handle_clear_order():
    clear_order()
    return jsonify({'success': True})

@app.route('/complete_order', methods=['POST'])
def handle_complete_order():
    try:
        order = complete_order()
        if order:
            report = generate_order_report(order)
            # Remove PDF generation
            session_state['chat_history'].append({
                'role': 'assistant',
                'content': report
            })
            # Send confirmation email
            email_data = {
                'recipient': 'vinayak.bhatia22@spit.ac.in',  # Replace with actual recipient email
                'subject': 'Order Confirmation',
                'body': report
            }
            handle_send_email(email_data)  # Pass email_data as argument
            # Return order data and report, but no PDF
            return jsonify({'order': order, 'report': report})
        return jsonify({'order': None})
    except Exception as e:
        print(f"Error completing order: {str(e)}")
        return jsonify({'error': 'Error completing order'}), 500

def convert_to_native_types(order):
    for item in order:
        item['id'] = int(item['id'])
        item['price'] = float(item['price'])
        item['quantity'] = int(item['quantity'])
        item['preparation_time'] = int(item['preparation_time'])
    return order

@app.route('/get_order', methods=['GET'])
def handle_get_order():
    order = convert_to_native_types(session_state['current_order'])
    return jsonify(order)

@app.route('/get_cart', methods=['GET'])
def handle_get_cart():
    cart = convert_to_native_types(session_state['current_order'])
    return jsonify(cart)

@app.route('/get_discounts', methods=['GET'])
def handle_get_discounts():
    applicable_discounts = get_applicable_discounts(session_state['current_order'])
    return jsonify(applicable_discounts)

@app.route('/apply_discount', methods=['POST'])
def handle_apply_discount():
    data = request.json
    discount_code = data.get('discount_code', '')
    discount = next((d for d in discounts if d['code'] == discount_code), None)
    if discount:
        session_state['applied_discount'] = discount
        return jsonify({'success': True, 'discount': discount})
    return jsonify({'success': False})


@app.route('/send_email', methods=['POST'])
def handle_send_email(email_data=None):
    try:
        # Get email data from request if not provided
        if email_data is None:
            email_data = request.json
        recipient = email_data.get('recipient', 'ntpjc2vinayak@gmail.com')
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        if not all([recipient, subject, body]):
            return jsonify({'error': 'Missing required fields (recipient, subject, body)'}), 400
        
        # Prepare the email content for the agent
        email_prompt = f"""
        Send an email with the following details:
        - To: {recipient}
        - Subject: {subject}
        - Body: {body}
        """
        
        # Execute the agent to send the email
        result = agent.run(email_prompt)
        
        # Add to chat history
        session_state['chat_history'].append({
            'role': 'system',
            'content': f'Email sent to {recipient} with subject "{subject}"'
        })
        
        return jsonify({
            'success': True,
            'message': 'Email sent successfully',
            'result': str(result)
        })
    
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return jsonify({
            'error': f'Failed to send email: {str(e)}'
        }), 500

# Make sure to add these imports at the top of your file if not already present
from langchain.agents import AgentType, initialize_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from composio_langchain import ComposioToolSet
os.environ["GOOGLE_API_KEY"] = "AIzaSyBqGm2s9Tav2zoFLjoxQTeesCrl6j6KRH8"
# Add the agent initialization at the top of your file, after app initialization
def initialize_agent_with_tools():
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        temperature=0.1,
        convert_system_message_to_human=True
    )
    
    # Initialize Composio tools
    composio_toolset = ComposioToolSet(api_key="7x3tgeyd9hcuftbaxha3pn")
    tools = composio_toolset.get_tools(actions=['GMAIL_SEND_EMAIL'])
    
    # Create agent
    return initialize_agent(
        tools,
        llm,
        agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
        verbose=True
    )

# Initialize the agent globally
agent = initialize_agent_with_tools()

if __name__ == '__main__':
    app.run(port=5000)