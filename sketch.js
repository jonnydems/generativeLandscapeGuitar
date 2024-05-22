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
let mic, fft;
let starDiameter;
let lightning = [];

function setup() {
  strokeWeight(2);
  frameRate(30);
  // Create a new audio input (microphone)
  mic = new p5.AudioIn();

  // Start the microphone
  mic.start();

  // Create a new FFT object with a smoothing factor
  fft = new p5.FFT(0.8, 1024);
  
  // Connect the FFT to the microphone input
  fft.setInput(mic);

  // Connect the microphone input to the master output
  mic.connect();

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
    let y = map(noise(noiseOffset3), 0, 1, height * 0.7, height * 0.85); // Adjust height for shorter mountains
    vertices3.push(createVector(xi, y));
    noiseOffset3 += noiseScale3;
  }
  vertices3.push(createVector(width, height)); // End at bottom-right corner
  
  // Random position for the moon
  moonX = random(width / 2, width - 200);
  moonY = random(100, height / 3);
  moonDiameter = random(100, 300);
  starDiameter = 2;
  
  // Generate random positions for stars
  for (let i = 0; i < 200; i++) {
    stars.push(createVector(random(width), random(height * 0.4)));
  }
}

function draw() {
  clear();


  
  // Getting frequency
  let spectrum = fft.analyze();
  
  let dominantFrequency = findDominantFrequency(spectrum);

  if (dominantFrequency >= 200 && dominantFrequency < 800) {
    starDiameter = dominantFrequency / 100;
  }

  amplitude = mic.getLevel();

      // Create lightning at random intervals
      if (amplitude > 0) {
        lightning = [];
        createLightning(width / 2, 0, width / 2, height / 4);
      }
    
      // Draw the lightning
      stroke(255, 255, 255, 200); // Set stroke to white with alpha for glow effect
      for (let i = 0; i < lightning.length; i++) {
        let bolt = lightning[i];
        line(bolt.x1, bolt.y1, bolt.x2, bolt.y2);
      }

  moonDiameter = map(amplitude, 0, 1, 100, 5000);

  // Draw gradient background from the graphics buffer
  image(gradient, 0, 0);
  
  // Draw stars
  fill(255); // White color for stars
  noStroke(); // No stroke for stars
  for (let i = 0; i < stars.length; i++) {
    // Check if the star's y-coordinate is below a certain threshold
    let d = dist(stars[i].x, stars[i].y, moonX, moonY);
    if (d > moonDiameter / 2 + 2) {
      ellipse(stars[i].x, stars[i].y, starDiameter, starDiameter); // Draw stars as small ellipses
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

  // Draw third mountain range
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

    // Update third mountain range
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
  vertices3 = vertices3.filter((vertex) => vertex.x >= -10);
  
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

function findDominantFrequency(spectrum) {
  let maxIndex = 0;
  let maxValue = 0;
  
  // Find the index of the maximum value in the spectrum array
  for (let i = 0; i < spectrum.length; i++) {
    if (spectrum[i] > maxValue) {
      maxValue = spectrum[i];
      maxIndex = i;
    }
  }
  
  // Convert the index to a frequency
  let nyquist = sampleRate() / 2;
  let frequency = map(maxIndex, 0, spectrum.length, 0, nyquist);
  
  return frequency;
} 

// Recursive function to create lightning
function createLightning(x1, y1, x2, y2) {
  lightning.push({ x1, y1, x2, y2 });

  if (y2 < height) {
    let nextX = x2 + random(-20, 20);
    let nextY = y2 + random(10, 30);

    createLightning(x2, y2, nextX, nextY);

    // Reduce the probability of branching
    if (random(1) < 0.1) {
      createLightning(x2, y2, x2 + random(-20, 20), y2 + random(10, 30));
    }
  }
}