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

// App Configuration
const APP_CONFIG = {
    version: '2.0.0',
    lastUpdated: new Date().toISOString()
};

// User Management
let loggedInUser = null;
let users = JSON.parse(localStorage.getItem('users')) || {};
let userStats = JSON.parse(localStorage.getItem('userStats')) || {};

function logout() {
    loggedInUser = null;
    updateMadeByIcon();
    updateProfileInfo();
    document.getElementById('madeByInput').value = 'Guest';
}

function updateMadeByIcon() {
    const userIcons = document.querySelectorAll('.user-icon');
    const logoutBtns = document.querySelectorAll('[id^="logoutBtn"]');
    const loginBtns = document.querySelectorAll('[id^="showLoginBtn"]');
    const signupBtns = document.querySelectorAll('[id^="showSignupBtn"]');
    
    if (loggedInUser) {
        userIcons.forEach(icon => {
            icon.style.display = 'inline-flex';
            icon.classList.add('online');
        });
        
        const savedIcon = getUserIcon(loggedInUser) || 'cat';
        updateUserIcon(savedIcon);
        
        document.getElementById('madeByInput').value = loggedInUser;
        
        logoutBtns.forEach(btn => btn.style.display = 'inline-block');
        loginBtns.forEach(btn => btn.style.display = 'none');
        signupBtns.forEach(btn => btn.style.display = 'none');
    } else {
        userIcons.forEach(icon => {
            icon.style.display = 'inline-flex';
            icon.classList.remove('online');
        });
        
        document.getElementById('madeByInput').value = 'Guest';
        
        logoutBtns.forEach(btn => btn.style.display = 'none');
        loginBtns.forEach(btn => btn.style.display = 'inline-block');
        signupBtns.forEach(btn => btn.style.display = 'inline-block');
    }
}

function updateProfileInfo() {
    const profileUsername = document.getElementById('profileUsername');
    const profileStatus = document.getElementById('profileStatus');
    
    if (profileUsername && profileStatus) {
        if (loggedInUser) {
            profileUsername.textContent = loggedInUser;
            profileStatus.textContent = 'Online';
            profileStatus.style.color = 'var(--success-color)';
            
            // Update stats
            updateUserStats();
        } else {
            profileUsername.textContent = 'Guest';
            profileStatus.textContent = 'Not logged in';
            profileStatus.style.color = 'var(--text-light)';
        }
    }
}

function updateUserStats() {
    if (!loggedInUser) return;
    
    // Initialize user stats if they don't exist
    if (!userStats[loggedInUser]) {
        userStats[loggedInUser] = {
            storiesCreated: 0,
            gamesPlayed: 0,
            highScore: 0
        };
    }
    
    // Get high score from localStorage
    const highScore = parseInt(localStorage.getItem('geometryDashHighScore')) || 0;
    if (highScore > userStats[loggedInUser].highScore) {
        userStats[loggedInUser].highScore = highScore;
    }
    
    // Update stats display
    const statElements = document.querySelectorAll('.stat-item span');
    if (statElements.length >= 3) {
        statElements[0].textContent = `Stories Created: ${userStats[loggedInUser].storiesCreated}`;
        statElements[1].textContent = `Games Played: ${userStats[loggedInUser].gamesPlayed}`;
        statElements[2].textContent = `High Score: ${userStats[loggedInUser].highScore}`;
    }
    
    // Save stats to localStorage
    localStorage.setItem('userStats', JSON.stringify(userStats));
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
        option.classList.remove('selected');
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
    const userIcons = document.querySelectorAll('[id^="userIcon"]');
    userIcons.forEach(icon => {
        icon.src = `images/${iconName}.svg`;
    });
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
        updateProfileInfo();
        
        // Increment login count in stats
        if (!userStats[loggedInUser]) {
            userStats[loggedInUser] = {
                storiesCreated: 0,
                gamesPlayed: 0,
                highScore: 0
            };
        }
        
        setTimeout(() => {
            showIconSelector();
        }, WELCOME_CONFIG.displayTime + 100);
        return true;
    } else {
        showNotification('Incorrect username or password', 'error');
        return false;
    }
}

function signup() {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    if (!username || !password) {
        showNotification('Please enter both username and password', 'error');
        return false;
    }

    users = JSON.parse(localStorage.getItem('users')) || {};

    if (!users[username]) {
        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Initialize user stats
        userStats[username] = {
            storiesCreated: 0,
            gamesPlayed: 0,
            highScore: 0
        };
        localStorage.setItem('userStats', JSON.stringify(userStats));
        
        showNotification('Signup successful! You can now log in.', 'success');
        hideSignup();
        clearAuthInputs('signup');
        
        // Show login form after successful signup
        setTimeout(() => {
            showLogin();
        }, 1000);
        
        return true;
    } else {
        showNotification('Username already exists', 'error');
        return false;
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = '💬';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';
    
    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${message}</span>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Storage Functions
function saveInput(inputName) {
    const value = document.querySelector(`[name="${inputName}"]`).value;
    localStorage.setItem(inputName, value);
    
    // Update story creation stats
    if (loggedInUser && value && value.trim() !== '') {
        if (!userStats[loggedInUser]) {
            userStats[loggedInUser] = {
                storiesCreated: 0,
                gamesPlayed: 0,
                highScore: 0
            };
        }
        
        // Only increment if this is the first time this input is being filled
        const previousValue = localStorage.getItem(`${inputName}_previous`);
        if (!previousValue && value.trim() !== '') {
            userStats[loggedInUser].storiesCreated++;
            localStorage.setItem('userStats', JSON.stringify(userStats));
            updateProfileInfo();
        }
        
        // Save the current value as previous for next comparison
        localStorage.setItem(`${inputName}_previous`, value);
    }
}

function loadSavedInputs() {
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        if (input.id === 'madeByInput') {
            input.value = loggedInUser || 'Guest';
        } else if (input.name) {
            const savedValue = localStorage.getItem(input.name);
            if (savedValue) {
                input.value = savedValue;
            }
        }
    });
}

function clearAllInputs() {
    // Ask for confirmation
    if (!confirm('Are you sure you want to clear all inputs? This cannot be undone.')) {
        return;
    }
    
    const inputs = document.querySelectorAll('.inline-input');
    inputs.forEach(input => {
        if (input.name) {
            input.value = '';
            localStorage.removeItem(input.name);
            localStorage.removeItem(`${input.name}_previous`);
        }
    });
    
    showNotification('All inputs have been cleared!', 'success');
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
    if (!searchTerm.trim()) {
        showNotification('Please enter a search term', 'warning');
        return;
    }
    
    // Remove any previous highlights
    const allInputs = document.querySelectorAll('.inline-input');
    allInputs.forEach(input => {
        input.style.backgroundColor = '';
        input.style.borderColor = '';
    });
    
    // Search and highlight matches
    let found = false;
    let firstMatch = null;
    let matchCount = 0;
    
    allInputs.forEach(input => {
        if (input.value.toLowerCase().includes(searchTerm.toLowerCase())) {
            input.style.backgroundColor = '#fef9c3'; // Light yellow highlight
            input.style.borderColor = '#eab308'; // Yellow border
            if (!firstMatch) firstMatch = input;
            found = true;
            matchCount++;
        }
    });

    // Scroll to first match if found
    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showNotification(`Found ${matchCount} match${matchCount !== 1 ? 'es' : ''}!`, 'success');
    }
    
    // Show feedback if no matches found
    if (!found) {
        showNotification(`No matches found for: "${searchTerm}"`, 'warning');
    }
}

// Fan Mail Functions
function sendFanMail() {
    const email = document.getElementById('emailInput').value;
    const message = document.getElementById('messageInput').value;
    const count = parseInt(document.getElementById('repeatCount').value);

    // Validate inputs
    if (!email || !message || !count) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (!email.includes('@')) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    if (count < 1 || count > 10) {
        showNotification('Please enter a number between 1 and 10', 'error');
        return;
    }

    // Simulate sending emails
    const promises = Array(count).fill().map(() => {
        return new Promise(resolve => {
            setTimeout(resolve, Math.random() * 1000);
        });
    });

    // Show loading state
    const button = document.getElementById('sendFanMailBtn');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    button.disabled = true;

    Promise.all(promises).then(() => {
        // Reset form
        document.getElementById('emailInput').value = '';
        document.getElementById('messageInput').value = '';
        document.getElementById('repeatCount').value = '1';
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;

        // Show success message
        showNotification(`Successfully sent ${count} fan mail${count > 1 ? 's' : ''} to yourself!`, 'success');
    });
}

// Tab Switching
function switchTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content and activate button
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Log for debugging
    console.log(`Switched to tab: ${tabId}`);
}

// Initialize Application
function initializeApp() {
    // Initialize icon visibility
    updateMadeByIcon();
    updateProfileInfo();

    // Set up tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            console.log(`Tab button clicked: ${tabId}`);
            switchTab(tabId);
        });
    });
    
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
    
    // Set up auth event listeners for all login/signup buttons
    document.querySelectorAll('[id^="showLoginBtn"]').forEach(btn => {
        btn.addEventListener('click', showLogin);
    });
    
    document.getElementById('hideLoginBtn').addEventListener('click', hideLogin);
    
    document.querySelectorAll('[id^="showSignupBtn"]').forEach(btn => {
        btn.addEventListener('click', showSignup);
    });
    
    document.getElementById('hideSignupBtn').addEventListener('click', hideSignup);
    
    document.querySelectorAll('[id^="logoutBtn"]').forEach(btn => {
        btn.addEventListener('click', logout);
    });
    
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
    
    // Add CSS for notifications
    addNotificationStyles();
    
    // Show welcome message for first-time visitors
    if (!localStorage.getItem('visited')) {
        setTimeout(() => {
            showNotification('Welcome to Fill in the Sentence! Fill in the blanks to create fun stories.', 'info');
            localStorage.setItem('visited', 'true');
        }, 1000);
    }
}

// Add notification styles dynamically
function addNotificationStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            background: white;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-md);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 2000;
            max-width: 350px;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            border-left: 4px solid var(--primary-color);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left-color: var(--success-color);
        }
        
        .notification.error {
            border-left-color: var(--danger-color);
        }
        
        .notification.warning {
            border-left-color: var(--warning-color);
        }
        
        .notification-icon {
            font-size: 1.5rem;
        }
        
        .notification-message {
            flex: 1;
            font-size: 0.95rem;
        }
    `;
    document.head.appendChild(styleElement);
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    
    // Set up fan mail form
    document.getElementById('sendFanMailBtn').addEventListener('click', sendFanMail);
    
    // Ensure tabs are working correctly
    console.log('DOM loaded, checking tabs...');
    const tabButtons = document.querySelectorAll('.tab-button');
    console.log(`Found ${tabButtons.length} tab buttons`);
    
    // Log tab content elements
    const tabContents = document.querySelectorAll('.tab-content');
    console.log(`Found ${tabContents.length} tab content elements`);
    tabContents.forEach(content => {
        console.log(`Tab content ID: ${content.id}`);
    });
});
