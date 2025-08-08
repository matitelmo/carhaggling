console.log('=== SIGNUP SCRIPT LOADED - VERSION 2 ===');

// Global variables
let currentStep = 1;
let userName = '';
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
    password: '',
    confirmPassword: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
};

// Search type toggle functionality for signup
function toggleSearchTypeSignup(type, element) {
    // Remove active class from all toggle options
    document.querySelectorAll('.search-type-toggle .toggle-option').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked element
    element.classList.add('active');
    
    // Show/hide appropriate fields
    const makeModelFields = document.querySelectorAll('.make-model-field');
    const bodyTypeFields = document.querySelectorAll('.body-type-field');
    
    if (type === 'make-model') {
        makeModelFields.forEach(field => {
            field.style.display = 'block';
            const select = field.querySelector('select');
            if (select) select.required = true;
        });
        bodyTypeFields.forEach(field => {
            field.style.display = 'none';
            const select = field.querySelector('select');
            if (select) select.required = false;
        });
    } else if (type === 'body-type') {
        makeModelFields.forEach(field => {
            field.style.display = 'none';
            const select = field.querySelector('select');
            if (select) select.required = false;
        });
        bodyTypeFields.forEach(field => {
            field.style.display = 'block';
            const select = field.querySelector('select');
            if (select) select.required = true;
        });
    }
}

// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to pre-populate form from the global funnelData object
function prePopulateForm() {
    // Data is now expected to be in the global funnelData variable
    console.log('Pre-populating form with data:', funnelData);

    // Handle search type toggle first
    if (funnelData.searchType === 'body-type') {
        const bodyTypeToggle = document.querySelector('.search-type-toggle .toggle-option[data-type="body-type"]');
        if (bodyTypeToggle) {
            bodyTypeToggle.click(); // Programmatically click the toggle to show the right fields
        }
        const bodyTypeSelect = document.getElementById('bodyType');
        if (bodyTypeSelect && funnelData.bodyType) {
            bodyTypeSelect.value = funnelData.bodyType;
            console.log(`Pre-populated body type: ${funnelData.bodyType}`);
        }
    } else { // Default to 'make-model'
        const makeModelToggle = document.querySelector('.search-type-toggle .toggle-option[data-type="make-model"]');
        if (makeModelToggle && !makeModelToggle.classList.contains('active')) {
             makeModelToggle.click();
        }
        const makeSelect = document.getElementById('carMake');
        if (makeSelect && funnelData.carMake) {
            makeSelect.value = funnelData.carMake;
            console.log(`Pre-populated make: ${funnelData.carMake}`);
            updateCarModels(); // Crucial to load the models for the selected make
            
            // Set model after a short delay for the model list to populate
            if (funnelData.carModel) {
                setTimeout(() => {
                    const modelSelect = document.getElementById('carModel');
                    if (modelSelect) {
                        modelSelect.value = funnelData.carModel;
                        console.log(`Pre-populated model: ${funnelData.carModel}`);
                    }
                }, 100);
            }
        }
    }
    
    // Populate common fields
    const yearSelect = document.getElementById('carYear');
    if (yearSelect && funnelData.carYear) {
        yearSelect.value = funnelData.carYear;
        console.log(`Pre-populated year: ${funnelData.carYear}`);
    }
    
    const mileageSelect = document.getElementById('carMileage');
    if (mileageSelect && funnelData.carMileage) {
        mileageSelect.value = funnelData.carMileage;
        console.log(`Pre-populated mileage: ${funnelData.carMileage}`);
    }
}

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

// Utility function to scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Navigation functions
function goToStep(step) {
    console.log(`=== NAVIGATING TO STEP ${step} ===`);
    
    if (step < 1 || step > 6) {
        console.error(`Invalid step number: ${step}`);
        return;
    }
    
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
        console.log('Removed active class from:', content.id);
    });
    
    // Show target step
    const targetStep = document.getElementById(`step${step}`);
    console.log('Target step element:', targetStep);
    if (targetStep) {
        targetStep.classList.add('active');
        currentStep = step;
        updateProgressBar(step);
        
        // Scroll to top of page smoothly with a small delay for better UX
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 100);
        
        console.log(`Successfully navigated to step ${step}`);
        
        // If going to step 3, start AI search
        if (step === 3) {
            console.log('Step 3 detected, starting AI search...');
            setTimeout(() => {
                startAISearch();
            }, 500);
        }
    } else {
        console.error(`Target step element not found: step${step}`);
    }
}

function updateProgressBar(step) {
    const progressFill = document.getElementById('progressFill');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    // Update progress bar
    const progress = ((step - 1) / 5) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Update step indicators
    progressSteps.forEach((stepEl, index) => {
        const stepNumber = index + 1;
        stepEl.classList.remove('active', 'completed');
        
        if (stepNumber < step) {
            stepEl.classList.add('completed');
        } else if (stepNumber === step) {
            stepEl.classList.add('active');
        }
    });
}

// Update car models based on selected make
function updateCarModels() {
    const carMake = document.getElementById('carMake');
    const carModelSelect = document.getElementById('carModel');
    
    // Debug logging
    console.log('updateCarModels called');
    console.log('carMake element:', carMake);
    console.log('carModelSelect element:', carModelSelect);
    
    if (!carMake || !carModelSelect) {
        console.error('Car make or model select elements not found');
        return;
    }
    
    const selectedMake = carMake.value;
    console.log('Selected make:', selectedMake);
    
    // Clear existing options
    carModelSelect.innerHTML = '<option value="">Select Model</option>';
    
    if (selectedMake && selectedMake !== 'other' && carModels[selectedMake]) {
        console.log('Available models for', selectedMake, ':', carModels[selectedMake]);
        carModels[selectedMake].forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            carModelSelect.appendChild(option);
        });
    } else {
        console.log('No models found for make:', selectedMake);
    }
}

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateName(name) {
    return name.trim().length >= 2;
}

function validatePhone(phone) {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showError(message) {
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
    const currentStepEl = document.getElementById(`step${currentStep}`);
    currentStepEl.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// Analytics tracking
function trackEvent(eventName, eventData = {}) {
    console.log('Event tracked:', eventName, eventData);
}

// Step 1: Car Details form submission
function handleCarDetailsSubmit(event) {
    event.preventDefault();
    
    // Collect form data
    funnelData.carMake = document.getElementById('carMake').value;
    funnelData.carModel = document.getElementById('carModel').value;
    funnelData.carYear = document.getElementById('carYear').value;
    funnelData.carMileage = document.getElementById('carMileage').value;
    
    // Validation
    if (!funnelData.carMake || !funnelData.carModel || !funnelData.carYear || !funnelData.carMileage) {
        showError('Please fill in all car details.');
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
    goToStep(2);
}

// Step 2: Location form submission
function handleLocationSubmit(event) {
    event.preventDefault();
    
    funnelData.zipCode = document.getElementById('zipCode').value;
    
    // Validation
    if (!funnelData.zipCode || funnelData.zipCode.length !== 5) {
        showError('Please enter a valid 5-digit ZIP code.');
        return;
    }
    
    const selectedOption = document.querySelector('.distance-option.selected');
    if (!selectedOption) {
        showError('Please select a search distance.');
        return;
    }
    
    const distance = selectedOption.dataset.distance;
    funnelData.distance = distance;
    
    // Track step completion
    trackEvent('funnel_step_completed', { 
        step: 2, 
        zip_code: funnelData.zipCode,
        distance: funnelData.distance
    });
    
    // Start AI search simulation
    goToStep(3);
}

// Enhanced AI Search Simulation
function startAISearch() {
    console.log('=== AI SEARCH SIMULATION START ===');
    
    const searchProgressFill = document.getElementById('searchProgressFill');
    const searchProgressText = document.getElementById('searchProgressText');
    const activityLog = document.getElementById('activityLog');
    
    console.log('Progress elements:', { 
        searchProgressFill: !!searchProgressFill, 
        searchProgressText: !!searchProgressText, 
        activityLog: !!activityLog 
    });
    
    if (!searchProgressFill || !searchProgressText || !activityLog) {
        console.error('AI search elements not found');
        return;
    }
    
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
    
    console.log('Starting search activities...');
    
    // Add activities to log with enhanced styling
    searchActivities.forEach((activity, index) => {
        setTimeout(() => {
            console.log(`Activity ${index + 1}: ${activity.text}`);
            
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
                console.log('All activities completed, showing success...');
                setTimeout(() => {
                    showSearchSuccess();
                }, 1500);
            }
        }, activity.time);
    });
    
    console.log('=== AI SEARCH SIMULATION SETUP COMPLETE ===');
}

function showSearchSuccess() {
    console.log('=== SHOW SEARCH SUCCESS START ===');
    
    // Generate realistic search results based on car type and location
    const baseCarsFound = Math.floor(Math.random() * 12) + 8; // 8-20 cars
    const carsFound = baseCarsFound;
    
    // Calculate realistic savings based on car type
    const savingsRange = {
        'Toyota': { min: 1800, max: 3200 },
        'Honda': { min: 1500, max: 2800 },
        'Ford': { min: 2200, max: 3800 },
        'Chevrolet': { min: 2000, max: 3500 },
        'Nissan': { min: 1600, max: 3000 },
        'Hyundai': { min: 1400, max: 2600 },
        'Kia': { min: 1400, max: 2600 },
        'Mazda': { min: 1700, max: 3100 },
        'Subaru': { min: 1900, max: 3300 },
        'Volkswagen': { min: 2000, max: 3600 },
        'BMW': { min: 2500, max: 4500 },
        'Mercedes-Benz': { min: 2800, max: 5000 },
        'Audi': { min: 2600, max: 4800 },
        'Lexus': { min: 2400, max: 4200 },
        'Tesla': { min: 3000, max: 5500 }
    };
    
    // Use car make as fallback for car type
    const carType = funnelData.carMake || 'Toyota';
    const avgSavings = Math.floor(Math.random() * 
        (savingsRange[carType]?.max - savingsRange[carType]?.min || 2000)) + (savingsRange[carType]?.min || 1500);
    
    console.log('Search results:', {
        carsFound,
        avgSavings,
        carType,
        funnelData
    });
    
    // Update car count and add savings info
    const carsFoundElement = document.getElementById('carsFound');
    if (carsFoundElement) {
        carsFoundElement.textContent = carsFound;
        console.log('Updated cars found element:', carsFound);
    } else {
        console.error('Cars found element not found');
    }
    
    // Add savings information to the success message
    const successSubtitle = document.querySelector('.success-subtitle');
    if (successSubtitle) {
        successSubtitle.innerHTML = `We found <strong>${carsFound}</strong> potential matches in your area with an average savings of <strong>$${avgSavings.toLocaleString()}</strong>`;
        console.log('Updated success subtitle');
    } else {
        console.error('Success subtitle element not found');
    }
    
    // Show success step
    console.log('Navigating to step 4...');
    goToStep(4);
    
    // Track search completion with enhanced data
    trackEvent('ai_search_completed', {
        cars_found: carsFound,
        average_savings: avgSavings,
        car_type: carType,
        distance: funnelData.distance,
        zip_code: funnelData.zipCode
    });
    
    console.log('=== SHOW SEARCH SUCCESS COMPLETE ===');
}

// Step 4: Contact form submission
function handleContactSubmit(event) {
    event.preventDefault();
    
    funnelData.firstName = document.getElementById('firstName').value;
    funnelData.lastName = document.getElementById('lastName').value;
    funnelData.email = document.getElementById('contactEmail').value;
    funnelData.phone = document.getElementById('phone').value;
    funnelData.password = document.getElementById('password').value;
    funnelData.confirmPassword = document.getElementById('confirmPassword').value;
    funnelData.priceTarget = document.getElementById('priceTarget').value;
    
    // Validation
    if (!funnelData.firstName || !funnelData.lastName || !funnelData.email) {
        showError('Please fill in all required contact information.');
        return;
    }
    
    if (!validateEmail(funnelData.email)) {
        showError('Please enter a valid email address.');
        return;
    }
    
    if (funnelData.phone && !validatePhone(funnelData.phone)) {
        showError('Please enter a valid phone number or leave it blank.');
        return;
    }
    
    // Password validation
    if (!funnelData.password) {
        showError('Please create a password for your account.');
        return;
    }
    
    if (funnelData.password.length < 8) {
        showError('Password must be at least 8 characters long.');
        return;
    }
    
    if (funnelData.password !== funnelData.confirmPassword) {
        showError('Passwords do not match. Please try again.');
        return;
    }
    
    // Track step completion
    trackEvent('funnel_step_completed', { 
        step: 5, 
        has_phone: funnelData.phone.length > 0,
        has_password: true,
        price_target: funnelData.priceTarget
    });
    
    // Update summary
    updateSummary();
    
    // Move to payment step
    goToStep(6);
}

// Step 5: Payment form submission
function handlePaymentSubmit(event) {
    event.preventDefault();
    
    funnelData.cardNumber = document.getElementById('cardNumber').value;
    funnelData.expiryDate = document.getElementById('expiryDate').value;
    funnelData.cvv = document.getElementById('cvv').value;
    funnelData.cardName = document.getElementById('cardName').value;
    
    // Validation
    if (!funnelData.cardNumber || !funnelData.expiryDate || !funnelData.cvv || !funnelData.cardName) {
        showError('Please fill in all payment information.');
        return;
    }
    
    // Basic card validation
    if (funnelData.cardNumber.replace(/\s/g, '').length < 13) {
        showError('Please enter a valid card number.');
        return;
    }
    
    // Track payment attempt
    trackEvent('payment_attempted', { 
        step: 6,
        total_steps: 6
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
        `${funnelData.carYear} ${funnelData.carMake} ${funnelData.carModel} (Under ${parseInt(funnelData.carMileage).toLocaleString()} miles)`;
    document.getElementById('summaryLocation').textContent = funnelData.zipCode;
    document.getElementById('summaryDistance').textContent = `${funnelData.distance} miles`;
    document.getElementById('summaryContact').textContent = 
        `${funnelData.firstName} ${funnelData.lastName} (${funnelData.email})`;
}

function showPaymentProcessing() {
    const submitButton = document.querySelector('#paymentForm .cta-button.primary');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Processing Payment...';
    submitButton.disabled = true;
    
    // Add loading animation
    submitButton.classList.add('processing');
}

function showSuccessStep() {
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show success step
    document.getElementById('successStep').classList.add('active');
    
    // Scroll to top of page smoothly with a small delay for better UX
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 100);
    
    // Track successful completion
    trackEvent('funnel_completed', {
        car_make: funnelData.carMake,
        car_model: funnelData.carModel,
        car_year: funnelData.carYear,
        zip_code: funnelData.zipCode,
        distance: funnelData.distance
    });
}

// Distance selection
function selectDistance(option) {
    // Remove selected class from all options
    document.querySelectorAll('.distance-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    option.classList.add('selected');
    
    // Store the selected distance
    const distance = option.dataset.distance;
    funnelData.distance = distance;
    
    console.log('Distance selected:', distance);
}

// Price slider functionality
function updatePriceDisplay(value) {
    const priceValue = document.querySelector('.price-value');
    if (priceValue) {
        priceValue.textContent = `$${parseInt(value).toLocaleString()}`;
    }
}

// Card formatting
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '');
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    input.value = value;
}

function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

function formatCVV(input) {
    input.value = input.value.replace(/\D/g, '');
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing signup page');
    
    // Load data from localStorage
    const savedData = JSON.parse(localStorage.getItem('funnelData'));
    console.log('Saved data from localStorage:', savedData);
    
    if (savedData) {
        funnelData = { ...funnelData, ...savedData };
        console.log('Updated funnelData:', funnelData);
        prePopulateForm();
    }
    
    // Check if we should start at a different step
    const startStep = parseInt(getUrlParameter('startStep'));
    console.log('startStep from URL:', startStep);
    
    if (startStep && startStep > 1) {
        console.log('Should start at step', startStep, '- setting timeout...');
        setTimeout(() => {
            console.log('Executing goToStep(', startStep, ')');
            goToStep(startStep);
        }, 150); // Delay to ensure everything is loaded
    } else {
        console.log('Starting at step 1 (default)');
        updateProgressBar(1);
    }
    
    // Set up form event listeners
    const carDetailsForm = document.getElementById('carDetailsForm');
    const locationForm = document.getElementById('locationForm');
    const contactForm = document.getElementById('contactForm');
    const paymentForm = document.getElementById('paymentForm');
    
    if (carDetailsForm) carDetailsForm.addEventListener('submit', handleCarDetailsSubmit);
    if (locationForm) locationForm.addEventListener('submit', handleLocationSubmit);
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
    if (paymentForm) paymentForm.addEventListener('submit', handlePaymentSubmit);
    
    // Set up other listeners
    setupCarMakeListener();
    setupDistanceListeners();
    setupPriceSliderListener();
    setupCardFormattingListeners();
    
    // Track page load
    trackEvent('signup_page_loaded');
});

// Refactored setup functions
function setupCarMakeListener() {
    const carMakeSelect = document.getElementById('carMake');
    if (carMakeSelect) {
        carMakeSelect.addEventListener('change', updateCarModels);
    }
}

function setupDistanceListeners() {
    document.querySelectorAll('.distance-option').forEach(option => {
        option.addEventListener('click', function() {
            selectDistance(this);
        });
    });
}

function setupPriceSliderListener() {
    const priceSlider = document.getElementById('priceTarget');
    if (priceSlider) {
        priceSlider.addEventListener('input', e => updatePriceDisplay(e.target.value));
    }
}

function setupCardFormattingListeners() {
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    
    if (cardNumber) cardNumber.addEventListener('input', e => formatCardNumber(e.target));
    if (expiryDate) expiryDate.addEventListener('input', e => formatExpiryDate(e.target));
    if (cvv) cvv.addEventListener('input', e => formatCVV(e.target));
}


// Add CSS for error notifications
const errorStyles = `
.error-notification {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    animation: slideInDown 0.3s ease-out;
}

.error-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
}

.error-message {
    flex: 1;
    color: #dc2626;
    font-weight: 500;
}

.error-close {
    background: none;
    border: none;
    color: #dc2626;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.error-close:hover {
    background-color: #fecaca;
}

@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.cta-button.processing {
    position: relative;
    color: transparent;
}

.cta-button.processing::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Inject error styles
const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);

// Test function for debugging car models
function testCarModels() {
    console.log('Testing car models functionality...');
    console.log('carModels object:', carModels);
    console.log('Toyota models:', carModels['Toyota']);
    
    const carMake = document.getElementById('carMake');
    const carModel = document.getElementById('carModel');
    
    console.log('Car make element:', carMake);
    console.log('Car model element:', carModel);
    
    if (carMake && carModel) {
        console.log('Setting Toyota as test value...');
        carMake.value = 'Toyota';
        updateCarModels();
        console.log('Car model options after update:', carModel.innerHTML);
    } else {
        console.error('Car make or model elements not found');
    }
}

// Make test function available globally
window.testCarModels = testCarModels; 