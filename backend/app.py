from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Load API Key from .env
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")


genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.0-flash")

def clean_markdown(text):
    """Removes Markdown-style bold formatting from the AI response."""
    return re.sub(r"\*\*", "", text)

@app.route("/recommend", methods=["POST"])
def recommend():
    try:
        data = request.json
        user_responses = f"""
        1. Personality: {data.get('q1', '')}
        2. Favorite places: {data.get('q2', '')}
        3. Preferred scent type: {data.get('q3', '')}
        4. Ideal season: {data.get('q4', '')}
        5. Desired mood: {data.get('q5', '')}
        """

        prompt = f"""
        Based on the following user responses, suggest a perfume recommendation in a structured format.
        Ensure the output follows this style:

        **Perfume Name by Brand**

        - **Personality:** Explain how the perfume matches their personality.
        - **Favorite Place:** Connect the scent to their preferred location.
        - **Preferred Scent Type:** Describe how the perfume aligns with their scent preference.
        - **Ideal Season:** Justify why this perfume suits their favorite season.
        - **Desired Mood:** Explain how the fragrance evokes the desired mood.

        User Responses:
        {user_responses}
        """

        response = model.generate_content(prompt)
        
        # Extract AI response text
        if hasattr(response, 'text') and response.text:
            ai_text = clean_markdown(response.text.strip())
            return jsonify({"recommendation": ai_text})

        return jsonify({"error": "No scent recommendation received from AI."})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)  # Run on all network interfaces