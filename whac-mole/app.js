const squares = document.querySelectorAll('.square');
const timeLeft = document.querySelector('#time-left');
const score = document.querySelector('#score');

let result = 0;
let hitPosition;
let currentTime = 60;
let timerId = null;
let moleSpeed = 1000; // Initial mole speed

// Function to place a mole in a random square
function randomSquare() {
  squares.forEach(square => square.classList.remove('mole', 'bonus-mole'));

  let randomSquare = squares[Math.floor(Math.random() * squares.length)];
  
  // 10% chance to spawn a bonus mole
  if (Math.random() < 0.1) {
    randomSquare.classList.add('bonus-mole');
    randomSquare.dataset.type = 'bonus'; // Mark it as a bonus
  } else {
    randomSquare.classList.add('mole');
    randomSquare.dataset.type = 'normal'; // Mark it as normal
  }
  
  hitPosition = randomSquare.id;
}

// Function to handle mole hits
squares.forEach(square => {
  square.addEventListener('mousedown', () => {
    if (square.id == hitPosition) {
      if (square.dataset.type === 'bonus') {
        result += 5; // Bonus moles give 5 points
      } else {
        result++;
      }
      score.textContent = result;
      hitPosition = null;
    }
  });
});

// Function to move the mole with variable speed
function moveMole() {
  clearInterval(timerId);
  randomSquare();
  moleSpeed = Math.max(300, moleSpeed - 50); // Gradually reduce speed (min 300ms)
  timerId = setInterval(randomSquare, moleSpeed);
}

// Countdown timer
function countDown() {
  currentTime--;
  timeLeft.textContent = currentTime;

  if (currentTime === 0) {
    clearInterval(countDownTimerId);
    clearInterval(timerId);
    alert('GAME OVER! Your final score is ' + result);
  }
}

// Start the game
let countDownTimerId = setInterval(countDown, 1000);
moveMole();
