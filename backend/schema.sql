CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    education TEXT,
    skills JSONB,
    projects JSONB,
    work JSONB,
    links JSONB
);