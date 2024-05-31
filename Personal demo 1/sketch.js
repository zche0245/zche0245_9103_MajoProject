let Background;
let Tower;
let lines = [];
let backgroundBase;
let towerBase;
let maxLines = 1000;
let fft;
let numBins = 128;
let smoothing = 0.8;

//create a line class to manage all the lines drawn on the canvas
class Line {
  constructor(x1, y1, x2, y2, color, thickness, direction, speed) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.thickness = thickness;
    this.direction = direction;
    this.speed = speed;
  }

  draw() {
    stroke(this.color);
    strokeWeight(this.thickness);
    line(this.x1, this.y1, this.x2, this.y2);
  }

  update() {
    let angle = atan2(this.y2 - this.y1, this.x2 - this.x1);
    this.x1 += this.direction * this.speed * cos(angle);
    this.x2 += this.direction * this.speed * cos(angle);
    this.y1 += this.direction * this.speed * sin(angle);
    this.y2 += this.direction * this.speed * sin(angle);
  }
}

function preload() {
  Background = loadImage('asset/originalWork.jpg');
  Tower = loadImage('asset/tower.png');
  song = loadSound('asset/haggstrom.mp3');
}

function setup() {
  fft = new p5.FFT(smoothing, numBins);

  song.connect(fft);

  frameRate(60);
  createCanvas(windowWidth, windowHeight);
  Tower.resize(windowWidth, windowHeight);
  backgroundBase = drawBase(Background);
  towerBase = drawBase(Tower);
  redraw();
}

function draw() {


    // 获取频谱数据
    let spectrum = fft.analyze();
  
    // 输出到控制台以便查看
    console.log(spectrum);

  // 获取低频和高频的能量值
  let lowFreq = fft.getEnergy(20, 250);
  let highFreq = fft.getEnergy(4000, 20000);
  
  // 输出到控制台
  console.log("低频值:", lowFreq);
  console.log("高频值:", highFreq);
  
  //draw the static background
  image(backgroundBase, 0, 0, windowWidth, windowHeight);
  tint(255, 5);

  //draw the moving background
  for (let i = 0; i < 30; i++) {
    addLine(Background);
  }

  //draw the static tower
  image(towerBase, 0, 0, windowWidth, windowHeight);
  tint(255, 10);


  //draw the moving tower
  for (let i = 0; i < 15; i++) {
    addLine(Tower);
  }

  //limit the line quantity to save memory
  while (lines.length > maxLines) {
    lines.shift();
  }

  for (let line of lines) {
    line.update();
    line.draw();
  }
}

//creating lines
function createLine(img, x1 = null, y1 = null, speed =1.5) {
  if (x1 === null) x1 = random(windowWidth);
  if (y1 === null) y1 = random(windowHeight);

  const { angle, length, direction } = getLineProperties(img, y1);
  const x2 = x1 + cos(angle) * length;
  const y2 = y1 + sin(angle) * length;
  const color = img.get(x1, y1);
  const thickness = random(3, 10);

  return new Line(x1, y1, x2, y2, color, thickness, direction, speed);
}

//set the property of the line base on the position
function getLineProperties(img, y1) {
  let angle;
  let direction = 1;

  if (img === Tower) {
    angle = PI / 2 + random(-PI / 5, PI / 5);
    direction = -1;
  } else {
    if (y1 > windowHeight * 0.3 && y1 < windowHeight * 0.6) {
      direction = -1;
    }
    if (y1 < windowHeight * 0.6) {
      angle = PI / 2 + random(-PI / 5, PI / 5);
    } else {
      angle = random(PI * 0.85, PI * 1.05);
    }
  }

  const length = random(50);
  return { angle, length, direction };
}


//draw the static base for canvas
function drawBase(img) {
  img.resize(windowWidth, windowHeight);
  let graphics = createGraphics(windowWidth, windowHeight);
  graphics.clear();

  const numLines = 50000;
  for (let i = 0; i < numLines; i++) {
    const line = createLine(img);
    graphics.stroke(line.color);
    graphics.strokeWeight(line.thickness);
    graphics.line(line.x1, line.y1, line.x2, line.y2);
  }

  return graphics;
}

//draw the moving lines
function addLine(img) {
  const line = createLine(img);
  lines.push(line);
}

//resize canvas
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

function mousePressed() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}
