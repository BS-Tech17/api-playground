const API_BASE = 'https://api-playground.onrender.com'; // Replace with your actual backend URL (e.g., Render.com URL)

async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} - ${errorText}`);
        }
        return await response.json();
    } catch (e) {
        throw new Error(`Fetch failed: ${e.message}`);
    }
}

async function viewProfile() {
    try {
        const data = await fetchAPI('/profile');
        if (data.error) {
            document.getElementById('profile-output').innerHTML = `<p class="error">Error: ${data.error}</p>`;
            return;
        }
        let tableHTML = `
            <table class="table">
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
        document.getElementById('profile-output').innerHTML = `<p class="error">Error: ${e.message}</p>`;
    }
}

async function listProjects() {
    try {
        const data = await fetchAPI('/projects');
        if (data.length === 0) {
            document.getElementById('projects-output').innerHTML = `<p>No projects found.</p>`;
            return;
        }
        let tableHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Links</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(project => `
                        <tr>
                            <td>${project.title}</td>
                            <td>${project.description}</td>
                            <td>${project.links.join(', ')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('projects-output').innerHTML = tableHTML;
    } catch (e) {
        document.getElementById('projects-output').innerHTML = `<p class="error">Error: ${e.message}</p>`;
    }
}

async function searchBySkill() {
    const skill = document.getElementById('skill-input').value;
    if (!skill) {
        document.getElementById('skill-output').innerHTML = `<p class="error">Please enter a skill.</p>`;
        return;
    }
    try {
        const data = await fetchAPI(`/projects?skill=${encodeURIComponent(skill)}`);
        if (data.length === 0) {
            document.getElementById('skill-output').innerHTML = `<p>No projects found for skill: ${skill}</p>`;
            return;
        }
        let tableHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Links</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(project => `
                        <tr>
                            <td>${project.title}</td>
                            <td>${project.description}</td>
                            <td>${project.links.join(', ')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('skill-output').innerHTML = tableHTML;
    } catch (e) {
        document.getElementById('skill-output').innerHTML = `<p class="error">Error: ${e.message}</p>`;
    }
}

async function generalSearch() {
    const q = document.getElementById('search-input').value;
    if (!q) {
        document.getElementById('search-output').innerHTML = `<p class="error">Please enter a search query.</p>`;
        return;
    }
    try {
        const data = await fetchAPI(`/search?q=${encodeURIComponent(q)}`);
        let tableHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.skills.length > 0 ? data.skills.map(skill => `
                        <tr>
                            <td>Skill</td>
                            <td>${skill}</td>
                        </tr>
                    `).join('') : ''}
                    ${data.projects.length > 0 ? data.projects.map(project => `
                        <tr>
                            <td>Project</td>
                            <td>${project.title}: ${project.description} (${project.links.join(', ')})</td>
                        </tr>
                    `).join('') : ''}
                    ${data.work.length > 0 ? data.work.map(work => `
                        <tr>
                            <td>Work</td>
                            <td>${work.title}: ${work.description}</td>
                        </tr>
                    `).join('') : ''}
                </tbody>
            </table>
        `;
        if (data.skills.length === 0 && data.projects.length === 0 && data.work.length === 0) {
            tableHTML = `<p>No results found for query: ${q}</p>`;
        }
        document.getElementById('search-output').innerHTML = tableHTML;
    } catch (e) {
        document.getElementById('search-output').innerHTML = `<p class="error">Error: ${e.message}</p>`;
    }
}

async function getTopSkills() {
    try {
        const data = await fetchAPI('/skills/top');
        if (data.length === 0) {
            document.getElementById('skills-output').innerHTML = `<p>No top skills found.</p>`;
            return;
        }
        let tableHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Top Skills</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(skill => `
                        <tr>
                            <td>${skill}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('skills-output').innerHTML = tableHTML;
    } catch (e) {
        document.getElementById('skills-output').innerHTML = `<p class="error">Error: ${e.message}</p>`;
    }
}