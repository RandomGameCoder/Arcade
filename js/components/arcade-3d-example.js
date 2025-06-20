/**
 * Example: Loading a 3D model of an arcade machine
 * 
 * This file demonstrates how to load and display a 3D model
 * of an arcade machine for the gallery page. Place this file
 * in js/components/ and include it in your gallery.html
 */

// Create a model loader instance
const modelLoader = new Model3DLoader();
let cameraAngle = 0;
let arcadeMachines = [];

// Define the arcade machine positions
function setupArcadeMachines() {
  // Parameters for circular arrangement
  const radius = 400;
  const count = 5; // Number of machines
  
  for (let i = 0; i < count; i++) {
    // Calculate position on a circle
    const angle = (TWO_PI / count) * i;
    const x = radius * sin(angle);
    const z = radius * cos(angle);
    
    arcadeMachines.push({
      x: x,
      y: 0,
      z: z,
      rotationY: angle + PI, // Make them face the center
      scale: 50,
      modelName: 'arcadeMachine',
      textureName: 'arcadeMachineTexture',
      gameTitle: `Game ${i + 1}`,
      selected: false
    });
  }
}

// Preload assets
function preload() {
  // Add models and textures to load
  modelLoader
    .addModel('arcadeMachine', 'assets/models/arcade-machine.obj', true)
    .addTexture('arcadeMachineTexture', 'assets/images/arcade-texture.png')
    .addTexture('screenTexture', 'assets/images/game-screen.png');
    
  // Start loading
  modelLoader.loadAll(() => {
    console.log('All arcade models loaded!');
    setupArcadeMachines();
  });
}

function setup() {
  // Create a canvas that fills the container
  const container = document.querySelector('.canvas-container');
  const canvas = createCanvas(container.offsetWidth, container.offsetHeight, WEBGL);
  canvas.parent(container);
  
  // Set camera angle
  cameraAngle = 0;
  
  // Handle window resize
  window.addEventListener('resize', () => {
    resizeCanvas(container.offsetWidth, container.offsetHeight);
  });
}

function draw() {
  // Clear the background
  background('#10131a');
  
  // If assets are still loading, show loading screen
  if (modelLoader.isLoading) {
    // Center the loading bar
    modelLoader.drawLoadingScreen(
      -width/4, 0, width/2, 20
    );
    return;
  }
  
  // Set lighting
  ambientLight(60);
  pointLight(255, 255, 255, 0, -200, 0);
  directionalLight(255, 255, 200, 0, -1, -1);
  
  // Set camera position
  camera(
    500 * sin(cameraAngle), 
    -200, // Slightly above looking down
    500 * cos(cameraAngle), 
    0, 0, 0, // Look at center
    0, 1, 0  // Up vector
  );
  
  // Slowly rotate camera
  cameraAngle += 0.002;
  
  // Draw floor
  push();
  translate(0, 150, 0);
  rotateX(HALF_PI);
  fill(30, 30, 40);
  noStroke();
  plane(1200, 1200);
  pop();
  
  // Draw arcade machines
  for (let machine of arcadeMachines) {
    push();
    translate(machine.x, machine.y, machine.z);
    rotateY(machine.rotationY);
    scale(machine.scale);
    
    // Highlight selected machine
    if (machine.selected) {
      // Add glow effect
      ambientLight(0, 191, 174); // Cyan glow for selected machine
      scale(1.05); // Make it slightly larger
    }
    
    // Draw the model
    if (modelLoader.getModel('arcadeMachine')) {
      texture(modelLoader.getTexture('arcadeMachineTexture'));
      model(modelLoader.getModel('arcadeMachine'));
      
      // Add screen texture to the model
      push();
      // Adjust these values to position the screen on your model
      translate(0, -0.5, 0.6); 
      rotateX(0.1);
      plane(0.8, 0.6);
      pop();
    }
    
    // Add text above machine
    push();
    translate(0, -100, 0);
    rotateY(-machine.rotationY); // Counter-rotate so text faces camera
    textSize(20);
    textAlign(CENTER, CENTER);
    fill(255);
    text(machine.gameTitle, 0, 0);
    pop();
    
    pop();
  }
  
  // Draw title
  push();
  translate(0, -350, 0);
  rotateY(-cameraAngle); // Make title always face camera
  textSize(40);
  textAlign(CENTER, CENTER);
  fill('#00bfae');
  text("ARCADE GALLERY", 0, 0);
  textSize(20);
  fill(200);
  text("Select a game to play", 0, 50);
  pop();
}

// Handle clicks to select a machine
function mouseClicked() {
  if (modelLoader.isLoading) return;
  
  // Set all machines as not selected
  for (let machine of arcadeMachines) {
    machine.selected = false;
  }
  
  // Implement proper ray casting or color picking for production
  // This is simplified for demonstration
  
  // For now, just select one randomly on click as placeholder
  const randomIndex = floor(random(arcadeMachines.length));
  arcadeMachines[randomIndex].selected = true;
}

// Note: In a real implementation, you'd need more sophisticated
// intersection testing or ray casting for proper 3D selection
