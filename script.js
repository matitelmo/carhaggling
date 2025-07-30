// Global variables
let selectedCarType = '';
let currentStep = 1;
let userName = '';

// Car type selection functionality
function selectCarType(type) {
    selectedCarType = type;
    
    // Remove active class from all car icons
    document.querySelectorAll('.car-icon').forEach(icon => {
        icon.classList.remove('active');
    });
    
    // Add active class to selected icon
    event.target.closest('.car-icon').classList.add('active');
    
    // Update button text
    const heroCtaButton = document.getElementById('heroCtaButton');
    heroCtaButton.textContent = `Find My Perfect ${type} →`;
    
    // Show email form with animation
    const emailForm = document.getElementById('emailForm');
    emailForm.style.display = 'flex';
    
    // Pre-fill email if available from hero
    const heroEmail = document.getElementById('heroEmail');
    if (heroEmail && heroEmail.value) {
        document.getElementById('email').value = heroEmail.value;
    }
}

// Modal management
function openModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Pre-fill email if available
    const heroEmail = document.getElementById('heroEmail');
    const modalEmail = document.getElementById('email');
    if (heroEmail && heroEmail.value && modalEmail) {
        modalEmail.value = heroEmail.value;
    }
    
    // Reset to step 1
    showStep(1);
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('welcomeForm').reset();
    currentStep = 1;
}

function showStep(stepNum) {
    // Hide all steps
    document.querySelectorAll('.modal-step').forEach(step => {
        step.style.display = 'none';
    });
    
    // Show target step
    const targetStep = document.getElementById(`step${stepNum}`);
    if (targetStep) {
        targetStep.style.display = 'block';
        currentStep = stepNum;
    }
}

// Welcome form submission
function handleWelcomeSubmit(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    
    // Basic validation
    if (!fullName || !email || !email.includes('@')) {
        alert('Please fill in all fields correctly.');
        return;
    }
    
    userName = fullName.split(' ')[0]; // Get first name
    
    // Show step 2 and start animation
    showStep(2);
    startLoadingAnimation();
}

// Theatrical loading animation
function startLoadingAnimation() {
    // Update user analysis text
    const userAnalysisText = document.getElementById('userAnalysisText');
    userAnalysisText.innerHTML = `<span class="user-name">${userName}</span>, your AI co-pilot is analyzing the market...`;
    
    // Initialize progress tracking
    let currentProgress = 0;
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    // Professional status updates with icons and better messaging
    const statusUpdates = [
        {
            icon: '🔍',
            message: 'Scanning 2,847 active listings across major marketplaces',
            progress: 20
        },
        {
            icon: '📊',
            message: 'Analyzing pricing trends and market data from 50+ sources',
            progress: 40
        },
        {
            icon: '🔒',
            message: 'Running VIN checks against CarFax, AutoCheck & NHTSA databases',
            progress: 60
        },
        {
            icon: '🤖',
            message: 'AI negotiation engine calculating optimal pricing strategies',
            progress: 80
        },
        {
            icon: '✅',
            message: 'Success! Found 4 pre-vetted vehicles matching your criteria',
            progress: 100
        }
    ];
    
    const statusList = document.getElementById('statusList');
    statusList.innerHTML = ''; // Clear existing items
    
    let statusIndex = 0;
    const statusInterval = setInterval(() => {
        if (statusIndex < statusUpdates.length) {
            const update = statusUpdates[statusIndex];
            
            // Update progress bar
            currentProgress = update.progress;
            progressBar.style.width = `${currentProgress}%`;
            progressText.textContent = `${currentProgress}%`;
            
            // Add status update with professional styling
            const li = document.createElement('li');
            li.className = 'status-item';
            li.innerHTML = `
                <div class="status-icon">${update.icon}</div>
                <div class="status-content">
                    <div class="status-message">${update.message}</div>
                    <div class="status-time">${new Date().toLocaleTimeString()}</div>
                </div>
                <div class="status-check">✓</div>
            `;
            statusList.appendChild(li);
            
            // Add completion animation
            setTimeout(() => {
                li.classList.add('completed');
            }, 200);
            
            statusIndex++;
        } else {
            // Animation complete
            clearInterval(statusInterval);
            
            // Show completion message
            setTimeout(() => {
                const completionMessage = document.createElement('div');
                completionMessage.className = 'completion-message';
                completionMessage.innerHTML = `
                    <div class="completion-icon">🎯</div>
                    <div class="completion-text">
                        <h3>Analysis Complete!</h3>
                        <p>Your AI co-pilot has identified the best opportunities in your market.</p>
                    </div>
                `;
                statusList.appendChild(completionMessage);
                
                // Show step 3 after a brief delay
                setTimeout(() => {
                    showStep(3);
                }, 2000);
            }, 1000);
        }
    }, 1500);
}

// FAQ Toggle Functionality
function toggleFAQ(element) {
    console.log('=== FAQ DEBUG START ===');
    console.log('toggleFAQ called with element:', element);
    
    const faqItem = element.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    
    console.log('FAQ item found:', faqItem);
    console.log('Answer element found:', answer);
    console.log('Answer is active:', answer.classList.contains('active'));
    
    // Simple display toggle approach
    if (answer.style.display === 'block') {
        // Close the FAQ
        console.log('Closing FAQ...');
        answer.style.display = 'none';
        answer.classList.remove('active');
        element.classList.remove('active');
        element.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');
        console.log('FAQ closed');
    } else {
        // Open the FAQ
        console.log('Opening FAQ...');
        answer.style.display = 'block';
        answer.classList.add('active');
        element.classList.add('active');
        element.setAttribute('aria-expanded', 'true');
        answer.setAttribute('aria-hidden', 'false');
        console.log('FAQ opened');
    }
    
    console.log('Final answer display:', answer.style.display);
    console.log('Final answer classes:', answer.className);
    console.log('=== FAQ DEBUG END ===');
}

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('active');
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
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
    
    // Close modal when clicking outside
    document.getElementById('modalOverlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Pre-fill email from hero to modal
    const heroEmail = document.getElementById('heroEmail');
    const modalEmail = document.getElementById('email');
    
    if (heroEmail && modalEmail) {
        heroEmail.addEventListener('input', function() {
            modalEmail.value = this.value;
        });
    }
    
    // Auto-advance car type selection if user clicks email input first
    const emailInput = document.getElementById('heroEmail');
    if (emailInput) {
        emailInput.addEventListener('focus', function() {
            if (!selectedCarType) {
                // Auto-select first car type
                selectCarType('SUV');
            }
        });
    }
    
    // Add FAQ click handlers
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            toggleFAQ(this);
        });
    });
    
    // Add keyboard support for FAQ
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(this);
            }
        });
    });
});

// Analytics tracking (placeholder for GTM)
function trackEvent(eventName, eventData = {}) {
    // This would integrate with Google Tag Manager
    console.log('Event tracked:', eventName, eventData);
    
    // Example events to track:
    // - Car type selection
    // - Modal opens
    // - Form submissions
    // - Waitlist signups
    // - FAQ interactions
}

// Enhanced car type selection with tracking
function selectCarType(type) {
    selectedCarType = type;
    
    // Remove active class from all car icons
    document.querySelectorAll('.car-icon').forEach(icon => {
        icon.classList.remove('active');
    });
    
    // Add active class to selected icon
    event.target.closest('.car-icon').classList.add('active');
    
    // Update button text
    const heroCtaButton = document.getElementById('heroCtaButton');
    heroCtaButton.textContent = `Find My Perfect ${type} →`;
    
    // Show email form with animation
    const emailForm = document.getElementById('emailForm');
    emailForm.style.display = 'flex';
    
    // Pre-fill email if available from hero
    const heroEmail = document.getElementById('heroEmail');
    if (heroEmail && heroEmail.value) {
        document.getElementById('email').value = heroEmail.value;
    }
    
    // Track car type selection
    trackEvent('car_type_selected', { car_type: type });
}

// Enhanced modal open with tracking
function openModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Pre-fill email if available
    const heroEmail = document.getElementById('heroEmail');
    const modalEmail = document.getElementById('email');
    if (heroEmail && heroEmail.value && modalEmail) {
        modalEmail.value = heroEmail.value;
    }
    
    // Reset to step 1
    showStep(1);
    
    // Track modal open
    trackEvent('modal_opened', { source: 'hero_cta' });
}

// Enhanced form submission with tracking
function handleWelcomeSubmit(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    
    // Basic validation
    if (!fullName || !email || !email.includes('@')) {
        alert('Please fill in all fields correctly.');
        return;
    }
    
    userName = fullName.split(' ')[0]; // Get first name
    
    // Track form submission
    trackEvent('form_submitted', { 
        step: 'welcome',
        car_type: selectedCarType 
    });
    
    // Show step 2 and start animation
    showStep(2);
    startLoadingAnimation();
}

// Waitlist success tracking
function completeWaitlistSignup() {
    trackEvent('waitlist_signup_completed', {
        car_type: selectedCarType,
        user_name: userName
    });
    
    // Close modal
    closeModal();
    
    // Show success message (optional)
    setTimeout(() => {
        alert('Thank you for joining our waitlist! We\'ll be in touch soon.');
    }, 500);
}

// Add click handler for final waitlist button
document.addEventListener('DOMContentLoaded', function() {
    const waitlistButton = document.querySelector('#step4 .cta-button');
    if (waitlistButton) {
        waitlistButton.addEventListener('click', completeWaitlistSignup);
    }
});

// Performance optimization: Lazy load Lottie animation
document.addEventListener('DOMContentLoaded', function() {
    const lottiePlayer = document.querySelector('lottie-player');
    if (lottiePlayer) {
        // Ensure Lottie loads properly
        lottiePlayer.addEventListener('load', function() {
            console.log('Lottie animation loaded successfully');
        });
    }
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels and roles
    const carIcons = document.querySelectorAll('.car-icon');
    carIcons.forEach((icon, index) => {
        const carType = icon.getAttribute('data-type');
        icon.setAttribute('aria-label', `Select ${carType} as your preferred car type`);
        icon.setAttribute('role', 'button');
        icon.setAttribute('tabindex', '0');
        
        // Add keyboard support
        icon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectCarType(carType);
            }
        });
    });
    
    // Modal accessibility
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'modal-title');
    }
    
    // FAQ accessibility
    document.querySelectorAll('.faq-question').forEach(question => {
        question.setAttribute('role', 'button');
        question.setAttribute('tabindex', '0');
        question.setAttribute('aria-expanded', 'false');
        
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    });
});

// Form validation enhancement
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateName(name) {
    return name.trim().length >= 2;
}

function validatePhone(phone) {
    // Basic phone validation - allows various formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phone === '' || phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Enhanced form submission with better validation
function handleWelcomeSubmit(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    // Enhanced validation
    if (!validateName(fullName)) {
        alert('Please enter a valid name (at least 2 characters).');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    if (phone && !validatePhone(phone)) {
        alert('Please enter a valid phone number or leave it blank.');
        return;
    }
    
    userName = fullName.split(' ')[0]; // Get first name
    
    // Track form submission
    trackEvent('form_submitted', { 
        step: 'welcome',
        car_type: selectedCarType,
        has_phone: phone.length > 0
    });
    
    // Show step 2 and start animation
    showStep(2);
    startLoadingAnimation();
}

// Stats animation on scroll
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const finalValue = stat.textContent;
                const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
                
                if (!isNaN(numericValue)) {
                    animateNumber(stat, 0, numericValue, finalValue);
                }
                observer.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element, start, end, originalText) {
    const duration = 2000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = originalText.replace(/\d+/, current.toLocaleString());
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = originalText;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Initialize stats animation when page loads
document.addEventListener('DOMContentLoaded', function() {
    animateStats();
});

// Enhanced social proof ticker with more realistic data
function updateTickerData() {
    const tickerContent = document.querySelector('.ticker-content');
    if (tickerContent) {
        const messages = [
            'Just saved Mark T. in Los Angeles $2,150 on a 2021 Honda CR-V',
            'Found a mint-condition 2019 Ford F-150 for Sarah P. in Austin',
            'Helped Jennifer K. find her dream Tesla Model 3 in under 48 hours',
            'Negotiated $3,200 off a 2020 Toyota Camry for Mike R. in Chicago',
            'Saved David L. $1,800 on a 2022 Hyundai Tucson in Seattle',
            'Found the perfect 2020 Subaru Outback for Lisa M. in Denver',
            'Helped Alex K. save $2,500 on a 2021 Mazda CX-5 in Portland',
            'Negotiated $1,950 off a 2019 Honda Accord for Maria S. in Miami'
        ];
        
        // Randomly shuffle messages for variety
        const shuffled = messages.sort(() => 0.5 - Math.random());
        tickerContent.innerHTML = shuffled.map(msg => `<span>${msg}</span>`).join('');
    }
}

// Update ticker data periodically
setInterval(updateTickerData, 30000); // Update every 30 seconds 