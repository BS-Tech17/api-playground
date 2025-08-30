import psycopg2
from psycopg2.extras import Json
from dotenv import load_dotenv
import os

load_dotenv()

def init_db():
    try:
        conn = psycopg2.connect(os.getenv('DATABASE_URL'))
        cursor = conn.cursor()
        # Schema
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS profile (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                education TEXT,
                skills JSONB,
                projects JSONB,
                work JSONB,
                links JSONB
            )
        ''')
        # Seed data
        cursor.execute('''
            INSERT INTO profile (id, name, email, education, skills, projects, work, links) VALUES (
                1,
                %s, %s, %s, %s, %s, %s, %s
            ) ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                email = EXCLUDED.email,
                education = EXCLUDED.education,
                skills = EXCLUDED.skills,
                projects = EXCLUDED.projects,
                work = EXCLUDED.work,
                links = EXCLUDED.links
        ''', (
            'Your Full Name',
            'your.email@example.com',
            'Your Education (e.g., BS in Computer Science, University X, 2023)',
            Json(["Python", "Machine Learning", "Data Science", "Web Development"]),
            Json([
                {"title": "Project 1", "description": "Built a cool ML model", "links": ["https://github.com/BS-Tech17/project1"]},
                {"title": "Project 2", "description": "Web app for data viz", "links": ["https://github.com/BS-Tech17/project2"]}
            ]),
            Json([
                {"title": "Intern at Company X", "description": "Worked on AI pipelines"},
                {"title": "Research Assistant", "description": "Analyzed datasets"}
            ]),
            Json({"github": "https://github.com/BS-Tech17", "linkedin": "https://linkedin.com/in/yourname", "portfolio": "https://portfolio-placeholder.com"})
        ))
        conn.commit()
        print("Database initialized and seeded.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    init_db()