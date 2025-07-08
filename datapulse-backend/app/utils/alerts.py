import os
import requests
from dotenv import load_dotenv

load_dotenv()
SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL")

def send_slack_alert(event_type: str, message: str):
    if not SLACK_WEBHOOK_URL:
        return
    payload = {
        "text": f"🚨 [{event_type.upper()}] {message}"
    }
    requests.post(SLACK_WEBHOOK_URL, json=payload)
