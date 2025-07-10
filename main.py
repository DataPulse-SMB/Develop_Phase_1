from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import httpx
import datetime

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# In-memory storage for events (for dev/testing only)
event_store = []

# Load your Slack webhook URL from environment
SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL")

if not SLACK_WEBHOOK_URL:
    raise Exception("SLACK_WEBHOOK_URL not found in .env file")

# Root health check
@app.get("/")
def read_root():
    return {"message": "✅ DataPulse backend is running!"}

# Event ingestion route
@app.post("/event")
async def receive_event(request: Request):
    try:
        payload = await request.json()
        event_type = payload.get("event_type")
        event_data = payload.get("data")

        if not event_type or not event_data:
            raise HTTPException(status_code=400, detail="Missing 'event_type' or 'data'")

        timestamp = datetime.datetime.now().isoformat()

        # Save event to in-memory store (simulate database)
        event = {
            "event_type": event_type,
            "data": event_data,
            "timestamp": timestamp,
        }
        event_store.append(event)

        # Example alert condition (send Slack alert if type is 'error')
        if event_type.lower() == "error":
            await send_slack_alert(f"🚨 ERROR EVENT:\n{event_data}\n🕒 {timestamp}")

        return {"message": "Event received", "status": "ok"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Function to send alert to Slack
async def send_slack_alert(message: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                SLACK_WEBHOOK_URL,
                json={"text": message},
                timeout=10.0
            )
            response.raise_for_status()
        except Exception as e:
            print(f"Failed to send Slack alert: {e}")
