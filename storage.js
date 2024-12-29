// Storage Functions
function saveInput(inputName) {
    const value = document.querySelector(`[name="${inputName}"]`).value;
    localStorage.setItem(inputName, value);
}

function loadSavedInputs() {
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        const savedValue = localStorage.getItem(input.name);
        if (savedValue) {
            input.value = savedValue;
        }
    });
}

function clearAllInputs() {
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => input.value = '');
    localStorage.clear();
}

function limitInputLength(inputId, maxLength) {
    const input = document.getElementById(inputId);
    if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
    }
}

// Event Listeners
function setupStorageListeners() {
    // Made By input length limit
    const madeByInput = document.getElementById('madeByInput');
    if (madeByInput) {
        madeByInput.addEventListener('input', () => limitInputLength('madeByInput', 10));
    }

    // Clear button
    const clearButton = document.getElementById('clearButton');
    if (clearButton) {
        clearButton.addEventListener('click', clearAllInputs);
    }

    // Story inputs auto-save
    const storyInputs = document.querySelectorAll('.inline-input');
    storyInputs.forEach(input => {
        input.addEventListener('input', () => saveInput(input.name));
    });
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

// Make functions globally available
window.saveInput = saveInput;
window.loadSavedInputs = loadSavedInputs;
window.clearAllInputs = clearAllInputs;
window.limitInputLength = limitInputLength;
window.setupStorageListeners = setupStorageListeners;
window.saveUserIcon = saveUserIcon;
window.getUserIcon = getUserIcon;

// Initialize storage listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', setupStorageListeners);
