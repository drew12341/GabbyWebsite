// Storage Functions
function loadSavedInputs() {
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        if (input.id === 'madeByInput') {
            // Skip madeByInput as it's handled by user module
            return;
        }
        
        if (input.name) {
            const savedValue = localStorage.getItem(input.name);
            if (savedValue) {
                input.value = savedValue;
            }
        }
    });
}

function limitInputLength(inputId, maxLength) {
    const input = document.getElementById(inputId);
    if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
    }
}

// User Icon Functions
function saveUserIcon(username, iconName) {
    const userIcons = JSON.parse(localStorage.getItem('userIcons')) || {};
    userIcons[username] = iconName;
    localStorage.setItem('userIcons', JSON.stringify(userIcons));
}

function getUserIcon(username) {
    const userIcons = JSON.parse(localStorage.getItem('userIcons')) || {};
    return userIcons[username] || 'cat'; // Default to cat if no icon selected
}

// Event Listeners
function setupStorageListeners() {
    // Made By input length limit
    const madeByInput = document.getElementById('madeByInput');
    if (madeByInput) {
        madeByInput.addEventListener('input', () => limitInputLength('madeByInput', 10));
    }
}
