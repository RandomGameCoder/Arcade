# ARCADE WEBSITE

This is a small project for the users to play some games.  

## Structure

The website mainly has 3 sections:  

- A home page
- A game gallery, and
- An about page.  

  
The home page is just to introduce the users to the website and the purpose.  
The about page specifies about me (RandomGameCoder), and the website.  
The gallery page will contain a list of games from which the user can select one and play.  

## Directory Structure

```
/
├── index.html         # Home page
├── gallery.html       # Game gallery page  
├── about.html         # About page
├── css/
│   └── style.css      # Main stylesheet
├── js/
│   ├── transitions.js # Page transition effects
│   └── components/    # UI components
│       ├── home-bg.js      # Home page background
│       └── gallery-arcade.js # Gallery arcade interface
├── assets/            # Images, 3D models, and other assets
│   ├── images/        # 2D images and textures
│   ├── models/        # 3D model files (.obj, .gltf, etc.)
│   └── sounds/        # Audio files for games and interface
└── games/             # Individual game files
```

## Using 3D Models

This project supports loading and displaying 3D models for a more immersive experience. The following model formats are supported:

- **OBJ (.obj)**: Simple 3D model format, supported natively by p5.js
- **GLTF/GLB (.gltf, .glb)**: More advanced format with animations, requires additional libraries

### How to Add 3D Models

1. Place your 3D model files in the `assets/models/` directory
2. Place associated textures in the `assets/images/` directory
3. Load the models in your JavaScript code using the p5.js `loadModel()` function or appropriate library

### Loading Example

```javascript
// In preload function
let myModel;
function preload() {
  // The second parameter (true) normalizes the model size
  myModel = loadModel('assets/models/my-model.obj', true);
}

// In draw function
function draw() {
  // Make sure you're using WEBGL for 3D rendering
  // createCanvas(800, 600, WEBGL); // in setup()
  
  // Render the model
  push();
  translate(0, 0, 0);
  rotateY(frameCount * 0.01);
  model(myModel);
  pop();
}
```

For more detailed examples and advanced usage, see the `js/3d-model-guide.js` file.

All of the games are made using p5 and the website is not run using any server.
