const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// getContext() method會回傳一個canvas的drawing context
// drawing context可以用來在canvas內畫圖

//canvas單位設定
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;

// 蛇
let snake = []; // 存array的物件, 每個物件都存一個x.y值
function createSnake() {
  snake[0] = {
    x: 40,
    y: 0,
  };
  snake[1] = {
    x: 20,
    y: 0,
  };
  snake[2] = {
    x: 0,
    y: 0,
  };
}
//果實
class Fruit {
  //果實預設位置
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  //畫出果實
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  //選果實的新位置 不能跟蛇重疊
  pickLocation() {
    let Touch = true; //先假設果子會碰到蛇
    let newX;
    let newY;

    while (Touch) {
      newX = Math.floor(Math.random() * column) * unit;
      newY = Math.floor(Math.random() * row) * unit;

      let allPass = true; //先假設果子都不在蛇的身上
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x == newX && snake[i].y == newY) {
          allPass = false;
          break;
        }
      }
      if (allPass) {
        Touch = false; //果子pass過蛇的全身表示不會碰到蛇
        this.x = newX;
        this.y = newY;
      }
    }
  }
}

//起始設定
// 蛇
createSnake();
// 果實
let myFruit = new Fruit();
// 方向
let d = "Right";
//分數
let score = 0;
//最高分數
let highestScore;
loadRecordScore();
document.getElementById("myScore2").innerHTML = "Record Score: " + highestScore;

function draw() {
  //判斷頭有沒有撞到自己的身體
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game Over");
      return;
    }
  }

  // 起始的時候背景都先設定為全黑
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 畫出果實
  myFruit.drawFruit();

  // 開始畫蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) ctx.fillStyle = "lightgreen";
    else ctx.fillStyle = "lightblue";

    ctx.strokeStyle = "white";
    // x,y,width,height
    //畫外框
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
    //填滿
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
  }

  //依照方向參數d 決定下一偵蛇的座標要在哪裡
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (d == "Left") {
    if (snakeX == 0) snakeX = canvas.width - unit;
    else snakeX -= unit;
  } else if (d == "Right") {
    if (snakeX == canvas.width - unit) snakeX = 0;
    else snakeX += unit;
  } else if (d == "Top") {
    if (snakeY == 0) snakeY = canvas.height - unit;
    else snakeY -= unit;
  } else if (d == "Down") {
    if (snakeY == canvas.height - unit) snakeY = 0;
    else snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //有沒有吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    //果實要有新位置
    myFruit.pickLocation();
    //更新分數並顯示
    score += 1;
    document.getElementById("myScore").innerHTML = "Game Score: " + score;
    setHighestScore(score);
    document.getElementById("myScore2").innerHTML =
      "Record Score: " + highestScore;
  } else {
    snake.pop(); //去尾
  }
  snake.unshift(newHead); //增頭

  // 方向設定
  window.addEventListener("keydown", (e) => {
    if (e.keyCode == 37 && d != "Right") d = "Left";
    else if (e.keyCode == 38 && d != "Down") d = "Top";
    else if (e.keyCode == 39 && d != "Left") d = "Right";
    else if (e.keyCode == 40 && d != "Top") d = "Down";

    // 按了上下左右鍵之後, 在下一偵被畫出來之前
    // 不接受任何keydown事件
    // 這樣可以防止連續按鍵導致動畫跟不上蛇的實際動作
  });
}

let myGame = setInterval(draw, 100);

//紀錄最高得分
function loadRecordScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
