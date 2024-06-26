const gameArea = document.querySelector(".game-area");
const playerElement = document.querySelector(".player");
const scoreElement = document.querySelector(".score");
const timeElement = document.querySelector(".time");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

// const startButton = document.querySelector(".start");

let difficultyMultiplier;
let playerPosition = 220;
let playerScore = 0;
let speedUpGeneratingEnemies = 0;
let enemySpeed = 10;
let playerSpeed = 10;
let timeScore = 0;

let movingLeft = false;
let movingRight = false;

let timerInterval;

let sendNewBlock;
let sendNewBlock2;
let sendNewBlock3;
let generateNewBonus;

scoreElement.textContent = playerScore;
timeElement.textContent = timeScore;

function updateScore(score) {
  playerScore += score;
  scoreElement.textContent = playerScore;
}

function setDifficulty(level) {
  if (level === "disaster") {
    difficultyMultiplier = 0.1;
    sendNewBlock2 = setInterval(() => createNewBlock(), 1800);
    setTimeout(() => {
      sendNewBlock3 = setInterval(() => createNewBlock(), 2300);
    }, 60 * 1000);
  } else if (level === "hard") {
    difficultyMultiplier = 0.5;
    sendNewBlock2 = setInterval(() => createNewBlock(), 1800);
  } else if (level === "medium") {
    difficultyMultiplier = 1;
    sendNewBlock2 = setInterval(() => createNewBlock(), 2100);
  } else {
    difficultyMultiplier = 1;
  }
}

function checkDifficuly() {
  if (timeScore <= 30 * difficultyMultiplier) {
    enemySpeed = 2;
  } else if (timeScore <= 60 * difficultyMultiplier) {
    enemySpeed = 3;
  } else if (timeScore <= 90 * difficultyMultiplier) {
    enemySpeed = 4;
  } else if (timeScore <= 240 * difficultyMultiplier) {
    enemySpeed = 5;
  } else if (timeScore <= 300 * difficultyMultiplier) {
    enemySpeed = 6;
  } else if (timeScore <= 360 * difficultyMultiplier) {
    enemySpeed = 7;
  }
}

function randomValueMaxMin(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createBonus() {
  const bonusElement = document.createElement("div");
  bonusElement.classList.add("bonus");
  bonusElement.style.left = `${randomValueMaxMin(450)}px`;

  gameArea.appendChild(bonusElement);

  const bonusInterval = setInterval(() => {
    if (checkBonusCollision(playerElement, bonusElement)) {
      updateScore(300);
      bonusElement.remove();
    }
  }, 50);

  setTimeout(() => bonusElement.remove(), 3000);
}

function createNewBlock() {
  const enemyBlock = document.createElement("div");
  enemyBlock.classList.add("enemy");
  enemyBlock.style.left = `${randomValueMaxMin(450)}px`;
  console.log();
  gameArea.append(enemyBlock);
  checkDifficuly();

  let blockPosition = 0;

  const blockInterval = setInterval(() => {
    blockPosition += enemySpeed;
    enemyBlock.style.top = `${blockPosition}px`;

    if (blockPosition >= 480) {
      clearInterval(blockInterval);
      updateScore(100);
      scoreElement.textContent = playerScore;
      enemyBlock.remove();
    }

    if (checkCollision(playerElement, enemyBlock)) {
      if (isMobile()) {
        leftButton.removeEventListener("touchstart", startMovingLeft);
        leftButton.removeEventListener("touchend", stopMovingLeft);
        rightButton.removeEventListener("touchstart", startMovingRight);
        rightButton.removeEventListener("touchend", startMovingRight);
      } else {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
      }

      enemyBlock.style.backgroundImage = `url("./explosion.png")`;
      playerElement.style.backgroundImage = `url("./explosion.png")`;

      clearInterval(blockInterval);
      clearInterval(timerInterval);
      clearInterval(sendNewBlock);
      clearInterval(sendNewBlock2);
      clearInterval(sendNewBlock3);
      clearInterval(generateNewBonus);
      document.querySelector(".result-box").classList.remove("hidden");
    }
  }, 16);
}

function checkBonusCollision(player, bonusItem) {
  const playerRect = player.getBoundingClientRect();
  const bonusRect = bonusItem.getBoundingClientRect();
  if (
    playerRect.bottom > bonusRect.top &&
    playerRect.top < bonusRect.bottom &&
    playerRect.left < bonusRect.right &&
    playerRect.right > bonusRect.left
  ) {
    return true;
  }

  return false;
}

function checkCollision(player, enemy) {
  const playerRect = player.getBoundingClientRect();
  const enemyRect = enemy.getBoundingClientRect();
  if (
    playerRect.bottom > enemyRect.top &&
    playerRect.top < enemyRect.bottom &&
    playerRect.left < enemyRect.right &&
    playerRect.right > enemyRect.left
  ) {
    return true;
  }
  return false;
}

function startGame(difficulty) {
  setDifficulty(difficulty);
  if (isMobile()) {
    gameArea.style.transform = "scale(0.65)";
    document.querySelector(".controls-box").classList.remove("hidden");

    leftButton.addEventListener("touchstart", startMovingLeft);
    leftButton.addEventListener("touchend", stopMovingLeft);
    rightButton.addEventListener("touchstart", startMovingRight);
    rightButton.addEventListener("touchend", stopMovingRight);
  } else {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
  }

  document.querySelector(".button-box").classList.add("hidden");
  document.querySelector(".game-container").classList.remove("hidden");

  const updateInterval = setInterval(moveHero, 16);

  sendNewBlock = setInterval(() => createNewBlock(), 1600);

  timerInterval = setInterval(() => {
    timeScore++;
    timeElement.textContent = timeScore;
  }, 1000);

  generateNewBonus = setInterval(
    () => createBonus(),
    randomValueMaxMin(10000, 2000)
  );
}

function startMovingLeft() {
  movingLeft = true;
}

function stopMovingLeft() {
  movingLeft = false;
}

function startMovingRight() {
  movingRight = true;
}

function stopMovingRight() {
  movingRight = false;
}

function handleKeyDown(e) {
  if (e.key === "ArrowLeft") movingLeft = true;
  if (e.key === "ArrowRight") movingRight = true;
}

function handleKeyUp(e) {
  if (e.key === "ArrowLeft") movingLeft = false;
  if (e.key === "ArrowRight") movingRight = false;
}

function isMobileScreen() {
  return window.innerWidth <= 800 && window.innerHeight <= 600;
}

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function isMobileUserAgent() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

function isMobile() {
  return isMobileScreen() || isTouchDevice() || isMobileUserAgent();
}

function moveHero() {
  if (movingLeft && playerPosition >= 10) {
    playerPosition -= playerSpeed;
    playerElement.style.left = `${playerPosition}px`;
  }
  if (movingRight && playerPosition <= 440) {
    playerPosition += playerSpeed;
    playerElement.style.left = `${playerPosition}px`;
  }
}

document.querySelectorAll(".button-box button").forEach((button) => {
  button.addEventListener("click", () => {
    const difficulty = button.classList[0];
    startGame(difficulty);
  });
});

document
  .querySelector(".restart")
  .addEventListener("click", () => document.location.reload());
