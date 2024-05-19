let noiseOffset1 = 5; // Offset for the first mountain range
let noiseOffset2 = 9; // Offset for the second mountain range
let noiseOffset3 = 15; // Offset for the second mountain range
let noiseScale1 = 0.1; // Noise scale for the first mountain range
let noiseScale2 = 0.04; // Noise scale for the second mountain range
let noiseScale3 = 0.04; // Noise scale for the second mountain range
let vertices1 = []; // Vertices for the first mountain range
let vertices2 = []; // Vertices for the second mountain range
let vertices3 = []; // Vertices for the second mountain range
let bgTop;
let bgBottom;
let gradient;
let fX1; // x-coordinate for the first mountain range
let fX2; // x-coordinate for the second mountain range
let fX3; // x-coordinate for the second mountain range
let byTen = 0;
let moonX;
let moonY;
let moonDiameter;
let stars = []; // Array to store star positions

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgTop = color(random(0, 100), random(0, 100), random(0, 100));
  bgBottom = color(red(bgTop) + 150, green(bgTop) + 150, blue(bgTop) + 150);
  
  gradient = createGraphics(width, height);
  setGradient(gradient, 0, 0, width, height, bgTop, bgBottom);
  
  // Initialize vertices for the first mountain range
  vertices1.push(createVector(0, height)); // Start from bottom-left corner
  for (let xi = 0; xi <= width; xi += 10) {
    let y = map(noise(noiseOffset1), 0, 1, height * 0.4, height * 0.6); // Adjust height for shorter mountains
    vertices1.push(createVector(xi, y));
    noiseOffset1 += noiseScale1;
  }
  vertices1.push(createVector(width, height)); // End at bottom-right corner
  
  // Initialize vertices for the second mountain range
  vertices2.push(createVector(0, height)); // Start from bottom-left corner
  for (let xi = 0; xi <= width; xi += 10) {
    let y = map(noise(noiseOffset2), 0, 1, height * 0.5, height * 0.7); // Adjust height for shorter mountains
    vertices2.push(createVector(xi, y));
    noiseOffset2 += noiseScale2;
  }
  vertices2.push(createVector(width, height)); // End at bottom-right corner

  // Initialize vertices for the third mountain range
  vertices3.push(createVector(0, height)); // Start from bottom-left corner
  for (let xi = 0; xi <= width; xi += 10) {
    let y = map(noise(noiseOffset2), 0, 1, height * 0.7, height * 0.85); // Adjust height for shorter mountains
    vertices3.push(createVector(xi, y));
    noiseOffset3 += noiseScale3;
  }
  vertices3.push(createVector(width, height)); // End at bottom-right corner
  
  // Random position for the moon
  moonX = random(width / 2, width - 200);
  moonY = random(100, height / 3);
  moonDiameter = random(100, 300);
  
  // Generate random positions for stars
  for (let i = 0; i < 200; i++) {
    stars.push(createVector(random(width), random(height*0.4)));
  }
}

function draw() {
  clear();
  
  // Draw gradient background from the graphics buffer
  image(gradient, 0, 0);
  
  // Draw stars
  fill(255); // White color for stars
  noStroke(); // No stroke for stars
  for (let i = 0; i < stars.length; i++) {
    // Check if the star's y-coordinate is below a certain threshold
    let d = dist(stars[i].x, stars[i].y, moonX, moonY);
    if (d > moonDiameter / 2 + 2) {
      ellipse(stars[i].x, stars[i].y, 2, 2); // Draw stars as small ellipses
    }
  }
  
  // Draw the moon
  fill(255, 255, 255, 100); // White color with transparency
  ellipse(moonX, moonY, moonDiameter, moonDiameter); // Positioned randomly with a diameter of 100 pixels
  
  fill(75, 75, 75, 170);
  // Draw first mountain range
  noStroke();
  beginShape();
  for (let i = 0; i < vertices1.length; i++) {
    let v = vertices1[i];
    vertex(v.x, v.y);
    fX1 = v.x;
    v.x -= 1;
  }
  endShape(CLOSE);
  
  // Draw second mountain range
  beginShape();
  for (let i = 0; i < vertices2.length; i++) {
    let v = vertices2[i];
    vertex(v.x, v.y);
    fX2 = v.x;
    v.x -= 1;
  }
  endShape(CLOSE);

  // Draw second mountain range
  beginShape();
  for (let i = 0; i < vertices3.length; i++) {
    let v = vertices3[i];
    vertex(v.x, v.y);
    fX3 = v.x;
    v.x -= 1;
  }
  endShape(CLOSE);

  // Adding a new vertex to the mountain ranges
  if ((byTen % 10) == 0) {
    // Update first mountain range
    vertices1.pop();
    let y1 = map(noise(noiseOffset1), 0, 1, height * 0.4, height * 0.6); // Adjust height for shorter mountains
    vertices1.push(createVector(fX1, y1));
    vertices1.push(createVector(width + 18, height));
    noiseOffset1 += noiseScale1;
    
    // Update second mountain range
    vertices2.pop();
    let y2 = map(noise(noiseOffset2), 0, 1, height * 0.5, height * 0.7); // Adjust height for shorter mountains
    vertices2.push(createVector(fX2, y2));
    vertices2.push(createVector(width + 18, height));
    noiseOffset2 += noiseScale2;

    // Update second mountain range
    vertices3.pop();
    let y3 = map(noise(noiseOffset3), 0, 1, height * 0.7, height * 0.85); // Adjust height for shorter mountains
    vertices3.push(createVector(fX3, y3));
    vertices3.push(createVector(width + 18, height));
    noiseOffset3 += noiseScale3;
  }

  // Increment
  fX1 += 1;
  fX2 += 1;
  fX3 += 1;
  byTen += 1;

  // Filter vertices to remove those out of the visible area
  vertices1 = vertices1.filter((vertex) => vertex.x >= -10);
  vertices2 = vertices2.filter((vertex) => vertex.x >= -10);
  vertices3 = vertices2.filter((vertex) => vertex.x >= -10);
  
  // Add new vertices at the beginning to maintain continuity
  vertices1.unshift(createVector(0, height));
  vertices2.unshift(createVector(0, height));
  vertices3.unshift(createVector(0, height));
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