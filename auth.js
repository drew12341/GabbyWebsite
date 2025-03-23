// User Management
let users = JSON.parse(localStorage.getItem('users')) || {};

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

function initializeTestUser() {
    if (!users['test']) {
        users['test'] = 'test123';
        localStorage.setItem('users', JSON.stringify(users));
    }
}
