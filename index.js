const gameArea = document.querySelector(".game-area");
const playerElement = document.querySelector(".player");
const scoreElement = document.querySelector(".score");
const timeElement = document.querySelector(".time");

// const startButton = document.querySelector(".start");

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
let generateNewBonus;

scoreElement.textContent = playerScore;
timeElement.textContent = timeScore;

function updateScore(score) {
  playerScore += score;
  scoreElement.textContent = playerScore;
}

function checkDifficuly() {
  if (timeScore < 30) {
    enemySpeed = 2;
  } else if (timeScore < 60) {
    enemySpeed = 3;
  } else if (timeScore < 90) {
    enemySpeed = 4;
  } else if (timeScore < 240) {
    enemySpeed = 5;
  } else if (timeScore < 300) {
    enemySpeed = 6;
  } else if (timeScore < 360) {
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
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      enemyBlock.style.backgroundImage = `url("./explosion.png")`;
      playerElement.style.backgroundImage = `url("./explosion.png")`;

      clearInterval(blockInterval);
      clearInterval(timerInterval);
      clearInterval(sendNewBlock);
      clearInterval(generateNewBonus);
      // document.location.reload();
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

function startGame() {
  document.querySelector(".button-box").classList.add("hidden");
  document.querySelector(".game-container").classList.remove("hidden");

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

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

function handleKeyDown(e) {
  if (e.key === "ArrowLeft") movingLeft = true;
  if (e.key === "ArrowRight") movingRight = true;
}

function handleKeyUp(e) {
  if (e.key === "ArrowLeft") movingLeft = false;
  if (e.key === "ArrowRight") movingRight = false;
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

document.querySelector(".start").addEventListener("click", startGame);
document
  .querySelector(".restart")
  .addEventListener("click", () => document.location.reload());
