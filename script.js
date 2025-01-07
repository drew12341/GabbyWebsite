// Animation Configuration
const CONFETTI_CONFIG = {
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
    count: 150,
    duration: {
        min: 2000,
        max: 5000
    },
    spread: 400
};

const WELCOME_CONFIG = {
    displayTime: 4000
};

// User Management
let loggedInUser = null;
let users = JSON.parse(localStorage.getItem('users')) || {};

function logout() {
    loggedInUser = null;
    updateMadeByIcon();
    document.getElementById('madeByInput').value = 'Guest';
}

function updateMadeByIcon() {
    const userIcon = document.querySelector('.user-icon');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginBtn = document.getElementById('showLoginBtn');
    const signupBtn = document.getElementById('showSignupBtn');
    
    if (!userIcon) return;
    
    if (loggedInUser) {
        userIcon.style.display = 'inline-flex';
        const savedIcon = getUserIcon(loggedInUser) || 'cat';
        updateUserIcon(savedIcon);
        document.getElementById('madeByInput').value = loggedInUser;
        logoutBtn.style.display = 'inline-block';
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
    } else {
        userIcon.style.display = 'none';
        document.getElementById('madeByInput').value = 'Guest';
        logoutBtn.style.display = 'none';
        loginBtn.style.display = 'inline-block';
        signupBtn.style.display = 'inline-block';
    }
}

// Confetti Animation
function createConfetti() {
    for (let i = 0; i < CONFETTI_CONFIG.count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = CONFETTI_CONFIG.colors[Math.floor(Math.random() * CONFETTI_CONFIG.colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = -10 + 'px';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(confetti);

        // Animation
        const animation = confetti.animate([
            { 
                transform: `translate(0, 0) rotate(0deg)`, 
                opacity: 1 
            },
            { 
                transform: `translate(${Math.random() * CONFETTI_CONFIG.spread - CONFETTI_CONFIG.spread/2}px, ${window.innerHeight + 10}px) rotate(${Math.random() * 720}deg)`, 
                opacity: 0 
            }
        ], {
            duration: Math.random() * (CONFETTI_CONFIG.duration.max - CONFETTI_CONFIG.duration.min) + CONFETTI_CONFIG.duration.min,
            easing: 'cubic-bezier(.37,0,.63,1)'
        });

        animation.onfinish = () => confetti.remove();
    }
}

// Welcome Message Animation
function showWelcomeMessage() {
    const welcomeMsg = document.getElementById('welcomeMessage');
    welcomeMsg.style.display = 'block';
    createConfetti();

    setTimeout(() => {
        welcomeMsg.style.display = 'none';
    }, WELCOME_CONFIG.displayTime);
}

// Icon Selection Functions
function showIconSelector() {
    document.getElementById('iconSelector').style.display = 'block';
    const currentIcon = getUserIcon(loggedInUser);
    const iconOptions = document.querySelectorAll('.icon-option');
    iconOptions.forEach(option => {
        if (option.dataset.icon === currentIcon) {
            option.classList.add('selected');
        }
    });
}

function hideIconSelector() {
    document.getElementById('iconSelector').style.display = 'none';
}

function selectIcon(iconName) {
    if (!loggedInUser) return;
    
    // Update selection UI
    document.querySelectorAll('.icon-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.icon === iconName) {
            option.classList.add('selected');
        }
    });
    
    // Save selection and update display
    saveUserIcon(loggedInUser, iconName);
    updateUserIcon(iconName);
}

function updateUserIcon(iconName) {
    const userIcon = document.getElementById('userIcon');
    if (userIcon) {
        userIcon.src = `images/${iconName}.svg`;
    }
}

// Auth UI Functions
function showLogin() {
    document.getElementById('loginContainer').style.display = 'block';
}

function hideLogin() {
    document.getElementById('loginContainer').style.display = 'none';
}

function showSignup() {
    document.getElementById('signupContainer').style.display = 'block';
}

function hideSignup() {
    document.getElementById('signupContainer').style.display = 'none';
}

// Auth Logic
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username] && users[username] === password) {
        loggedInUser = username;
        hideLogin();
        clearAuthInputs('login');
        showWelcomeMessage();
        updateMadeByIcon();
        document.getElementById('showLoginBtn').style.display = 'none';
        document.getElementById('showSignupBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline-block';
        
        setTimeout(() => {
            showIconSelector();
        }, WELCOME_CONFIG.displayTime + 100);
        return true;
    } else {
        alert('Incorrect username or password');
        return false;
    }
}

function signup() {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    users = JSON.parse(localStorage.getItem('users')) || {};

    if (!users[username]) {
        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));
        alert('Signup successful');
        hideSignup();
        clearAuthInputs('signup');
        return true;
    } else {
        alert('Username already exists');
        return false;
    }
}

// Storage Functions
function saveInput(inputName) {
    const value = document.querySelector(`[name="${inputName}"]`).value;
    localStorage.setItem(inputName, value);
}

function loadSavedInputs() {
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        if (input.id === 'madeByInput') {
            input.value = 'Guest';
        } else {
            const savedValue = localStorage.getItem(input.name);
            if (savedValue) {
                input.value = savedValue;
            }
        }
    });
}

function clearAllInputs() {
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => input.value = '');
    localStorage.clear();
}

// Helper Functions
function clearAuthInputs(type) {
    if (type === 'login') {
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
    } else if (type === 'signup') {
        document.getElementById('signupUsername').value = '';
        document.getElementById('signupPassword').value = '';
    }
}

function limitInputLength(inputId, maxLength) {
    const input = document.getElementById(inputId);
    if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
    }
}

// Search functionality
function searchInputs(searchTerm) {
    if (!searchTerm.trim()) return;
    
    // Remove any previous highlights
    const allInputs = document.querySelectorAll('.inline-input');
    allInputs.forEach(input => {
        input.style.backgroundColor = '';
        input.style.borderColor = '';
    });
    
    // Search and highlight matches
    let found = false;
    let firstMatch = null;
    allInputs.forEach(input => {
        if (input.value.toLowerCase().includes(searchTerm.toLowerCase())) {
            input.style.backgroundColor = '#fef9c3'; // Light yellow highlight
            input.style.borderColor = '#eab308'; // Yellow border
            if (!firstMatch) firstMatch = input;
            found = true;
        }
    });

    // Scroll to first match if found
    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Show feedback if no matches found
    if (!found) {
        alert('No matches found for: ' + searchTerm);
    }
}

// Email Subscription
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function checkForSales() {
    // This function would typically be called by a server-side cron job
    // For now, we'll just store the subscription
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
    const message = document.getElementById('subscriptionMessage');
    message.textContent = `You'll be notified when Whittaker's chocolates go on sale!`;
    message.style.color = '#10b981'; // Success green color
}

function handleSubscription() {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    const message = document.getElementById('subscriptionMessage');

    if (!email) {
        message.textContent = 'Please enter an email address';
        message.style.color = '#ef4444'; // Error red color
        return;
    }

    if (!isValidEmail(email)) {
        message.textContent = 'Please enter a valid email address';
        message.style.color = '#ef4444';
        return;
    }

    // Store subscription
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
    if (!subscriptions.includes(email)) {
        subscriptions.push(email);
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    }

    // Clear input and show success message
    emailInput.value = '';
    checkForSales();
}

// Initialize Application
function initializeApp() {
    // Set up subscription form
    const subscribeBtn = document.getElementById('subscribeBtn');
    const emailInput = document.getElementById('emailInput');
    
    subscribeBtn.addEventListener('click', handleSubscription);
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubscription();
        }
    });

    // Initialize icon visibility
    updateMadeByIcon();
    
    // Set up icon selection
    const iconOptions = document.querySelectorAll('.icon-option');
    iconOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectIcon(option.dataset.icon);
            setTimeout(hideIconSelector, 500);
        });
    });

    // Set up search functionality
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    
    searchButton.addEventListener('click', () => {
        searchInputs(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchInputs(searchInput.value);
        }
    });
    
    // Set up auth event listeners
    document.getElementById('showLoginBtn').addEventListener('click', showLogin);
    document.getElementById('hideLoginBtn').addEventListener('click', hideLogin);
    document.getElementById('showSignupBtn').addEventListener('click', showSignup);
    document.getElementById('hideSignupBtn').addEventListener('click', hideSignup);
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    
    // Set up login/signup form submissions
    document.getElementById('loginBtn').addEventListener('click', login);
    document.getElementById('signupBtn').addEventListener('click', signup);

    // Set up storage listeners
    const madeByInput = document.getElementById('madeByInput');
    if (madeByInput) {
        madeByInput.addEventListener('input', () => limitInputLength('madeByInput', 10));
    }

    const clearButton = document.getElementById('clearButton');
    if (clearButton) {
        clearButton.addEventListener('click', clearAllInputs);
    }

    const storyInputs = document.querySelectorAll('.inline-input');
    storyInputs.forEach(input => {
        if (input.id !== 'madeByInput') {
            input.addEventListener('input', () => saveInput(input.name));
        }
    });

    // Load saved inputs
    loadSavedInputs();

    // Create test user
    if (!users['test']) {
        users['test'] = 'test123';
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Add keyboard event listeners for form submissions
    document.getElementById('loginContainer').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            login();
        }
    });

    document.getElementById('signupContainer').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            signup();
        }
    });
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
