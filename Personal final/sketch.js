//create containers
let Background;
let Tower;
let lines = [];
let backgroundBase;
let towerBase;


let showText = true;

//Values of line properties
let strokeweightBase = 3;
let lengthBase = 50;
let grayScale = 100;
let density = 10;

let maxLines = 1000;

//Audio settings
let analyzer;
let fft;
let numBins = 128;
let smoothing = 0.1;

// Create a class to manage all the lines drawn on the canvas
class Line {
  constructor(x1, y1, x2, y2, color, strokeWeight, direction, speed) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.strokeWeight = strokeWeight;
    this.direction = direction;
    this.speed = speed;
  }

  draw() {
    stroke(this.color);
    strokeWeight(this.strokeWeight);
    line(this.x1, this.y1, this.x2, this.y2);
  }

  // Update the position of the line
  update() {
    let angle = atan2(this.y2 - this.y1, this.x2 - this.x1);
    this.x1 += this.direction * this.speed * cos(angle);
    this.x2 += this.direction * this.speed * cos(angle);
    this.y1 += this.direction * this.speed * sin(angle);
    this.y2 += this.direction * this.speed * sin(angle);
  }
}

function preload() {
  // Preload images and audio
  Background = loadImage('asset/originalWork.jpg');
  Tower = loadImage('asset/tower.png');
  song = loadSound('asset/song.mp3');
}

function setup() {
  // Create audio analyzer
  analyzer = new p5.Amplitude(smoothing);
  analyzer.setInput(song);

  fft = new p5.FFT(smoothing, numBins);
  song.connect(fft);

  createCanvas(windowWidth, windowHeight);
  Tower.resize(windowWidth, windowHeight);
  backgroundBase = drawBase(Background);
  towerBase = drawBase(Tower);

  textAlign(CENTER, CENTER);
  textSize(64);
}

function draw() {
  // Get audio data
  let volume = analyzer.getLevel();
  let spectrum = fft.analyze();
  
  // Get values for low and high frequencies
  let lowFreq = fft.getEnergy(20, 200);
  let highFreq = fft.getEnergy(4000, 20000);
  
  // Adjust line properties based on audio data
  strokeweightBase = 3 * (1 + 4 * (lowFreq / 300) * (lowFreq / 300) * (lowFreq / 300));
  lengthBase = 5 * (1 + 3 * (highFreq / 30));
  grayScale = 1400 * volume;
  density = 10 + (200 * volume);
  maxLines = 1000 + (10000 * volume);

  // Draw static background
  tint(grayScale, 10);
  image(backgroundBase, 0, 0, windowWidth, windowHeight);

  // Draw moving background
  for (let i = 0; i < density; i++) {
    addLine(Background);
  }

  // Limit the number of lines to save memory
  while (lines.length > maxLines) {
    lines.shift();
  }

  // Update and draw all lines
  for (let line of lines) {
    line.update();
    line.draw();
  }

  // Draw static tower
  tint(grayScale, 50);
  image(towerBase, 0, 0, windowWidth, windowHeight);
  
  // Draw moving tower
  for (let i = 0; i < density; i++) {
    addLine(Tower);
  }
  
  // Click to play text
  if (showText) {
    noStroke();
    fill(150);
    rect(width / 2 - 250, height / 2 - 60, 500, 120, 10);
    fill(255);
    text("Click to play", width / 2, height / 2);
  }
}

// Create lines with properties
function createLine(img, x1 = null, y1 = null, speed = 1.5) {
  if (x1 === null) x1 = random(windowWidth);
  if (y1 === null) y1 = random(windowHeight);

  let { angle, length, direction } = getLineProperties(img, y1);
  const x2 = x1 + cos(angle) * length;
  const y2 = y1 + sin(angle) * length;
  const color = img.get(x1, y1);
  const strokeWeight = random(strokeweightBase, strokeweightBase * 3);

  return new Line(x1, y1, x2, y2, color, strokeWeight, direction, speed);
}

// Set line properties based on position
function getLineProperties(img, y1) {
  let angle;
  let length;
  let direction = 1;

  if (img === Tower) {
    angle = PI / 2 + random(-PI / 5, PI / 5);
    direction = -1;
    length = random(50);
  } else {
    if (y1 > windowHeight * 0.3 && y1 < windowHeight * 0.6) {
      direction = -1;
    }
    if (y1 < windowHeight * 0.6) {
      angle = PI / 2 + random(-PI / 5, PI / 5);
    } else {
      angle = random(PI * 0.85, PI * 1.05);
    }
    length = random(lengthBase);
  }

  return { angle, length, direction };
}

// Draw static base for canvas
function drawBase(img) {
  img.resize(windowWidth, windowHeight);
  let graphics = createGraphics(windowWidth, windowHeight);
  graphics.clear();

  const numLines = 50000;
  for (let i = 0; i < numLines; i++) {
    let line = createLine(img);
    graphics.stroke(line.color);
    graphics.strokeWeight(line.strokeWeight);
    graphics.line(line.x1, line.y1, line.x2, line.y2);
  }

  return graphics;
}

// Add moving line
function addLine(img) {
  let line = createLine(img);
  lines.push(line);
}

// Resize canvas
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  backgroundBase = drawBase(Background);
  towerBase = drawBase(Tower);
  lines = [];
  redraw();
}

// Mouse click event
function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
  if (showText) {
    showText = false;
  } else {
    showText = true;
  }
}
