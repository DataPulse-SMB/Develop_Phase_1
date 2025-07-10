from fastapi import FastAPI, Depends, Query, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.models import Event, Alert, Rule, User
from app.schemas import EventCreate, AlertCreate, RuleCreate, ChatRequest, RuleUpdate, Settings, LoginRequest, TokenResponse
from app.utils import send_slack_alert
from fastapi.responses import JSONResponse
from collections import defaultdict
from datetime import datetime

from fastapi import HTTPException, Path



import requests

app = FastAPI()

origins = [
    "https://data-pulse-frontend.vercel.app"
]

# ✅ Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "DataPulse API is running 🚀"}

# ✅ Create an event and maybe trigger alert
@app.post("/events")
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    db_event = Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    # 🔔 Trigger Slack on error
    if event.event_type == "error":
        send_slack_alert("error", event.payload.get("message", "No message"))

        # 🔔 Check for 3+ errors in 1 minute for this user
        one_min_ago = datetime.utcnow() - timedelta(minutes=1)
        recent_errors = db.query(Event).filter(
            Event.user_id == event.user_id,
            Event.event_type == "error",
            Event.created_at >= one_min_ago
        ).count()

        if recent_errors >= 3:
            alert_msg = f"⚠️ 3+ errors in 1 min for user {event.user_id}"
            new_alert = Alert(user_id=event.user_id, message=alert_msg)
            db.add(new_alert)
            db.commit()
            send_slack_alert("alert", alert_msg)

    # ✅ Rule-Based Alert System (Any event type)
    rules = db.query(Rule).filter(Rule.event_type == event.event_type).all()

    for rule in rules:
        window_start = datetime.utcnow() - timedelta(minutes=rule.time_window_minutes)

        rule_query = db.query(Event).filter(
            Event.event_type == rule.event_type,
            Event.created_at >= window_start
        )
        if rule.user_id:
            rule_query = rule_query.filter(Event.user_id == rule.user_id)

        count = rule_query.count()

        if count >= rule.threshold:
            send_slack_alert("RULE ALERT", rule.message)

    return {"status": "ok", "event_id": db_event.id}


# ✅ Get events with filters
@app.get("/events")
def get_events(
    event_type: str = Query(None),
    user_id: str = Query(None),
    start_date: str = Query(None),
    end_date: str = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(Event)

    if event_type:
        query = query.filter(Event.event_type == event_type)
    if user_id:
        query = query.filter(Event.user_id == user_id)
    if start_date and end_date:
        try:
            start = datetime.fromisoformat(start_date)
            end = datetime.fromisoformat(end_date)
            query = query.filter(Event.created_at.between(start, end))
        except ValueError:
            return {"error": "Invalid date format. Use ISO 8601."}

    return query.order_by(Event.created_at.desc()).offset(skip).limit(limit).all()

# ✅ Manually create alert (if needed)
@app.post("/alert")
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    db_alert = Alert(
        user_id=alert.user_id,
        message=alert.message,
        created_at=alert.created_at or datetime.utcnow()
    )
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return {"status": "alert_created", "alert_id": db_alert.id}

# ✅ Get alerts for frontend
@app.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).order_by(Alert.created_at.desc()).limit(20).all()

@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    try:
        today = datetime.utcnow().date()
        last_7_days = today - timedelta(days=6)

        events = db.query(Event).filter(Event.created_at >= last_7_days).all()

        # Prepare data
        event_count_by_day = defaultdict(lambda: {"error": 0, "info": 0, "warning": 0})
        errors_over_time = defaultdict(int)
        type_distribution = defaultdict(int)

        for event in events:
            day = event.created_at.date().isoformat()
            hour = event.created_at.strftime("%H:00")
            etype = event.event_type

            if etype in event_count_by_day[day]:
                event_count_by_day[day][etype] += 1

            if etype == "error":
                errors_over_time[hour] += 1

            type_distribution[etype] += 1

        return {
            "eventCountByDay": [
                {"date": day, **counts} for day, counts in sorted(event_count_by_day.items())
            ],
            "errorsOverTime": [
                {"time": hour, "errors": count} for hour, count in sorted(errors_over_time.items())
            ],
            "eventTypeDistribution": [
                {"name": k, "value": v} for k, v in type_distribution.items()
            ],
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    



@app.post("/rules")
def create_rule(rule: RuleCreate, db: Session = Depends(get_db)):
    existing = db.query(Rule).filter(
        Rule.user_id == rule.user_id,
        Rule.event_type == rule.event_type,
        Rule.threshold == rule.threshold,
        Rule.time_window_minutes == rule.time_window_minutes,
        Rule.message == rule.message,
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Rule already exists")

    new_rule = Rule(**rule.dict())
    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)
    return {"status": "rule_created", "rule_id": new_rule.id}





@app.get("/rules")
def get_rules(db: Session = Depends(get_db)):
    return db.query(Rule).order_by(Rule.created_at.desc()).all()

@app.put("/rules/{rule_id}")
def update_rule(rule_id: int, updated_rule: RuleUpdate, db: Session = Depends(get_db)):
    rule = db.query(Rule).filter(Rule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    
    for key, value in updated_rule.dict().items():
        setattr(rule, key, value)
    
    db.commit()
    return {"status": "updated"}

@app.delete("/rules/{rule_id}")
def delete_rule(rule_id: int, db: Session = Depends(get_db)):
    rule = db.query(Rule).filter(Rule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    
    db.delete(rule)
    db.commit()
    return {"status": "deleted"}

@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    try:
        response = requests.post(
             "https://data-pulse-frontend.vercel.app/chat",
            #"http://localhost:8000/chat",
           
            
            json={
                "model": "llama3",
                "messages": [
                    {"role": "user", "content": req.message}
                ]
            }
        )
        response.raise_for_status()
        data = response.json()
        return {"response": data['message']['content']}
    except Exception as e:
        print("Chat error:", e)
        return {"error": str(e)}
    
settings_store = {
    "slack": "",
    "email": "",
    "notifications": True
}

@app.get("/settings")
def get_settings():
    return settings_store

@app.post("/settings")
def save_settings(new_settings: Settings):
    settings_store.update(new_settings.dict())
    return {"status": "saved"}


FAKE_TOKEN = "datapulse-dev-token"  # Replace with real JWT in prod

@app.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()

    if not user or user.password != data.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {"token": FAKE_TOKEN}
