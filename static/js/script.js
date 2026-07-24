// API Base URL
const API_BASE_URL = "/api";

// -------------------------
// Skills
// -------------------------
async function loadSkills() {
    const container = document.getElementById("skills-container");
    if (!container) return;

    try {
        const response = await fetch(`${API_BASE_URL}/skills/`);
        if (!response.ok) throw new Error("Failed to load skills");

        const data = await response.json();
        container.innerHTML = "";

        const skills = data.results || data;

        if (skills.length) {
            skills.forEach(skill => {
                container.innerHTML += `
                    <div class="skill-card">
                        <h3>${skill.name}</h3>
                        <div class="skill-progress">
                            <div class="skill-progress-bar" style="width:${skill.percentage}%"></div>
                        </div>
                        <span>${skill.percentage}%</span>
                    </div>
                `;
            });
        } else {
            container.innerHTML = "<p>No skills found.</p>";
        }
    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>Unable to load skills.</p>";
    }
}

// -------------------------
// Projects
// -------------------------
async function loadProjects() {
    const container = document.getElementById("projects-container");
    if (!container) return;

    try {
        const response = await fetch(`${API_BASE_URL}/projects/`);
        if (!response.ok) throw new Error("Failed to load projects");

        const data = await response.json();
        container.innerHTML = "";

        const projects = data.results || data;

        if (projects.length) {
            projects.forEach(project => {

                const tech =
                    project.tech_list
                        ? project.tech_list.map(t => `<span class="tech-tag">${t}</span>`).join("")
                        : "";

                container.innerHTML += `
                <div class="project-card">
                    <div class="project-image">
                        ${
                            project.image
                            ? `<img src="${project.image}" alt="${project.title}">`
                            : ""
                        }
                    </div>

                    <div class="project-content">
                        <h3>${project.title}</h3>

                        <p>${project.description}</p>

                        <div>${tech}</div>

                        <br>

                        ${
                            project.github_link
                            ? `<a href="${project.github_link}" target="_blank">GitHub</a>`
                            : ""
                        }

                        ${
                            project.live_link
                            ? `<a href="${project.live_link}" target="_blank"> Live Demo</a>`
                            : ""
                        }

                    </div>
                </div>
                `;
            });

        } else {

            container.innerHTML = "<p>No projects found.</p>";

        }

    } catch (err) {

        console.error(err);

        container.innerHTML = "<p>Unable to load projects.</p>";

    }

}

// -------------------------
// Services
// -------------------------
async function loadServices() {

    const container = document.getElementById("services-container");

    if (!container) return;

    try {

        const response = await fetch(`${API_BASE_URL}/services/`);

        if (!response.ok) throw new Error("Failed to load services");

        const data = await response.json();

        container.innerHTML = "";

        const services = data.results || data;

        if (services.length) {

            services.forEach(service => {

                container.innerHTML += `
                <div class="service-card">
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                </div>
                `;

            });

        } else {

            container.innerHTML = "<p>No services found.</p>";

        }

    } catch (err) {

        console.error(err);

        container.innerHTML = "<p>Unable to load services.</p>";

    }

}

// -------------------------
// Visitor Counter
// -------------------------
async function loadVisitorCount() {

    const visitor = document.getElementById("visitor-count");

    if (!visitor) return;

    try {

        const response = await fetch(`${API_BASE_URL}/visitors/`);

        if (!response.ok) return;

        const data = await response.json();

        visitor.textContent = data.count;

    } catch (err) {

        console.error(err);

    }

}

// -------------------------
// Contact Form
// -------------------------
const contactForm = document.getElementById("contact-form");

if (contactForm) {

    contactForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const formMessage = document.getElementById("form-message");

        try {

            const response = await fetch(`${API_BASE_URL}/contact/`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "X-CSRFToken": getCookie("csrftoken"),

                },

                body: JSON.stringify({

                    name: document.getElementById("name").value,

                    email: document.getElementById("email").value,

                    subject: document.getElementById("subject").value,

                    message: document.getElementById("message").value,

                }),

            });

            if (response.ok) {

                formMessage.innerHTML = "Message Sent Successfully.";

                contactForm.reset();

            } else {

                formMessage.innerHTML = "Failed to send message.";

            }

        } catch (err) {

            console.error(err);

            formMessage.innerHTML = "Server Error.";

        }

    });

}

// -------------------------
// CSRF
// -------------------------
function getCookie(name) {

    let cookieValue = null;

    if (document.cookie) {

        document.cookie.split(";").forEach(cookie => {

            cookie = cookie.trim();

            if (cookie.startsWith(name + "=")) {

                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

            }

        });

    }

    return cookieValue;

}

// -------------------------
// Page Load
// -------------------------
document.addEventListener("DOMContentLoaded", () => {

    loadSkills();

    loadProjects();

    loadServices();

    loadVisitorCount();

});

// -------------------------
// Smooth Scroll
// -------------------------
document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (e) {

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    if (loader) {
        setTimeout(() => {
            loader.classList.add("out");
        }, 1800);
    }
});
