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

// Storage Functions for UI
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
