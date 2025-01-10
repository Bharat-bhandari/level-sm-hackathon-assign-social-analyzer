from flask import Flask, request, jsonify
import os
import requests
from dotenv import load_dotenv
import json
import warnings

# --------------------
# Paste the run_flow code and variables from your generated script here
# --------------------

BASE_API_URL = "https://api.langflow.astra.datastax.com"
LANGFLOW_ID = "27788756-d588-4b43-a11b-1f06b175ebc8"
FLOW_ID = "4fd23e29-cc58-47af-9296-7cbd2885aece"
# It's best to store your token in environment variables for security
APPLICATION_TOKEN = os.getenv("APPLICATION_TOKEN") 


TWEAKS = {
  "ChatInput-f5zF7": {},
  "ParseData-Ticw5": {},
  "Prompt-RmfYU": {},
  "SplitText-WAAb7": {},
  "OpenAIModel-9QeqT": {},
  "ChatOutput-W4TsL": {},
  "AstraDB-gX6IL": {},
  "OpenAIEmbeddings-v4Moz": {},
  "AstraDB-kMYju": {},
  "File-RDDkm": {},
  "OpenAIEmbeddings-jahRQ": {}
}

def run_flow(message: str,
             endpoint: str = FLOW_ID,
             output_type: str = "chat",
             input_type: str = "chat",
             tweaks: dict = TWEAKS,
             application_token: str = APPLICATION_TOKEN) -> dict:
    api_url = f"{BASE_API_URL}/lf/{LANGFLOW_ID}/api/v1/run/{endpoint}"

    payload = {
        "input_value": message,
        "output_type": output_type,
        "input_type": input_type,
    }
    if tweaks:
        payload["tweaks"] = tweaks

    headers = {"Content-Type": "application/json"}
    if application_token:
        headers["Authorization"] = f"Bearer {application_token}"

    response = requests.post(api_url, json=payload, headers=headers)
    return response.json()

# --------------------
# Create the Flask application
# --------------------
app = Flask(__name__)

@app.route("/run_flow", methods=["POST"])
def run_flow_api():
    """
    POST a JSON object like: { "message": "Your prompt here" }
    """
    data = request.get_json(force=True)
    message = data.get("message", "")

    # optional: handle endpoint or tweaks if you want to override the default
    endpoint = data.get("endpoint", FLOW_ID)

    # call the run_flow function
    result = run_flow(
        message=message,
        endpoint=endpoint,
    )
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
