// Setup Canvas
var canvas = document.createElement('canvas');
var width = 16;
var height = 16;
var fps = 20;
var cx = null
var moveBallX = 0.125;
var moveBallY = 0.25;
var playerSpeed = 0.25;
var npcDirection = 1;
var pause = false;
var pausedByFocus = false;
var banner = width;
var gameMode = null;
var keys = [];

canvas.width = width;
canvas.height = height;

// Create Players and Ball
var player = [];
player[0] = {
    x: 6,
    y: 13,
    width: 4,
    height: 1,
    score: 0
};
player[1] = {
    x: 6,
    y: 1,
    width: 4,
    height: 1,
    score: 0
};
var ball = {
    x: 7,
    y: 7,
    width: 1,
    height: 1
};

// Functions
function draw() {
    // Draw Background
    cx.lineWidth = 1;
    cx.fillStyle = "black";
    cx.fillRect(0, 0, width, height);

    // Draw Players
    cx.lineWidth = 1;
    cx.fillStyle = "white";
    for (var i = 0; i < player.length; i++) {
        cx.fillRect(player[i].x, player[i].y, player[i].width, player[i].height);
        cx.stroke();
    }

    // Draw Ball
    cx.fillRect(ball.x, ball.y, ball.width, ball.height);
    cx.stroke();
}

function createImage(mimetype) {
    var value = canvas.toDataURL(mimetype);
    if (value.indexOf(mimetype) > 0) {
        return value;
    } else {
        return false;
    }
}

function changeFavicon(image) {
    document.getElementById("favipong").href = image;
}

function game() {
    // Check collision
    // Players
    for (var i = 0; i < player.length; i++) {
        if (
            ball.y == player[i].y &&
            ball.x >= player[i].x &&
            ball.x <= (player[i].x + player[i].width)
        ) {
            moveBallY *= -1;
        }
    }

    // Walls
    if (ball.x >= width || ball.x <= 0) {
        moveBallX *= -1;
    }

    if (ball.y >= height || ball.y <= 0) {
        if (ball.y >= height) {
		  player[1].score++;
		  ball.y = height - 5;
	  } else if (ball.y <= 0) {
		  player[0].score++;
		  ball.y = 4;
	  }
        ball.x = width / 2;
        player[0] = {...player[0], x: 6, y: 13 };
        player[1] = {...player[1], x: 6, y: 1 };
        pause = true;
        setTimeout(() => {
            pause = false;
        }, 750);
        moveBallY *= -1;
    }

    // Move Ball
    if (!pause || !pausedByFocus) {
        ball.x += moveBallX;
        ball.y += moveBallY;
    }

    // Move Player 2
    if ((!pause || !pausedByFocus) && gameMode === "AI") {
        if (ball.x < player[1].x) npcDirection = -1;
        if (ball.x > player[1].x + player[1].width) npcDirection = 1;

        if (npcDirection < 0) {
            if (player[1].x - playerSpeed >= 0) {
                player[1].x -= playerSpeed * 0.75;
            }
        } else {
            if (player[1].x + player[1].width + playerSpeed <= width) {
                player[1].x += playerSpeed * 0.75;
            }
        }
    }

    // Draw Game
    draw();

    // Update Favicon
    changeFavicon(createImage("image/png"));
    // Update Title
    document.title = (
        pausedByFocus
        ? "☕ Pause!"
        : "P1: " + player[0].score + " | P2: " + player[1].score
    );
}

// Controls
onkeydown = onkeyup = function(e) {
    e = e || event;

    keys[e.keyCode] = e.type == 'keydown';

    if (e.isComposing || keys[229]) {
        return;
    }

    // Player one
    if (keys[65] || keys[37]) { // Move left
        if (player[0].x - playerSpeed >= 0) {
            player[0].x -= playerSpeed;
        }
    } else if (keys[68] || keys[39]) { // Move right
        if (player[0].x + player[0].width + playerSpeed <= width) {
            player[0].x += playerSpeed;
        }
    }

    // Player two
    if (gameMode === "versus") {
        if (keys[74] || keys[100]) { // Move left
            if (player[1].x - playerSpeed >= 0) {
                player[1].x -= playerSpeed;
            }
        } else if (keys[76] || keys[102]) { // Move right
            if (player[1].x + player[1].width + playerSpeed <= width) {
                player[1].x += playerSpeed;
            }
        }
    }
}

// Draw Banner
function drawBanner() {
    if (banner < -80) {
        // Start Game
        game();
    } else {
        // Draw Background
        cx.lineWidth = 1;
        cx.fillStyle = "black";
        cx.fillRect(0, 0, width, height);

        // Banner Pos
        banner--;

        // Draw Text
        cx.fillStyle = "#FFF";
        cx.font = "14px Courier";
        cx.fillText("FAVIPONG!", banner, height - 4);

        // Update Favicon
        changeFavicon(createImage("image/png"));
    }
}

function playOrPause(event) {
    // var event = event || window.event;
    pausedByFocus = pause = event.type.toLowerCase() == 'blur' ? true : false;
}

// Start Game
function play(mode) {
    document.title = "Favipong";

    window.addEventListener('blur', playOrPause);
    window.addEventListener('focus', playOrPause);

    if (typeof(canvas.getContext) !== undefined) {
        cx = canvas.getContext('2d');
        gameMode = mode;

        // Show Banner
        setInterval(drawBanner, 1000 / fps);
    }
}

// restart game
function restart() {
    player[0] = { x: 6, y: 13, width: 4, height: 1, score: 0 };
    player[1] = { x: 6, y: 1, width: 4, height: 1, score: 0 };
    ball = { x: 7, y: 7, width: 1, height: 1 };
    cx.fillRect(0, 0, width, height);
}