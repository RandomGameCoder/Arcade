/**
 * Guide for Loading and Using 3D Models in p5.js
 * For Arcade Website
 * 
 * This file demonstrates different methods to load and use 3D models
 * in your p5.js-based games and interfaces.
 */

// =======================================================
// Method 1: Using p5.js built-in loadModel for OBJ files
// =======================================================

let arcadeMachine; // Variable to store the model

function preload() {
  // Load a 3D model in OBJ format
  // Models should be placed in the assets/models directory
  arcadeMachine = loadModel('assets/models/arcade-machine.obj', true);
  
  // The second parameter (true) normalizes the model size
  // Optional: You can also load a texture
  arcadeMachineTexture = loadImage('assets/images/arcade-texture.png');
}

function setup() {
  createCanvas(800, 600, WEBGL);
}

function draw() {
  background(0);
  
  // Set lighting
  ambientLight(100);
  directionalLight(255, 255, 255, 0, 0, -1);
  
  // Position and rotate model
  push();
  translate(0, 0, 0);
  scale(50); // Scale the model if needed
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  
  // Apply material properties
  normalMaterial(); // Simple material for testing
  // Or use texture:
  // texture(arcadeMachineTexture);
  
  // Draw the model
  model(arcadeMachine);
  pop();
}

// =======================================================
// Method 2: Loading GLTF/GLB models with external library
// =======================================================

/**
 * For more complex models in GLTF/GLB format, you'll need to include 
 * additional libraries. Add this to your HTML head before using:
 *
 * <script src="https://cdn.jsdelivr.net/npm/p5.glitch@latest/p5.glitch.js"></script>
 * OR
 * <script src="https://cdn.jsdelivr.net/npm/p5.3d@latest/p5.3d.js"></script>
 * OR
 * <script src="https://unpkg.com/three@0.126.1/build/three.min.js"></script>
 * <script src="https://unpkg.com/three-mesh-bvh@0.5.23/build/three-mesh-bvh.min.js"></script>
 * <script src="https://cdn.jsdelivr.net/npm/p5.glitch@latest/p5.glitch.js"></script>
 */

/* 
let gltfModel;

function preload() {
  // Load GLTF model (requires external library)
  gltfModel = loadGLTF('assets/models/character.glb');
}

function setup() {
  createCanvas(800, 600, WEBGL);
}

function draw() {
  background(0);
  
  // Set lighting
  ambientLight(100);
  directionalLight(255, 255, 255, 0, 0, -1);
  
  // Position and render the GLTF model
  push();
  translate(0, 50, 0);
  scale(100);
  rotateY(frameCount * 0.01);
  model(gltfModel);
  pop();
}
*/

// =======================================================
// Method 3: Programmatically creating 3D objects with p5.js
// =======================================================

function drawProgrammatic3D() {
  push();
  translate(-150, 0, 0);
  
  // Basic shapes available in p5.js WEBGL mode
  normalMaterial();
  
  push();
  translate(-100, 0, 0);
  box(50); // A cube
  pop();
  
  push();
  translate(0, 0, 0);
  sphere(30); // A sphere
  pop();
  
  push();
  translate(100, 0, 0);
  cylinder(20, 50); // A cylinder
  pop();
  
  pop();
}

// =======================================================
// Performance Tips for 3D Models
// =======================================================

/**
 * 1. Optimize your 3D models before importing:
 *    - Reduce polygon count
 *    - Use efficient UV mapping
 *    - Compress textures appropriately
 * 
 * 2. Implement level of detail (LOD):
 *    - Use simpler models when objects are far away
 *    - Only render detailed models when necessary
 * 
 * 3. Use object pooling:
 *    - Reuse 3D objects instead of creating new ones
 *    - Especially important for repeated elements
 * 
 * 4. Implement frustum culling:
 *    - Only render objects visible in the camera view
 * 
 * 5. Pre-load all assets:
 *    - Load models during loading screen
 *    - Avoid loading during gameplay
 */

// =======================================================
// Example: Implementing a basic 3D scene manager
// =======================================================

class SceneManager {
  constructor() {
    this.models = {};
    this.textures = {};
  }
  
  preloadAssets() {
    // Load all models in one place
    this.models.arcadeMachine = loadModel('assets/models/arcade.obj', true);
    this.models.character = loadModel('assets/models/character.obj', true);
    
    // Load all textures
    this.textures.arcadeMachine = loadImage('assets/images/arcade-texture.png');
    this.textures.character = loadImage('assets/images/character-texture.png');
  }
  
  drawArcadeMachine(x, y, z, rotationY) {
    push();
    translate(x, y, z);
    rotateY(rotationY);
    texture(this.textures.arcadeMachine);
    model(this.models.arcadeMachine);
    pop();
  }
  
  drawCharacter(x, y, z, animationFrame) {
    push();
    translate(x, y, z);
    texture(this.textures.character);
    model(this.models.character);
    // Apply animation logic here if needed
    pop();
  }
}

// Usage:
// let sceneManager = new SceneManager();
// function preload() { sceneManager.preloadAssets(); }
// In draw(): sceneManager.drawArcadeMachine(0, 0, 0, frameCount * 0.01);
