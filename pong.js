// Setup Canvas
var canvas = document.createElement('canvas');
var width = 16;
var height = 16;
var fps = 30;
var cx = null
var moveBallX = 1;
var moveBallY = 2

canvas.width = width;
canvas.height = height;

// Create Players and Ball
var player = [];
player[0] = { x: 6, y: 13, width: 4, height: 1 };
player[1] = { x: 6, y: 1, width: 4, height: 1 };
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
    return false;
}

function game() {
    // Move Ball
    if(ball.x >= width || ball.x <= 0) { 
        moveBallX *= -1;
    }
    
    if(ball.y >= height || ball.y <= 0) {
        moveBallY *= -1;
    }
    
    ball.x += moveBallX;
    ball.y += moveBallY;
    
    // Draw Game
    draw();
    
    // Update Favicon
    changeFavicon(createImage("image/png"));
}

// Start Game
if (typeof (canvas.getContext) !== undefined) {
    cx = canvas.getContext('2d');

    setInterval(game, 1000 / fps);
}



