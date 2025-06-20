/**
 * 3D Model Loader Utility for Arcade Website
 * 
 * A lightweight utility for handling 3D models in p5.js projects.
 * Include this file in your HTML after p5.js and before your game scripts.
 */

class Model3DLoader {
  constructor() {
    this.models = {};
    this.textures = {};
    this.isLoading = false;
    this.loadingProgress = 0;
    this.totalAssets = 0;
    this.loadedAssets = 0;
  }

  /**
   * Add a model to the loading queue
   * @param {string} name - Reference name for the model
   * @param {string} path - Path to the model file (relative to index.html)
   * @param {boolean} normalize - Whether to normalize the model size
   */
  addModel(name, path, normalize = true) {
    this.totalAssets++;
    this.models[name] = {
      path: path,
      normalize: normalize,
      loaded: false,
      model: null
    };
    return this;
  }

  /**
   * Add a texture to the loading queue
   * @param {string} name - Reference name for the texture
   * @param {string} path - Path to the texture image
   */
  addTexture(name, path) {
    this.totalAssets++;
    this.textures[name] = {
      path: path,
      loaded: false,
      texture: null
    };
    return this;
  }

  /**
   * Load all queued assets
   * @param {Function} callback - Function to call when all assets are loaded
   */
  loadAll(callback) {
    this.isLoading = true;
    this.callback = callback || function() {};
    
    // Load models
    for (let name in this.models) {
      const modelData = this.models[name];
      loadModel(
        modelData.path, 
        modelData.normalize,
        // Success callback
        (model) => {
          this.models[name].model = model;
          this.models[name].loaded = true;
          this.loadedAssets++;
          this.updateProgress();
        },
        // Error callback
        (error) => {
          console.error(`Failed to load model ${name} from ${modelData.path}:`, error);
          this.loadedAssets++; // Count as loaded even if failed
          this.updateProgress();
        }
      );
    }
    
    // Load textures
    for (let name in this.textures) {
      const textureData = this.textures[name];
      loadImage(
        textureData.path,
        // Success callback
        (img) => {
          this.textures[name].texture = img;
          this.textures[name].loaded = true;
          this.loadedAssets++;
          this.updateProgress();
        },
        // Error callback
        (error) => {
          console.error(`Failed to load texture ${name} from ${textureData.path}:`, error);
          this.loadedAssets++; // Count as loaded even if failed
          this.updateProgress();
        }
      );
    }
    
    // Handle the case where there are no assets to load
    if (this.totalAssets === 0) {
      this.isLoading = false;
      this.loadingProgress = 1;
      this.callback();
    }
  }
  
  /**
   * Update the loading progress and call the callback if all assets are loaded
   * @private
   */
  updateProgress() {
    this.loadingProgress = this.loadedAssets / this.totalAssets;
    
    if (this.loadedAssets >= this.totalAssets) {
      this.isLoading = false;
      this.callback();
    }
  }
  
  /**
   * Get a loaded model
   * @param {string} name - The name of the model to retrieve
   * @returns {Object} The loaded p5.js 3D model
   */
  getModel(name) {
    if (!this.models[name] || !this.models[name].loaded) {
      console.warn(`Model ${name} not found or not loaded yet.`);
      return null;
    }
    return this.models[name].model;
  }
  
  /**
   * Get a loaded texture
   * @param {string} name - The name of the texture to retrieve
   * @returns {Object} The loaded p5.js image/texture
   */
  getTexture(name) {
    if (!this.textures[name] || !this.textures[name].loaded) {
      console.warn(`Texture ${name} not found or not loaded yet.`);
      return null;
    }
    return this.textures[name].texture;
  }
  
  /**
   * Draw a loading screen
   * @param {number} x - X position for the progress bar
   * @param {number} y - Y position for the progress bar
   * @param {number} w - Width of the progress bar
   * @param {number} h - Height of the progress bar
   */
  drawLoadingScreen(x, y, w, h) {
    push();
    // Draw background
    fill(30);
    noStroke();
    rect(x, y, w, h);
    
    // Draw progress bar
    fill(0, 191, 174); // Arcade theme color
    rect(x, y, w * this.loadingProgress, h);
    
    // Draw text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(`Loading Assets: ${Math.floor(this.loadingProgress * 100)}%`, x + w/2, y + h/2);
    pop();
  }
}

// Example usage:
/*
const modelLoader = new Model3DLoader();

function preload() {
  // Queue up models and textures to load
  modelLoader
    .addModel('arcade', 'assets/models/arcade.obj')
    .addModel('character', 'assets/models/character.obj')
    .addTexture('arcadeTexture', 'assets/images/arcade-texture.png');
    
  // Start loading
  modelLoader.loadAll(() => {
    console.log('All 3D assets loaded!');
  });
}

function draw() {
  if (modelLoader.isLoading) {
    // Draw loading screen
    modelLoader.drawLoadingScreen(width/4, height/2, width/2, 20);
    return;
  }
  
  // Draw game content using the loaded models
  push();
  texture(modelLoader.getTexture('arcadeTexture'));
  model(modelLoader.getModel('arcade'));
  pop();
}
*/
