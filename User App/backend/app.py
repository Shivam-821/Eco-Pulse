from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from langdetect import detect
import google.generativeai as genai
from deep_translator import GoogleTranslator

app = Flask(__name__)
CORS(app)

genai.configure(api_key="AIzaSyC2O_6dq5gGuKWAeb6u-2IL1lsq3FCblNY")
model = genai.GenerativeModel('gemini-1.5-pro')

supported_keywords = [
    "waste", "recycling", "plastic", "organic waste", "biodegradable", "non-biodegradable",
    "garbage", "trash", "compost", "e-waste", "segregation", "reduce", "reuse", "recycle",
    "landfill", "waste disposal", "waste collection", "waste bin", "smart bin", "municipal waste",
    "solid waste", "wet waste", "dry waste", "hazardous waste", "recyclable", "incineration",
    "waste-to-energy", "recycling center", "waste segregation", "cleanliness", "dump site"
]

def format_response(response_text):
    lines = response_text.split('\n')
    formatted_text = ""
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        if "waste" in line.lower() or "recycle" in line.lower():
            formatted_text += f'♻️ Waste/Recycling: {line}\n\n'
        else:
            formatted_text += f'👉 {line}\n\n'
    return formatted_text

def is_supported_topic(question):
    return any(word in question.lower() for word in supported_keywords)

def generate_ai_response(question):
    try:
        response = model.generate_content(question)
        if response and hasattr(response, 'candidates') and response.candidates:
            return response.candidates[0].content.parts[0].text
        else:
            return "Sorry, I couldn't generate a response."
    except Exception as e:
        print("Gemini API Error:", str(e))
        return "⚠️ Error retrieving response from AI."

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    try:
        if not request.is_json:
            return jsonify({"error": "Invalid request. Please send JSON data."}), 400

        data = request.get_json()
        user_input = data.get("text", "").strip()

        if not user_input:
            return jsonify({"error": "Empty message"}), 400

        try:
            detected_lang = detect(user_input)
        except:
            return jsonify({"error": "Can't recognize language."}), 400

        translated_text = (
            GoogleTranslator(source=detected_lang, target="en").translate(user_input)
            if detected_lang != "en" else user_input
        )

        if not is_supported_topic(translated_text):
            return jsonify({
                "text": "🚫 I can only answer questions related to ** Waste Management ♻️.**"
            })

        ai_response = generate_ai_response(translated_text)
        formatted_response = format_response(ai_response)

        final_response = (
            GoogleTranslator(source="en", target=detected_lang).translate(formatted_response)
            if detected_lang != "en" else formatted_response
        )

        return jsonify({"text": final_response})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
