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
    setupStorageListeners();

    // Set up clear button
    const clearButton = document.getElementById('clearButton');
    if (clearButton) {
        clearButton.addEventListener('click', clearAllInputs);
    }

    // Set up story inputs auto-save
    const storyInputs = document.querySelectorAll('.inline-input');
    storyInputs.forEach(input => {
        if (input.id !== 'madeByInput' && input.name) {
            input.addEventListener('input', () => saveInput(input.name));
        }
    });

    // Load saved inputs
    loadSavedInputs();

    // Create test user
    initializeTestUser();

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
