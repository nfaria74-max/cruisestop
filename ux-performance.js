// UX Performance Optimizations
(function() {
    'use strict';

    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Optimize existing images
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.classList.contains('hero-photo')) {
                img.setAttribute('loading', 'eager');
                img.setAttribute('fetchpriority', 'high');
            } else if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add decoding="async" for better performance
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }

            // Add error handling
            img.addEventListener('error', function() {
                this.style.display = 'none';
                console.warn('Image failed to load:', this.src);
            });
        });
    }

    // Smooth scroll with performance optimization
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Touch optimization for mobile
    function initTouchOptimization() {
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // Add touch feedback
            const touchElements = document.querySelectorAll('.btn, .nav-link, .card');
            touchElements.forEach(element => {
                element.addEventListener('touchstart', function() {
                    this.classList.add('touch-active');
                });
                
                element.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.classList.remove('touch-active');
                    }, 150);
                });
            });
        }
    }

    // Accessibility improvements
    function initAccessibility() {
        // Add ARIA labels to interactive elements
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (button.textContent.trim()) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });

        // Focus management
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Form enhancements
    function initFormEnhancements() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Add real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    validateInput(this);
                });

                input.addEventListener('input', function() {
                    if (this.classList.contains('error')) {
                        validateInput(this);
                    }
                });
            });
        });
    }

    function validateInput(input) {
        const isValid = input.checkValidity();
        const errorMessage = input.nextElementSibling;
        
        if (!isValid) {
            input.classList.add('error');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.textContent = input.validationMessage;
                errorMessage.style.display = 'block';
            }
        } else {
            input.classList.remove('error');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.style.display = 'none';
            }
        }
    }

    // Initialize everything when DOM is ready
    function init() {
        optimizeImages();
        initSmoothScroll();
        initTouchOptimization();
        initAccessibility();
        initFormEnhancements();
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose some functions for external use
    window.UXPerformance = {
        optimizeImages,
        initAccessibility,
        initFormEnhancements
    };

})();
