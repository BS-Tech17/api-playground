from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from backend.database import Profile, get_profile, create_or_update_profile, get_projects_by_skill, get_top_skills, search
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update to frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "alive"}

@app.get("/profile", response_model=Profile)
def read_profile():
    profile = get_profile()
    if not profile:
        return {"error": "Profile not found"}
    return profile

@app.post("/profile", response_model=Profile)
def create_profile(profile: Profile):
    return create_or_update_profile(profile)

@app.put("/profile", response_model=Profile)
def update_profile(profile: Profile):
    return create_or_update_profile(profile)

@app.get("/projects")
def projects_by_skill(skill: Optional[str] = Query(None)):
    if skill:
        return get_projects_by_skill(skill)
    profile = get_profile()
    return profile.projects

@app.get("/skills/top")
def top_skills():
    return get_top_skills()

@app.get("/search")
def search_query(q: str = Query(...)):
    return search(q) 