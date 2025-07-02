var PLAY = 1;
var END = 0;
var gameState = PLAY;

var wiz, wiz_running, wiz_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg, gameoverbg;
var score=0;
var jumpSound, collidedSound;
let fontRegular;
var gameOver, restart;
var wmbAnimation, mbAnimation;
var magicBlastCooldown = 0;
var magicBlastCooldownDuration = 300;
let cooldownBarWidth = 100;
let startButton;
let instructionsButton;
let backButton;
let currentScreen;
let gameActive = false;


localStorage = ["HighestScore"];
localStorage[0] = 0;

function preload(){
  fontRegular = loadFont("assets/Press_Start_2P/PressStart2P-Regular.ttf");
  jumpSound = loadSound("assets/jump.wav")
  collidedSound = loadSound("assets/collided.wav");

  
  wmbAnimation = loadAnimation("assets/mb1.png", "assets/mb2.png", "assets/mb3.png", "assets/mb4.png");
  

  mbAnimation = loadAnimation("assets/mb5.png", "assets/mb6.png", "assets/mb7.png");

  
  backgroundImg = loadImage("assets/background.jpg")
  
  wiz_running = loadAnimation("assets/Wizard/Run1.png","assets/Wizard/Run2.png","assets/Wizard/Run3.png","assets/Wizard/Run4.png","assets/Wizard/Run5.png","assets/Wizard/Run6.png","assets/Wizard/Run7.png","assets/Wizard/Run8.png");
  wiz_collided = loadAnimation("assets/Wizard/Dead1.png");
  
  
  groundImage = loadImage("assets/ground.jpg");
  
  cloudImage = loadImage("assets/cloud.png");
  
  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");
  
  gameOverImg = loadImage("assets/gameover.png");
  restartImg = loadImage("assets/restart.png");
  gameoverbg = loadImage("assets/gameoverbg.jpg");
}

function drawEnterScreen() {
  background(backgroundImg); 
  fill(255); 
  textSize(18);
  textAlign(CENTER);
  text("In a realm gripped by an icy chill,a determined wizard embarks on a\njourney to restore life, using his powers to thaw frozen hearts and\nrekindle the dwindling flames of hope.", width / 2, height / 2 - 100);
  startButton.mousePressed(startGame);
  startButton.show(); 
  instructionsButton.show();
  invisibleGround.visible = true; 
  backButton.hide();
  ground.visible = false;
  wiz.visible = true;
}

function setup() {
  createCanvas(600, 400); 

  
  startButton = createButton("Start Game");
  startButton.position(width / 2 - 50, height / 2);
  startButton.mousePressed(startGame);
  
  
  instructionsButton = createButton("Instructions");
  instructionsButton.position(width / 2 - 50, height / 2 + 50);
  instructionsButton.mousePressed(showInstructions); 
  
  
  backButton = createButton("Back");
  backButton.position(width / 2 - 50, height / 2 + 100);
  

   currentScreen = "enter";
  
  wiz = createSprite(50,height-50,20,50);
  
  
  wiz.addAnimation("running", wiz_running);
  wiz.addAnimation("collided", wiz_collided);
  wiz.setCollider('circle',0,0,50);

  wiz.scale = 0.625;
  
  //wiz.debug=true;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.visible =false;
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(3 + 2.5*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.05;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  magicBlastGroup = new Group();
  
  score = 0;
}

function draw() {
  //wiz.debug = true;
  background(backgroundImg);
   
   if (currentScreen === "enter") {
      drawEnterScreen();
      invisibleGround.visible = false;
   } else if (currentScreen === "instructions") {
      showInstructions();
     invisibleGround.visible = false;
   }
  textSize(12);
  textFont(fontRegular);
  fill("black");
  

  
   if (gameState === PLAY && gameActive) {
    score = score + Math.round(getFrameRate()/60);
   ground.velocityX = -(3 + 2.5*score/100);

     text("Score: "+ score,29,70);
  text("HI: "+ localStorage[0], width/20, height/10);
 //text("Use the spacebar to \navoid the deadly rocks\nand the m key to unleash \nthe magic blast.", width / 2,height / 2 - 165);

    if (magicBlastCooldown > 0) {
     magicBlastCooldown--;
    }

     if (currentScreen === "enter") {
    startButton.show();
    instructionsButton.show();
    backButton.hide(); 
    hideGameElements(); 
  } else {
    startButton.hide();
    instructionsButton.hide();
    backButton.hide();
  }

    
    fill(0);
    rect(width/2-270 , height/2-110, 100, 10);
    
    cooldownBarWidth = map(magicBlastCooldown, 0, magicBlastCooldownDuration, 100,0);
    fill(255, 0, 0); 
    rect(width/2-270 , height/2-110, cooldownBarWidth, 10); 


    if((touches.length > 0 || keyDown("SPACE")) && wiz.y  >= height-120) {
      jumpSound.play( )
      wiz.velocityY = -10;
       touches = [];
    }
    
    wiz.velocityY = wiz.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if (keyWentDown("m") && magicBlastCooldown === 0) {
    createMagicBlast();
    magicBlastCooldown = magicBlastCooldownDuration;
   }

    if (obstaclesGroup.length > 0) {
    wiz.changeAnimation("running", mbAnimation);
  } else {
    wiz.changeAnimation("magicBlast", wmbAnimation);
  }

    for (var i = 0; i < magicBlastGroup.length; i++) {
  for (var j = 0; j < obstaclesGroup.length; j++) {
    if (magicBlastGroup[i].isTouching(obstaclesGroup[j])) {
      magicBlastGroup[i].destroy();
      obstaclesGroup[j].destroy();
      magicBlastCooldown = magicBlastCooldownDuration; 
    }
  }
}
    wiz.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(wiz)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
  
    ground.velocityX = 0;
    wiz.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
   
    wiz.changeAnimation("collided",wiz_collided);
    

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("space")) {      
      touches = []
    }
    if(mousePressedOver(restart)){
      reset();
     
    }
  }
  
  drawSprites();
}

function spawnClouds() {
  
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    
    cloud.lifetime = 800;
    
    
    cloud.depth = wiz.depth;
    wiz.depth = wiz.depth+1;
    
    
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
   
  
    obstacle.velocityX = -(6 + 3*score/100);
    
   
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
              
    obstacle.scale = 0.4;
    obstacle.lifetime = 300;
    obstacle.depth = wiz.depth;
    wiz.depth +=1;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  wiz.changeAnimation("running",wiz_running);

 if(localStorage[0]<score){
    localStorage[0] = score;
  }
  console.log(localStorage[0]);
  score = 0;
  
} 

function createMagicBlast() {
  var magicBlast = createSprite(wiz.x + 20, wiz.y - 10, 10, 10);
  magicBlast.addAnimation("magicBlast", mbAnimation);
  magicBlast.velocityX = 8;
  magicBlast.lifetime = width / magicBlast.velocityX;

  magicBlastGroup.add(magicBlast);
}


function drawInstructions() {
  background(backgroundImg);
  textSize(19);
  fill("white");
  text("Instructions:", width / 2-80, height / 2 - 100);
  textSize(17);
  text("-Use the spacebar to avoid the deadly rocks\n \n-Press 'M' to unleash the magic blast\n \n(Make sure to keep an eye on the cooldown timer)\n \n-Avoid obstacles and survive as long as possible", width / 2-170, height / 2 - 70);

  
  backButton.show();
  backButton.mousePressed(goBack);
}
   


function startGame() {
  console.log("Start button clicked");
   startButton.hide();
   instructionsButton.hide();
   gameState = PLAY;
   currentScreen = "game";
   
   backButton.show();
   reset();
   showGameElements();
   gameActive = true;
}


function showInstructions() {
   currentScreen = "instructions";
   backButton.show();
  hideGameElements();
  drawInstructions();
  wiz.visible = true;

  startButton.hide();
  instructionsButton.hide();
  
}


function hideGameElements() {
  wiz.visible = false;
  ground.visible = false;
  obstaclesGroup.setVisibleEach(false);
  cloudsGroup.setVisibleEach(false);
  magicBlastGroup.setVisibleEach(false);
  score = 0;
}

function goBack() {
  currentScreen = "enter";
  backButton.hide();
  startButton.show();
  instructionsButton.show();
  hideGameElements();
}

function showGameElements() {
  wiz.visible = true;
  ground.visible = true;
  obstaclesGroup.setVisibleEach(true);
  cloudsGroup.setVisibleEach(true);
  magicBlastGroup.setVisibleEach(true);
}