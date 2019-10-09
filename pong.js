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
var banner = width;

canvas.width = width;
canvas.height = height;

// Create Players and Ball
var player = [];
player[0] = { x: 6, y: 13, width: 4, height: 1, score: 0 };
player[1] = { x: 6, y: 1, width: 4, height: 1, score: 0 };
var ball = { x: 7, y: 7, width: 1, height: 1 };

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
	if(ball.x >= width || ball.x <= 0) {
		moveBallX *= -1;
	}

	if(ball.y >= height || ball.y <= 0) {
		if (ball.y >= height) player[1].score++;
		if (ball.y <= 0) player[0].score++;
		ball.x = width / 2;
		ball.y = height / 2;
		pause = true;
		setTimeout(() => {
			moveBallY = 1;
			ball.x = width / 2;
			ball.y = height / 2;
			pause = false;
		}, 750);
		moveBallY *= -1;
	}

	// Move Ball
	if (!pause) {
		ball.x += moveBallX;
		ball.y += moveBallY;
	}

	// Move Player 2
	if (!pause) {
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
	document.title = "P1: " + player[0].score + " | P2: " + player[1].score;
}

// Controls
window.addEventListener("keydown", event => {
	if (event.isComposing || event.keyCode === 229) {
		return;
	}

	if (event.keyCode == 65 || event.keyCode == 37) {
		// Move Left
		if (player[0].x - playerSpeed >= 0) {
			player[0].x -= playerSpeed;
		}
	} else if (event.keyCode == 68 || event.keyCode == 39) {
		// Move Right
		if (player[0].x + player[0].width + playerSpeed <= width) {
			player[0].x += playerSpeed;
		}
	}
});

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
		cx.fillText("FAVIPONG!", banner, height-4);

		// Update Favicon
		changeFavicon(createImage("image/png"));
	}
}

// Start Game
function play() {
	document.title = "Favipong";
	if (typeof (canvas.getContext) !== undefined) {
		cx = canvas.getContext('2d');

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
