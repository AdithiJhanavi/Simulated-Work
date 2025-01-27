const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;
let xDirection = -2;
let yDirection = 2;
const userStart = [230, 10];
let currentPosition = userStart;
const ballStart = [270, 40];
let ballCurrentPosition = ballStart;

let timerId;
let score = 0;
let balls = [ballCurrentPosition];
let powerUps = [];

// Class to represent a Block
class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + blockWidth, yAxis];
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
        this.topLeft = [xAxis, yAxis + blockHeight];
    }
}

// All the blocks
const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
];

// Draw the blocks
function addBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.left = blocks[i].bottomLeft[0] + 'px';
        block.style.bottom = blocks[i].bottomLeft[1] + 'px';
        grid.appendChild(block);
    }
}
addBlocks();

// Add the user (paddle)
const user = document.createElement('div');
user.classList.add('user');
grid.appendChild(user);
drawUser();

// Add the ball
const ball = document.createElement('div');
ball.classList.add('ball');
grid.appendChild(ball);
drawBall();

// Move user (paddle)
function moveUser(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (currentPosition[0] > 0) {
                currentPosition[0] -= 10;
                drawUser();
            }
            break;
        case 'ArrowRight':
            if (currentPosition[0] < (boardWidth - blockWidth)) {
                currentPosition[0] += 10;
                drawUser();
            }
            break;
    }
}
document.addEventListener('keydown', moveUser);

// Draw user (paddle)
function drawUser() {
    user.style.left = currentPosition[0] + 'px';
    user.style.bottom = currentPosition[1] + 'px';
}

// Draw ball
function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
}

// Move the ball
function moveBall() {
    balls.forEach(ballPos => {
        ballPos[0] += xDirection;
        ballPos[1] += yDirection;
        drawBall(ballPos);
        checkForCollisions(ballPos);
    });
}
timerId = setInterval(moveBall, 30);

// Check for collisions
function checkForCollisions(ballPos) {
    // Check for block collisions
    for (let i = 0; i < blocks.length; i++) {
        if (
            (ballPos[0] > blocks[i].bottomLeft[0] && ballPos[0] < blocks[i].bottomRight[0]) &&
            (ballPos[1] + ballDiameter > blocks[i].bottomLeft[1] && ballPos[1] < blocks[i].topLeft[1])
        ) {
            const allBlocks = Array.from(document.querySelectorAll('.block'));
            allBlocks[i].classList.remove('block');
            blocks.splice(i, 1);
            generatePowerUp(blocks[i].bottomLeft);
            changeDirection();
            score++;
            scoreDisplay.innerHTML = score;
            if (blocks.length === 0) {
                scoreDisplay.innerHTML = 'You Win!';
                clearInterval(timerId);
                document.removeEventListener('keydown', moveUser);
            }
        }
    }

    // Check for wall hits
    if (ballPos[0] >= (boardWidth - ballDiameter) || ballPos[0] <= 0 || ballPos[1] >= (boardHeight - ballDiameter)) {
        changeDirection();
    }

    // Check for user collision
    if (
        (ballPos[0] > currentPosition[0] && ballPos[0] < currentPosition[0] + blockWidth) &&
        (ballPos[1] > currentPosition[1] && ballPos[1] < currentPosition[1] + blockHeight)
    ) {
        changeDirection();
    }

    // Game over
    if (ballPos[1] <= 0) {
        clearInterval(timerId);
        scoreDisplay.innerHTML = 'You Lose!';
        document.removeEventListener('keydown', moveUser);
    }
}

// Change ball direction
function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2;
        return;
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2;
        return;
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2;
        return;
    }
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2;
        return;
    }
}

// Generate power-up
function generatePowerUp(position) {
    if (Math.random() > 0.8) {
        const powerUp = document.createElement('div');
        powerUp.classList.add('power-up');
        powerUp.style.left = position[0] + 40 + 'px';
        powerUp.style.bottom = position[1] + 'px';
        grid.appendChild(powerUp);
        powerUps.push(powerUp);
        movePowerUp(powerUp);
    }
}

// Move power-up and check for collision with paddle
function movePowerUp(powerUp) {
    const powerUpInterval = setInterval(() => {
        powerUp.style.bottom = parseFloat(powerUp.style.bottom) - 5 + 'px';
        if (parseFloat(powerUp.style.bottom) <= 0) {
            clearInterval(powerUpInterval);
            powerUp.remove();
        }

        if (
            (parseFloat(powerUp.style.left) > currentPosition[0] && parseFloat(powerUp.style.left) < currentPosition[0] + blockWidth) &&
            parseFloat(powerUp.style.bottom) <= currentPosition[1] + blockHeight
        ) {
            applyPowerUp(powerUp);
            clearInterval(powerUpInterval);
            powerUp.remove();
        }
    }, 20);
}

// Apply power-up effects
function applyPowerUp(powerUp) {
    const powerUpType = Math.random();

    // Paddle size increase
    if (powerUpType < 0.3) {
        user.style.width = parseFloat(user.style.width) + 20 + 'px';
    }
    // Ball speed increase
    if (powerUpType < 0.6 && powerUpType >= 0.3) {
        xDirection *= 1.5;
        yDirection *= 1.5;
    }
    // Extra life
    if (powerUpType >= 0.6) {
        score += 10;
        scoreDisplay.innerHTML = score;
    }
}
