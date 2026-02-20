const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake = [];
let food = {};
let powerUps = [];
let direction;
let score;
let level;
let speed;
let gameInterval;
const box = 20;

// Initialize the game
function init() {
    snake = [{x: 200, y: 200}];
    direction = "RIGHT";
    score = 0;
    level = 1;
    speed = 150;
    powerUps = [];
    document.getElementById("score").innerText = score;
    document.getElementById("level").innerText = level;
    document.getElementById("gameOver").style.display = "none";

    spawnFood();
}

// Spawn food at random position
function spawnFood() {
    let valid = false;
    while (!valid) {
        food = {x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box};
        valid = !snake.some(seg => seg.x === food.x && seg.y === food.y);
    }
}

// Randomly spawn power-ups
function spawnPowerUp() {
    let x = Math.floor(Math.random() * 20) * box;
    let y = Math.floor(Math.random() * 20) * box;
    powerUps.push({x, y});
}

// Draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake with shadow
    snake.forEach((seg, i) => {
        ctx.shadowColor = "#0f0";
        ctx.shadowBlur = 10;
        ctx.fillStyle = i === 0 ? "lime" : "green";
        ctx.fillRect(seg.x, seg.y, box, box);
    });

    // Draw food with shadow
    ctx.shadowColor = "#f00";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Draw power-ups with shadow
    ctx.shadowColor = "#ff0";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "yellow";
    powerUps.forEach(p => ctx.fillRect(p.x, p.y, box, box));

    moveSnake();
}

// Move snake
function moveSnake() {
    let head = {...snake[0]};

    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;

    // Check collisions
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collision(head, snake)) {
        clearInterval(gameInterval);
        document.getElementById("gameOver").style.display = "block";
        return;
    }

    snake.unshift(head);

    // Check food
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").innerText = score;
        spawnFood();

        // Level up every 5 points
        if(score % 5 === 0) {
            level++;
            document.getElementById("level").innerText = level;
            if (speed > 50) {
                speed -= 10;
                clearInterval(gameInterval);
                gameInterval = setInterval(draw, speed);
            }
        }

        // Chance for power-up
        if (Math.random() < 0.3) spawnPowerUp();
    } else {
        snake.pop();
    }

    // Power-up collision
    powerUps.forEach((p, index) => {
        if (head.x === p.x && head.y === p.y) {
            score += 3;
            document.getElementById("score").innerText = score;
            powerUps.splice(index, 1);
        }
    });
}

// Collision check
function collision(head, array) {ss
    return array.some(seg => seg.x === head.x && seg.y === head.y);
}

// Controls
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Start game
function startGame() {
    init();
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, speed);
}

// Restart game
function restartGame() {
    clearInterval(gameInterval);
    init();
    gameInterval = setInterval(draw, speed);
}
