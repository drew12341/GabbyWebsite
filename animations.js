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
