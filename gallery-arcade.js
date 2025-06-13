// 3D Arcade Machines Placeholder for Gallery Page
let machines = [];
let scrollOffset = 0;
let targetScrollOffset = 0;
let isDragging = false;
let lastMouseX = 0;
let lastTouchX = 0;
let canvas;

// Animation variables
let isEntering = false;
let isExiting = false;
let animationProgress = 0;
let entranceAnimationDuration = 120; // In frames (3 seconds at 60fps)
let exitAnimationDuration = 120; // In frames (2 seconds at 60fps)
let cameraStartZ = 1500; // Camera starts from far behind

// Neon sign variables
let neonSign = {
  text: "ARCADE GALLERY",
  x: 0,
  y: -800, // Start position (hidden above view)
  targetY: -350, // Final position when lowered
  width: 900,
  height: 150,
  visible: false, // Track visibility
  animating: false // Track if sign is currently animating
};

// Add a texture buffer for the neon sign text
let signTexture;

function setup() {
  // Create canvas inside the container
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent(document.querySelector('.canvas-container'));
  
  // Create texture for the sign text
  createSignTexture();
  
  // Create machines in a straight line
  machines = [];
  let count = 15;
  let spacing = 400;
  for (let i = 0; i < count; i++) {
    machines.push({
      x: (i - count/2) * spacing,
      y: 40,
      z: 0,
      w: 300,
      h: 450,
      d: 200
    });
  }
  
  // Start entrance animation
  startEnterAnimation();
  
  // Add event listener for page exit
  window.addEventListener('beforeunload', function() {
    startExitAnimation();
    // Delay the actual unload to show the animation
    if (isExiting && animationProgress < exitAnimationDuration/2) {
      return "Exiting...";
    }
  });
}

function createSignTexture() {
  // Create a graphics buffer for the sign text
  signTexture = createGraphics(900, 150);
  signTexture.background(30, 30, 40);
  
  // Draw text onto the buffer
  signTexture.textSize(70);
  signTexture.textAlign(CENTER, CENTER);
  signTexture.textFont('Arial');
  signTexture.textStyle(BOLD);
  
  // Create glow effect
  for (let i = 10; i > 0; i--) {
    signTexture.fill(0, 255, 240, 255 / (i * 2));
    signTexture.text(neonSign.text, signTexture.width/2, signTexture.height/2);
  }
  
  // Main text
  signTexture.fill(220, 255, 255);
  signTexture.text(neonSign.text, signTexture.width/2, signTexture.height/2);
}

function startEnterAnimation() {
  isEntering = true;
  isExiting = false;
  animationProgress = 0;
  // Initialize camera position for entrance
  scrollOffset = 0;
  cameraZ = cameraStartZ;
}

function startExitAnimation() {
  isExiting = true;
  isEntering = false;
  animationProgress = 0;
}

// Variables for camera position
let cameraZ = 600; // Default camera Z position

function draw() {
  background('#10131a');
  
  // Handle animations
  if (isEntering) {
    handleEntranceAnimation();
  } else if (isExiting) {
    handleExitAnimation();
  }
  
  // Update neon sign position
  updateNeonSign();
  
  // Smooth scrolling
  scrollOffset = lerp(scrollOffset, targetScrollOffset, 0.08);
  
  // Camera setup - with animated Z position
  camera(scrollOffset, -200, cameraZ, scrollOffset, 0, 0, 0, 1, 0);
  
  // Lighting
  ambientLight(120);
  directionalLight(255, 255, 255, 0, 0.5, -1);
  pointLight(150, 150, 255, scrollOffset, -300, 400);
  
  // Draw neon sign only if visible
  if (neonSign.visible) {
    drawNeonSign();
  }
  
  // Draw machines in a line with infinite scrolling
  for (let i = 0; i < machines.length; i++) {
    push();
    let m = machines[i];
    translate(m.x, m.y, m.z);
    
    drawArcadeMachine();
    pop();
    
    // Infinite scrolling effect
    let totalWidth = machines.length * 400;
    if (m.x + 200 < scrollOffset - width) {
      m.x += totalWidth;
    }
    if (m.x - 200 > scrollOffset + width) {
      m.x -= totalWidth;
    }
  }
}

function handleEntranceAnimation() {
  animationProgress++;
  
  if (animationProgress <= entranceAnimationDuration) {
    // Animate camera moving forward from far behind
    cameraZ = map(animationProgress, 0, entranceAnimationDuration, cameraStartZ, 800);
    
    // End animation when complete
    if (animationProgress >= entranceAnimationDuration) {
      isEntering = false;
      // Start the sign animation after camera reaches destination
      startSignAnimation();
    }
  }
}

function startSignAnimation() {
  neonSign.visible = true;
  neonSign.animating = true;
  neonSign.y = -800; // Start from off-screen
}

// Update neon sign position in the draw function
function updateNeonSign() {
  // Only animate if sign is visible and animating
  if (neonSign.visible && neonSign.animating) {
    // Animate sign lowering down
    neonSign.y = lerp(neonSign.y, neonSign.targetY, 0.05);
    
    // Stop animation when close enough to target
    if (Math.abs(neonSign.y - neonSign.targetY) < 5) {
      neonSign.animating = false;
      neonSign.y = neonSign.targetY;
    }
  }
}

function handleExitAnimation() {
  animationProgress++;
  
  if (animationProgress <= exitAnimationDuration) {
    // Animate camera moving backward
    cameraZ = map(animationProgress, 0, exitAnimationDuration, 600, cameraStartZ);
    
    // Hide the sign when exiting
    if (animationProgress > exitAnimationDuration * 0.3) {
      neonSign.visible = false;
    }
    
    // End animation when complete
    if (animationProgress >= exitAnimationDuration) {
      isExiting = false;
    }
  }
}

function drawNeonSign() {
  push();
  translate(scrollOffset, neonSign.y, -100);
  
  // Draw chains/wires holding the sign
  stroke(180);
  strokeWeight(3);
  line(-neonSign.width/2 + 50, 0, -neonSign.width/2 + 50, -200);
  line(neonSign.width/2 - 50, 0, neonSign.width/2 - 50, -200);
  
  // Draw sign backing
  noStroke();
  fill(30, 30, 40);
  box(neonSign.width, neonSign.height, 20);
  
  // Draw sign with text texture
  push();
  translate(0, 0, 11); // Position it in front of the sign backing
  texture(signTexture);
  noStroke();
  plane(neonSign.width, neonSign.height);
  pop();
  
  // Add outer glow effect to the whole sign
  push();
  translate(0, 0, 15);
  noStroke();
  fill(0, 255, 240, 20);
  plane(neonSign.width + 20, neonSign.height + 20);
  pop();
  
  pop(); // End sign group
}

function drawArcadeMachine() {
  // Main body - massive size for packed feeling
  fill('#23263a');
  box(300, 450, 200);
  
  // Screen - massive
  push();
  translate(0, -100, 101);
  fill('#000000');
  box(220, 150, 10);
  
  // Add screen glow effect
  push();
  translate(0, 0, 2);
  fill(0, 191, 174, 30);
  box(230, 160, 1);
  pop();
  pop();
  
  // Marquee - massive
  push();
  translate(0, -225, 96);
  fill('#1a1d2e');
  box(220, 60, 25);
  
  // Add marquee glow
  push();
  translate(0, 0, 15);
  fill(0, 191, 174, 50);
  box(230, 70, 5);
  pop();
  pop();
  
  // Controls - massive
  push();
  translate(0, 100, 101);
  fill('#e0e0e0');
  box(150, 40, 10);
  pop();
  
  // Joystick - massive
  push();
  translate(-45, 120, 108);
  fill('#ff0055');
  sphere(18);
  
  // Joystick base
  push();
  translate(0, 8, -8);
  fill('#333');
  cylinder(25, 10);
  pop();
  pop();
  
  // Buttons - massive
  for (let i = 0; i < 4; i++) {
    push();
    translate(20 + i*30, 120, 108);
    fill(i % 2 ? '#00bfae' : '#ff0055');
    sphere(12);
    pop();
  }
  
  // Side panels for more detail
  push();
  translate(-152, 0, 0);
  fill('#1a1d2e');
  box(4, 450, 180);
  pop();
  
  push();
  translate(152, 0, 0);
  fill('#1a1d2e');
  box(4, 450, 180);
  pop();
}

// Mouse interaction
function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
}

function mouseDragged() {
  if (isDragging) {
    let deltaX = mouseX - lastMouseX;
    targetScrollOffset -= deltaX * 2;
    lastMouseX = mouseX;
  }
}

function mouseReleased() {
  isDragging = false;
}

function mouseWheel(event) {
  targetScrollOffset += event.delta * 3;
  return false;
}

// Touch interaction for mobile devices
function touchStarted() {
  if (touches.length === 1) {
    isDragging = true;
    lastTouchX = touches[0].x;
  }
  return false;
}

function touchMoved() {
  if (isDragging && touches.length === 1) {
    let deltaX = touches[0].x - lastTouchX;
    targetScrollOffset -= deltaX * 2;
    lastTouchX = touches[0].x;
  }
  return false;
}

function touchEnded() {
  isDragging = false;
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
