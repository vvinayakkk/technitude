
# 🤖 Agentic AI Platform: Drive-Thru & Healthcare Assistant

<img width="1024" height="1024" alt="image" src="https://github.com/user-attachments/assets/75571443-b581-4146-8620-86100917cefa" />


This repository showcases a powerful, unified platform for building and deploying agentic AI systems. It features two distinct, fully functional AI agents: a **Restaurant Drive-Thru Assistant** and a **Healthcare Clinic Assistant**. Both are designed to operate autonomously, handle complex conversational tasks, and perform actions using a suite of agent tools.

This project is a blueprint for creating robust, enterprise-grade conversational AI that goes beyond simple chatbots. It demonstrates how to build intelligent agents that can reason, follow up, and automate real-world tasks.

-----

## 🚀 Key Features

This platform is built on a modular architecture, with separate frontends and backends for each agent.

### 🍔 Restaurant Drive-Thru Assistant

This agent automates the food ordering process using advanced conversational AI and a RAG (Retrieval-Augmented Generation) system.

  - **Intelligent Ordering:** Handles complex, multi-item orders, including adding, removing, and clearing items from an order.
  - **Menu Navigation:** Searches the menu for specific items, ingredients, dietary restrictions, and customizations.
  - **Order Management:** Generates order summaries and receipts, and can apply discounts and finalize orders.
  - **Agentic Capabilities:**
      - **Follow-up:** Proactively asks for missing information (e.g., drink size).
      - **Actions:** Can trigger actions (add to order, complete order, apply discounts) based on conversation.
      - **External Tools:** Uses an agent tool to send email confirmations.
  - **Backend:** A Python backend leveraging OpenAI and Mistral for powerful RAG and conversational abilities.

### 🏥 Healthcare Clinic Assistant

This agent streamlines patient interactions, from appointment booking to general health inquiries.

  - **Appointment Automation:** Books, reschedules, and cancels appointments with doctors.
  - **Doctor Finder:** Locates doctors based on specialty, symptoms, or name.
  - **Personalized Assistance:** Acts as an AI-powered health assistant for Q\&A and general recommendations.
  - **Agentic Capabilities:**
      - **Context Persistence:** Maintains a patient profile and chat history to provide personalized service.
      - **Autonomous Flows:** Automates the entire appointment booking workflow, from initial request to confirmation.
      - **Tool Use:** Uses internal "tools" to interact with a simulated database for patient and doctor information.

-----

## 🧠 Agentic System & Automation

The core of this platform is the agentic framework. Both bots are not just static question-and-answer systems; they are dynamic, proactive agents. They can:

  - **Reason:** Understand user intent and determine the best course of action.
  - **Act:** Execute specific functions or "tools" based on the conversation (e.g., `book_appointment()`, `add_to_order()`).
  - **Follow-up:** Ask clarifying questions and guide the user through a process to a successful conclusion.
  - **Automate:** String together multiple actions to complete complex tasks autonomously.

-----

## 📂 Project Structure

```
.
├── client/                     # React frontend for the Drive-Thru Bot
│   ├── public/
│   ├── src/
│   └── package.json
├── frontend/                   # React frontend for the Healthcare Bot
│   ├── public/
│   ├── src/
│   └── package.json
├── main/                       # Python backend for both bots
│   ├── agents/
│   ├── core/
│   └── tools/
├── .env.example
├── README.md                   # You are here
└── requirements.txt            # Python dependencies
```

  - **`client/`**: A modern React frontend for the Drive-Thru bot.
  - **`frontend/`**: A separate React frontend for the Healthcare bot, showcasing how to build multiple user interfaces for the same backend.
  - **`main/`**: The core Python backend that powers both agents. It contains the agentic logic, tools, and API endpoints.

-----

## 🛠️ Setup Instructions

To run this project locally, you need to set up the backend and both frontends.

### 1\. Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://your-repo-link.git
    cd your-repo-name
    ```
2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Set up environment variables:**
      - Create a `.env` file in the root directory.
      - Add your API keys for the large language models. The platform supports multiple providers.
    <!-- end list -->
    ```env
    OPENAI_API_KEY=your_openai_key
    MISTRAL_API_KEY=your_mistral_key
    GEMINI_API_KEY=your_gemini_key
    ```
4.  **Run the backend:**
    ```bash
    python main/app.py
    ```
    The backend will run on `http://127.0.0.1:5000`.

### 2\. Frontend Setup (for both bots)

Each frontend needs to be set up and run separately.

1.  **For the Drive-Thru Bot:**
    ```bash
    cd client/
    npm install
    npm run dev
    ```
2.  **For the Healthcare Bot:**
    ```bash
    cd frontend/
    npm install
    npm run dev
    ```

You can now access the Drive-Thru bot at `http://localhost:5173` and the Healthcare bot at `http://localhost:5174` (or similar ports, depending on your setup).

-----

## 🗣️ Demo & Usage

### 🍔 Scenario 1: The Complex Drive-Thru Order

This example showcases the Restaurant Drive-Thru Assistant handling a detailed order with a dietary restriction, an ambiguous request, and a proactive suggestion.

**User:** Hi, I'd like to order for myself and my friend. I'll take a Fire Zinger Stacker meal, but my friend has a gluten intolerance, so she needs something that's gluten-free.

**Assistant:** Welcome\! I can certainly help with that. I've added a **Fire Zinger Stacker Meal** to your order. For your friend, I'm checking the menu for our gluten-free options.

**Assistant:** I've found a few gluten-free options on the menu: the **Original Fillet Breaded**, the **Fire Zinger**, and the **Colonel Burger**. Which of these would she prefer?

**User:** The Colonel Burger sounds good. Can we make it a meal?

**Assistant:** Absolutely. I've added a **Colonel Burger Meal** to your order. So far, you have two meals. What sides would you both like?

**User:** Let me get French Fries for me and for her, can she get a side salad?

**Assistant:** I've noted that. Both meals will come with a drink. What drinks would you both like?

**User:** Give us both a Pepsi, please.

**Assistant:** Got it. To confirm, your order is:

1.  **Fire Zinger Stacker Meal** (with French Fries and a Pepsi)
2.  **Colonel Burger Meal** (with a Side Salad and a Pepsi)

**Assistant:** I see you've ordered two meals. We have a **Family Meal Deal** discount available for orders like this. It will automatically save you 15%. Would you like me to apply it?

**User:** Wow, yes, definitely\! That's awesome. What's my total?

**Assistant:** With the 15% discount applied, your new total is **$29.75**. Ready to check out?

-----

### 🏥 Scenario 2: The Proactive Healthcare Assistant

This example demonstrates the Healthcare Assistant's ability to handle appointment booking, retrieve patient data, and proactively suggest the next steps, creating a truly agentic workflow.

**User:** Hi, I've been having some bad headaches lately, and I need to see a doctor.

**Assistant:** I'm sorry to hear that. I can help you with that. I need to find a doctor who specializes in headaches. To do that, I'll need to confirm your name. Can you please tell me your full name?

**User:** It's David Chen.

**Assistant:** Thank you, David. I've located your profile. I see that you've visited our clinic before and your primary care physician is **Dr. Emily Carter**. Would you like to book an appointment with her? She specializes in general practice and can provide an initial consultation.

**User:** Yes, that sounds great. Can I get an appointment sometime next week?

**Assistant:** I'm checking Dr. Carter's availability for next week... I see she has a few openings. How does **Wednesday, October 11th, at 2:00 PM** sound?

**User:** That works for me. Please book that.

**Assistant:** I've successfully booked your appointment with Dr. Emily Carter for Wednesday, October 11th, at 2:00 PM. A confirmation email has been sent to your email address on file.

**Assistant:** For your headaches, it's often helpful to keep a log of when they occur and any potential triggers. Would you like me to send you a simple headache log via email? This can be very useful for your doctor.

**User:** That's a great idea\! Yes, please send me the log.

**Assistant:** Done. You should receive that shortly. We look forward to seeing you at your appointment, David. Is there anything else I can assist you with today?

**User:** No, that's all, thanks\!

## **Assistant:** You're welcome\! Feel better soon.

## 🤝 Contributing

We welcome contributions\! If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement."

-----

## 📄 License

This project is licensed under the Apache 2.0 License. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

-----

## 🙌 Acknowledgements

  - OpenAI
  - MistralAI
  - React
  - Vite
