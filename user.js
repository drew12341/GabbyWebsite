// User Management
let loggedInUser = null;
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
