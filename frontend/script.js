const API_BASE = 'http://localhost:8000';  // Update to hosted URL after deployment

async function fetchAPI(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error('API error');
    return await response.json();
}

async function viewProfile() {
    try {
        const data = await fetchAPI('/profile');
        document.getElementById('profile-output').textContent = JSON.stringify(data, null, 2);
    } catch (e) {
        document.getElementById('profile-output').textContent = `Error: ${e.message}`;
    }
}

async function listProjects() {
    try {
        const data = await fetchAPI('/projects');
        document.getElementById('projects-output').textContent = JSON.stringify(data, null, 2);
    } catch (e) {
        document.getElementById('projects-output').textContent = `Error: ${e.message}`;
    }
}

async function searchBySkill() {
    const skill = document.getElementById('skill-input').value;
    try {
        const data = await fetchAPI(`/projects?skill=${encodeURIComponent(skill)}`);
        document.getElementById('skill-output').textContent = JSON.stringify(data, null, 2);
    } catch (e) {
        document.getElementById('skill-output').textContent = `Error: ${e.message}`;
    }
}

async function generalSearch() {
    const q = document.getElementById('search-input').value;
    try {
        const data = await fetchAPI(`/search?q=${encodeURIComponent(q)}`);
        document.getElementById('search-output').textContent = JSON.stringify(data, null, 2);
    } catch (e) {
        document.getElementById('search-output').textContent = `Error: ${e.message}`;
    }
} 
