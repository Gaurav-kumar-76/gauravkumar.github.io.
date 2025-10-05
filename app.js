// Gaurav Kumar Portfolio - Interactive JavaScript

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initTheme();
        this.initScrollProgress();
        this.initNavigation();
        this.initAnimations();
        this.initTypewriter();
        this.initSkillBars();
        this.initProjectFilter();
        this.initContactForm();
        this.initIntersectionObserver();
        this.initModals();
    }

    bindEvents() {
        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('load', this.handleLoad.bind(this));

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }

        // Navigation
        const hamburger = document.getElementById('nav-hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', this.handleSmoothScroll.bind(this));
        });
    }

    // Theme System
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let theme;
        if (savedTheme) {
            theme = savedTheme;
        } else {
            theme = systemPrefersDark ? 'dark' : 'light';
        }
        
        this.setTheme(theme);
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        document.body.setAttribute('data-color-scheme', theme);
        const themeIcon = document.getElementById('theme-icon');
        
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    // Scroll Progress
    initScrollProgress() {
        this.updateScrollProgress();
    }

    updateScrollProgress() {
        const scrollProgress = document.getElementById('scroll-progress');
        if (!scrollProgress) return;

        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / documentHeight) * 100;
        
        scrollProgress.style.transform = `scaleX(${progress / 100})`;
    }

    // Navigation
    initNavigation() {
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const scrollPos = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    toggleMobileMenu() {
        const hamburger = document.getElementById('nav-hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    handleSmoothScroll(e) {
        const href = e.target.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const hamburger = document.getElementById('nav-hamburger');
            const navMenu = document.getElementById('nav-menu');
            
            if (hamburger && navMenu && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    }

    // Typewriter Effect
    initTypewriter() {
        const subtitle = document.getElementById('hero-subtitle');
        if (!subtitle) return;

        const text = 'BCA Graduate | Web Developer | Data Analyst';
        const phrases = text.split(' | ');
        let currentPhrase = 0;
        let currentChar = 0;
        let isDeleting = false;

        const typeWriter = () => {
            const currentText = phrases[currentPhrase];
            
            if (isDeleting) {
                subtitle.textContent = currentText.substring(0, currentChar - 1);
                currentChar--;
            } else {
                subtitle.textContent = currentText.substring(0, currentChar + 1);
                currentChar++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && currentChar === currentText.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && currentChar === 0) {
                isDeleting = false;
                currentPhrase = (currentPhrase + 1) % phrases.length;
                typeSpeed = 500; // Pause before next phrase
            }

            setTimeout(typeWriter, typeSpeed);
        };

        // Start typewriter effect after a delay
        setTimeout(typeWriter, 1000);
    }

    // Animated Counters
    initAnimations() {
        this.animateCounters();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (target >= 1000) {
                        counter.textContent = Math.ceil(current).toLocaleString();
                    } else {
                        counter.textContent = current.toFixed(2);
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    if (target >= 1000) {
                        counter.textContent = target.toLocaleString();
                    } else {
                        counter.textContent = target.toFixed(2);
                    }
                }
            };
            
            // Start animation when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }

    // Skill Bars Animation
    initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.getAttribute('data-width');
                    
                    setTimeout(() => {
                        progressBar.style.width = `${width}%`;
                    }, 200);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => observer.observe(bar));
    }

    // Project Filter
    initProjectFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                        card.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // Modal System
    initModals() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal:not(.hidden)');
                if (openModal) {
                    this.closeModal(openModal.id);
                }
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Focus trap
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    // Contact Form
    initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (this.validateForm(data)) {
                this.handleFormSubmission(data);
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.subject || data.subject.trim().length < 5) {
            errors.push('Subject must be at least 5 characters long');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }
        
        if (errors.length > 0) {
            this.showFormErrors(errors);
            return false;
        }
        
        return true;
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch (input.type) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'text':
                if (input.name === 'name' && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                if (input.name === 'subject' && value.length < 5) {
                    isValid = false;
                    errorMessage = 'Subject must be at least 5 characters long';
                }
                break;
        }
        
        if (input.tagName === 'TEXTAREA' && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }
        
        this.setFieldValidation(input, isValid, errorMessage);
    }

    setFieldValidation(input, isValid, errorMessage = '') {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;
        
        // Remove existing error
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid) {
            input.style.borderColor = 'var(--color-error)';
            
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.color = 'var(--color-error)';
            errorElement.style.fontSize = 'var(--font-size-sm)';
            errorElement.style.marginTop = 'var(--space-4)';
            errorElement.textContent = errorMessage;
            
            formGroup.appendChild(errorElement);
        } else {
            input.style.borderColor = 'var(--color-success)';
        }
    }

    clearFieldError(input) {
        input.style.borderColor = '';
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            const error = formGroup.querySelector('.field-error');
            if (error) {
                error.remove();
            }
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showFormErrors(errors) {
        // Create or update error container
        let errorContainer = document.querySelector('.form-errors');
        
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'form-errors';
            errorContainer.style.cssText = `
                background: rgba(var(--color-error-rgb), 0.1);
                border: 1px solid var(--color-error);
                color: var(--color-error);
                padding: var(--space-16);
                border-radius: var(--radius-base);
                margin-bottom: var(--space-16);
                font-size: var(--font-size-sm);
            `;
            
            const form = document.getElementById('contact-form');
            form.insertBefore(errorContainer, form.firstChild);
        }
        
        errorContainer.innerHTML = `
            <strong>Please fix the following errors:</strong>
            <ul style="margin: var(--space-8) 0 0 0; padding-left: var(--space-20);">
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;
        
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    handleFormSubmission(data) {
        const submitBtn = document.querySelector('#contact-form button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            this.showSuccessMessage();
            document.getElementById('contact-form').reset();
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Clear any errors
            const errorContainer = document.querySelector('.form-errors');
            if (errorContainer) {
                errorContainer.remove();
            }
        }, 2000);
    }

    showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.cssText = `
            background: rgba(var(--color-success-rgb), 0.1);
            border: 1px solid var(--color-success);
            color: var(--color-success);
            padding: var(--space-16);
            border-radius: var(--radius-base);
            margin-bottom: var(--space-16);
            font-size: var(--font-size-sm);
            display: flex;
            align-items: center;
            gap: var(--space-8);
        `;
        
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Thank you! Your message has been sent successfully. I'll get back to you soon.</span>
        `;
        
        const form = document.getElementById('contact-form');
        form.insertBefore(successMessage, form.firstChild);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    // Intersection Observer for Animations
    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.about-card, .skill-category, .project-card, .timeline-item, .contact-card'
        );
        
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }

    // Event Handlers
    handleScroll() {
        this.updateScrollProgress();
        this.updateActiveNavLink();
        
        // Add navbar background on scroll
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(var(--color-slate-900-rgb), 0.95)';
        } else {
            navbar.style.background = 'rgba(var(--color-slate-900-rgb), 0.9)';
        }
    }

    handleResize() {
        // Close mobile menu on resize if open
        if (window.innerWidth > 768) {
            const hamburger = document.getElementById('nav-hamburger');
            const navMenu = document.getElementById('nav-menu');
            
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    }

    handleLoad() {
        // Remove any loading states
        document.body.classList.add('loaded');
        
        // Initialize particles or other load-dependent features
        this.initParticles();
    }

    // Particle System (Optional Enhancement)
    initParticles() {
        // Simple particle system for hero section
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Add more floating shapes dynamically
        const shapesContainer = hero.querySelector('.floating-shapes');
        if (!shapesContainer) return;

        for (let i = 6; i <= 10; i++) {
            const shape = document.createElement('div');
            shape.className = `shape shape-${i}`;
            shape.style.cssText = `
                width: ${Math.random() * 60 + 40}px;
                height: ${Math.random() * 60 + 40}px;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * -6}s;
                animation-duration: ${Math.random() * 4 + 4}s;
            `;
            shapesContainer.appendChild(shape);
        }
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Global modal functions (called from HTML)
window.openModal = function(modalId) {
    if (window.portfolioApp) {
        window.portfolioApp.openModal(modalId);
    }
};

window.closeModal = function(modalId) {
    if (window.portfolioApp) {
        window.portfolioApp.closeModal(modalId);
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
    
    // Add some performance optimizations
    
    // Optimize scroll events
    let ticking = false;
    function updateScroll() {
        window.portfolioApp.handleScroll();
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    });
    
    // Preload critical resources
    const preloadLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
    
    // Add CSS for fade-in animation
    if (!document.querySelector('#dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
            .fade-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            body.loaded .hero-text {
                animation: slideInLeft 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            body.loaded .hero-profile {
                animation: slideInRight 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
        `;
        document.head.appendChild(style);
    }
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Note: Service Worker would be implemented separately
        console.log('Portfolio loaded successfully');
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Navigate sections with arrow keys when not in form fields
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
        const currentHash = window.location.hash.substring(1) || 'home';
        const currentIndex = sections.indexOf(currentHash);
        
        if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
            e.preventDefault();
            window.location.hash = sections[currentIndex + 1];
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            window.location.hash = sections[currentIndex - 1];
        }
    }
});

// Performance monitoring
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
        }
    }
});

observer.observe({ entryTypes: ['navigation'] });