let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;
const canvasBoxes = canvasSize / box;
let snake, direction, apple, score, bestScore;

document.addEventListener("keydown", changeDirection);

function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "flex";

    snake = [{ x: box * 5, y: box * 5 }];
    direction = "RIGHT";
    score = 0;
    document.getElementById("score").innerText = score;
    apple = generateApple();

    game = setInterval(drawGame, 100);
}

function goToMenu() {
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("startScreen").style.display = "flex";
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    if (keyPressed === 37 && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (keyPressed === 38 && direction !== "DOWN") {
        direction = "UP";
    } else if (keyPressed === 39 && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (keyPressed === 40 && direction !== "UP") {
        direction = "DOWN";
    } else if (keyPressed === 65 && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (keyPressed === 87 && direction !== "DOWN") {
        direction = "UP";
    } else if (keyPressed === 68 && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (keyPressed === 83 && direction !== "UP") {
        direction = "DOWN";
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    drawGrid();

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "green" : "white";
        ctx.strokeStyle = "black";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(apple.x, apple.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    if (snakeX === apple.x && snakeY === apple.y) {
        apple = generateApple();
        score++;
        document.getElementById("score").innerText = score;
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= canvasSize ||
        snakeY >= canvasSize ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        gameOver();
    }

    snake.unshift(newHead);
}

function drawGrid() {
    ctx.strokeStyle = "#ccc";
    for (let x = 0; x < canvasSize; x += box) {
        for (let y = 0; y < canvasSize; y += box) {
            ctx.strokeRect(x, y, box, box);
        }
    }
}

function generateApple() {
    let appleX, appleY;
    do {
        appleX = Math.floor(Math.random() * canvasBoxes) * box;
        appleY = Math.floor(Math.random() * canvasBoxes) * box;
    } while (collision({ x: appleX, y: appleY }, snake));
    return { x: appleX, y: appleY };
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function gameOver() {
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "flex";
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }
    document.getElementById("bestScore").innerText = bestScore;
}

window.onload = () => {
    bestScore = localStorage.getItem('bestScore') || 0;
    document.getElementById("bestScore").innerText = bestScore;
    goToMenu();
}