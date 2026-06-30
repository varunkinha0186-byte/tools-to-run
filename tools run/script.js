const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

const jumpSound = new Audio("sounds/jump.wav");
const bgMusic = new Audio("sounds/bgmusic.mp3");
const pointSound = new Audio("sounds/point.wav");
const gameOverSound = new Audio("sounds/gameover.wav");
const hitSound = new Audio("sounds/hit.wav");

bgMusic.loop = true;
bgMusic.volume = 0.3;

let bird = {
    x:80,
    y:250,
    width:35,
    height:35,
    gravity:0.6,
    lift:-11,
    velocity:0
};

let pipes=[];
let score=0;
let gameOver=false;

function createPipe(){

    let gap=240;
    let topHeight=Math.random()*250+50;

    pipes.push({
        x:canvas.width,
        top:topHeight,
        bottom:canvas.height-topHeight-gap,
        width:60,
        passed:false
    });

}

setInterval(()=>{
if(!gameOver)
createPipe();
},3000);

function drawBird(){

ctx.fillStyle="yellow";

ctx.beginPath();
ctx.arc(
bird.x,
bird.y,
18,
0,
Math.PI*2
);

ctx.fill();

ctx.fillStyle="black";

ctx.beginPath();
ctx.arc(bird.x+6,bird.y-4,2,0,Math.PI*2);
ctx.fill();

}

function drawPipes(){

ctx.fillStyle="green";

pipes.forEach(pipe=>{

ctx.fillRect(pipe.x,0,pipe.width,pipe.top);

ctx.fillRect(
pipe.x,
canvas.height-pipe.bottom,
pipe.width,
pipe.bottom
);

pipe.x-= 2;

if (
    bird.x + 18 > pipe.x &&
    bird.x - 18 < pipe.x + pipe.width &&
    (
        bird.y - 18 < pipe.top ||
        bird.y + 18 > canvas.height - pipe.bottom
    )
) {
    if (!gameOver) {

        gameOver = true;

       
        bgMusic.pause();
        bgMusic.currentTime = 0;

       
        hitSound.currentTime = 0;
        hitSound.play();

       
        hitSound.onended = () => {
            gameOverSound.currentTime = 0;
            gameOverSound.play();
        };
    }
}

if(!pipe.passed && pipe.x+pipe.width<bird.x){

score++;
pipe.passed=true;

pointSound.currentTime = 0;
pointSound.play();

}

});

pipes=pipes.filter(pipe=>pipe.x>-80);

}

function updateBird(){

bird.velocity+=bird.gravity;

bird.y+=bird.velocity;

if(bird.y>canvas.height-18){

bird.y=canvas.height-18;

if (!gameOver) {
    gameOver = true;

    bgMusic.pause();
    bgMusic.currentTime = 0;

    hitSound.play();

    setTimeout(() => {
        gameOverSound.play();
    }, 300);
}

}

if(bird.y<18){

bird.y=18;

bird.velocity=0;

}

}

function drawScore(){

ctx.fillStyle="white";

ctx.font="30px Arial";

ctx.fillText("Score : "+score,20,40);

}

function drawGameOver(){

ctx.fillStyle="black";

ctx.font="40px Arial";

ctx.fillText("Game Over",90,250);

ctx.font="22px Arial";

ctx.fillText("Press SPACE or Click",85,300);
ctx.fillText("to Restart",135,330);

}

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height);

drawBird();

drawPipes();

updateBird();

drawScore();

if(gameOver){

drawGameOver();

return;

}

requestAnimationFrame(animate);

}

animate();

function jump() {

    if (gameOver) {
        restartGame();
        return;
    }

    jumpSound.currentTime = 0;
    jumpSound.play();

    bird.velocity = bird.lift;

    document.getElementById("start").style.display = "none";

    if (bgMusic.paused) {
    bgMusic.play().catch(err => console.log(err));
}
}

canvas.addEventListener("click",jump);
function restartGame() {

    bird.y = 250;
    bird.velocity = 0;

    pipes = [];

    score = 0;

    gameOver = false;

    document.getElementById("start").style.display = "block";
    document.getElementById("start").innerHTML =
        "<p>Press SPACE or Click to Start</p>";

    animate();

    bgMusic.currentTime = 0;
    bgMusic.play();

}
document.addEventListener("keydown", (e) => {

    if (e.code === "Space") {
        e.preventDefault();
        jump();
    }

});
document.addEventListener("click", () => {
    jumpSound.load();
    pointSound.load();
    gameOverSound.load();
    bgMusic.load();
}, { once: true });

jumpSound.volume = 0.4;
pointSound.volume = 0.5;
bgMusic.volume = 0.7;
gameOverSound.volume = 0.8;

hitSound.play();

hitSound.onended = () => {
    gameOverSound.play();
};