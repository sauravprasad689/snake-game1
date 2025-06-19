let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

// snake axis
class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// speed of the game
let speed = 7;
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

// head of the snake
let headX = 10;
let headY = 10;
let snakeParts = [];
let tailLength = 2;

// apple coordinates
let appleX = 5;
let appleY = 5;

// movement
let inputsXVelocity = 0;
let inputsYVelocity = 0;
let xVelocity = 0;
let yVelocity = 0;

let score = 0;

// sound effect
let gulpSound = new Audio("gulp.mp3");

// game loop
function drawGame() {
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  changeSnakePosition();
  let result = isGameOver();
  if (result) return;

  clearScreen();
  drawApple();
  checkAppleCollision();
  drawSnake();
  drawScore();

  if (score > 5) speed = 9;
  if (score > 10) speed = 11;

  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  if (yVelocity === 0 && xVelocity === 0) return false;

  // Wall collision
  if (headX < 0 || headX >= tileCount || headY < 0 || headY >= tileCount) {
    gameOverScreen();
    return true;
  }

  // Self collision
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOverScreen();
      return true;
    }
  }

  return false;
}

function gameOverScreen() {
  ctx.fillStyle = "white";
  ctx.font = "50px Verdana";

  let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop("0", "magenta");
  gradient.addColorStop("0.5", "blue");
  gradient.addColorStop("1.0", "red");

  ctx.fillStyle = gradient;
  ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
}

function drawScore() {
  ctx.fillStyle = "#00ff99";
  ctx.font = "14px Verdana";
  ctx.fillText("Score: " + score, canvas.width - 100, 20);
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.shadowBlur = 0;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "#00ff99";
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#00ff99";

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY));
  while (snakeParts.length > tailLength) {
    snakeParts.shift();
  }

  // Draw snake head
  ctx.fillStyle = "#ffcc00";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#ffcc00";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  headX += xVelocity;
  headY += yVelocity;
}

function drawApple() {
  ctx.fillStyle = "#ff0055";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#ff0055";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    gulpSound.play();
  }
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  // Up
  if ((event.keyCode == 38 || event.keyCode == 87) && inputsYVelocity !== 1) {
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }

  // Down
  if ((event.keyCode == 40 || event.keyCode == 83) && inputsYVelocity !== -1) {
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }

  // Left
  if ((event.keyCode == 37 || event.keyCode == 65) && inputsXVelocity !== 1) {
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }

  // Right
  if ((event.keyCode == 39 || event.keyCode == 68) && inputsXVelocity !== -1) {
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
}

drawGame();
