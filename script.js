// Global variables
let selectedCarType = '';
let currentStep = 1;
let userName = '';

// Car make and model data
const carModels = {
    'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', 'Prius', 'Avalon', 'Sienna', '4Runner', 'Sequoia', 'Land Cruiser'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'HR-V', 'Passport', 'Ridgeline', 'Insight', 'Clarity'],
    'Ford': ['F-150', 'F-250', 'F-350', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Expedition', 'Ranger', 'Bronco', 'Maverick', 'Transit'],
    'Chevrolet': ['Silverado', 'Colorado', 'Camaro', 'Corvette', 'Equinox', 'Traverse', 'Tahoe', 'Suburban', 'Malibu', 'Impala', 'Spark', 'Bolt'],
    'Nissan': ['Altima', 'Sentra', 'Maxima', 'Rogue', 'Murano', 'Pathfinder', 'Armada', 'Frontier', 'Titan', 'Leaf', 'Versa'],
    'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Venue', 'Kona', 'Accent', 'Veloster', 'Ioniq'],
    'Kia': ['Forte', 'K5', 'Sorento', 'Telluride', 'Sportage', 'Soul', 'Rio', 'Stinger', 'EV6', 'Niro'],
    'Mazda': ['Mazda3', 'Mazda6', 'CX-30', 'CX-5', 'CX-9', 'CX-50', 'MX-30', 'MX-5 Miata'],
    'Subaru': ['Impreza', 'Legacy', 'Outback', 'Forester', 'Crosstrek', 'Ascent', 'BRZ', 'WRX'],
    'Volkswagen': ['Golf', 'Jetta', 'Passat', 'Tiguan', 'Atlas', 'ID.4', 'Taos', 'Arteon'],
    'BMW': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i4', 'i7', 'iX'],
    'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Class', 'AMG GT', 'EQS', 'EQE'],
    'Audi': ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q4', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron', 'e-tron GT'],
    'Lexus': ['ES', 'IS', 'LS', 'LC', 'RC', 'UX', 'NX', 'RX', 'GX', 'LX', 'LFA'],
    'Tesla': ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck', 'Roadster']
};

// Funnel state management
let funnelData = {
    carMake: '',
    carModel: '',
    carYear: '',
    carMileage: '',
    zipCode: '',
    distance: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
};

let currentFunnelStep = 1;

// Hero search form functionality
function handleHeroSearch(formData) {
    // Store search data for use in signup flow
    localStorage.setItem('searchData', JSON.stringify(formData));
    
    // Track search event
    trackEvent('hero_search_submitted', formData);
    
    // Redirect to signup page with mileage parameter
    const mileage = formData.maxMileage;
    window.location.href = `signup.html?mileage=${mileage}`;
}

// Enhanced modal open with funnel reset
function openModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset funnel
    resetFunnel();
    
    // Track modal open
    trackEvent('modal_opened', { source: 'hero_cta' });
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('carDetailsForm').reset();
    document.getElementById('locationForm').reset();
    document.getElementById('distanceForm').reset();
    document.getElementById('contactForm').reset();
    document.getElementById('paymentForm').reset();
    currentFunnelStep = 1;
}

function resetFunnel() {
    currentFunnelStep = 1;
    window.funnelStartTime = Date.now(); // Track when funnel starts
    funnelData = {
        carMake: '',
        carModel: '',
        carYear: '',
        carMileage: '',
        zipCode: '',
        distance: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: ''
    };
    
    // Reset all forms
    document.getElementById('carDetailsForm').reset();
    document.getElementById('locationForm').reset();
    document.getElementById('distanceForm').reset();
    document.getElementById('contactForm').reset();
    document.getElementById('paymentForm').reset();
    
    // Reset car model dropdown
    const carModelSelect = document.getElementById('carModel');
    if (carModelSelect) {
        carModelSelect.innerHTML = '<option value="">Select Model</option>';
    }
    
    // Show first step
    showFunnelStep(1);
}

function showFunnelStep(step) {
    // Hide all steps
    document.querySelectorAll('.modal-step').forEach(stepEl => {
        stepEl.style.display = 'none';
    });
    
    // Show target step
    const targetStep = document.getElementById(`step${step}`);
    if (targetStep) {
        targetStep.style.display = 'block';
        currentFunnelStep = step;
        updateProgressBar(step);
    }
}

function updateProgressBar(step) {
    const progressFill = document.getElementById('progressFill');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    // Update progress bar
    const progress = ((step - 1) / 4) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Update step indicators
    progressSteps.forEach((stepEl, index) => {
        if (index + 1 <= step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
}

// Update car models based on selected make
function updateCarModels() {
    const carMake = document.getElementById('carMake').value;
    const carModelSelect = document.getElementById('carModel');
    
    // Clear existing options
    carModelSelect.innerHTML = '<option value="">Select Model</option>';
    
    if (carMake && carMake !== 'other' && carModels[carMake]) {
        carModels[carMake].forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            carModelSelect.appendChild(option);
        });
    }
}

// Step 1: Car Details
function handleCarDetailsSubmit(event) {
    event.preventDefault();
    
    // Collect form data
    funnelData.carMake = document.getElementById('carMake').value;
    funnelData.carModel = document.getElementById('carModel').value;
    funnelData.carYear = document.getElementById('carYear').value;
    funnelData.carMileage = document.getElementById('carMileage').value;
    
    // Enhanced validation with field-specific errors
    if (!funnelData.carMake) {
        showError('Please select a car make.', 'carMake');
        return;
    }
    if (!funnelData.carModel) {
        showError('Please select a car model.', 'carModel');
        return;
    }
    if (!funnelData.carYear) {
        showError('Please select a car year.', 'carYear');
        return;
    }
    if (!funnelData.carMileage) {
        showError('Please enter maximum mileage.', 'carMileage');
        return;
    }
    
    // Track step completion
    trackEvent('funnel_step_completed', { 
        step: 1, 
        car_make: funnelData.carMake,
        car_model: funnelData.carModel,
        car_year: funnelData.carYear,
        car_mileage: funnelData.carMileage
    });
    
    // Move to next step
    showFunnelStep(2);
}

// Step 2: Location & Distance
function handleLocationDistanceSubmit(event) {
    event.preventDefault();
    
    funnelData.zipCode = document.getElementById('zipCode').value;
    
    // Enhanced validation with field-specific errors
    if (!funnelData.zipCode || funnelData.zipCode.length !== 5) {
        showError('Please enter a valid 5-digit ZIP code.', 'zipCode');
        return;
    }
    
    const selectedOption = document.querySelector('.distance-option.selected');
    if (!selectedOption) {
        showError('Please select a search distance.');
        return;
    }
    
    const distance = selectedOption.dataset.distance;
    funnelData.distance = distance;
    
    // Update displays
    document.getElementById('zipDisplay').textContent = funnelData.zipCode;
    document.getElementById('distanceDisplay').textContent = `${funnelData.distance} miles`;
    
    // Track step completion
    trackEvent('funnel_step_completed', { 
        step: 2, 
        zip_code: funnelData.zipCode,
        distance: funnelData.distance
    });
    
    // Start AI search simulation
    showFunnelStep('2-5');
    startAISearch();
}



// Enhanced AI Search Simulation
function startAISearch() {
    const searchProgressFill = document.getElementById('searchProgressFill');
    const searchProgressText = document.getElementById('searchProgressText');
    const activityLog = document.getElementById('activityLog');
    
    // Clear previous activity
    activityLog.innerHTML = '';
    
    // Enhanced search activities with more realistic and engaging content
    const searchActivities = [
        { time: 0, text: 'Initializing AI search parameters...', progress: 10, icon: '🤖' },
        { time: 800, text: 'Connecting to 50+ market data sources...', progress: 20, icon: '🔗' },
        { time: 1600, text: 'Scanning 2,847 active listings in your area...', progress: 35, icon: '🔍' },
        { time: 2400, text: 'Running VIN checks against CarFax & AutoCheck...', progress: 50, icon: '🔒' },
        { time: 3200, text: 'Analyzing pricing trends from 3 months of data...', progress: 65, icon: '📊' },
        { time: 4000, text: 'Identifying vehicles matching your criteria...', progress: 80, icon: '🎯' },
        { time: 4800, text: 'Calculating optimal negotiation strategies...', progress: 90, icon: '💡' },
        { time: 5600, text: 'Compiling personalized recommendations...', progress: 100, icon: '✅' }
    ];
    
    // Add activities to log with enhanced styling
    searchActivities.forEach((activity, index) => {
        setTimeout(() => {
            // Update progress
            searchProgressFill.style.width = `${activity.progress}%`;
            searchProgressText.textContent = activity.text;
            
            // Add activity to log with enhanced styling
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-time">${new Date().toLocaleTimeString()}</div>
                </div>
                <div class="activity-status">✓</div>
            `;
            activityLog.appendChild(activityItem);
            
            // Add completion animation
            setTimeout(() => {
                activityItem.classList.add('completed');
            }, 200);
            
            // Scroll to bottom
            activityLog.scrollTop = activityLog.scrollHeight;
            
            // If this is the last activity, show success after a delay
            if (index === searchActivities.length - 1) {
                setTimeout(() => {
                    showSearchSuccess();
                }, 1500);
            }
        }, activity.time);
    });
}



function showSearchSuccess() {
    // Generate realistic search results based on car type and location
    const baseCarsFound = Math.floor(Math.random() * 12) + 8; // 8-20 cars
    const carsFound = baseCarsFound;
    
    // Calculate realistic savings based on car type
    const savingsRange = {
        'SUV': { min: 1800, max: 3200 },
        'Sedan': { min: 1500, max: 2800 },
        'Truck': { min: 2200, max: 3800 },
        'Coupe': { min: 2000, max: 3500 },
        'EV': { min: 2500, max: 4200 }
    };
    
    const carType = selectedCarType || 'SUV';
    const avgSavings = Math.floor(Math.random() * 
        (savingsRange[carType].max - savingsRange[carType].min)) + savingsRange[carType].min;
    
    // Update car count and add savings info
    document.getElementById('carsFound').textContent = carsFound;
    
    // Add savings information to the success message
    const successSubtitle = document.querySelector('.success-subtitle');
    if (successSubtitle) {
        successSubtitle.innerHTML = `We found <strong>${carsFound}</strong> potential matches in your area with an average savings of <strong>$${avgSavings.toLocaleString()}</strong>`;
    }
    
    // Show success step
    showFunnelStep('2-5-success');
    
    // Track search completion with enhanced data
    trackEvent('ai_search_completed', {
        cars_found: carsFound,
        average_savings: avgSavings,
        car_type: carType,
        distance: funnelData.distance,
        zip_code: funnelData.zipCode
    });
}

// Step 3: Contact Information
function handleContactSubmit(event) {
    event.preventDefault();
    
    funnelData.firstName = document.getElementById('firstName').value;
    funnelData.lastName = document.getElementById('lastName').value;
    funnelData.email = document.getElementById('email').value;
    funnelData.phone = document.getElementById('phone').value;
    funnelData.priceTarget = document.getElementById('priceTarget').value;
    
    // Enhanced validation with field-specific errors
    if (!funnelData.firstName) {
        showError('Please enter your first name.', 'firstName');
        return;
    }
    if (!funnelData.lastName) {
        showError('Please enter your last name.', 'lastName');
        return;
    }
    if (!funnelData.email) {
        showError('Please enter your email address.', 'email');
        return;
    }
    if (!validateEmail(funnelData.email)) {
        showError('Please enter a valid email address.', 'email');
        return;
    }
    if (!funnelData.phone) {
        showError('Please enter your phone number.', 'phone');
        return;
    }
    
    // Track step completion
    trackEvent('funnel_step_completed', { 
        step: 3, 
        has_phone: funnelData.phone.length > 0,
        price_target: funnelData.priceTarget
    });
    
    // Update summary
    updateSummary();
    
    showFunnelStep(4);
}

// Step 4: Payment
function handlePaymentSubmit(event) {
    event.preventDefault();
    
    funnelData.cardNumber = document.getElementById('cardNumber').value;
    funnelData.expiryDate = document.getElementById('expiryDate').value;
    funnelData.cvv = document.getElementById('cvv').value;
    funnelData.cardName = document.getElementById('cardName').value;
    
    // Enhanced validation with field-specific errors
    if (!funnelData.cardName) {
        showError('Please enter the cardholder name.', 'cardName');
        return;
    }
    if (!funnelData.cardNumber) {
        showError('Please enter your card number.', 'cardNumber');
        return;
    }
    if (funnelData.cardNumber.replace(/\s/g, '').length < 13) {
        showError('Please enter a valid card number.', 'cardNumber');
        return;
    }
    if (!funnelData.expiryDate) {
        showError('Please enter the expiry date.', 'expiryDate');
        return;
    }
    if (!funnelData.cvv) {
        showError('Please enter the CVV.', 'cvv');
        return;
    }
    
    // Track payment attempt
    trackEvent('payment_attempted', { 
        step: 5,
        total_steps: 5
    });
    
    // Simulate payment processing
    showPaymentProcessing();
    
    // In real implementation, this would process the payment
    setTimeout(() => {
        showSuccessStep();
    }, 2000);
}

function updateSummary() {
    document.getElementById('summaryCar').textContent = 
        `${funnelData.carYear} ${funnelData.carMake} ${funnelData.carModel} (${funnelData.carMileage} miles max)`;
    document.getElementById('summaryLocation').textContent = funnelData.zipCode;
    document.getElementById('summaryDistance').textContent = `${funnelData.distance} miles`;
    document.getElementById('summaryContact').textContent = 
        `${funnelData.firstName} ${funnelData.lastName} (${funnelData.email})`;
}

function showPaymentProcessing() {
    const submitButton = document.querySelector('#paymentForm .cta-button');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Processing Payment...';
    submitButton.disabled = true;
    
    // Add loading animation
    submitButton.classList.add('processing');
    
    // Add processing message
    const processingMessage = document.createElement('div');
    processingMessage.className = 'processing-message';
    processingMessage.innerHTML = `
        <div class="processing-icon">⏳</div>
        <div class="processing-text">
            <h4>Processing your payment...</h4>
            <p>This usually takes 10-15 seconds. Please don't close this window.</p>
        </div>
    `;
    
    const paymentForm = document.getElementById('paymentForm');
    paymentForm.appendChild(processingMessage);
    
    // Track payment processing start
    trackEvent('payment_processing_started', {
        step: currentFunnelStep,
        payment_method: 'credit_card'
    });
}

function showSuccessStep() {
    // Hide all steps
    document.querySelectorAll('.modal-step').forEach(step => {
        step.style.display = 'none';
    });
    
    // Show success step
    document.getElementById('successStep').style.display = 'block';
    
    // Add personalized welcome message
    const successMessage = document.querySelector('#successStep .success-content p');
    if (successMessage && funnelData.firstName) {
        successMessage.innerHTML = `Hi <strong>${funnelData.firstName}</strong>! Your AI co-pilot is now scanning the market for your perfect ${funnelData.carMake} ${funnelData.carModel}.`;
    }
    
    // Track successful completion with enhanced data
    trackEvent('funnel_completed', {
        car_make: funnelData.carMake,
        car_model: funnelData.carModel,
        car_year: funnelData.carYear,
        zip_code: funnelData.zipCode,
        distance: funnelData.distance,
        user_name: funnelData.firstName,
        total_time: Date.now() - window.funnelStartTime || 0
    });
    
    // Start success animation
    setTimeout(() => {
        const successIcon = document.querySelector('#successStep .success-icon');
        if (successIcon) {
            successIcon.style.animation = 'bounce 1s ease-in-out';
        }
    }, 500);
}

function showError(message, fieldId = null) {
    // Remove existing error
    const existingError = document.querySelector('.error-notification');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div class="error-icon">⚠️</div>
        <div class="error-message">${message}</div>
        <button class="error-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add to current step
    const currentStepEl = document.getElementById(`step${currentFunnelStep}`);
    currentStepEl.appendChild(errorDiv);
    
    // Highlight specific field if provided
    if (fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.add('error');
            field.focus();
            
            // Remove error class after user starts typing
            field.addEventListener('input', function() {
                this.classList.remove('error');
            }, { once: true });
        }
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
    
    // Track error
    trackEvent('form_error', { 
        step: currentFunnelStep, 
        message: message,
        field: fieldId 
    });
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
    showFunnelStep(2);
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
                    showFunnelStep(3);
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
    console.log('Answer has hidden class:', answer.classList.contains('hidden'));
    
    // Toggle the hidden class (this is what the HTML onclick is already doing)
    answer.classList.toggle('hidden');
    
    // Update ARIA attributes
    const isExpanded = !answer.classList.contains('hidden');
    element.setAttribute('aria-expanded', isExpanded);
    answer.setAttribute('aria-hidden', !isExpanded);
    
    // Add/remove active class to question for styling
    if (isExpanded) {
        element.classList.add('active');
    } else {
        element.classList.remove('active');
    }
    
    console.log('Final hidden class state:', answer.classList.contains('hidden'));
    console.log('=== FAQ DEBUG END ===');
}

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;
    
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        body.style.overflow = '';
    } else {
        mobileMenu.classList.add('active');
        body.style.overflow = 'hidden';
    }
}

// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-nav a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            toggleMobileMenu();
        });
    });
    
    // Close mobile menu when clicking outside
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                toggleMobileMenu();
            }
        });
    }
    
    // Prevent body scroll when modal is open on mobile
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    // Add touch support for better mobile interaction
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        // Swipe up to close mobile menu
        if (diff > swipeThreshold && document.getElementById('mobileMenu').classList.contains('active')) {
            toggleMobileMenu();
        }
    }
});

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

// Enhanced Analytics tracking
function trackEvent(eventName, eventData = {}) {
    // Add timestamp and session data
    const enhancedData = {
        ...eventData,
        timestamp: new Date().toISOString(),
        session_id: window.sessionId || generateSessionId(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        current_step: currentFunnelStep,
        selected_car_type: selectedCarType
    };
    
    // This would integrate with Google Tag Manager, Mixpanel, or other analytics
    console.log('Event tracked:', eventName, enhancedData);
    
    // Example events to track:
    // - Car type selection
    // - Modal opens
    // - Form submissions
    // - Waitlist signups
    // - FAQ interactions
    // - Step completions
    // - Errors
    // - Payment attempts
    // - Funnel completions
}

// Generate unique session ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Initialize session tracking
document.addEventListener('DOMContentLoaded', function() {
    window.sessionId = generateSessionId();
    trackEvent('page_view', { 
        page: window.location.pathname,
        referrer: document.referrer
    });
});

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
    showFunnelStep(1);
    
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
    showFunnelStep(2);
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
    showFunnelStep(2);
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
        
        // Use easing function for smoother animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        // Preserve the original format (currency, units, etc.)
        if (originalText.includes('$')) {
            element.textContent = '$' + current.toLocaleString();
        } else if (originalText.includes('%')) {
            element.textContent = current + '%';
        } else if (originalText.includes('hrs')) {
            element.textContent = current + 'hrs';
        } else {
            element.textContent = current.toLocaleString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            // Ensure we end at the exact final value
            element.textContent = originalText;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Initialize stats animation when page loads
document.addEventListener('DOMContentLoaded', function() {
    animateStats();
    
    // Initialize hero search form
    const heroSearchForm = document.getElementById('heroSearchForm');
    if (heroSearchForm) {
        heroSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const carMake = document.getElementById('carMake').value;
            const carModel = document.getElementById('carModel').value;
            const carYear = document.getElementById('carYear').value;
            const carMileage = document.getElementById('carMileage').value;
            
            if (!carMake || !carModel || !carYear || !carMileage) {
                alert('Please fill in all fields');
                return;
            }
            
            // Store search data and redirect to signup with all parameters
            localStorage.setItem('searchData', JSON.stringify({
                carMake,
                carModel,
                carYear,
                carMileage
            }));
            
            const params = new URLSearchParams({
                make: carMake,
                model: carModel,
                year: carYear,
                mileage: carMileage
            });
            
            window.location.href = `signup.html?${params.toString()}`;
        });
    }
    
    // Initialize car models dropdown
    updateCarModels();
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

// Distance selection
document.addEventListener('DOMContentLoaded', function() {
                   // Distance option selection
               document.querySelectorAll('.distance-option').forEach(option => {
                   option.addEventListener('click', function() {
                       // Remove selected class from all options
                       document.querySelectorAll('.distance-option').forEach(opt => {
                           opt.classList.remove('selected');
                       });
                       
                       // Add selected class to clicked option
                       this.classList.add('selected');
                   });
               });
    
    // Card number formatting
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        value = value.replace(/\D/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = value;
    });
    
    // Expiry date formatting
    document.getElementById('expiryDate').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
    
                   // CVV formatting
               document.getElementById('cvv').addEventListener('input', function(e) {
                   e.target.value = e.target.value.replace(/\D/g, '');
               });
               
               // Price slider functionality
               const priceSlider = document.getElementById('priceTarget');
               const priceValue = document.querySelector('.price-value');
               
               if (priceSlider && priceValue) {
                   priceSlider.addEventListener('input', function(e) {
                       const value = parseInt(e.target.value);
                       priceValue.textContent = `$${value.toLocaleString()}`;
                   });
               }
    
    // Smooth scrolling for navigation links
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
    
    // Initialize blog carousel
    initializeBlogCarousel();
}); 

// Blog Carousel functionality
let carouselPosition = 0;
let cardsPerView = 3; // Default, will be calculated

function initializeBlogCarousel() {
    const carouselContainer = document.querySelector('.blog-carousel-container');
    const carouselCards = document.querySelectorAll('.blog-carousel .blog-card');
    
    if (!carouselContainer || carouselCards.length === 0) return;
    
    // Calculate cards per view based on screen width
    updateCardsPerView();
    
    // Initialize navigation buttons
    updateCarouselNav();
    
    // Add window resize listener
    window.addEventListener('resize', function() {
        updateCardsPerView();
        updateCarouselNav();
    });
}

function updateCardsPerView() {
    // Always show 3 cards regardless of screen size
    cardsPerView = 3;
}

function scrollCarousel(direction) {
    const carouselContainer = document.querySelector('.blog-carousel-container');
    if (!carouselContainer) return;
    
    const carouselCards = document.querySelectorAll('.blog-carousel .blog-card');
    const containerWidth = carouselContainer.offsetWidth;
    
    // Calculate gap based on screen size
    let gap = 30; // Default gap for desktop
    if (window.innerWidth <= 480) {
        gap = 15; // Small mobile gap
    } else if (window.innerWidth <= 768) {
        gap = 20; // Mobile gap
    }
    
    const cardWidth = containerWidth / 3 + gap; // card width + gap
    const maxPosition = Math.max(0, carouselCards.length - 3); // Always show 3 cards
    
    if (direction === 'next' && carouselPosition < maxPosition) {
        carouselPosition++;
    } else if (direction === 'prev' && carouselPosition > 0) {
        carouselPosition--;
    }
    
    const translateX = -carouselPosition * cardWidth;
    carouselContainer.style.transform = `translateX(${translateX}px)`;
    
    // Update navigation button states
    updateCarouselNav();
}

function updateCarouselNav() {
    const carouselCards = document.querySelectorAll('.blog-carousel .blog-card');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const maxPosition = Math.max(0, carouselCards.length - 3); // Always show 3 cards
    
    if (prevBtn) {
        prevBtn.disabled = carouselPosition === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = carouselPosition >= maxPosition;
    }
}