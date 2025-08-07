from flask import Flask, request, jsonify, session
from flask_cors import CORS
import pandas as pd
import numpy as np
import faiss
import json
from datetime import datetime, timedelta
from sentence_transformers import SentenceTransformer
import uuid
import random
from dateutil.parser import parse
import google.generativeai as genai

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'
CORS(app, supports_credentials=True)  # Enable CORS for React frontend

# Configuration
API_KEYS = [
"AIzaSyDpA3tXyPXzXSN9Pf5jj7zfcWBBHj8Hjnw",
"AIzaSyBi9mM8OtCK8thW17_t3LsQRk0tFt_2vm8",
"AIzaSyC7zvHQBq3n-cPQ8EDldwlNI83t_GqHlUE",
"AIzaSyCf2Rc9651OXUh2rhHjuWaP_I1IuGzqE44",
"AIzaSyC2fqsmpEQ6QXBlnR9C2vTTOJuzRNJ45Kc",
"AIzaSyAz4XUKYMyaBbDbJ9Y2QjQtII_KuoH71XY",
"AIzaSyBrffJPWKKj91uRj6K2rimhUyOXPgrF-Eg",
"AIzaSyAp_pVabntXveYkF8gfGDbuKCpkzzIUUeQ",
"AIzaSyB21azW6EMcOV71PtK8BMX4oCW8LdZoxIU",
"AIzaSyBrHUV_LEamKTNyFujMbILmk9Y-BNUVu8A",
"AIzaSyAHsdMRQ_iuDGCCVANUpgQwkHI9JOuCt-4",
"AIzaSyCjpXKwM5rENoArxFh1Wg1Fg0aHa6OfJQM",
"AIzaSyAWB2kqbEnfts7RrMsshfww5rR021aX8iE",
"AIzaSyAnmDM91Hrdx_nAe6Dt3fI2Cp9msrratHA"
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


def get_valid_api_key():
    for api_key in API_KEYS:
        if api_key:
            return api_key
    raise ValueError("No valid API keys available")

try:
    genai.configure(api_key=get_valid_api_key())
    model = genai.GenerativeModel('gemini-1.5-pro')
except Exception as e:
    print(f"Failed to initialize Gemini: {str(e)}")
    model = None

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Data Loading (same as original, abbreviated for brevity)
def load_doctor_data():
    return pd.DataFrame({
        'id': range(1, 21),
        'name': [
            'Dr. Sarah Johnson', 'Dr. James Williams', 'Dr. Robert Smith', 'Dr. Maria Garcia', 
            'Dr. David Chen', 'Dr. Emily Davis', 'Dr. Michael Rodriguez', 'Dr. Jennifer Martinez',
            'Dr. Daniel Wilson', 'Dr. Lisa Thompson', 'Dr. Richard Lee', 'Dr. Patricia Moore',
            'Dr. Thomas Taylor', 'Dr. Jessica Anderson', 'Dr. Charles White', 'Dr. Susan Harris',
            'Dr. Joseph Clark', 'Dr. Margaret Lewis', 'Dr. Matthew Hall', 'Dr. Karen Young'
        ],
        'specialization': [
            'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 
            'Dermatology', 'Oncology', 'Gastroenterology', 'Obstetrics',
            'Ophthalmology', 'Psychiatry', 'Radiology', 'Endocrinology',
            'Urology', 'Rheumatology', 'Nephrology', 'Pulmonology',
            'Allergy', 'Internal Medicine', 'Family Medicine', 'Emergency Medicine'
        ],
        'bio': [
            'Specializes in heart conditions with 15 years of experience',
            'Expert in neurological disorders and brain surgery',
            'Focuses on joint replacements and sports injuries',
            'Dedicated to children\'s health for over 10 years',
            'Treats skin conditions and performs cosmetic procedures',
            'Leading researcher in cancer treatment and care',
            'Digestive system specialist with advanced endoscopy training',
            'Provides comprehensive women\'s health and maternity care',
            'Expert in vision care and eye surgery',
            'Helps patients with mental health and wellness',
            'Specializes in diagnostic imaging and intervention',
            'Manages hormone disorders and diabetes',
            'Treats urinary tract issues and prostate conditions',
            'Focuses on autoimmune and inflammatory disorders',
            'Expert in kidney disease and transplant management',
            'Specializes in respiratory and lung conditions',
            'Treats allergies and immunological disorders',
            'Comprehensive adult healthcare provider',
            'Focuses on preventive care for all ages',
            'Trauma and acute care specialist'
        ],
        'languages': [
            'English, Spanish', 'English', 'English, French', 'English, Spanish', 
            'English, Mandarin', 'English', 'English, Spanish', 'English, Portuguese',
            'English, Cantonese', 'English', 'English, Korean', 'English',
            'English, Vietnamese', 'English', 'English, Hindi', 'English, Arabic',
            'English, Russian', 'English', 'English, German', 'English, Tagalog'
        ],
        'hospital_affiliation': [
            'City General Hospital', 'University Medical Center', 'Orthopedic Institute', 'Children\'s Hospital',
            'Dermatology Clinic', 'Cancer Treatment Center', 'Digestive Health Institute', 'Women\'s Health Center',
            'Vision Care Center', 'Behavioral Health Hospital', 'Radiology Partners', 'Endocrine Center',
            'Urology Associates', 'Arthritis Center', 'Kidney Care Specialists', 'Respiratory Institute',
            'Allergy & Asthma Center', 'Community Health Partners', 'Family Care Clinic', 'Emergency Medicine Group'
        ],
        'avg_rating': [
            4.8, 4.7, 4.6, 4.9, 4.7, 4.8, 4.5, 4.9, 4.6, 4.7, 4.8, 4.6, 4.5, 4.7, 4.8, 4.6, 4.7, 4.9, 4.8, 4.7
        ],
        'years_experience': [
            15, 20, 12, 10, 14, 18, 13, 16, 22, 17, 19, 11, 15, 13, 20, 16, 12, 19, 14, 21
        ],
        'education': [
            'Harvard Medical School', 'Johns Hopkins University', 'Mayo Clinic College of Medicine',
            'Stanford University School of Medicine', 'Yale School of Medicine', 'Columbia University',
            'UCLA Medical School', 'Duke University School of Medicine', 'University of Pennsylvania',
            'Washington University School of Medicine', 'UCSF School of Medicine', 'Northwestern University',
            'University of Michigan Medical School', 'Emory University School of Medicine',
            'University of Chicago Pritzker School of Medicine', 'Baylor College of Medicine',
            'NYU Grossman School of Medicine', 'University of Washington School of Medicine',
            'Vanderbilt University School of Medicine', 'Cornell Medical College'
        ]
    })

def generate_doctor_schedules():
    today = datetime.now().date()
    schedules = []
    doctor_df = load_doctor_data()
    for _, doctor in doctor_df.iterrows():
        for day_offset in range(30):
            current_date = today + timedelta(days=day_offset)
            if doctor['id'] % 3 == 0 and current_date.weekday() >= 5:
                continue
            if doctor['id'] % 4 == 0:
                start_times = ['08:00', '09:00', '10:00', '11:00']
            elif doctor['id'] % 4 == 1:
                start_times = ['13:00', '14:00', '15:00', '16:00']
            elif doctor['id'] % 4 == 2:
                start_times = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']
            else:
                start_times = ['11:00', '12:00', '14:00', '15:00', '16:00', '17:00']
            available_slots = [slot for slot in start_times if random.random() > 0.3]
            if available_slots:
                schedules.append({
                    'doctor_id': doctor['id'],
                    'date': current_date.strftime('%Y-%m-%d'),
                    'available_slots': available_slots
                })
    return pd.DataFrame(schedules)

def load_medical_conditions():
    return pd.DataFrame({
        'id': range(1, 26),
        'name': [
            'Hypertension', 'Diabetes', 'Asthma', 'Arthritis', 'Depression',
            'Anxiety', 'Chronic Obstructive Pulmonary Disease', 'Heart Disease', 'Cancer',
            'Migraine', 'Allergies', 'Eczema', 'Influenza', 'Common Cold',
            'Gastroesophageal Reflux Disease', 'Irritable Bowel Syndrome', 'Kidney Disease',
            'Osteoporosis', 'Multiple Sclerosis', 'Parkinson\'s Disease',
            'Alzheimer\'s Disease', 'Hypothyroidism', 'Hyperthyroidism',
            'Fibromyalgia', 'Chronic Fatigue Syndrome'
        ],
        'description': [
            'Condition where blood pressure is consistently elevated',
            'Group of diseases that result in too much sugar in the blood',
            'Chronic condition involving the airways in the lungs',
            'Inflammation of one or more joints causing pain and stiffness',
            'Mood disorder characterized by persistent sadness and loss of interest',
            'Disorder characterized by excessive worry and fear',
            'Progressive lung disease causing obstructed airflow',
            'Conditions that affect the heart\'s structure and function',
            'Disease involving abnormal cell growth with potential to invade other parts of the body',
            'Recurrent headache that causes moderate to severe pain',
            'Immune system reaction to substances that are normally harmless',
            'Inflammatory skin condition causing itchy, red, and scaly patches',
            'Viral infection that attacks the respiratory system',
            'Viral infectious disease of the upper respiratory system',
            'Digestive disorder causing acid reflux',
            'Common disorder affecting the large intestine',
            'Gradual loss of kidney function',
            'Disease where decreased bone strength increases the risk of fractures',
            'Disease affecting the central nervous system',
            'Progressive disorder of the nervous system affecting movement',
            'Progressive disease that destroys memory and other mental functions',
            'Condition where the thyroid gland doesn\'t produce enough hormones',
            'Condition where the thyroid gland produces too much hormone',
            'Disorder characterized by widespread musculoskeletal pain',
            'Complex disorder characterized by extreme fatigue'
        ],
        'symptoms': [
            'Headaches, shortness of breath, nosebleeds',
            'Increased thirst, frequent urination, unexplained weight loss',
            'Shortness of breath, chest tightness, wheezing',
            'Joint pain, swelling, stiffness, decreased range of motion',
            'Persistent sadness, loss of interest, sleep problems',
            'Excessive worry, restlessness, fatigue, difficulty concentrating',
            'Shortness of breath, wheezing, chest tightness, chronic cough',
            'Chest pain, shortness of breath, pain in neck/jaw/back',
            'Unexplained weight loss, fatigue, pain, skin changes',
            'Severe headache, nausea, sensitivity to light and sound',
            'Sneezing, itching, watery eyes, runny nose',
            'Dry, itchy, red skin, scaly patches',
            'Fever, chills, muscle aches, cough, congestion',
            'Runny nose, sneezing, congestion, sore throat',
            'Heartburn, regurgitation, chest pain, difficulty swallowing',
            'Abdominal pain, cramping, bloating, gas, diarrhea or constipation',
            'Nausea, vomiting, fatigue, swelling in legs and ankles',
            'Back pain, loss of height over time, bone fractures',
            'Fatigue, difficulty walking, numbness or tingling, muscle weakness',
            'Tremor, slowed movement, rigid muscles, impaired balance',
            'Memory loss, confusion, difficulty completing familiar tasks',
            'Fatigue, increased sensitivity to cold, weight gain',
            'Weight loss, rapid heartbeat, increased appetite, nervousness',
            'Widespread pain, fatigue, sleep problems, cognitive difficulties',
            'Extreme fatigue, sleep that doesn\'t refresh, cognitive impairment'
        ],
        'recommended_specialization': [
            'Cardiology', 'Endocrinology', 'Pulmonology', 'Rheumatology', 'Psychiatry',
            'Psychiatry', 'Pulmonology', 'Cardiology', 'Oncology',
            'Neurology', 'Allergy', 'Dermatology', 'Family Medicine', 'Family Medicine',
            'Gastroenterology', 'Gastroenterology', 'Nephrology',
            'Endocrinology', 'Neurology', 'Neurology',
            'Neurology', 'Endocrinology', 'Endocrinology',
            'Rheumatology', 'Internal Medicine'
        ],
        'severity_level': [
            'Moderate', 'Moderate', 'Moderate', 'Moderate', 'Moderate',
            'Moderate', 'Severe', 'Severe', 'Severe',
            'Mild', 'Mild', 'Mild', 'Mild', 'Mild',
            'Moderate', 'Moderate', 'Severe',
            'Moderate', 'Severe', 'Severe',
            'Severe', 'Moderate', 'Moderate',
            'Moderate', 'Moderate'
        ],
        'chronic': [
            True, True, True, True, True,
            True, True, True, True,
            True, True, True, False, False,
            True, True, True,
            True, True, True,
            True, True, True,
            True, True
        ]
    })

def load_insurance_data():
    return pd.DataFrame({
        'id': range(1, 11),
        'name': [
            'Blue Cross Blue Shield', 'Aetna', 'UnitedHealthcare', 'Cigna', 
            'Humana', 'Kaiser Permanente', 'Medicare', 'Medicaid', 
            'Anthem', 'MetLife'
        ],
        'coverage_type': [
            'PPO', 'HMO', 'EPO', 'POS', 'PPO', 'HMO', 
            'Government', 'Government', 'PPO', 'PPO'
        ],
        'network_type': [
            'Broad', 'Moderate', 'Broad', 'Moderate', 
            'Broad', 'Restricted', 'Broad', 'Restricted', 
            'Broad', 'Moderate'
        ],
        'contact_number': [
            '800-123-4567', '877-234-5678', '866-345-6789', '855-456-7890',
            '844-567-8901', '833-678-9012', '822-789-0123', '811-890-1234',
            '800-901-2345', '899-012-3456'
        ],
        'coverage_level': [
            'Premium', 'Standard', 'Premium', 'Standard',
            'Premium', 'Premium', 'Basic', 'Basic',
            'Standard', 'Premium'
        ]
    })

def load_procedures_data():
    return pd.DataFrame({
        'id': range(1, 21),
        'name': [
            'Annual Physical Examination', 'Blood Test Panel', 'X-Ray Imaging',
            'MRI Scan', 'CT Scan', 'Ultrasound', 'Dental Cleaning',
            'Vaccination', 'Skin Biopsy', 'Colonoscopy',
            'Mammogram', 'Electrocardiogram (ECG)', 'Allergy Testing',
            'Vision Test', 'Hearing Test', 'Bone Density Scan',
            'Stress Test', 'Endoscopy', 'Sleep Study', 'Physical Therapy'
        ],
        'description': [
            'Comprehensive yearly health check-up', 'Blood sample analysis for various health markers',
            'Imaging of bones and certain tissues', 'Detailed imaging using magnetic resonance',
            'Cross-sectional imaging using X-rays', 'Imaging using sound waves',
            'Professional teeth cleaning and examination', 'Administration of vaccines for disease prevention',
            'Small tissue sample removal for testing', 'Examination of the large intestine',
            'X-ray imaging of breast tissue', 'Recording of heart\'s electrical activity',
            'Testing for allergic reactions', 'Assessment of visual acuity and eye health',
            'Assessment of hearing ability', 'Measurement of bone mineral density',
            'Monitoring heart during exercise', 'Examination of digestive tract with a camera',
            'Overnight monitoring of sleep patterns', 'Exercises to restore movement and function'
        ],
        'duration_minutes': [
            45, 15, 20, 60, 30, 30, 60, 15, 30, 60,
            30, 15, 45, 30, 30, 30, 45, 60, 480, 45
        ],
        'preparation_required': [
            True, True, False, True, True, True, False, False, False, True,
            False, False, True, False, False, False, True, True, True, False
        ],
        'associated_specialties': [
            'Family Medicine', 'Internal Medicine', 'Radiology', 'Radiology',
            'Radiology', 'Radiology', 'Dentistry', 'Family Medicine',
            'Dermatology', 'Gastroenterology', 'Radiology', 'Cardiology',
            'Allergy', 'Ophthalmology', 'Otolaryngology', 'Endocrinology',
            'Cardiology', 'Gastroenterology', 'Neurology', 'Orthopedics'
        ]
    })

doctor_df = load_doctor_data()
schedule_df = generate_doctor_schedules()
conditions_df = load_medical_conditions()
insurance_df = load_insurance_data()
procedures_df = load_procedures_data()

# FAISS Indices
def build_doctor_faiss_index(df):
    doctor_texts = [f"{row['name']} - {row['specialization']} - {row['bio']} - {row['languages']} - {row['hospital_affiliation']}" for _, row in df.iterrows()]
    embeddings = embedding_model.encode(doctor_texts).astype('float32')
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)
    return index, embeddings

def build_conditions_faiss_index(df):
    condition_texts = [f"{row['name']} - {row['description']} - {row['symptoms']} - {row['recommended_specialization']}" for _, row in df.iterrows()]
    embeddings = embedding_model.encode(condition_texts).astype('float32')
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)
    return index, embeddings

doctor_index, doctor_embeddings = build_doctor_faiss_index(doctor_df)
conditions_index, conditions_embeddings = build_conditions_faiss_index(conditions_df)

# FAISS Index for Chat History
chat_history_index = faiss.IndexFlatL2(embedding_model.get_sentence_embedding_dimension())
chat_history_embeddings = []

def store_chat_history(user_query, assistant_response):
    chat_text = f"User: {user_query}\nAssistant: {assistant_response}"
    embedding = embedding_model.encode([chat_text]).astype('float32')
    chat_history_index.add(embedding)
    chat_history_embeddings.append(chat_text)

def retrieve_chat_history(query, top_k=3):
    query_embedding = embedding_model.encode([query]).astype('float32')
    distances, indices = chat_history_index.search(query_embedding, top_k)
    return [chat_history_embeddings[i] for i in indices[0] if 0 <= i < len(chat_history_embeddings)]

# Session Initialization
def init_session():
    if 'appointments' not in session:
        session['appointments'] = []
    if 'current_appointment' not in session:
        session['current_appointment'] = {
            'patient_name': '', 'doctor_id': None, 'date': None, 'time': None, 'reason': '',
            'insurance': None, 'is_new_patient': True, 'contact_number': '', 'email': '',
            'symptoms': '', 'medical_history': '', 'emergency_contact': ''
        }
    if 'appointment_id' not in session:
        session['appointment_id'] = str(uuid.uuid4())[:8]
    if 'patient_profile' not in session:
        session['patient_profile'] = {
            'name': '', 'dob': None, 'gender': '', 'address': '', 'contact_number': '',
            'email': '', 'insurance': None, 'medical_history': [], 'allergies': [],
            'current_medications': [], 'emergency_contact': '', 'preferred_pharmacy': '',
            'preferred_contact_method': 'Phone'
        }
    if 'chat_history' not in session:
        session['chat_history'] = [{"role": "assistant", "content": "Hello! I'm your AI Health Assistant. How can I help you today?"}]
    if 'booking_step' not in session:
        session['booking_step'] = 1

# Utility Functions
def search_doctors(query, top_k=5):
    query_embedding = embedding_model.encode([query]).astype('float32')
    distances, indices = doctor_index.search(query_embedding, top_k)
    return [doctor_df.iloc[i].to_dict() for i in indices[0] if i < len(doctor_df)]

def search_conditions(query, top_k=3):
    query_embedding = embedding_model.encode([query]).astype('float32')
    distances, indices = conditions_index.search(query_embedding, top_k)
    return [conditions_df.iloc[i].to_dict() for i in indices[0] if i < len(conditions_df)]

def get_available_slots(doctor_id, date):
    if date is None or date == '':
        return []
    if isinstance(date, str):
        date = datetime.strptime(date, '%Y-%m-%d').date()
    filtered = schedule_df[(schedule_df['doctor_id'] == doctor_id) & (schedule_df['date'] == date.strftime('%Y-%m-%d'))]
    return filtered.iloc[0]['available_slots'] if not filtered.empty else []

def get_available_dates(doctor_id):
    filtered = schedule_df[schedule_df['doctor_id'] == doctor_id]
    return filtered['date'].unique().tolist() if not filtered.empty else []

def book_appointment(appointment_details):
    appointment_details['appointment_id'] = session['appointment_id']
    appointment_details['booking_timestamp'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    appointment_details['status'] = 'Confirmed'
    doctor_info = doctor_df[doctor_df['id'] == appointment_details['doctor_id']].iloc[0].to_dict()
    appointment_details.update({'doctor_name': doctor_info['name'], 'doctor_specialization': doctor_info['specialization']})
    
    idx = schedule_df[(schedule_df['doctor_id'] == appointment_details['doctor_id']) & 
                      (schedule_df['date'] == appointment_details['date'])].index
    if not idx.empty:
        slots = schedule_df.loc[idx[0], 'available_slots']
        if appointment_details['time'] in slots:
            slots.remove(appointment_details['time'])
            schedule_df.loc[idx[0], 'available_slots'] = slots
    
    session['appointments'].append(appointment_details)
    session['current_appointment'] = {'patient_name': '', 'doctor_id': None, 'date': None, 'time': None, 'reason': '',
                                     'insurance': None, 'is_new_patient': True, 'contact_number': '', 'email': '',
                                     'symptoms': '', 'medical_history': '', 'emergency_contact': ''}
    session['appointment_id'] = str(uuid.uuid4())[:8]
    session['booking_step'] = 1
    session.modified = True
    return appointment_details

def cancel_appointment(appointment_id):
    for i, apt in enumerate(session['appointments']):
        if apt['appointment_id'] == appointment_id:
            session['appointments'][i]['status'] = 'Cancelled'
            session['appointments'][i]['cancellation_timestamp'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            idx = schedule_df[(schedule_df['doctor_id'] == apt['doctor_id']) & 
                              (schedule_df['date'] == apt['date'])].index
            if not idx.empty:
                slots = schedule_df.loc[idx[0], 'available_slots']
                if apt['time'] not in slots:
                    slots.append(apt['time'])
                    slots.sort()
                    schedule_df.loc[idx[0], 'available_slots'] = slots
            session.modified = True
            return True
    return False

def get_ai_recommendations(query, context=None):
    if not model:
        return "AI model not available."
    try:
        prompt = f"""
        You are a helpful healthcare assistant for a medical appointment booking system.
        Context: {context if context else 'No context provided.'}
        User query: {query}
        Provide a helpful, concise response in a friendly, professional tone.
        """
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

# API Routes
@app.route('/api/init', methods=['GET'])
def init():
    init_session()
    return jsonify({'status': 'Session initialized'})

@app.route('/api/doctors', methods=['GET', 'POST'])
def doctors():
    init_session()
    if request.method == 'POST':
        data = request.json
        search_type = data.get('search_type')
        if search_type == 'specialty':
            specialty = data.get('specialty')
            results = doctor_df[doctor_df['specialization'] == specialty].to_dict('records')
        elif search_type == 'symptoms':
            symptoms = data.get('symptoms')
            conditions = search_conditions(symptoms)
            specializations = list(set(c['recommended_specialization'] for c in conditions))
            results = doctor_df[doctor_df['specialization'].isin(specializations)].to_dict('records')
            context = f"Symptoms: {symptoms}\nConditions: {', '.join(c['name'] for c in conditions)}"
            ai_advice = get_ai_recommendations(f"What doctor should I see for {symptoms}?", context)
            return jsonify({'results': results, 'ai_advice': ai_advice})
        elif search_type == 'name':
            name = data.get('name')
            results = doctor_df[doctor_df['name'].str.contains(name, case=False)].to_dict('records')
        return jsonify({'results': results})
    return jsonify({'specializations': sorted(doctor_df['specialization'].unique()), 'doctors': doctor_df.to_dict('records')})

@app.route('/api/book_appointment', methods=['GET', 'POST'])
def book_appointment_api():
    init_session()
    step = session['booking_step']
    
    if request.method == 'POST':
        data = request.json
        if step == 1:
            doctor_id = data.get('doctor_id')
            date = data.get('date')
            time = data.get('time')
            if doctor_id:
                session['current_appointment']['doctor_id'] = doctor_id
            if date and date in get_available_dates(doctor_id):
                session['current_appointment']['date'] = date
            if time:
                session['current_appointment']['time'] = time
                session['booking_step'] = 2
            session.modified = True
            return jsonify({'step': 2, 'slots': get_available_slots(doctor_id, date)})
        elif step == 2:
            session['current_appointment'].update(data)
            session['current_appointment']['is_new_patient'] = data.get('is_new_patient', True)
            session['booking_step'] = 3
            session.modified = True
            doctor = doctor_df[doctor_df['id'] == session['current_appointment']['doctor_id']].iloc[0].to_dict()
            return jsonify({'step': 3, 'appointment': session['current_appointment'], 'doctor': doctor})
        elif step == 3:
            print(f"Step 3 - Current Appointment: {session['current_appointment']}")
            try:
                booked = book_appointment(session['current_appointment'].copy())
                print(f"Booked: {booked}")
                doctor = doctor_df[doctor_df['id'] == booked['doctor_id']].iloc[0].to_dict()
                return jsonify({'step': 4, 'booked': booked, 'doctor': doctor})
            except Exception as e:
                print(f"Booking Error: {str(e)}")
                return jsonify({'error': str(e)}), 500
    else:
        doctor_id = session['current_appointment'].get('doctor_id') or int(request.args.get('doctor_id', 0))
        if not doctor_id:
            return jsonify({'error': 'No doctor selected'}), 400
        doctor = doctor_df[doctor_df['id'] == doctor_id].iloc[0].to_dict()
        return jsonify({
            'step': step,
            'doctor': doctor,
            'available_dates': get_available_dates(doctor_id),
            'appointment': session['current_appointment']
        })

@app.route('/api/appointments', methods=['GET', 'POST'])
def appointments_api():
    init_session()
    if request.method == 'POST':
        data = request.json
        action = data.get('action')
        apt_id = data.get('appointment_id')
        if action == 'cancel':
            if cancel_appointment(apt_id):
                return jsonify({'success': 'Cancelled'})
            return jsonify({'error': 'Cancellation failed'}), 400
        elif action == 'reschedule':
            for apt in session['appointments']:
                if apt['appointment_id'] == apt_id:
                    cancel_appointment(apt_id)
                    session['current_appointment'] = apt.copy()
                    session['current_appointment'].pop('appointment_id', None)
                    session['booking_step'] = 1
                    session.modified = True
                    return jsonify({'redirect': '/book_appointment'})
    status_filter = request.args.get('filter', 'All')
    apts = session['appointments']
    now = datetime.now().date()
    if status_filter == 'Upcoming':
        apts = [a for a in apts if a['status'] == 'Confirmed' and datetime.strptime(a['date'], '%Y-%m-%d').date() >= now]
    elif status_filter == 'Past':
        apts = [a for a in apts if datetime.strptime(a['date'], '%Y-%m-%d').date() < now and a['status'] != 'Cancelled']
    elif status_filter == 'Cancelled':
        apts = [a for a in apts if a['status'] == 'Cancelled']
    apts.sort(key=lambda x: x['date'], reverse=True)
    return jsonify({'appointments': apts, 'doctors': doctor_df.to_dict('records')})

@app.route('/api/health_assistant', methods=['GET', 'POST'])
def health_assistant_api():
    init_session()
    if request.method == 'POST':
        query = request.json.get('query')
        if query.lower() == "give all chats as history":
            return jsonify({'chat_history': session['chat_history']})
        
        session['chat_history'].append({"role": "user", "content": query})
        
        # Retrieve relevant chat history
        relevant_history = retrieve_chat_history(query)
        context = f"Profile: {json.dumps(session['patient_profile'])}\nAppointments: {json.dumps(session['appointments'][:3])}\nChat History: {json.dumps(relevant_history)}"
        
        conditions = search_conditions(query)
        if conditions:
            context += f"\nConditions: {json.dumps(conditions)}"
        
        response = get_ai_recommendations(query, context)
        session['chat_history'].append({"role": "assistant", "content": response})
        
        # Store chat history in vector database
        store_chat_history(query, response)
        
        session.modified = True
        return jsonify({'chat_history': session['chat_history']})
    return jsonify({'chat_history': session['chat_history']})

@app.route('/api/profile', methods=['GET', 'POST'])
def profile_api():
    init_session()
    if request.method == 'POST':
        data = request.json
        for key in data:
            if key in session['patient_profile']:
                if key in ['medical_history', 'allergies', 'current_medications']:
                    session['patient_profile'][key] = data[key] if isinstance(data[key], list) else data[key].split(',')
                else:
                    session['patient_profile'][key] = data[key]
        session.modified = True
        return jsonify({'success': 'Profile updated'})
    return jsonify({'profile': session['patient_profile'], 'insurance_options': ["None"] + insurance_df['name'].tolist()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)