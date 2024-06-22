const canvasGame = document.getElementById("game");
const startGame = document.getElementById("start");
const ctx = canvasGame.getContext("2d");
const blockSize = 10;
const widthInBlocks = canvasGame.width / blockSize;
const heightInBlocks = canvasGame.height / blockSize;
let score = 0;
let gameStart = false;

const snake = {
    dx: 0,
    dy: 0,
    body: [],
    moveLeft() {
        this.dx = -1;
        this.dy = 0;
    },
    moveRight() {
        this.dx = 1;
        this.dy = 0;
    },
    moveUp() {
        this.dx = 0;
        this.dy = -1;
    },
    moveDown() {
        this.dx = 0;
        this.dy = 1;
    },
    update() {
        const newHead = {
            x: this.body[this.body.length - 1].x + this.dx,
            y: this.body[this.body.length - 1].y + this.dy,
        };
        this.body.push(newHead);
        this.body.shift();
    },
    draw() {
        for (let i = 0; i < this.body.length; i++) {
            ctx.fillStyle = "green";
            ctx.fillRect(
                this.body[i].x * blockSize,
                this.body[i].y * blockSize,
                blockSize,
                blockSize
            );
        }
    },
    addBody() {
        const newBodyPart = {
            x: this.body[0].x,
            y: this.body[0].y,
        };
        this.body.unshift(newBodyPart);
    },
    isSnakeBody(x, y) {
        for (let i = 0; i < this.body.length - 1; i++) {
            if (this.body[i].x === x && this.body[i].y === y) {
                return true;
            }
        }
        return false;
    }
};

const food = {
    x: Math.floor(Math.random() * widthInBlocks),
    y: Math.floor(Math.random() * heightInBlocks),
    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x * blockSize, this.y * blockSize, blockSize, blockSize);
    },
    eaten() {
        let xpos = Math.floor(Math.random() * widthInBlocks);
        let ypos = Math.floor(Math.random() * heightInBlocks);
        while (snake.isSnakeBody(xpos, ypos)) {
            xpos = Math.floor(Math.random() * widthInBlocks);
            ypos = Math.floor(Math.random() * heightInBlocks);
        }
        this.x = xpos;
        this.y = ypos;
    },
};


let lastIntervalDirection = "right";
let direction = "right";

startGame.addEventListener("click", () => {
    startGame.style.display = "none";
    gameStart = true;
    snake.body = [{ x: widthInBlocks / 2, y: heightInBlocks / 2 }];
});

document.addEventListener("keydown", (event) => {
    if (gameStart) {
        if (event.key === "a" && lastIntervalDirection !== "right") {
            direction = "left";
        } else if (event.key === "d" && lastIntervalDirection !== "left") {
            direction = "right";
        } else if (event.key === "w" && lastIntervalDirection !== "down") {
            direction = "up";
        } else if (event.key === "s" && lastIntervalDirection !== "up") {
            direction = "down";
        }
    }
});

setInterval(() => {
    if (gameStart) {
        ctx.clearRect(0, 0, canvasGame.width, canvasGame.height);
        drawScore();
        drawMatrix();

        if (direction === "left") {
            snake.moveLeft();
            lastIntervalDirection = "left";
        } else if (direction === "right") {
            snake.moveRight();
            lastIntervalDirection = "right";
        } else if (direction === "up") {
            snake.moveUp();
            lastIntervalDirection = "up";
        } else if (direction === "down") {
            snake.moveDown();
            lastIntervalDirection = "down";
        }

        if (
            snake.body[snake.body.length - 1].x === food.x &&
            snake.body[snake.body.length - 1].y === food.y
        ) {
            score++;
            food.eaten();
            snake.addBody();
        }

        snake.update();
        food.draw();
        snake.draw();

        if (
            snake.body[snake.body.length - 1].x < 0 ||
            snake.body[snake.body.length - 1].x >= widthInBlocks ||
            snake.body[snake.body.length - 1].y < 0 ||
            snake.body[snake.body.length - 1].y >= heightInBlocks ||
            isSnakeBody(snake.body[snake.body.length - 1].x, snake.body[snake.body.length - 1].y)
        ) {
            gameStart = false;
            direction = "right";
            startGame.style.display = "block";
            ctx.clearRect(0, 0, canvasGame.width, canvasGame.height);
            score = 0;
            snake.body = [];
            snake.body.push({ x: widthInBlocks / 2, y: heightInBlocks / 2 });
        }
    }
}, 100);

function isSnakeBody(x, y) {
    for (let i = 0; i < snake.body.length - 1; i++) {
        if (snake.body[i].x === x && snake.body[i].y === y) {
            return true;
        }
    }
    return false;
}

function drawScore() {
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, blockSize, blockSize);
}

function drawMatrix() {
    ctx.strokeStyle = "gray";
    for (let i = 0; i <= widthInBlocks; i++) {
        ctx.beginPath();
        ctx.moveTo(i * blockSize, 0);
        ctx.lineTo(i * blockSize, canvasGame.height);
        ctx.stroke();
    }
    for (let i = 0; i <= heightInBlocks; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * blockSize);
        ctx.lineTo(canvasGame.width, i * blockSize);
        ctx.stroke();
    }
}