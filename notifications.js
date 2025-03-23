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
