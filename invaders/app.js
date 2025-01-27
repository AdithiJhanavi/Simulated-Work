const grid = document.querySelector(".grid")
const resultDisplay = document.querySelector(".results")
let currentShooterIndex = 202
const width = 15
const aliensRemoved = []
let invadersId
let isGoingRight = true
let direction = 1
let results = 0
let bossActive = false
let bossHealth = 3  // Boss starts with 3 health points
let bossPosition = 105 // Example position for the boss
let bossDirection = 1 // 1 = moving right, -1 = moving left

// Add new variables for the red ball boss
let redBallActive = false
let redBallPosition = 90 // Example position for the red ball
let redBallDirection = 1 // 1 = moving right, -1 = moving left

// Create the grid squares
for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div")
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll(".grid div"))

const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

// Create the health bar for the boss
const bossHealthBar = document.createElement("div")
bossHealthBar.classList.add("boss-health-bar")
document.body.appendChild(bossHealthBar)

function draw() {
    // Draw the regular alien invaders
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add("invader")
        }
    }
    
    // Draw the first boss if active
    if (bossActive) {
        squares[bossPosition].classList.add("boss")
        bossHealthBar.style.width = `${(bossHealth / 3) * 100}%`
    }

    // Draw the red ball if active (second boss)
    if (redBallActive) {
        squares[redBallPosition].classList.add("red-ball")
    }
}

draw()

squares[currentShooterIndex].classList.add("shooter")

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove("invader")
    }
    if (bossActive) {
        squares[bossPosition].classList.remove("boss")
    }
    if (redBallActive) {
        squares[redBallPosition].classList.remove("red-ball")
    }
}

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter")
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
            break
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break
    }
    squares[currentShooterIndex].classList.add("shooter")
}

document.addEventListener("keydown", moveShooter)

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
    remove()

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            isGoingRight = false
        }
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
            direction = 1
            isGoingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    if (squares[currentShooterIndex].classList.contains("invader")) {
        resultDisplay.innerHTML = "GAME OVER"
        clearInterval(invadersId)
    }

    if (aliensRemoved.length === alienInvaders.length && !bossActive) {
        // After all regular invaders are cleared, spawn the boss
        bossActive = true
        resultDisplay.innerHTML = "BOSS BATTLE"
        draw()
    }

    if (aliensRemoved.length === alienInvaders.length && bossActive && bossHealth <= 0) {
        // Start the red ball after the first boss is defeated
        startRedBallMovement()
    }

    if (aliensRemoved.length === alienInvaders.length && bossActive && bossHealth <= 0 && redBallActive) {
        resultDisplay.innerHTML = "YOU WIN"
        clearInterval(invadersId)
    }
}

invadersId = setInterval(moveInvaders, 600)

function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex

    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser")
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add("laser")

        if (squares[currentLaserIndex].classList.contains("invader")) {
            squares[currentLaserIndex].classList.remove("laser")
            squares[currentLaserIndex].classList.remove("invader")
            squares[currentLaserIndex].classList.add("boom")

            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300)
            clearInterval(laserId)

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultDisplay.innerHTML = results
        }

        if (squares[currentLaserIndex].classList.contains("boss")) {
            // Boss takes damage from laser
            bossHealth--
            squares[currentLaserIndex].classList.remove("laser")
            if (bossHealth <= 0) {
                squares[currentLaserIndex].classList.remove("boss")
                resultDisplay.innerHTML = "BOSS DEFEATED!"
                clearInterval(laserId)
            }
        }

        if (squares[currentLaserIndex].classList.contains("red-ball")) {
            // Red ball takes damage from laser
            redBallActive = false
            squares[currentLaserIndex].classList.remove("laser")
            squares[currentLaserIndex].classList.remove("red-ball")
            resultDisplay.innerHTML = "RED BALL DEFEATED!"
            clearInterval(laserId)
        }
    }

    if (e.key === "ArrowUp") {
        laserId = setInterval(moveLaser, 100)
    }
}

document.addEventListener('keydown', shoot)

function moveBoss() {
    // Move the boss fast across the screen
    remove()

    bossPosition += bossDirection

    // Change direction if the boss hits the left or right edge of the grid
    if (bossPosition % width === 0 || bossPosition % width === width - 1) {
        bossDirection = -bossDirection // Reverse the direction
    }

    draw()
}

// Move the boss every 100ms to make it move quickly
setInterval(moveBoss, 100)

// Function to move the red ball (second boss)
function moveRedBall() {
    // Remove the current red ball (if any)
    if (redBallActive) {
        squares[redBallPosition].classList.remove("red-ball")
    }

    // Move the red ball
    redBallPosition += redBallDirection

    // If the red ball hits the left or right edge, reverse direction
    if (redBallPosition % width === 0 || redBallPosition % width === width - 1) {
        redBallDirection = -redBallDirection // Reverse the direction
    }

    // Add the new position for the red ball
    squares[redBallPosition].classList.add("red-ball")
}

// Function to start the red ball movement after boss battle
function startRedBallMovement() {
    if (bossHealth <= 0 && !redBallActive) {
        redBallActive = true
        setInterval(moveRedBall, 100) // Move the red ball quickly every 100ms
    }
}
