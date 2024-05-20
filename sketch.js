let mic, fft;

function setup() {
  createCanvas(800, 400);
  
  // Create a new audio input (microphone)
  mic = new p5.AudioIn();
  
  // Start the microphone
  mic.start();
  
  // Create a new FFT object with a smoothing factor
  fft = new p5.FFT(0.8, 1024);
  
  // Connect the FFT to the microphone input
  fft.setInput(mic);
}

function draw() {
  background(0);
  
  // Get the frequency spectrum from the FFT object
  let spectrum = fft.analyze();
  
  noStroke();
  fill(0, 255, 0); // Green color for the frequency bars
  
  // Loop through the spectrum array and draw the frequency bars
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h);
  }
  
  // Determine the dominant frequency
  let dominantFrequency = findDominantFrequency(spectrum);
  
  // Perform actions based on frequency
  if (dominantFrequency < 125) {
    // Low frequency action
    fill(0, 0, 255); // Blue
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Low Frequency', width / 2, height / 2);
  } else if (dominantFrequency >= 125 && dominantFrequency < 250) {
    // Medium-low frequency action
    fill(0, 128, 255); // Light blue
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Medium-Low Frequency', width / 2, height / 2);
  } else if (dominantFrequency >= 250 && dominantFrequency < 500) {
    // Medium frequency action
    fill(0, 255, 255); // Cyan
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Medium Frequency', width / 2, height / 2);
  } else if (dominantFrequency >= 500 && dominantFrequency < 1000) {
    // Medium-high frequency action
    fill(255, 128, 0); // Orange
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Medium-High Frequency', width / 2, height / 2);
  } else {
    // High frequency action
    fill(255, 0, 0); // Red
    textSize(32);
    textAlign(CENTER, CENTER);
    text('High Frequency', width / 2, height / 2);
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
