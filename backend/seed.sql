INSERT INTO profile (id, name, email, education, skills, projects, work, links) VALUES (
    1,
    'Your Full Name',
    'your.email@example.com',
    'Your Education (e.g., BS in Computer Science, University X, 2023)',
    '["Python", "Machine Learning", "Data Science", "Web Development"]'::jsonb,
    '[{"title": "Project 1", "description": "Built a cool ML model", "links": ["https://github.com/BS-Tech17/project1"]}, {"title": "Project 2", "description": "Web app for data viz", "links": ["https://github.com/BS-Tech17/project2"]}]'::jsonb,
    '[{"title": "Intern at Company X", "description": "Worked on AI pipelines"}, {"title": "Research Assistant", "description": "Analyzed datasets"}]'::jsonb,
    '{"github": "https://github.com/BS-Tech17", "linkedin": "https://linkedin.com/in/yourname", "portfolio": "https://portfolio-placeholder.com"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    education = EXCLUDED.education,
    skills = EXCLUDED.skills,
    projects = EXCLUDED.projects,
    work = EXCLUDED.work,
    links = EXCLUDED.links;