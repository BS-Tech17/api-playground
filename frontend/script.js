
const API_BASE = 'https://api-playground-nine.vercel.app/';  // Update to backend URL in production

async function fetchAPI(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error('API error');
    return await response.json();
}

async function viewProfile() {
    try {
        const data = await fetchAPI('/profile');
        if (data.error) {
            document.getElementById('profile-output').innerHTML = `<p class="text-red-500">Error: ${data.error}</p>`;
            return;
        }
        // Create table
        let tableHTML = `
            <table id="profile-table">
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>ID</td><td>${data.id}</td></tr>
                    <tr><td>Name</td><td>${data.name}</td></tr>
                    <tr><td>Email</td><td>${data.email}</td></tr>
                    <tr><td>Education</td><td>${data.education}</td></tr>
                    <tr><td>Skills</td><td>${data.skills.join(', ')}</td></tr>
                    <tr><td>Projects</td><td>${
                        data.projects.map(p => `${p.title}: ${p.description} (${p.links.join(', ')})`).join('<br>')
                    }</td></tr>
                    <tr><td>Work</td><td>${
                        data.work.map(w => `${w.title}: ${w.description}`).join('<br>')
                    }</td></tr>
                    <tr><td>Links</td><td>${
                        Object.entries(data.links).map(([key, value]) => `${key}: ${value}`).join('<br>')
                    }</td></tr>
                </tbody>
            </table>
        `;
        document.getElementById('profile-output').innerHTML = tableHTML;
    } catch (e) {
        document.getElementById('profile-output').innerHTML = `<p class="text-red-500">Error: ${e.message}</p>`;
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