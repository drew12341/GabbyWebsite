class GeometryDash {
    constructor() {
        this.canvas = document.getElementById('geometryDash');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 300;
        this.flashIntensity = 0;
        this.flashDecay = 0.03;
        
        this.player = {
            x: 100,
            y: this.canvas.height - 50,
            width: 30,
            height: 30,
            velocity: 0,
            jumping: false
        };

        this.highScore = parseInt(localStorage.getItem('geometryDashHighScore')) || 0;

        this.gravity = 0.7;  // Slightly reduced gravity for better control
        this.jumpForce = -13;  // Adjusted jump force
        this.obstacles = [];
        this.baseSpeed = 5;  // Lower base speed for better initial control
        this.speed = this.baseSpeed;
        this.gameOver = false;
        this.score = 0;
        this.difficultyMultiplier = 1;
        this.maxSpeed = 9;  // Cap the maximum speed
        
        // Predefined obstacle patterns like Geometry Dash
        this.obstaclePatterns = [
            // Basic single obstacle
            { width: 30, height: 40, gap: 300 },
            // Double obstacle pattern
            { width: 30, height: 50, gap: 100, double: true },
            // Low-high pattern
            { width: 30, heightLow: 30, heightHigh: 60, gap: 200 },
            // Triple small obstacles
            { width: 20, height: 30, gap: 80, triple: true }
        ];
        this.currentPattern = 0;
        
        this.init();
    }

    init() {
        this.addObstacle();
        
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && !this.player.jumping) {
                this.player.velocity = this.jumpForce;
                this.player.jumping = true;
            }
        });

        this.gameLoop();
    }

    addObstacle() {
        const pattern = this.obstaclePatterns[this.currentPattern];
        
        if (pattern.triple) {
            // Create triple obstacle pattern
            const height = pattern.height * this.difficultyMultiplier;
            for (let i = 0; i < 3; i++) {
                this.obstacles.push({
                    x: this.canvas.width + (i * pattern.gap),
                    y: this.canvas.height - height,
                    width: pattern.width,
                    height: height
                });
            }
        } else if (pattern.double) {
            // Create double obstacle pattern
            const height = pattern.height * this.difficultyMultiplier;
            this.obstacles.push({
                x: this.canvas.width,
                y: this.canvas.height - height,
                width: pattern.width,
                height: height
            });
            this.obstacles.push({
                x: this.canvas.width + pattern.gap,
                y: this.canvas.height - height,
                width: pattern.width,
                height: height
            });
        } else if (pattern.heightLow && pattern.heightHigh) {
            // Create low-high pattern
            const heightLow = pattern.heightLow * this.difficultyMultiplier;
            const heightHigh = pattern.heightHigh * this.difficultyMultiplier;
            this.obstacles.push({
                x: this.canvas.width,
                y: this.canvas.height - heightLow,
                width: pattern.width,
                height: heightLow
            });
            this.obstacles.push({
                x: this.canvas.width + pattern.gap,
                y: this.canvas.height - heightHigh,
                width: pattern.width,
                height: heightHigh
            });
        } else {
            // Create basic pattern
            const height = pattern.height * this.difficultyMultiplier;
            this.obstacles.push({
                x: this.canvas.width,
                y: this.canvas.height - height,
                width: pattern.width,
                height: height
            });
        }
        
        // Cycle through patterns
        this.currentPattern = (this.currentPattern + 1) % this.obstaclePatterns.length;
        
        this.flashIntensity = 0.6;
    }

    update() {
        if (this.gameOver) return;

        // Update speed based on score with a cap
        this.speed = Math.min(this.maxSpeed, this.baseSpeed + (this.score * 0.15));  // Gentler speed increase
        this.difficultyMultiplier = 1 + (this.score * 0.04);  // Gentler difficulty curve

        // Update flash effect
        if (this.flashIntensity > 0) {
            this.flashIntensity = Math.max(0, this.flashIntensity - this.flashDecay);
        }

        // Update player
        this.player.velocity += this.gravity;
        this.player.y += this.player.velocity;

        // Ground collision
        if (this.player.y > this.canvas.height - this.player.height) {
            this.player.y = this.canvas.height - this.player.height;
            this.player.jumping = false;
            this.player.velocity = 0;
        }

        // Update obstacles
        this.obstacles.forEach((obstacle, index) => {
            obstacle.x -= this.speed;

            // Remove off-screen obstacles
            if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(index, 1);
                this.score++;
            }

            // Collision detection
            if (this.checkCollision(this.player, obstacle)) {
                this.gameOver = true;
            }
        });

        // Add new obstacles with better spacing
        if (this.obstacles.length < 4) {  // Increased max obstacles for patterns
            const lastObstacle = this.obstacles[this.obstacles.length - 1];
            if (lastObstacle && lastObstacle.x < this.canvas.width - 250) {  // Adjusted spacing
                this.addObstacle();
            }
        }
    }

    checkCollision(player, obstacle) {
        return player.x < obstacle.x + obstacle.width &&
               player.x + player.width > obstacle.x &&
               player.y < obstacle.y + obstacle.height &&
               player.y + player.height > obstacle.y;
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw player with gradient and shadow
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetY = 5;

        const playerGradient = this.ctx.createLinearGradient(
            this.player.x, this.player.y,
            this.player.x, this.player.y + this.player.height
        );
        playerGradient.addColorStop(0, '#6366f1');
        playerGradient.addColorStop(1, '#4f46e5');
        this.ctx.fillStyle = playerGradient;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        this.ctx.restore();

        // Draw obstacles with gradient and shadow
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetY = 4;

        this.obstacles.forEach(obstacle => {
            const obstacleGradient = this.ctx.createLinearGradient(
                obstacle.x, obstacle.y,
                obstacle.x, obstacle.y + obstacle.height
            );
            obstacleGradient.addColorStop(0, '#f87171');
            obstacleGradient.addColorStop(1, '#ef4444');
            this.ctx.fillStyle = obstacleGradient;
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
        this.ctx.restore();

        // Apply flash effect overlay
        if (this.flashIntensity > 0) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${this.flashIntensity})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Draw scores with shadow
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetY = 2;
        this.ctx.fillStyle = '#1e293b';
        this.ctx.font = '20px Poppins';
        this.ctx.fillText(`Score: ${this.score}`, 20, 30);
        this.ctx.fillText(`High Score: ${this.highScore}`, 20, 60);
        this.ctx.fillText(`Speed: ${Math.round(this.speed * 10) / 10}x`, 20, 90);
        this.ctx.restore();

        // Draw game over
        if (this.gameOver) {
            this.ctx.fillStyle = '#1e293b';
            this.ctx.font = '40px Poppins';
            this.ctx.fillText('Game Over!', this.canvas.width/2 - 100, this.canvas.height/2);
            this.ctx.font = '20px Poppins';
            this.ctx.fillText('Press R to restart', this.canvas.width/2 - 80, this.canvas.height/2 + 40);
        }
    }

    gameLoop = () => {
        this.update();
        this.draw();
        requestAnimationFrame(this.gameLoop);
    }

    restart() {
        this.player.y = this.canvas.height - this.player.height;
        this.player.velocity = 0;
        this.obstacles = [];
        this.addObstacle();
        this.gameOver = false;
        this.speed = this.baseSpeed;
        this.difficultyMultiplier = 1;
        this.flashIntensity = 0;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('geometryDashHighScore', this.highScore.toString());
        }
        this.score = 0;
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new GeometryDash();
    
    // Restart handler
    document.addEventListener('keydown', (e) => {
        if (e.code === 'KeyR' && game.gameOver) {
            game.restart();
        }
    });
});
