const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const upgradeTimer = document.getElementById('upgrade-timer');
const upgradeTimerBar = document.getElementById('upgrade-timer-bar');
let score = 0;

let playerX = gameArea.clientWidth / 2;
let playerY = gameArea.clientHeight - player.clientHeight - 10;
let isMovingLeft = false;
let isMovingRight = false;
let speed = 5;
let upgradeActive = false;
let upgradeDuration = 5000; // 5 segundos
let upgradeTimerInterval;
let gameIntervals = []; // Para armazenar todos os intervalos

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        isMovingLeft = true;
    } else if (e.key === 'ArrowRight') {
        isMovingRight = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        isMovingLeft = false;
    } else if (e.key === 'ArrowRight') {
        isMovingRight = false;
    }
});

function movePlayer() {
    if (isMovingLeft && playerX > 0) {
        playerX -= speed;
    } else if (isMovingRight && playerX < gameArea.clientWidth - player.clientWidth) {
        playerX += speed;
    }
    player.style.left = playerX + 'px';
}

function createItem() {
    const item = document.createElement('div');
    item.classList.add('item');
    item.style.left = Math.random() * (gameArea.clientWidth - 30) + 'px';
    gameArea.appendChild(item);

    let itemInterval = setInterval(() => {
        const itemRect = item.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (
            itemRect.left < playerRect.left + playerRect.width &&
            itemRect.left + itemRect.width > playerRect.left &&
            itemRect.top < playerRect.top + playerRect.height &&
            itemRect.top + itemRect.height > playerRect.top
        ) {
            score++;
            scoreDisplay.textContent = 'Pontuação: ' + score;
            gameArea.removeChild(item);
            clearInterval(itemInterval);
        }

        if (itemRect.top > gameArea.clientHeight) {
            clearInterval(itemInterval);
            gameArea.removeChild(item);
        } else {
            item.style.top = itemRect.top + 5 + 'px';
        }
    }, 50);
    gameIntervals.push(itemInterval);
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = Math.random() * (gameArea.clientWidth - 50) + 'px';
    gameArea.appendChild(obstacle);

    let obstacleInterval = setInterval(() => {
        const obstacleRect = obstacle.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (
            obstacleRect.left < playerRect.left + playerRect.width &&
            obstacleRect.left + obstacleRect.width > playerRect.left &&
            obstacleRect.top < playerRect.top + playerRect.height &&
            obstacleRect.top + obstacleRect.height > playerRect.top
        ) {
            gameOver(); // Chama a função gameOver em caso de colisão
        }

        if (obstacleRect.top > gameArea.clientHeight) {
            clearInterval(obstacleInterval);
            gameArea.removeChild(obstacle);
        } else {
            obstacle.style.top = obstacleRect.top + 3 + 'px';
        }
    }, 50);
    gameIntervals.push(obstacleInterval);
}

function createUpgrade() {
    const upgrade = document.createElement('div');
    upgrade.classList.add('upgrade');
    upgrade.style.left = Math.random() * (gameArea.clientWidth - 30) + 'px';
    gameArea.appendChild(upgrade);

    let upgradeInterval = setInterval(() => {
        const upgradeRect = upgrade.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (
            upgradeRect.left < playerRect.left + playerRect.width &&
            upgradeRect.left + upgradeRect.width > playerRect.left &&
            upgradeRect.top < playerRect.top + playerRect.height &&
            upgradeRect.top + upgradeRect.height > playerRect.top
        ) {
            activateUpgrade();
            gameArea.removeChild(upgrade);
            clearInterval(upgradeInterval);
        }

        if (upgradeRect.top > gameArea.clientHeight) {
            clearInterval(upgradeInterval);
            gameArea.removeChild(upgrade);
        } else {
            upgrade.style.top = upgradeRect.top + 3 + 'px';
        }
    }, 50);
    gameIntervals.push(upgradeInterval);
}

function activateUpgrade() {
    upgradeActive = true;
    speed = 10;
    upgradeTimer.style.display = 'block';
    let timeRemaining = upgradeDuration;
    upgradeTimerBar.style.width = '100%';

    clearInterval(upgradeTimerInterval);
    upgradeTimerInterval = setInterval(() => {
        timeRemaining -= 100;
        const percentage = (timeRemaining / upgradeDuration) * 100;
        upgradeTimerBar.style.width = percentage + '%';

        if (timeRemaining <= 0) {
            clearInterval(upgradeTimerInterval);
            upgradeActive = false;
            speed = 5;
            upgradeTimer.style.display = 'none';
        }
    }, 100);
    gameIntervals.push(upgradeTimerInterval);
}

function gameOver() {
    document.getElementById('final-score').innerText = score;
    document.getElementById('game-over-screen').style.display = 'block';
    gameIntervals.forEach(interval => clearInterval(interval)); // Limpa todos os intervalos
    isMovingLeft = false;
    isMovingRight = false;
    document.removeEventListener('keydown', handleKeyDown); // Remove eventos de teclado
    document.removeEventListener('keyup', handleKeyUp);
}

function restartGame() {
    location.reload(); // Recarrega a página para recomeçar o jogo
}

function goToHome() {
    window.location.href = 'tela.html'; // Altere para o caminho da sua tela inicial
}

function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') {
        isMovingLeft = true;
    } else if (e.key === 'ArrowRight') {
        isMovingRight = true;
    }
}

function handleKeyUp(e) {
    if (e.key === 'ArrowLeft') {
        isMovingLeft = false;
    } else if (e.key === 'ArrowRight') {
        isMovingRight = false;
    }
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

gameIntervals.push(setInterval(movePlayer, 20));
gameIntervals.push(setInterval(createItem, 3000));
gameIntervals.push(setInterval(createObstacle, 4000));
gameIntervals.push(setInterval(createUpgrade, 10000));
