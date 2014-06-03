var canvasBg1 = document.getElementById('canvasBg1');
var cntxBg1 = canvasBg1.getContext('2d');

var canvasBg2 = document.getElementById('canvasBg2');
var cntxBg2 = canvasBg2.getContext('2d');

var canvasBg3 = document.getElementById('canvasBg3');
var cntxBg3 = canvasBg3.getContext('2d');

var canvasJet = document.getElementById('canvasJet');
var cntxJet = canvasJet.getContext('2d');

var canvasEnemy = document.getElementById('canvasEnemy');
var cntxEnemy = canvasEnemy.getContext('2d');

var canvasParachute = document.getElementById('canvasParachute');
var cntxParachute = canvasParachute.getContext('2d');

var canvasHUD = document.getElementById('canvasHUD');
var cntxHUD = canvasHUD.getContext('2d');
cntxHUD.fillStyle = "rgba(255,255,255,0.8)";
cntxHUD.font = "bold 20px Arial";

var canvasGameOver = document.getElementById('canvasGameOver');
var cntxGameOver = canvasGameOver.getContext('2d');
cntxGameOver.fillStyle = "rgba(112,57,23,0.8)";
cntxGameOver.font = "bold 23px Helvetica";

var audioIntro = document.getElementById('audioIntro');
var audioPlay = document.getElementById('audioPlay');
var audioMissile = document.getElementById('audioMissile');
var audioExplosion = document.getElementById('audioExplosion');


//new

var bg1DrawX1 = 0;
var bg1DrawX2 = 1600;


function moveBg1(){
	bg1DrawX1 -= 4;
	bg1DrawX2 -= 4;
	if(bg1DrawX1 <= -1600){
		bg1DrawX1 = 1600;
	}
	else if(bg1DrawX2 <= -1600){
		bg1DrawX2 = 1600;
	}
	drawBg1();
}


var bg2DrawX1 = 0;
var bg2DrawX2 = 1600;

function moveBg2(){
	bg2DrawX1 -= 5;
	bg2DrawX2 -= 5;
	if(bg2DrawX1 <= -1600){
		bg2DrawX1 = 1600;
	}
	else if(bg2DrawX2 <= -1600){
		bg2DrawX2 = 1600;
	}
	drawBg2();
}


var bg3DrawX1 = 0;
var bg3DrawX2 = 800;

function moveBg3(){
	bg3DrawX1 -= 0.08;
	bg3DrawX2 -= 0.08;
	if(bg3DrawX1 <= -800){
		bg3DrawX1 = 800;
	}
	else if(bg3DrawX2 <= -800){
		bg3DrawX2 = 800;
	}
	drawBg3();
}






//end new


var jet1 = new Jet();
var btnPlay = new Button(170, 309, 360, 432);
var btnPlay1 = new Button(430, 630, 360, 432);
var btnPlay2 = new Button(430, 630, 360, 432);
var btnVolumeOn = new Button(700, 730, 20, 50);
var btnVolumeOff = new Button(740, 770, 20, 50);
var btnPlayAgain = new Button(200, 400, 400, 455);
var btnMainMenu = new Button(430, 630, 400, 455);
var gameWidth = canvasBg1.width;
var gameHeight = canvasBg1.height;
var mouseX = 0;
var mouseY = 0;
var time = 60;
var isPlaying = false;
var on = false;
var timeLimit = 60;
var time = timeLimit;
var timer;
var current = 0;
var volumeStatus = true;
var requestAnimFrame = window.requestAnimationFrame ||
					   window.webkitRequestAnimationFrame ||
					   window.mozRequestAnimationFrame ||
					   window.msRequestAnimationFrame ||
					   window.oRequestAnimationFrame ||
					   function(callback){
					   		window.setTimeout(callback, 1000/60);
					   };
var enemies = [];
var parachutes = [];
var spawnAmount = 4;
var escaped = 0;
var imgSprite = new Image();
imgSprite.src = "sprite.png";
imgSprite.addEventListener('load',init,false);

//main function

function init(){
	spawnEnemy(spawnAmount);
	spawnParachute(3);
	drawMenu();
	audioIntro.play();
	audioIntro.loop = true;
	document.addEventListener('click',mouseClicked,false);
}
 
function playGame(){
	timer = setInterval(updateTime,1000);
	if(on){
		enemy = new Enemy();
		parachute = new Parachute();
		drawBg1();
		drawBg2();
		drawBg3();
		startLoop();
		document.addEventListener('keydown',checkKeyDown,false);
		document.addEventListener('keyup',checkKeyUp,false);

	}
}

function spawnEnemy(number){
	for(var i = 0; i < number; i++){
		enemies[enemies.length] = new Enemy();
	}

}


function drawAllEnemies(){
	clearCTXEnemy();
	for(var i=0; i < enemies.length; i++){
		enemies[i].draw();
	}
}

function spawnParachute(number){
	for(var i = 0; i < number; i++){
		parachutes[parachutes.length] = new Parachute();
	}

}


function drawAllParachutes(){
	clearCTXParachute();
	for(var i=0; i < parachutes.length; i++){
		parachutes[i].draw();
	}
}

function loop(){
	if(isPlaying){
		jet1.draw();
		moveBg1();
		moveBg2();
		moveBg3();
		drawAllEnemies();
		drawAllParachutes();
		updateHUD();
		checkGameOver();
		audioIntro.pause();
		audioIntro.currentTime = 0;
		audioPlay.play();
		requestAnimFrame(loop);
	}

}

function startLoop(){
	isPlaying = true;
	loop();
}

function stopLoop(){
	isPlaying = false;
	
}

function turnVolumeOff(){
		audioIntro.pause();
		audioIntro.currentTime = 0;
		volumeStatus = false;
}

function turnVolumeOn(){
		audioIntro.play();
		volumeStatus = true;
	
}

function respet(){
	escaped = 0;
	jet1.score = 0;
	jet1.drawX = 100;
	jet1.drawY = 200;
	time = timeLimit;
	for(var i=0; i < enemies.length; i++){
		enemies[i].drawX = Math.floor(Math.random()*1000) + gameWidth;
		enemies[i].drawY = Math.floor(Math.random()*350);
	}
	for(var i=0; i < parachutes.length; i++){
		parachutes[i].drawX = Math.floor(Math.random()*500) + gameWidth;
		parachutes[i].drawY = Math.floor(Math.random()*300);;
	}
	for(var i = 0; i < 30 ; i++){
		jet1.bullets[i].recycle();
	}
	var bg1DrawX1 = 0;
	var bg1DrawX2 = 1600;
	var bg2DrawX1 = 0;
	var bg2DrawX2 = 1600;
	var bg3DrawX1 = 0;
	var bg3DrawX2 = 800;
	cntxBg1.clearRect(0,0,gameWidth,gameHeight);
	cntxBg2.clearRect(0,0,gameWidth,gameHeight);
	cntxBg3.clearRect(0,0,gameWidth,gameHeight);
	clearCTXJet();
	clearCTXParachute();
	clearCTXEnemy();
	clearCTXHUD();
	clearCTXGameOver();

}

function drawMenu(){
	var srcX = 0;
	var srcY = 580;
	var drawX = 0;
	var drawY = 0;
	cntxBg3.drawImage(imgSprite,srcX,srcY,gameWidth,gameHeight,drawX,drawY,gameWidth,gameHeight);
}

function drawGameOver(){
	if(!on){
		var srcX = 0;
		var srcY = 1580;
		var drawX = 0;
		var drawY = 0;
		cntxGameOver.drawImage(imgSprite,srcX,srcY,gameWidth,gameHeight,drawX,drawY,gameWidth,gameHeight);
	}
}

function drawBg1(){
	cntxBg1.clearRect(0,0,gameWidth,gameHeight);
	if(btnPlay.checkClicked() || current === 1){
			cntxBg1.drawImage(imgSprite,0,0,1600,gameHeight,bg1DrawX1,0,1600,gameHeight);
			cntxBg1.drawImage(imgSprite,0,0,1600,gameHeight,bg1DrawX2,0,1600,gameHeight);
		}
	if(btnPlay1.checkClicked() || current === 2){
			cntxBg1.drawImage(imgSprite,1600,0,1600,gameHeight,bg1DrawX1,0,1600,gameHeight);
			cntxBg1.drawImage(imgSprite,1600,0,1600,gameHeight,bg1DrawX2,0,1600,gameHeight);
		}	
	
}

function drawBg2(){
	cntxBg2.clearRect(0,0,gameWidth,gameHeight);
	if(btnPlay.checkClicked() || current === 1){
		cntxBg2.drawImage(imgSprite,0,1080,1600,gameHeight,bg2DrawX1,0,1600,gameHeight);
		cntxBg2.drawImage(imgSprite,0,1080,1600,gameHeight,bg2DrawX2,0,1600,gameHeight);
	}
	if(btnPlay1.checkClicked() || current === 2){
		cntxBg2.drawImage(imgSprite,1600,1080,1600,gameHeight,bg2DrawX1,0,1600,gameHeight);
		cntxBg2.drawImage(imgSprite,1600,1080,1600,gameHeight,bg2DrawX2,0,1600,gameHeight);
	}
}

function drawBg3(){ //sun
	cntxBg3.clearRect(0,0,gameWidth,gameHeight);
	cntxBg3.drawImage(imgSprite,801,500,800,gameHeight,bg3DrawX1,0,800,gameHeight);
	cntxBg3.drawImage(imgSprite,801,500,800,gameHeight,bg3DrawX2,0,800,gameHeight);
	
}


function updateHUD(){
	cntxHUD.clearRect(0,0,gameWidth,gameHeight);
	cntxHUD.fillText("Score: "+ jet1.score, 650, 30);
	cntxHUD.fillText("Escaped: "+ escaped, 500, 30);
	cntxHUD.fillText("Time Left: "+ time, 20, 30);
}

function updateTime(){
	time = time - 1;
}

function reloadPage(){
	location.reload();
}

function checkGameOver(){
	if(jet1.checkHitEnemy() || jet1.checkHitParachute() || time === 0){
		gameOver();
	}
}

function gameOver(){
	stopLoop();
	on = false;
	drawGameOver();
	gameOverNote();
	document.addEventListener('click',mouseClicked1,false);
	clearInterval(timer);
}


function gameOverNote(){
	cntxGameOver.fillText("Your Score: " + jet1.score, 330, 340);
	if(jet1.score < 0 && jet1.score > -200 && !jet1.checkHitEnemy() && !jet1.checkHitParachute()){
		cntxGameOver.fillText("TIME UP", 370, 230);
		cntxGameOver.fillText("Gather yourself up...you need better than that..", 150, 280);
	}
	if(jet1.score <= -200 && jet1.score > -400 && !jet1.checkHitEnemy() && !jet1.checkHitParachute()){
		cntxGameOver.fillText("TIME UP", 370, 230);
		cntxGameOver.fillText("Disappointing..expected something better..", 170, 280);
	}
	if(jet1.score <= -400 && !jet1.checkHitEnemy() && !jet1.checkHitParachute()){
		cntxGameOver.fillText("TIME UP", 370, 230);
		cntxGameOver.fillText("Shame..a 10 year old plays better than you..", 170, 280);
	}
	if(jet1.score === 0 && !jet1.checkHitEnemy() && !jet1.checkHitParachute()){
		cntxGameOver.fillText("TIME UP", 370, 230);
		cntxGameOver.fillText("Good...but we expect something north of zero..", 140, 280);
	}
	if(jet1.score >0 && jet1.score <= 100 && !jet1.checkHitEnemy() && !jet1.checkHitParachute()){
		cntxGameOver.fillText("TIME UP", 370, 230);
		cntxGameOver.fillText("Promising...you are worth a watch...", 210, 280);
	}
	if(jet1.score >100 && jet1.score <= 200 && !jet1.checkHitEnemy() && !jet1.checkHitParachute()){
		cntxGameOver.fillText("TIME UP", 370, 230);
		cntxGameOver.fillText("Good job...be proud..", 300, 280);
	}
	if(jet1.score > 200 && !jet1.checkHitEnemy() && !jet1.checkHitParachute()){
		cntxGameOver.fillText("TIME UP", 370, 230);
		cntxGameOver.fillText("Salute...dude, you are AWESOME..", 220, 280);
	}
	if(jet1.checkHitEnemy()){
		cntxGameOver.fillText("Brave yet stupid...You crashed into enemy plane..", 140, 250);
	}
	if(jet1.checkHitParachute()){
		cntxGameOver.fillText("You hit our parachute..dumb fellow..", 190, 250);
	}
}


//end of main function








//jet functions

function Jet(){
	this.srcX = 0;
	this.srcY = 500;
	this.drawX = 100;
	this.drawY = 200;
	this.noseX = this.drawX + 100;
	this.noseY = this.drawY + 30;
	this.leftX = this.drawX;
	this.rightX = this.drawX + this.width;
	this.topY = this.drawY;
	this.bottomY = this.drawY + this.height;
	this.width = 100;
	this.height = 40;
	this.speed = 3;
	this.isUpKey = false;
	this.isRightKey = false;
	this.isDownKey = false;
	this.isLeftKey = false;
	this.isSpacebar = false;
	this.isShooting = false;
	this.bullets = [];
	this.currentBullet = 0;
	for(var i = 0; i < 30 ; i++){
		this.bullets[this.bullets.length] = new Bullet();
	}
	this.score = 0;
	this.explosion = new Explosion();
}

Jet.prototype.draw = function (){
	clearCTXJet();
	this.updateCoors();
	this.checkDirections();	
	this.checkShooting();
	this.drawAllBullets();
	this.checkHitEnemy();
	this.checkHitParachute();
	cntxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
};



Jet.prototype.updateCoors = function (){
	this.noseX = this.drawX + 100;
	this.noseY = this.drawY + 30;
	this.leftX = this.drawX;
	this.rightX = this.drawX + this.width;
	this.topY = this.drawY;
	this.bottomY = this.drawY + this.height;
};



Jet.prototype.checkDirections = function (){
	if(this.isUpKey && this.topY > 0){
		this.drawY -= this.speed;
	}
	if(this.isRightKey && this.rightX < 800){
		this.drawX += this.speed;
	}
	if(this.isDownKey && this.bottomY < 500){
		this.drawY += this.speed;
	}
	if(this.isLeftKey && this.leftX > 0){
		this.drawX -= this.speed;
	}
};


Jet.prototype.drawAllBullets = function() {
	for(var i=0; i < this.bullets.length; i++){
		if(this.bullets[i].drawX >= 0){
			this.bullets[i].draw();		
		}
		if(this.bullets[i].explosion.hasHit){
			this.bullets[i].explosion.draw();
		}
	}
};


Jet.prototype.checkShooting = function() {
	if(this.isSpacebar && !this.isShooting){
		this.isShooting = true;
		audioMissile.play();
		this.bullets[this.currentBullet].fire(this.noseX, this.noseY);
		this.currentBullet++;
		if(this.currentBullet >= this.bullets.length){
			this.currentBullet = 0;
		}
	}
	else if(!this.isSpacebar){
		this.isShooting = false;
	}
	
};


Jet.prototype.checkHitEnemy = function(){
	for(var i=0; i < enemies.length; i++){
		if(this.rightX >= enemies[i].drawX &&
		   this.leftX <= enemies[i].drawX + enemies[i].width &&
		   this.bottomY >= enemies[i].drawY &&
		   this.topY <= enemies[i].drawY + enemies[i].height){
				return true;
		}
	}

};


Jet.prototype.checkHitParachute = function(){
	for(var i=0; i < parachutes.length; i++){
		if(this.rightX >= parachutes[i].drawX &&
		   this.leftX <= parachutes[i].drawX + parachutes[i].width &&
		   this.bottomY >= parachutes[i].drawY &&
		   this.topY <= parachutes[i].drawY + parachutes[i].height){
				return true;
		}
	}

};


Jet.prototype.updateScore = function(points) {
	this.score = this.score + points;
	audioExplosion.play();
	updateHUD();
};



function drawJet(){
	
}


function clearCTXJet(){
	cntxJet.clearRect(0,0,gameWidth,gameHeight);
}

function clearCTXGameOver(){
	cntxGameOver.clearRect(0,0,gameWidth,gameHeight);
}

function clearCTXHUD(){
	cntxHUD.clearRect(0,0,gameWidth,gameHeight);
}


//end of jet functions


//bullet functions

function Bullet(){
	this.srcX = 100;
	this.srcY = 500;
	this.drawX = -20;
	this.drawY = 0;
	this.width = 40;
	this.height = 10;
	this.explosion = new Explosion();
}


Bullet.prototype.draw = function (){
	this.drawX += 4;
	cntxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	this.checkHitEnemy();
	this.checkHitParachute();
	if(this.drawX > gameWidth){
		this.recycle();
	}
};


Bullet.prototype.fire = function(startX,startY){
	this.drawX = startX;
	this.drawY = startY;
};


Bullet.prototype.checkHitEnemy = function(){
	for(var i=0; i < enemies.length; i++){
		if(this.drawX + this.width >= enemies[i].drawX &&
		   this.drawX <= enemies[i].drawX + enemies[i].width &&
		   this.drawY + this.height >= enemies[i].drawY &&
		   this.drawY <= enemies[i].drawY + enemies[i].height){
				this.explosion.drawX = enemies[i].drawX - (this.explosion.width/2);
				this.explosion.drawY = enemies[i].drawY;
				this.explosion.hasHit = true;
				this.recycle();
				enemies[i].recycleEnemy();
				jet1.updateScore(enemies[i].rewardPoints);
		}
	}

};


Bullet.prototype.checkHitParachute = function(){
	for(var i=0; i < parachutes.length; i++){
		if(this.drawX + this.width >= parachutes[i].drawX &&
		   this.drawX <= parachutes[i].drawX + parachutes[i].width &&
		   this.drawY + this.height >= parachutes[i].drawY &&
		   this.drawY <= parachutes[i].drawY + parachutes[i].height){
				this.explosion.drawX = parachutes[i].drawX - (this.explosion.width/2);
				this.explosion.drawY = parachutes[i].drawY;
				this.explosion.hasHit = true;
				this.recycle();
				parachutes[i].recycleParachute();
				jet1.updateScore(parachutes[i].rewardPoints);
		}
	}

};


Bullet.prototype.recycle = function(){
	this.drawX = -20;
};


//end of bullet function


//explosion functions


function Explosion(){
	this.srcX = 750;
	this.srcY = 500;  
	this.drawX = 0;
	this.drawY = 0;
	this.width = 50;
	this.height = 50;
	this.hasHit = false;
	this.hasHit1 = false;
	this.currentFrame = 0;
	this.totalFrames = 20;
}

Explosion.prototype.draw = function(){
	if(this.currentFrame <= this.totalFrames){
		cntxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
		this.currentFrame++;
	}
	else{
		this.currentFrame = 0;
		this.hasHit = false;
	}
};

//end of explosion functions





//enemy functions

function Enemy(){
	this.srcX = 0;
	this.srcY = 540;
	this.drawX = Math.floor(Math.random()*1000) + gameWidth;
	this.drawY = Math.floor(Math.random()*350);
	this.width = 100;
	this.height = 40;
	this.speed = 5 + Math.random()*1;
	this.rewardPoints = 10;
}

Enemy.prototype.draw = function (){
	this.drawX -= this.speed;
	cntxEnemy.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	this.checkEscaped();
};

Enemy.prototype.checkEscaped = function (){
	if(this.width+this.drawX <= 0){
		this.recycleEnemy();
		escaped++;
	}
	
};


Enemy.prototype.recycleEnemy = function (){
	this.drawX = Math.floor(Math.random()*1000) + gameWidth;
	this.drawY = Math.floor(Math.random()*350);
};



function drawEnemy(){
	
}

function clearCTXEnemy(){
	cntxEnemy.clearRect(0,0,gameWidth,gameHeight);
}

//end of enemy functions


//parachute functions

function Parachute(){
	this.srcX = 140;
	this.srcY = 500;
	this.drawX = Math.floor(Math.random()*500) + gameWidth;
	this.drawY = Math.floor(Math.random()*300);
	this.width = 50;
	this.height = 80;
	this.speed = 1 + Math.random()*1;
	this.rewardPoints = -100;
}

Parachute.prototype.draw = function (){
	this.drawX -= this.speed;
	cntxParachute.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	this.checkEscaped();
};

Parachute.prototype.checkEscaped = function (){
	if(this.width+this.drawX <= 0){
		this.recycleParachute();
	}

};


Parachute.prototype.recycleParachute = function (){
	this.drawX = Math.floor(Math.random()*500) + gameWidth;
	this.drawY = Math.floor(Math.random()*300);
};



function drawParachutes(){
	
}

function clearCTXParachute(){
	cntxParachute.clearRect(0,0,gameWidth,gameHeight);
}

//end of parachute functions


//button object

function Button(xL, xR, yT, yB){
	this.xLeft = xL;
	this.xRight = xR;
	this.yTop = yT;
	this.yBottom = yB;
}

Button.prototype.checkClicked = function (){
	if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom) return true;
};



//end of button object




//event functions

function mouseClicked(e){
	mouseX = e.pageX - canvasBg1.offsetLeft;
	mouseY = e.pageY - canvasBg1.offsetTop;
	if(!isPlaying){
		if(btnPlay.checkClicked()){
			on = true;
			playGame();
			current = 1;
		}
	}
	if(!isPlaying){
		if(btnPlay1.checkClicked()){
			on = true;
			playGame();
			current = 2;
		}
	}
	if(!isPlaying){
		if(btnVolumeOn.checkClicked()){
			turnVolumeOff();
		}
	}
	if(!isPlaying){
		if(btnVolumeOff.checkClicked()){
			turnVolumeOn();
		}
	}
}

function mouseClicked1(e){
	mouseX = e.pageX - canvasGameOver.offsetLeft;
	mouseY = e.pageY - canvasGameOver.offsetTop;
	if(jet1.checkHitEnemy() || jet1.checkHitParachute() || time === 0){
		if(btnPlayAgain.checkClicked()) {
			audioPlay.pause();
			audioPlay.currentTime = 0;
			on = true;
			respet();
			playGame();
			
		}
	}
	if(jet1.checkHitEnemy() || jet1.checkHitParachute() || time === 0){
		if(btnMainMenu.checkClicked()){
			audioPlay.pause();
			audioPlay.currentTime = 0;
			respet();
			init();
		}
	}
}




function checkKeyDown(e){
	var keyID = e.keyCode || e.which;
	if (keyID === 38 || keyID === 87){//up or W
		jet1.isUpKey = true;
		e.preventDefault();
	}
	if (keyID === 39 || keyID === 68){//right or D
		jet1.isRightKey = true;
		e.preventDefault();
	}
	if (keyID === 40 || keyID === 83){//down or S
		jet1.isDownKey = true;
		e.preventDefault();
	}
	if (keyID === 37 || keyID === 65){//left or A
		jet1.isLeftKey = true;
		e.preventDefault();
	}
	if (keyID === 32){//spacebar
		jet1.isSpacebar = true;
		e.preventDefault();
	}

}

function checkKeyUp(e){
	var keyID = e.keyCode || e.which;
	if (keyID === 38 || keyID === 87){//up or W
		jet1.isUpKey = false;
		e.preventDefault();
	}
	if (keyID === 39 || keyID === 68){//right or D
		jet1.isRightKey = false;
		e.preventDefault();
	}
	if (keyID === 40 || keyID === 83){//down or S
		jet1.isDownKey = false;
		e.preventDefault();
	}
	if (keyID === 37 || keyID === 65){//left or A
		jet1.isLeftKey = false;
		e.preventDefault();
	}
	if (keyID === 32){//spacebar
		jet1.isSpacebar = false;
		e.preventDefault();
	}
}


// end of evet functions