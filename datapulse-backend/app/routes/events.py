from pydantic import BaseModel
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Event
from app.utils.alerts import send_slack_alert

router = APIRouter()

# Pydantic model for request body
class EventCreate(BaseModel):
    user_id: str
    event_type: str
    payload: dict

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/events")
async def receive_event(event: EventCreate, db: Session = Depends(get_db)):
    new_event = Event(
        user_id=event.user_id,
        event_type=event.event_type,
        payload=event.payload
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    if event.event_type in ["error", "failure"]:
        send_slack_alert(event.event_type, f"User: {event.user_id} – Event: {event.event_type}")

    return {"status": "ok", "event_id": new_event.id}
