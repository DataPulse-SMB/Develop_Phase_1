from sqlalchemy import Column, Integer, String, JSON, DateTime, func
from app.database import Base
from datetime import datetime


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String)
    event_type = Column(String)
    payload = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String)
    message = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
class Rule(Base):
    __tablename__ = "rules"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=True)  # optional
    event_type = Column(String)
    threshold = Column(Integer)
    time_window_minutes = Column(Integer)
    message = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String) 
