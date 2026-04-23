// DOM Elements
const dynamicText = document.getElementById('dynamic-text');
const skillsPanel = document.getElementById('skills-panel');
const experiencePanel = document.getElementById('experience-panel');
const cursorGlow = document.querySelector('.cursor-glow');
const magneticElements = document.querySelectorAll('.magnetic');

// Shared panel close timer
let panelCloseTimer = null;
let activePanel = null;
let activeSkillCard = null;
let activeExperienceNode = null;
let shakeTimer = null;

function updatePanelPosition() {
    if (activePanel && (activeSkillCard || activeExperienceNode)) {
        let targetEl = activeSkillCard || activeExperienceNode;
        if (activeExperienceNode) {
            targetEl = activeExperienceNode.querySelector('.tree-content');
        }
        const rect = targetEl.getBoundingClientRect();

        activePanel.style.top = `${rect.top}px`;

        if (activeExperienceNode) {
            const isLeftBranch = activeExperienceNode.closest('.left-branch') !== null;
            if (!isLeftBranch) {
                const panelWidth = activePanel.offsetWidth || 450;
                activePanel.style.left = `${Math.max(16, rect.left - panelWidth - 20)}px`;
            } else {
                activePanel.style.left = `${rect.right + 20}px`;
            }
        } else {
            activePanel.style.left = `${rect.right + 20}px`;
        }

        // Ensure panel does not go off-screen right
        const panelRect = activePanel.getBoundingClientRect();
        if (panelRect.right > window.innerWidth - 16) {
            activePanel.style.left = `${Math.max(window.innerWidth - panelRect.width - 24, 16)}px`;
        }
    }
}

// Typing Animation Data
const roles = ['Full Stack Developer', 'UI/UX Designer', 'Problem Solver', 'Tech Enthusiast', 'Creative Coder', 'Penetration Tester'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

// Skills Data
const skillsData = {
    pentesting: {
        title: 'Penetration Testing',
        progress: 88,
        description: 'Ethical penetration testing for web, network, and application stacks. I identify exploitable weaknesses, validate controls, and deliver practical remediation guidance.',
        expertise: ['Reconnaissance & Discovery', 'Vulnerability Assessment', 'Exploit Validation', 'Post-Exploitation', 'Security Reporting'],
        applications: ['Red Team Exercises', 'External Assessments', 'Internal Audits']
    },
    websec: {
        title: 'Web App Security',
        progress: 85,
        description: 'Securing web applications against OWASP Top 10 risks, application logic flaws, and authentication bypasses through hands-on testing and secure coding reviews.',
        expertise: ['OWASP Top 10', 'Secure Coding', 'Input Validation', 'Session Management', 'API Security'],
        applications: ['Web Penetration Tests', 'App Hardening', 'Secure Development']
    },
    netsec: {
        title: 'Network Security',
        progress: 82,
        description: 'Defending infrastructure with network segmentation, intrusion prevention, packet analysis, and secure remote access controls to harden enterprise environments.',
        expertise: ['Firewall Review', 'IDS/IPS Monitoring', 'Network Segmentation', 'VPN Security', 'Packet Analysis'],
        applications: ['Perimeter Defense', 'Internal Network Audit', 'Secure Connectivity']
    },
    secauto: {
        title: 'Security Automation',
        progress: 78,
        description: 'Automating security workflows using scripts and tooling for continuous scanning, incident response orchestration, and compliance checks.',
        expertise: ['SIEM Automation', 'Vulnerability Scanning', 'CI/CD Security Gates', 'Scripting & Orchestration', 'Alert Triage'],
        applications: ['Continuous Monitoring', 'DevSecOps', 'Automated Reporting']
    },
    javascript: {
        title: 'JavaScript',
        progress: 50,
        description: 'Core JavaScript skills for frontend scripting, DOM interaction, and ES6 syntax applied to interactive web experiences.',
        expertise: ['DOM Manipulation', 'ES6 Syntax', 'Event Handling', 'Async Basics', 'Browser APIs'],
        applications: ['Frontend Development', 'Interactive UI', 'Dynamic Web Pages']
    },
    csshtml: {
        title: 'CSS / HTML',
        progress: 50,
        description: 'Fundamental HTML and CSS skills for building accessible layouts, responsive designs, and clean web interfaces.',
        expertise: ['Responsive Layouts', 'Semantic Markup', 'Flexbox & Grid', 'Accessibility', 'Cross-Browser Styling'],
        applications: ['Web Interfaces', 'Landing Pages', 'Site Prototyping']
    },
    python: {
        title: 'Python',
        progress: 50,
        description: 'Practical Python scripting for automation, data handling, and basic backend logic with a focus on clarity and maintainability.',
        expertise: ['Scripting', 'Data Processing', 'Automation', 'APIs', 'Libraries'],
        applications: ['Automation Tasks', 'Backend Scripts', 'Data Workflows']
    },
    java: {
        title: 'Java',
        progress: 50,
        description: 'Fundamental Java knowledge for object-oriented programming, core APIs, and application logic design.',
        expertise: ['OOP Concepts', 'Core Java APIs', 'Collections', 'Exception Handling', 'Basic Concurrency'],
        applications: ['Desktop Apps', 'Backend Services', 'Java Prototyping']
    }
};

// Projects Data
const projectsData = {
    1: {
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce solution with modern UI, secure payments, and admin dashboard.',
        tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        image: 'https://via.placeholder.com/400x250/6366f1/ffffff?text=Project+1',
        certificate: {
            title: 'E-Commerce Platform Achievement',
            subtitle: 'Full-Stack Development Certificate',
            description: 'Successfully designed and deployed a complete e-commerce platform with integrated payment processing, user authentication, and real-time inventory management. The platform handles 10,000+ concurrent users with 99.9% uptime.',
            status: 'Completed',
            impact: 'High - 50K+ Monthly Users',
            duration: '3 Months',
            team: '6 Members',
            demoLink: '#',
            githubLink: '#'
        }
    },
    2: {
        title: 'Data Visualization Dashboard',
        description: 'Interactive dashboard for real-time data analysis with customizable charts and filters.',
        tech: ['D3.js', 'Python', 'Flask', 'PostgreSQL'],
        image: 'https://via.placeholder.com/400x250/06b6d4/ffffff?text=Project+2',
        certificate: {
            title: 'Data Visualization Dashboard',
            subtitle: 'Analytics & Performance Recognition',
            description: 'Created an advanced data visualization dashboard providing real-time analytics with 15+ interactive chart types. The solution reduced data analysis time by 75% and improved decision-making efficiency across departments.',
            status: 'Completed',
            impact: 'Very High - Enterprise-Level',
            duration: '2.5 Months',
            team: '4 Members',
            demoLink: '#',
            githubLink: '#'
        }
    },
    3: {
        title: 'Mobile App',
        description: 'Cross-platform mobile application for task management with offline capabilities.',
        tech: ['React Native', 'Firebase', 'Redux'],
        image: 'https://via.placeholder.com/400x250/8b5cf6/ffffff?text=Project+3',
        certificate: {
            title: 'Mobile App Development',
            subtitle: 'Cross-Platform Excellence Certificate',
            description: 'Developed a cross-platform mobile application available on iOS and Android with 100K+ downloads. Features include offline sync, real-time notifications, and seamless cloud integration with 4.8-star app store rating.',
            status: 'Completed',
            impact: 'High - 100K+ Downloads',
            duration: '2 Months',
            team: '5 Members',
            demoLink: '#',
            githubLink: '#'
        }
    }
};

// Experience Data
const experienceData = {
    1: {
        title: 'Senior Developer',
        date: '2025 - Present',
        description: 'Leading development of web applications and mentoring junior developers.'
    },
    2: {
        title: 'Head Management',
        date: '2025 ( 6 Months) ',
        description: 'Developed and maintained multiple client projects using modern technologies.'
    },
    3: {
        title: 'Pentester',
        date: '2025 - 2026 ( 9 months )',
        description: 'Led a penetration testing project on a real-world web application, identifying critical vulnerabilities and delivering actionable security recommendations based on industry best practices.'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTypingAnimation();
    initScrollAnimations();
    initModalHandlers();
    initProjectSwitcher();
    initMagneticEffects();
    initCursorGlow();
    initFormHandler();
    initExtraAnimations();
    initInsaneBackground();
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
    document.querySelectorAll('.reveal-text, .tree-node, .skill-card, .project-card').forEach(el => {
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
    // Skills panel
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('click', () => {
            const skill = card.dataset.skill;
            const data = skillsData[skill];

            document.getElementById('panel-skill-title').textContent = data.title;
            document.getElementById('panel-progress-fill').style.setProperty('--progress-width', `${data.progress}%`);
            document.getElementById('panel-progress-text').textContent = `${data.progress}%`;
            document.getElementById('panel-skill-description').textContent = data.description;

            // Populate expertise list
            const expertiseList = document.getElementById('expertise-list');
            expertiseList.innerHTML = '';
            data.expertise.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                expertiseList.appendChild(li);
            });

            // Populate applications
            const applicationsList = document.getElementById('applications-list');
            applicationsList.innerHTML = '';
            data.applications.forEach(app => {
                const span = document.createElement('span');
                span.className = 'app-tag';
                span.textContent = app;
                applicationsList.appendChild(span);
            });

            // Update badge based on progress
            const badge = document.querySelector('.skill-badge');
            if (data.progress >= 85) {
                badge.textContent = 'Expert';
                badge.style.background = 'linear-gradient(135deg, #1e40af, #3b82f6)';
            } else if (data.progress >= 75) {
                badge.textContent = 'Advanced';
                badge.style.background = 'linear-gradient(135deg, #0d9488, #06b6d4)';
            } else {
                badge.textContent = 'Proficient';
                badge.style.background = 'linear-gradient(135deg, #8b5cf6, #a78bfa)';
            }

            // Position panel next to clicked card
            const rect = card.getBoundingClientRect();
            const panel = skillsPanel;
            const isMobile = window.innerWidth <= 768;

            if (isMobile) {
                // Center the panel on mobile
                panel.style.left = '50%';
                panel.style.top = '50%';
                panel.style.transform = 'translate(-50%, -50%)';
            } else {
                // Position next to card on desktop
                panel.style.left = `${rect.right + 20}px`;
                panel.style.top = `${rect.top}px`;
                panel.style.transform = '';
            }

            panel.classList.add('active');
            activePanel = panel;
            activeSkillCard = card;
            activeProjectCard = null;
            activeExperienceNode = null;

            // Add rotation and move right animation to card
            card.classList.add('skill-anim-right');
            setTimeout(() => card.classList.remove('skill-anim-right'), 800);

            // Auto-hide after 5 seconds
            if (panelCloseTimer) clearTimeout(panelCloseTimer);
            panelCloseTimer = setTimeout(() => {
                panel.classList.remove('active');
                activePanel = null;
                activeSkillCard = null;
            }, 5000);

            // Close other panels
            projectsPanel.classList.remove('active');
        });
    });


    // Projects pop-up modal on click
    document.querySelectorAll('.project-card[data-project]').forEach(card => {
        card.addEventListener('click', () => {
            const project = card.dataset.project;
            const data = projectsData[project];

            // Show certificate modal on click
            showCertificateModal(project, data);
        });
    });

    // Close panels
    document.querySelectorAll('.close-panel').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            skillsPanel.classList.remove('active');
            experiencePanel.classList.remove('active');
        });
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (!e.target.closest('.skill-card') && !e.target.closest('.project-card') && !e.target.closest('.tree-node') && !e.target.closest('.slide-panel')) {
            skillsPanel.classList.remove('active');
            experiencePanel.classList.remove('active');
        }
    });

    // Certificate Modal Handler
    const certificateModal = document.getElementById('certificate-modal');
    const certificateClose = document.querySelector('.certificate-close');
    
    if (certificateClose) {
        certificateClose.addEventListener('click', () => {
            certificateModal.classList.remove('active');
        });
    }

    // Close certificate modal on outside click
    certificateModal.addEventListener('click', (e) => {
        if (e.target === certificateModal) {
            certificateModal.classList.remove('active');
        }
    });

    // Close certificate modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            certificateModal.classList.remove('active');
        }
    });
}

function initProjectSwitcher() {
    const buttons = document.querySelectorAll('.switch-button');
    const sections = document.querySelectorAll('.switchable-block');
    const sectionTitle = document.querySelector('.section-title');

    function setActiveSection(targetId) {
        const transitionOverlay = document.getElementById('sectionTransition');

        // Add loading state to all buttons
        buttons.forEach(button => button.classList.add('loading'));

        // Show transition overlay
        transitionOverlay.classList.add('active');

        // Remove active class from all buttons with smooth transition
        buttons.forEach(button => {
            button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            button.classList.remove('active');
        });

        // Add active class to clicked button after a short delay
        const activeButton = document.querySelector(`[data-target="${targetId}"]`);
        if (activeButton) {
            setTimeout(() => {
                activeButton.classList.add('active');
                activeButton.classList.remove('loading');
            }, 300);
        }

        // Remove loading state from other buttons
        setTimeout(() => {
            buttons.forEach(button => {
                if (button !== activeButton) button.classList.remove('loading');
            });
        }, 600);

        // Hide transition overlay after section switch
        setTimeout(() => {
            transitionOverlay.classList.remove('active');
        }, 800);

        // Update section title with smooth animation
        const newTitle = targetId === 'projects-list' ? 'Projects' : 'Vulnerabilities';
        if (sectionTitle.textContent !== newTitle) {
            sectionTitle.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            sectionTitle.style.opacity = '0';
            sectionTitle.style.transform = 'translateY(-15px) scale(0.95)';
            setTimeout(() => {
                sectionTitle.textContent = newTitle;
                sectionTitle.style.opacity = '1';
                sectionTitle.style.transform = 'translateY(0) scale(1)';
            }, 200);
        }

        // Handle section transitions with improved timing
        sections.forEach(section => {
            if (section.id === targetId) {
                // Show the target section with enhanced animation
                section.style.display = 'block';
                // Force reflow for smooth animation
                section.offsetHeight;
                section.classList.add('active');

                // Add fade-in class with delay for smoother effect
                setTimeout(() => {
                    section.classList.add('fade-in');
                }, 100);

                // Animate cards with improved stagger timing
                const cards = section.querySelectorAll('.project-card');
                cards.forEach((card, index) => {
                    // Reset card state
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(50px) scale(0.9)';
                    card.style.filter = 'blur(2px)';

                    // Animate in with smooth timing
                    setTimeout(() => {
                        card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                        card.style.filter = 'blur(0)';
                    }, 200 + (index * 80)); // Smoother stagger
                });
            } else {
                // Hide other sections with smooth exit animation
                section.classList.remove('fade-in');
                const cards = section.querySelectorAll('.project-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(-30px) scale(0.95)';
                        card.style.filter = 'blur(1px)';
                    }, index * 30);
                });

                // Hide section after cards animation
                setTimeout(() => {
                    section.classList.remove('active');
                    section.style.display = 'none';
                }, 500); // Increased delay for smoother transition
            }
        });
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            setActiveSection(targetId);
        });
    });

    // Initialize with projects active and smooth entrance
    setTimeout(() => {
        setActiveSection('projects-list');
    }, 100);
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

// Show Certificate Modal
function showCertificateModal(projectId, projectData) {
    const certificateModal = document.getElementById('certificate-modal');
    const cert = projectData.certificate;

    // Populate certificate modal
    document.getElementById('cert-title').textContent = cert.title;
    document.getElementById('cert-subtitle').textContent = cert.subtitle;
    document.getElementById('cert-description').textContent = cert.description;
    document.getElementById('cert-status').textContent = cert.status;
    document.getElementById('cert-impact').textContent = cert.impact;
    document.getElementById('cert-duration').textContent = cert.duration;
    document.getElementById('cert-team').textContent = cert.team;
    
    const demoLink = document.getElementById('cert-demo');
    const githubLink = document.getElementById('cert-github');
    
    demoLink.href = cert.demoLink;
    githubLink.href = cert.githubLink;

    // Show modal with animation
    certificateModal.classList.add('active');
}

// Cursor Glow
function initCursorGlow() {
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    // Platform detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window;

    if (isMobile || isTouch) {
        // Hide cursor glow on touch devices
        cursorGlow.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateGlow() {
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;

        cursorGlow.style.left = `${glowX - 12}px`;
        cursorGlow.style.top = `${glowY - 12}px`;

        requestAnimationFrame(updateGlow);
    }

    updateGlow();

    // Add hover effects for interactive elements
    document.querySelectorAll('button, .skill-card, .project-card, .social-link, a').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorGlow.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorGlow.style.transform = 'scale(1)';
        });
    });
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

// Handle window resize for panel positioning
window.addEventListener('resize', () => {
    // Reposition active panels on resize
    const activePanels = document.querySelectorAll('.slide-panel.active');
    activePanels.forEach(panel => {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // Center the panel on mobile
            panel.style.left = '50%';
            panel.style.top = '50%';
            panel.style.transform = 'translate(-50%, -50%)';
        } else {
            // Find the corresponding card and reposition
            const isSkillPanel = panel === skillsPanel;
            const cards = isSkillPanel ? document.querySelectorAll('.skill-card') : document.querySelectorAll('.project-card');

            cards.forEach(card => {
                if (card.matches(':hover')) {
                    const rect = card.getBoundingClientRect();
                    panel.style.left = `${rect.right + 20}px`;
                    panel.style.top = `${rect.top}px`;
                    panel.style.transform = '';
                }
            });
        }
    });
});

// Additional Animations and Effects
function initExtraAnimations() {
    // Add stagger animation to skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });

    // Add hover sound effect simulation (visual feedback)
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.animation = 'glowPulse 0.6s infinite';
        });
        el.addEventListener('mouseleave', () => {
            el.style.animation = '';
        });
    });

    // Add typing effect to about text
    const aboutText = document.querySelector('.about-text p');
    if (aboutText) {
        const text = aboutText.textContent;
        aboutText.textContent = '';
        let i = 0;
        const typeAbout = () => {
            if (i < text.length) {
                aboutText.textContent += text.charAt(i);
                i++;
                setTimeout(typeAbout, 30);
            }
        };
        // Trigger on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeAbout();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(aboutText);
    }

    // Add particle burst on button hover
    document.querySelectorAll('.cta-button, .submit-button').forEach(button => {
        button.addEventListener('mouseenter', createParticleBurst);
    });
}

function createParticleBurst(e) {
    const button = e.target;
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.setProperty('--angle', `${i * 45}deg`);
        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

function createImpactBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create shockwave ring
    const shockwave = document.createElement('div');
    shockwave.className = 'impact-shockwave';
    shockwave.style.left = `${centerX}px`;
    shockwave.style.top = `${centerY}px`;
    shockwave.style.width = '20px';
    shockwave.style.height = '20px';
    document.body.appendChild(shockwave);

    setTimeout(() => shockwave.remove(), 600);

    // Particle explosion
    for (let i = 0; i < 16; i++) {
        const particle = document.createElement('div');
        particle.className = 'impact-particle';
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.setProperty('--angle', `${i * 22.5}deg`);
        particle.style.background = i % 2 === 0 ? 'var(--primary)' : 'var(--accent)';
        particle.style.boxShadow = `0 0 15px ${particle.style.background}`;
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 800);
    }
}

// Handle window resize + scroll for panel attachment
document.addEventListener('scroll', updatePanelPosition);
window.addEventListener('resize', updatePanelPosition);

// Insane Interactive Particle Network Background
function initInsaneBackground() {
    // Create and inject the canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'insane-bg-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Track mouse securely
    let mouse = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Node networking configuration
    const connectionDistance = 120;
    const mouseDistance = 200;
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles(); 
    }

    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.radius = Math.random() * 1.5 + 0.5;
            
            // Pick a random vibrant neon color
            const colors = ['rgba(59, 130, 246, 1)', 'rgba(96, 165, 250, 1)', 'rgba(139, 92, 246, 1)', 'rgba(99, 102, 241, 1)'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.glowColor = this.color.replace('1)', '0.3)'); // Creates a soft outer glow
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Wrap around edges for infinite flow
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            // Core bright particle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Soft glow aura
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
            ctx.fillStyle = this.glowColor;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        // Responsive node density map
        const count = Math.min(Math.floor((width * height) / 9000), 180);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            
            // Draw line connections to neighbor nodes
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(96, 165, 250, ${(1 - dist / connectionDistance) * 0.5})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            // Interaction with Mouse Cursor
            const dxMouse = particles[i].x - mouse.x;
            const dyMouse = particles[i].y - mouse.y;
            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

            if (distMouse < mouseDistance) {
                ctx.beginPath();
                // Draw glowing active link to mouse
                ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - distMouse / mouseDistance) * 0.8})`;
                ctx.lineWidth = 1.2;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();

                // Physics: particles dynamically drift away from direct cursor impact
                const dodgeForce = ((mouseDistance - distMouse) / mouseDistance) * 0.05;
                particles[i].x += (dxMouse / distMouse) * dodgeForce;
                particles[i].y += (dyMouse / distMouse) * dodgeForce;
            }
            
            particles[i].draw();
        }

        requestAnimationFrame(animate);
    }

    resize();
    animate();
}