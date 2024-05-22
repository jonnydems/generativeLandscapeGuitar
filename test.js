
let mic, fft;
let spectrum = [];

function setup() {
  createCanvas(400, 400);
  
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  background(0);
  
  // Get the audio spectrum
  spectrum = fft.analyze();
  
  // Draw the visualizer
  let centerX = width / 2;
  let centerY = height / 2;
  let numPoints = spectrum.length / 2; // Only half the circle
  let angleStep = PI / numPoints;
  let radius = 150;
  
  beginShape();
  for (let i = 0; i < numPoints; i++) {
    let angle = i * angleStep;
    let x = centerX + cos(angle) * (radius + spectrum[i] * 0.5);
    let y = centerY + sin(angle) * (radius + spectrum[i] * 0.5);
    vertex(x, y);
  }
  // Mirroring the other half
  for (let i = numPoints - 1; i >= 0; i--) {
    let angle = i * angleStep;
    let x = centerX + cos(angle) * (radius + spectrum[i] * 0.5);
    let y = centerY - sin(angle) * (radius + spectrum[i] * 0.5); // Use negative sin
    vertex(x, y);
  }
  endShape(CLOSE);
}