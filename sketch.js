var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 0;

var gameOver, restart;

var jump, die, checkpoint;

localStorage.HighestScore = 0;

function preload() {
  trex_running = loadAnimation("https://assets.editor.p5js.org/5c5bc37c07d9ce001edcb109/92d3dce2-c142-46da-92f5-919b1b4f4372.png", "https://assets.editor.p5js.org/5c5bc37c07d9ce001edcb109/77e8ab25-4dff-4091-aaf2-e3457d9b1ecf.png", "https://assets.editor.p5js.org/5c5bc37c07d9ce001edcb109/64660101-8edd-4d0f-abb6-7fd4b03f8037.png");
  trex_collided = loadAnimation("https://assets.editor.p5js.org/5c5bc37c07d9ce001edcb109/8b8b710d-d125-4901-9192-e18142414791.png");

  groundImage = loadImage("https://assets.editor.p5js.org/5c5bc37c07d9ce001edcb109/58d503bf-1b35-41e1-b2a1-e5e137586b41.png");

  cloudImage = loadImage("https://assets.editor.p5js.org/5c5bc37c07d9ce001edcb109/a1df367e-6ca0-4b2e-8f7a-4c7eb350a4ba.png");

  obstacle1 = loadImage("https://assets.editor.p5js.org/5c5bc37c07d9ce001edcb109/98beb634-c261-420a-b2cc-2fbe4d36a1df.png");
  obstacle2 = loadImage("https://assets.editor.p5js.org/5c5bc37c07d9ce001edcb109/43852910-eb44-4330-9087-312e90e9ab87.png");
  obstacle3 = loadImage("https://assets.editor.p5js.org/5c5bc37c07d9ce001edcb109/e27f37ca-d34e-48e8-8f2a-def3099310f7.png");
  obstacle4 = loadImage("https://assets.editor.p5js.org/5c5bc37c07d9ce001edcb109/57bf5674-7b64-4b11-aa53-fb072331268e.png");
  obstacle5 = loadImage("https://assets.editor.p5js.org/5c5bc37c07d9ce001edcb109/47388875-b28d-499c-83eb-ca03f1d170ed.png");
  obstacle6 = loadImage("https://assets.editor.p5js.org/5c5bc37c07d9ce001edcb109/6a28f66a-f42e-4288-a6f2-7c42d1f69176.png");

  gameOverImg = loadImage("https://assets.editor.p5js.org/5c5bc37c07d9ce001edcb109/0f425b2f-2918-477f-b5ac-8e882e240593.png");

  restartImg = loadImage("https://assets.editor.p5js.org/5c5bc37c07d9ce001edcb109/00a24d4e-d8e2-4a74-a572-db4fadc735fd.png");

  jump = loadSound("jump.mp3");

  die = loadSound("die.mp3");

  checkpoint = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);

  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -(6 + 3 * score / 100);

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(300, 140);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  text("Score: " + score, 500, 50);
  textSize(14);
  textStyle(BOLD);
  text("HI " + localStorage.HighestScore, 420, 50);

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    ground.velocityX = -(6 + 3 * score / 100);

    if (score % 100 == 0 && score > 0) {
      checkpoint.play();
    }

    if (keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
      if (jump.isPlaying()) {
        jump.stop();
      } else {
        jump.play();
      }
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      die.play();
      gameState = END;
    }
  } else if (gameState === END) {


    gameOver.visible = true;
    restart.visible = true;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //change the trex animation
    trex.changeAnimation("collided", trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }


  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3 * score / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

  if (localStorage.HighestScore < score) {
    localStorage.HighestScore = score;
  }
  console.log(localStorage.HighestScore);

  score = 0;

}