# Working with 3D Models in the Arcade Website

This guide explains how to add and use 3D models in your static website using p5.js.

## File Structure

All 3D assets are organized in the `assets` directory:

```
/assets
  /models      - 3D model files (.obj, .gltf, .glb)
  /images      - Texture images and 2D graphics
  /sounds      - Audio files
```

## Supported 3D Model Formats

- **OBJ (.obj)**: Basic 3D model format, supported natively by p5.js
- **GLTF/GLB (.gltf, .glb)**: More complex format with animations and materials (requires additional libraries)

## Adding 3D Models to Your Project

1. **Prepare your model**:
   - Create or download a 3D model
   - Optimize it for web (reduce polygon count, compress textures)
   - Export in OBJ or GLTF/GLB format

2. **Place files in the proper directories**:
   - Place 3D model files in `/assets/models/`
   - Place texture images in `/assets/images/`
   
3. **Update your code**:
   - Use the provided `model-loader.js` utility to load and manage your models
   - Or use p5.js's native `loadModel()` function

## Loading Models with the ModelLoader Utility

```javascript
const modelLoader = new Model3DLoader();

function preload() {
  modelLoader
    .addModel('arcade', 'assets/models/arcade.obj')
    .addTexture('arcadeTexture', 'assets/images/arcade-texture.png')
    .loadAll(() => console.log('All models loaded!'));
}

function draw() {
  // Check if still loading
  if (modelLoader.isLoading) {
    modelLoader.drawLoadingScreen(width/4, height/2, width/2, 20);
    return;
  }
  
  // Use the models
  push();
  translate(0, 0, 0);
  texture(modelLoader.getTexture('arcadeTexture'));
  model(modelLoader.getModel('arcade'));
  pop();
}
```

## Loading Models Directly with p5.js

```javascript
let arcadeModel;
let arcadeTexture;

function preload() {
  // The second parameter (true) normalizes the model size
  arcadeModel = loadModel('assets/models/arcade.obj', true);
  arcadeTexture = loadImage('assets/images/arcade-texture.png');
}

function setup() {
  createCanvas(800, 600, WEBGL);
}

function draw() {
  background(0);
  lights();
  
  push();
  texture(arcadeTexture);
  model(arcadeModel);
  pop();
}
```

## Using GLTF/GLB Models (Advanced)

To use GLTF/GLB models, you need to include additional libraries:

```html
<!-- In your HTML head -->
<script src="https://cdn.jsdelivr.net/npm/p5.3d@0.0.1/p5.3d.js"></script>
```

Then load and use the models:

```javascript
let character;

function preload() {
  // Using p5.3d extension
  character = loadGLTF('assets/models/character.glb');
}

function draw() {
  // Use the GLTF model with animations
  model(character);
}
```

## Performance Tips

1. **Optimize your models**:
   - Keep polygon counts low
   - Use efficient textures (power-of-two sizes)
   - Avoid complex materials when possible

2. **Use level of detail (LOD)**:
   - Show simpler models when far away
   - Only load detailed models when needed

3. **Implement frustum culling**:
   - Only render models visible in the camera view

4. **Preload all assets**:
   - Use loading screens
   - Don't load during gameplay

5. **Batch similar models**:
   - Group models that use the same material

## Example Files

- `js/model-loader.js`: Utility for loading and managing 3D models
- `js/3d-model-guide.js`: Examples and best practices
- `js/components/arcade-3d-example.js`: Implementation example

## Further Resources

- [p5.js 3D Reference](https://p5js.org/reference/#/p5/WEBGL)
- [Learn WEBGL](https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5)
- [Blender](https://www.blender.org/) - Free 3D modeling software
- [3D Model Repositories](https://sketchfab.com/features/free-3d-models)
