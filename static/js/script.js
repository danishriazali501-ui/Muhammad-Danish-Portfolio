// API Base URL - Uses same domain in production
const API_BASE_URL = '/api';

// Fetch and display skills
async function loadSkills() {
    try {
        const response = await fetch(`${API_BASE_URL}/skills/`);
        const data = await response.json();
        
        const skillsContainer = document.getElementById('skills-container');
        skillsContainer.innerHTML = '';

        if (data.results && data.results.length > 0) {
            data.results.forEach(skill => {
                const skillCard = document.createElement('div');
                skillCard.className = 'skill-card';
                skillCard.innerHTML = `
                    <h3>${skill.name}</h3>
                    <div class="skill-progress">
                        <div class="skill-progress-bar" style="width: ${skill.percentage}%"></div>
                    </div>
                    <div class="skill-percent">${skill.percentage}%</div>
                `;
                skillsContainer.appendChild(skillCard);
            });
        } else {
            skillsContainer.innerHTML = '<p>No skills added yet. Add them in the admin panel.</p>';
        }
    } catch (error) {
        console.error('Error loading skills:', error);
        document.getElementById('skills-container').innerHTML = '<p>Error loading skills. Please try again.</p>';
    }
}

// Fetch and display projects
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/`);
        const data = await response.json();
        
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '';

        if (data.results && data.results.length > 0) {
            data.results.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                
                let linksHTML = '';
                if (project.github_link) {
                    linksHTML += `<a href="${project.github_link}" target="_blank" class="project-links github-link">GitHub</a>`;
                }
                if (project.live_link) {
                    linksHTML += `<a href="${project.live_link}" target="_blank" class="project-links live-link">Live Demo</a>`;
                }

                let techHTML = '';
                if (project.tech_list) {
                    techHTML = project.tech_list.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
                }

                projectCard.innerHTML = `
                    <div class="project-image">
                        ${project.image ? `<img src="${project.image}" alt="${project.title}">` : '📱'}
                    </div>
                    <div class="project-content">
                        <span class="project-tag">${project.tag}</span>
                        <h3>${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tech">${techHTML}</div>
                        <div class="project-links">
                            ${linksHTML || '<p>No links available</p>'}
                        </div>
                    </div>
                `;
                projectsContainer.appendChild(projectCard);
            });
        } else {
            projectsContainer.innerHTML = '<p>No projects added yet. Add them in the admin panel.</p>';
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-container').innerHTML = '<p>Error loading projects. Please try again.</p>';
    }
}

// Fetch and display services
async function loadServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/services/`);
        const data = await response.json();
        
        const servicesContainer = document.getElementById('services-container');
        servicesContainer.innerHTML = '';

        if (data.results && data.results.length > 0) {
            data.results.forEach(service => {
                const serviceCard = document.createElement('div');
                serviceCard.className = 'service-card';
                serviceCard.innerHTML = `
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                `;
                servicesContainer.appendChild(serviceCard);
            });
        } else {
            servicesContainer.innerHTML = '<p>No services added yet. Add them in the admin panel.</p>';
        }
    } catch (error) {
        console.error('Error loading services:', error);
        document.getElementById('services-container').innerHTML = '<p>Error loading services. Please try again.</p>';
    }
}

// Fetch visitor count
async function loadVisitorCount() {
    try {
        const response = await fetch(`${API_BASE_URL}/visitors/`);
        const data = await response.json();
        document.getElementById('visitor-count').textContent = data.count;
    } catch (error) {
        console.error('Error loading visitor count:', error);
    }
}

// Handle contact form submission
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const formMessage = document.getElementById('form-message');

    try {
        const response = await fetch(`${API_BASE_URL}/contact/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({
                name,
                email,
                subject,
                message,
            }),
        });

        if (response.ok) {
            formMessage.className = 'form-message success';
            formMessage.textContent = 'Message sent successfully! I will get back to you soon.';
            document.getElementById('contact-form').reset();
        } else {
            const errorData = await response.json();
            formMessage.className = 'form-message error';
            formMessage.textContent = `Error: ${errorData.message || 'Failed to send message'}`;
        }
    } catch (error) {
        console.error('Error sending message:', error);
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Error sending message. Please try again.';
    }

    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.className = 'form-message';
    }, 5000);
});

// Get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + '=') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Load all data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSkills();
    loadProjects();
    loadServices();
    loadVisitorCount();

    // Reload visitor count every 10 seconds
    setInterval(loadVisitorCount, 10000);
});

// Add smooth scroll behavior for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
