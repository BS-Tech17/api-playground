import psycopg2
from psycopg2.extras import Json
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
import os


load_dotenv()

class Project(BaseModel):
    title: str
    description: str
    links: List[str]

class Work(BaseModel):
    title: str
    description: str

class Profile(BaseModel):
    id: int = 1
    name: str
    email: str
    education: str
    skills: List[str]
    projects: List[Project]
    work: List[Work]
    links: dict

def get_db():
    try:
        conn = psycopg2.connect(os.getenv('DATABASE_URL'))
        return conn
    except Exception as e:
        print(f"DB Connection Error: {e}")
        raise

def get_profile():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM profile WHERE id=1")
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    if not row:
        return None
    return Profile(
        name=row[1], email=row[2], education=row[3],
        skills=row[4], projects=[Project(**p) for p in row[5]],
        work=[Work(**w) for w in row[6]], links=row[7]
    )

def create_or_update_profile(profile: Profile):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO profile (id, name, email, education, skills, projects, work, links)
        VALUES (1, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            education = EXCLUDED.education,
            skills = EXCLUDED.skills,
            projects = EXCLUDED.projects,
            work = EXCLUDED.work,
            links = EXCLUDED.links
        RETURNING *
    """, (
        profile.name, profile.email, profile.education,
        Json(profile.skills),
        Json([p.dict() for p in profile.projects]),
        Json([w.dict() for w in profile.work]),
        Json(profile.links)
    ))
    row = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()
    return Profile(
        name=row[1], email=row[2], education=row[3],
        skills=row[4], projects=[Project(**p) for p in row[5]],
        work=[Work(**w) for w in row[6]], links=row[7]
    )

def get_projects_by_skill(skill: str):
    profile = get_profile()
    return [p for p in profile.projects if skill.lower() in [s.lower() for s in profile.skills]]

def get_top_skills():
    profile = get_profile()
    return sorted(profile.skills)[:3]

def search(q: str):
    profile = get_profile()
    q_lower = q.lower()
    results = {
        'skills': [s for s in profile.skills if q_lower in s.lower()],
        'projects': [p for p in profile.projects if q_lower in p.title.lower() or q_lower in p.description.lower()],
        'work': [w for w in profile.work if q_lower in w.title.lower() or q_lower in w.description.lower()]
    }
    return results
