let noiseOffset = .1;
let noiseScale = 0.06; // Increase the noise scale for bigger mountains
let vertices = [];
let vertices2 = [];
let bgTop;
let bgBottom;
let gradient;
let fX;
let byTen = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgTop = color(random(255), random(255), random(255));
  bgBottom = color(red(bgTop) + 150, green(bgTop) + 150, blue(bgTop) + 150);
  
  gradient = createGraphics(width, height);
  setGradient(gradient, 0, 0, width, height, bgTop, bgBottom);
  
  fill(75, 75, 75, 170); // Gray color for mountains
  vertices.push(createVector(0, height)); // Start from bottom-left corner
  
  for (let xi = 0; xi <= width; xi += 10) {
    let y = map(noise(noiseOffset), 0, 1, height * 0.4, height * 0.8);
    vertices.push(createVector(xi, y));
    noiseOffset += noiseScale;
  }
  
  vertices.push(createVector(width, height)); // End at bottom-right corner
}

function draw() {

  clear();
  
  // Draw gradient background from the graphics buffer
  image(gradient, 0, 0);
  
  // Draw mountain shape after each frame
  noStroke();
  beginShape();
  for (let i = 0; i < vertices.length; i++) {
    let v = vertices[i];
    vertex(v.x, v.y);
    fX = v.x
    v.x -= 1;
  }
  endShape(CLOSE);

  // Adding a new vertex to draw
  if ((byTen % 10) == 0) {
    vertices.pop();
    y = map(noise(noiseOffset), 0, 1, height * 0.4, height * 0.8);
    vertices.push(createVector(fX, y));
    vertices.push(createVector(width+18 , height));
    noiseOffset += noiseScale;
  }

  // Increment
  fX += 1;
  byTen += 1;

  vertices = vertices.filter((vertex) => vertex.x >= -10);
  vertices.unshift(createVector(0, height));
  console.log(vertices);
}

function setGradient(gra, x, y, w, h, c1, c2) {
  gra.noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    gra.stroke(c);
    gra.line(x, i, x + w, i);
  }
}
