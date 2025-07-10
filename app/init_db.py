from app.database import Base, engine
from app.models import Event

print("🛠️ Creating tables in Supabase DB...")
Base.metadata.create_all(bind=engine)
print("✅ Done.")