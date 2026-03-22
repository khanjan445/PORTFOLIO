// DOM Elements
const dynamicText = document.getElementById('dynamic-text');
const skillsModal = document.getElementById('skills-modal');
const projectModal = document.getElementById('project-modal');
const cursorGlow = document.querySelector('.cursor-glow');
const magneticElements = document.querySelectorAll('.magnetic');

// Typing Animation Data
const roles = ['Full Stack Developer', 'UI/UX Designer', 'Problem Solver', 'Tech Enthusiast'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

// Skills Data
const skillsData = {
    javascript: {
        title: 'JavaScript',
        progress: 90,
        description: 'Expert in modern ES6+ features, async programming, and building interactive web applications.'
    },
    react: {
        title: 'React',
        progress: 85,
        description: 'Proficient in React ecosystem including hooks, context, and state management solutions.'
    },
    python: {
        title: 'Python',
        progress: 80,
        description: 'Experienced in backend development, data processing, and automation scripts.'
    },
    design: {
        title: 'UI/UX Design',
        progress: 75,
        description: 'Skilled in creating user-centered designs with modern tools and principles.'
    }
};

// Projects Data
const projectsData = {
    1: {
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce solution with modern UI, secure payments, and admin dashboard.',
        tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        image: 'https://via.placeholder.com/400x250/6366f1/ffffff?text=Project+1'
    },
    2: {
        title: 'Data Visualization Dashboard',
        description: 'Interactive dashboard for real-time data analysis with customizable charts and filters.',
        tech: ['D3.js', 'Python', 'Flask', 'PostgreSQL'],
        image: 'https://via.placeholder.com/400x250/06b6d4/ffffff?text=Project+2'
    },
    3: {
        title: 'Mobile App',
        description: 'Cross-platform mobile application for task management with offline capabilities.',
        tech: ['React Native', 'Firebase', 'Redux'],
        image: 'https://via.placeholder.com/400x250/8b5cf6/ffffff?text=Project+3'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTypingAnimation();
    initScrollAnimations();
    initModalHandlers();
    initMagneticEffects();
    initCursorGlow();
    initFormHandler();
});

// Typing Animation
function initTypingAnimation() {
    function typeWriter() {
        const currentRole = roles[roleIndex];

        if (!isDeleting) {
            dynamicText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentRole.length) {
                isDeleting = true;
                setTimeout(typeWriter, 2000);
                return;
            }
        } else {
            dynamicText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        }

        const typingSpeed = isDeleting ? 100 : 150;
        setTimeout(typeWriter, typingSpeed);
    }

    typeWriter();
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.reveal-text, .timeline-item, .skill-card, .project-card').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        document.querySelector('.particles').style.transform = `translateY(${rate}px)`;
    });
}

// Modal Handlers
function initModalHandlers() {
    // Skills modal
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('click', () => {
            const skill = card.dataset.skill;
            const data = skillsData[skill];

            document.getElementById('modal-skill-title').textContent = data.title;
            document.getElementById('progress-fill').style.setProperty('--progress-width', `${data.progress}%`);
            document.getElementById('progress-text').textContent = `${data.progress}%`;
            document.getElementById('modal-skill-description').textContent = data.description;

            skillsModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Projects modal
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const project = card.dataset.project;
            const data = projectsData[project];

            document.getElementById('modal-project-title').textContent = data.title;
            document.getElementById('modal-project-description').textContent = data.description;
            document.getElementById('modal-project-image').src = data.image;

            const techContainer = document.getElementById('modal-project-tech');
            techContainer.innerHTML = '';
            data.tech.forEach(tech => {
                const span = document.createElement('span');
                span.textContent = tech;
                techContainer.appendChild(span);
            });

            projectModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modals
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            skillsModal.style.display = 'none';
            projectModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === skillsModal || e.target === projectModal) {
            skillsModal.style.display = 'none';
            projectModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Magnetic Effects
function initMagneticEffects() {
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0px, 0px)';
        });
    });
}

// Cursor Glow
function initCursorGlow() {
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;

        cursorGlow.style.left = `${glowX - 10}px`;
        cursorGlow.style.top = `${glowY - 10}px`;

        requestAnimationFrame(updateGlow);
    }

    updateGlow();
}

// Smooth Scroll to Section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Form Handler
function initFormHandler() {
    const form = document.querySelector('.contact-form form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic form validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Simulate form submission
        alert('Thank you for your message! I\'ll get back to you soon.');

        // Reset form
        form.reset();
    });
}

// Performance Optimization
let ticking = false;

function optimizedScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            // Scroll-based animations can be added here
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', optimizedScroll);

// Mobile optimizations
if ('ontouchstart' in window) {
    // Disable hover effects on touch devices
    document.body.classList.add('touch-device');
}

// Preload images for better performance
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const image = new Image();
        image.src = img.src;
    });
}

preloadImages();
