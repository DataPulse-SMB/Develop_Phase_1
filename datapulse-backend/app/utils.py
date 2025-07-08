import os
import requests

SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL")

def send_slack_alert(event_type: str, message: str):
    if not SLACK_WEBHOOK_URL:
        return
    payload = {
        "text": f"🚨 [{event_type.upper()}] {message}"
    }
    try:
        requests.post(SLACK_WEBHOOK_URL, json=payload)
    except Exception as e:
        print("Slack alert failed:", e)