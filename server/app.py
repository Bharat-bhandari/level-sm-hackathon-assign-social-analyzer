from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
# Allow all origins:
CORS(app)
# OR restrict to a single domain:
# CORS(app, origins=['https://socialpulse-iota.vercel.app'])

# ----------------------------------------------------------------
# Langflow / DataStax config
# ----------------------------------------------------------------
BASE_API_URL = "https://api.langflow.astra.datastax.com"
LANGFLOW_ID = "27788756-d588-4b43-a11b-1f06b175ebc8"
FLOW_ID = "4fd23e29-cc58-47af-9296-7cbd2885aece"

# Retrieve your token from environment variables (.env or OS)
APPLICATION_TOKEN = os.getenv("APPLICATION_TOKEN")

@app.route("/run_flow", methods=["POST"])  # Or "/run_flow" if you prefer
def run_flow():
    data = request.json
    message = data.get("message")
    if not message:
        return jsonify({"error": "Message is required"}), 400

    try:
        api_url = f"{BASE_API_URL}/lf/{LANGFLOW_ID}/api/v1/run/{FLOW_ID}"
        payload = {
            "input_value": message,
            "output_type": "chat",
            "input_type": "chat",
        }

        headers = {
            "Content-Type": "application/json",
        }
        # If we have a token, include it
        if APPLICATION_TOKEN:
            headers["Authorization"] = f"Bearer {APPLICATION_TOKEN}"

        # Make the POST request to Langflow
        response = requests.post(api_url, json=payload, headers=headers)
        response_data = response.json()

        return jsonify(response_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Use PORT from environment if present, else 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
