from pydantic import BaseModel
from typing import Any, Dict, Optional
from datetime import datetime


class EventCreate(BaseModel):
    user_id: str
    event_type: str
    payload: Dict[str, Any]


class EventOut(EventCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
        
class AlertCreate(BaseModel):
    user_id: str
    message: str
    created_at: datetime = None  # Optional

    class Config:
        orm_mode = True
    
class RuleCreate(BaseModel):
    user_id: Optional[str]
    event_type: str
    threshold: int
    time_window_minutes: int
    message: str
    created_at: Optional[datetime] = None  # Allow frontend to optionally send this
    
class RuleUpdate(BaseModel):
    user_id: Optional[str]
    event_type: str
    threshold: int
    time_window_minutes: int
    message: str
    
class ChatRequest(BaseModel):
    message: str
    
class Settings(BaseModel):
    slack: Optional[str] = ""
    email: Optional[str] = ""
    notifications: Optional[bool] = True
    
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    token: str


