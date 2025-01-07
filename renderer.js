import { CANVAS, COLORS } from './constants.js';

export class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    clear() {
        this.ctx.clearRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    }

    drawPlayer(player) {
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetY = 5;

        const gradient = this.ctx.createLinearGradient(
            player.x, player.y,
            player.x, player.y + player.height
        );
        gradient.addColorStop(0, COLORS.PLAYER_GRADIENT.START);
        gradient.addColorStop(1, COLORS.PLAYER_GRADIENT.END);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(player.x, player.y, player.width, player.height);
        this.ctx.restore();
    }

    drawObstacles(obstacles) {
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetY = 4;

        obstacles.forEach(obstacle => {
            const gradient = this.ctx.createLinearGradient(
                obstacle.x, obstacle.y,
                obstacle.x, obstacle.y + obstacle.height
            );
            gradient.addColorStop(0, COLORS.OBSTACLE_GRADIENT.START);
            gradient.addColorStop(1, COLORS.OBSTACLE_GRADIENT.END);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
        this.ctx.restore();
    }

    drawFlash(intensity) {
        if (intensity > 0) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
            this.ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
        }
    }

    drawUI(score, highScore, speed) {
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetY = 2;
        this.ctx.fillStyle = COLORS.TEXT;
        this.ctx.font = '20px Poppins';
        
        this.ctx.fillText(`Score: ${score}`, 20, 30);
        this.ctx.fillText(`High Score: ${highScore}`, 20, 60);
        this.ctx.fillText(`Speed: ${Math.round(speed * 10) / 10}x`, 20, 90);
        this.ctx.restore();
    }

    drawGameOver() {
        this.ctx.fillStyle = COLORS.TEXT;
        this.ctx.font = '40px Poppins';
        this.ctx.fillText('Game Over!', CANVAS.WIDTH/2 - 100, CANVAS.HEIGHT/2);
        this.ctx.font = '20px Poppins';
        this.ctx.fillText('Press R to restart', CANVAS.WIDTH/2 - 80, CANVAS.HEIGHT/2 + 40);
    }
}
