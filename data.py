import json
import random

# Define base data for generation
categories = {
    "Appetizers": {
        "items": [
            ("Spring Rolls", 6.99, "Crispy rolls filled with vegetables.", ["vegetarian", "vegan"], False, 10),
            ("Garlic Bread", 4.99, "Toasted bread with garlic butter.", [], False, 8),
            ("Cheese Sticks", 5.99, "Mozzarella sticks with marinara.", ["vegetarian"], False, 12)
        ]
    },
    "Main Courses": {
        "items": [
            ("Grilled Salmon", 18.99, "Fresh salmon with lemon herb sauce.", [], True, 20),
            ("Vegetable Stir Fry", 12.99, "Mixed veggies in a soy-ginger sauce.", ["vegetarian", "vegan"], True, 15),
            ("Chicken Alfredo", 16.99, "Creamy pasta with grilled chicken.", [], False, 18),
            ("Beef Burger", 14.99, "Juicy beef patty with toppings.", [], False, 15)
        ]
    },
    "Sides": {
        "items": [
            ("Mashed Potatoes", 3.99, "Creamy potatoes with butter.", ["vegetarian"], True, 12),
            ("French Fries", 2.99, "Crispy golden fries.", ["vegetarian", "vegan"], True, 10),
            ("Side Salad", 3.49, "Fresh greens with dressing.", ["vegetarian", "vegan"], True, 5)
        ]
    },
    "Drinks": {
        "items": [
            ("Lemonade", 2.49, "Freshly squeezed lemonade.", ["vegetarian", "vegan"], True, 5),
            ("Cola", 1.99, "Classic cola drink.", ["vegetarian", "vegan"], True, 2),
            ("Iced Tea", 2.29, "Sweetened iced tea.", ["vegetarian", "vegan"], True, 3)
        ]
    }
}

def generate_menu():
    menu_data = {
        "restaurant": {
            "name": "Taste Haven",
            "location": "123 Flavor Street, Food City",
            "prep_time_default": 15
        },
        "menu": {
            "categories": [],
            "combos": []
        }
    }

    # Populate categories
    item_id = 1
    for cat_name, cat_data in categories.items():
        category = {"name": cat_name, "items": []}
        for name, price, desc, dietary, gf, prep in cat_data["items"]:
            category["items"].append({
                "id": f"{cat_name[0]}{item_id}",
                "name": name,
                "price": price,
                "description": desc,
                "dietary": dietary,
                "gluten_free": gf,
                "prep_time": prep
            })
            item_id += 1
        menu_data["menu"]["categories"].append(category)

    # Generate combos
    combo_id = 1
    for _ in range(3):  # Generate 3 random combos
        main = random.choice(categories["Main Courses"]["items"])
        side = random.choice(categories["Sides"]["items"])
        drink = random.choice(categories["Drinks"]["items"])
        combo_items = [f"M{item_id-4}", f"S{item_id-2}", f"D{item_id}"]
        total_price = round(main[1] + side[1] + drink[1] * 0.9, 2)  # 10% combo discount
        total_prep = max(main[5], side[5], drink[5]) + 5  # Add 5 min for combo prep
        # Fix: Properly combine dietary restrictions from all items
        combined_dietary = main[3] + side[3] + drink[3]
        dietary = list(set(combined_dietary))  # Remove duplicates
        gf = main[4] and side[4] and drink[4]
        menu_data["menu"]["combos"].append({
            "id": f"C{combo_id}",
            "name": f"{main[0]} Combo",
            "items": combo_items,
            "price": total_price,
            "description": f"{main[0]} with {side[0]} and {drink[0]}.",
            "prep_time": total_prep,
            "dietary": dietary,
            "gluten_free": gf
        })
        combo_id += 1

    return menu_data

if __name__ == "__main__":
    menu = generate_menu()
    with open("menu.json", "w") as f:
        json.dump(menu, f, indent=2)
    print("Generated menu.json successfully!")