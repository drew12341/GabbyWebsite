const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusElement = document.getElementById('status');

// Game state
const state = {
    player: {
        x: 400,
        y: 300,
        width: 32,
        height: 32,
        speed: 4,
        caughtPokemon: 0
    },
    pokemon: [
        { name: 'Pikachu', color: 'yellow', caught: false, x: 200, y: 200 },
        { name: 'Bulbasaur', color: 'green', caught: false, x: 600, y: 400 },
        { name: 'Charmander', color: 'red', caught: false, x: 300, y: 500 }
    ],
    grass: []
};

// Generate grass patches
for (let i = 0; i < 20; i++) {
    state.grass.push({
        x: Math.random() * (canvas.width - 50),
        y: Math.random() * (canvas.height - 50),
        width: 50,
        height: 50
    });
}

// Input handling
const keys = {};
document.addEventListener('keydown', (e) => {
    e.preventDefault(); // Prevent default arrow key scrolling
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function update() {
    // Player movement
    if (keys['ArrowLeft'] && state.player.x > 0) {
        state.player.x -= state.player.speed;
    }
    if (keys['ArrowRight'] && state.player.x < canvas.width - state.player.width) {
        state.player.x += state.player.speed;
    }
    if (keys['ArrowUp'] && state.player.y > 0) {
        state.player.y -= state.player.speed;
    }
    if (keys['ArrowDown'] && state.player.y < canvas.height - state.player.height) {
        state.player.y += state.player.speed;
    }

    // Check for Pokemon catches
    state.pokemon.forEach(pokemon => {
        if (!pokemon.caught && checkCollision(state.player, pokemon)) {
            pokemon.caught = true;
            state.player.caughtPokemon++;
            statusElement.textContent = `Pokemon: ${state.player.caughtPokemon}`;
        }
    });
}

function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grass patches
    ctx.fillStyle = '#90EE90';
    state.grass.forEach(grass => {
        ctx.fillRect(grass.x, grass.y, grass.width, grass.height);
    });

    // Draw uncaught Pokemon
    state.pokemon.forEach(pokemon => {
        if (!pokemon.caught) {
            ctx.fillStyle = pokemon.color;
            ctx.fillRect(pokemon.x, pokemon.y, 30, 30);
            
            // Draw Pokemon name
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.fillText(pokemon.name, pokemon.x, pokemon.y - 5);
        }
    });

    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(state.player.x, state.player.y, state.player.width, state.player.height);
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + 30 &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + 30 &&
           rect1.y + rect1.height > rect2.y;
}

// Focus handling
canvas.addEventListener('click', () => {
    canvas.focus();
});

canvas.addEventListener('focus', () => {
    console.log('Canvas focused');
});

canvas.addEventListener('blur', () => {
    console.log('Canvas lost focus');
    // Clear any held keys when focus is lost
    Object.keys(keys).forEach(key => keys[key] = false);
});

// Start the game
gameLoop();
canvas.focus(); // Focus the canvas immediately

// Add instructions
const instructions = document.createElement('div');
instructions.style.position = 'absolute';
instructions.style.bottom = '10px';
instructions.style.left = '10px';
instructions.style.color = 'white';
instructions.style.background = 'rgba(0, 0, 0, 0.7)';
instructions.style.padding = '10px';
instructions.style.borderRadius = '5px';
instructions.textContent = 'Use arrow keys to move. Touch Pokemon to catch them!';
document.getElementById('game-container').appendChild(instructions);
