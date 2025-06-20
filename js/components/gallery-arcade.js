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
  animating: false, // Track if sign is currently animating
  tiltAngle: 0, // Current tilt angle in degrees
  targetTiltAngle: 8, // Smaller tilt angle
  tiltAnimating: false, // Track if tilt animation is happening
  loweringComplete: false, // Track if lowering animation is complete
  wobblePhase: 0, // For wobble effect
  glitching: false, // Track if text is glitching
  glitchTimer: 0, // Timer for glitch effect
  lastGlitchTime: 0, // Last time a glitch occurred
  isBeingFixed: false, // Whether user is currently fixing the sign
  isFixed: false, // Whether the sign has been fixed
  achievementShown: false, // Whether the achievement has been displayed
  isHovered: false // Track if the sign is being hovered over
};

// Add achievement display
let achievement = {
  visible: false,
  text: "ACHIEVEMENT UNLOCKED: THE FIXER",
  description: "You fixed the tilted arcade sign!",
  showTime: 0,
  duration: 180 // Show for 3 seconds (60fps)
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

// Function to draw glitched text - move this before createSignTexture function
function drawGlitchedText() {
  // Create base text first
  signTexture.fill(200, 255, 255);
  signTexture.text(neonSign.text, signTexture.width/2, signTexture.height/2);
  
  // Add glitch effects
  // 1. Random color channels
  signTexture.push();
  signTexture.blendMode(DIFFERENCE);
  signTexture.fill(random(100, 255), random(100, 255), random(100, 255));
  
  // Offset text slightly
  let offsetX = random(-10, 10);
  let offsetY = random(-5, 5);
  signTexture.text(neonSign.text, signTexture.width/2 + offsetX, signTexture.height/2 + offsetY);
  signTexture.pop();
  
  // 2. Add random blocks of static
  signTexture.noStroke();
  for (let i = 0; i < 20; i++) {
    let x = random(signTexture.width);
    let y = random(signTexture.height);
    let w = random(5, 100);
    let h = random(2, 10);
    signTexture.fill(200, 255, 255, random(50, 150));
    signTexture.rect(x, y, w, h);
  }
  
  // 3. Sometimes add character corruption
  if (random() > 0.5) {
    let glitchText = "";
    for (let i = 0; i < neonSign.text.length; i++) {
      if (random() > 0.7) {
        // Replace with a random character
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        glitchText += chars.charAt(floor(random(chars.length)));
      } else {
        glitchText += neonSign.text.charAt(i);
      }
    }
    
    signTexture.fill(255, 100, 100);
    signTexture.text(glitchText, signTexture.width/2, signTexture.height/2);
  }
  
  // Add horizontal glitch lines
  for (let i = 0; i < 5; i++) {
    let y = random(signTexture.height);
    let h = random(2, 8);
    signTexture.fill(200, 255, 255, 200);
    signTexture.rect(0, y, signTexture.width, h);
  }
}

function createSignTexture() {
  // Create a graphics buffer for the sign text
  signTexture = createGraphics(900, 150);
  signTexture.background(20, 20, 30); // Darker background for digital display
  
  // Draw text onto the buffer with a more digital font
  signTexture.textSize(70);
  signTexture.textAlign(CENTER, CENTER);
  
  // Use a more digital-looking font rendering technique
  signTexture.textFont('Courier New');
  signTexture.textStyle(BOLD);
  
  // Check if we should apply glitch effect
  if (neonSign.glitching) {
    drawGlitchedText();
  } else {
    // Normal text rendering with pixelated style
    let pixelSize = 3;
    let charSpacing = 44; // Space between characters
    let startX = signTexture.width/2 - (neonSign.text.length * charSpacing)/2;
    
    // For each character, draw it with a digital/pixel effect
    for(let i = 0; i < neonSign.text.length; i++) {
      let char = neonSign.text.charAt(i);
      let charX = startX + i * charSpacing;
      
      // Draw glow effect for digital look
      for (let g = 6; g > 0; g--) {
        signTexture.fill(0, 180 + g*10, 255, 255 / (g * 2));
        // Draw pixelated version with slight offsets for digital feel
        drawDigitalChar(char, charX, signTexture.height/2, pixelSize, g);
      }
      
      // Main character
      signTexture.fill(200, 255, 255);
      drawDigitalChar(char, charX, signTexture.height/2, pixelSize, 0);
    }
  }
  
  // Add digital scan lines
  signTexture.stroke(200, 255, 255, 20);
  signTexture.strokeWeight(1);
  for (let y = 0; y < signTexture.height; y += 4) {
    signTexture.line(0, y, signTexture.width, y);
  }
}

// Helper function to draw pixelated characters
function drawDigitalChar(char, x, y, pixelSize, glowOffset) {
  // Draw the character in a normal font first
  signTexture.push();
  signTexture.textAlign(CENTER, CENTER);
  
  // If it's a space, just skip drawing
  if (char === ' ') {
    signTexture.pop();
    return;
  }
  
  // Add a slight random offset for digital character stability effect
  let xOffset = random(-1, 1) * glowOffset * 0.2;
  let yOffset = random(-1, 1) * glowOffset * 0.2;
  
  signTexture.text(char, x + xOffset, y + yOffset);
  signTexture.pop();
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

// Add this function before the draw() function
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

// Add the updateNeonSign function before the draw() function
function updateNeonSign() {
  // Only animate if sign is visible and animating
  if (neonSign.visible && neonSign.animating) {
    // Animate sign lowering down
    neonSign.y = lerp(neonSign.y, neonSign.targetY, 0.05);
    
    // Stop lowering animation when close enough to target
    if (Math.abs(neonSign.y - neonSign.targetY) < 5) {
      neonSign.animating = false;
      neonSign.y = neonSign.targetY;
      neonSign.loweringComplete = true;
      
      // Start tilt animation after lowering is complete
      neonSign.tiltAnimating = true;
    }
  }
  
  // Handle tilt animation after lowering is complete
  if (neonSign.loweringComplete && neonSign.tiltAnimating) {
    // Create a smoother tilting motion with wobble
    if (Math.abs(neonSign.tiltAngle) < Math.abs(neonSign.targetTiltAngle) * 0.8) {
      // Use easing for initial tilt to reduce jitter
      let targetProgress = neonSign.targetTiltAngle * 0.8;
      let currentDiff = targetProgress - neonSign.tiltAngle;
      neonSign.tiltAngle += currentDiff * 0.15; // Slower, smoother approach
    } else {
      // Add wobble effect to make it seem unstable, but with smaller amplitude
      neonSign.wobblePhase += 0.08; // Slower wobble
      let wobble = sin(neonSign.wobblePhase) * 1.5; // Reduced amplitude
      neonSign.tiltAngle = neonSign.targetTiltAngle + wobble;
      
      // Occasionally add a subtle jolt for dramatic effect
      if (frameCount % 180 === 0) { // Less frequent jolts
        neonSign.tiltAngle += (random(-1, 1) > 0) ? 2 : -2; // Smaller jolts
      }
      
      // Stop tilt animation after a while but keep wobbling slightly
      if (frameCount % 300 === 0) {
        neonSign.tiltAnimating = false;
        // But keep a small wobble effect permanently
        neonSign.targetTiltAngle = 6; // Final resting angle (was 12)
      }
    }
  } else if (neonSign.loweringComplete && !neonSign.tiltAnimating) {
    // Keep a slight wobble even after main animation is done
    neonSign.wobblePhase += 0.03;
    neonSign.tiltAngle = neonSign.targetTiltAngle + sin(neonSign.wobblePhase) * 1.2;
  }
}

function startSignAnimation() {
  neonSign.visible = true;
  neonSign.animating = true;
  neonSign.y = -800; // Start from off-screen
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
    // Check if mouse is over the sign for hover effect
    updateSignInteraction();
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
  
  // Check if it's time for a glitch
  if (neonSign.loweringComplete && frameCount > neonSign.lastGlitchTime + 120 && random() > 0.99) {
    // Start a new glitch
    neonSign.glitching = true;
    neonSign.glitchTimer = 0;
    neonSign.lastGlitchTime = frameCount;
    createSignTexture(); // Update the texture with glitch effect
  }
  
  // Update glitch timer if glitching
  if (neonSign.glitching) {
    neonSign.glitchTimer++;
    
    // Sometimes update the texture during glitch for flickering effect
    if (neonSign.glitchTimer % 3 === 0) {
      createSignTexture();
    }
    
    // End glitch after a random short duration
    if (neonSign.glitchTimer > random(5, 15)) {
      neonSign.glitching = false;
      createSignTexture(); // Reset texture to normal
    }
  }
  
  // Draw achievement if visible
  if (achievement.visible) {
    drawAchievement();
  }
  
  // Draw hint cursor when hovering over sign
  if (neonSign.isHovered) {
    drawInteractionHint();
  }
}

// Function to update sign interaction state
function updateSignInteraction() {
  // Use a simpler approach to detect if mouse is over the sign
  // Convert mouse coordinates to world space based on current camera position
  let mouseWorldX = map(mouseX, 0, width, -width/2, width/2) + scrollOffset;
  let mouseWorldY = map(mouseY, 0, height, -height/2, height/2) - 200;
  
  // Check if mouse is in sign bounds (use a larger hit area for easier interaction)
  let signLeft = scrollOffset - neonSign.width/2 - 50;
  let signRight = scrollOffset + neonSign.width/2 + 50;
  let signTop = neonSign.y - neonSign.height/2 - 50;
  let signBottom = neonSign.y + neonSign.height/2 + 50;
  
  neonSign.isHovered = (mouseWorldX > signLeft && mouseWorldX < signRight && 
                       mouseWorldY > signTop && mouseWorldY < signBottom);
}

// Function to draw interaction hint
function drawInteractionHint() {
  push();
  // Draw in screen space
  camera();
  noLights();
  
  // Change cursor to pointer
  cursor(HAND);
  
  // Draw hint text above cursor
  fill(0, 200, 255);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(14);
  text("Fix the sign!", mouseX, mouseY - 10);
  
  pop();
}

function drawNeonSign() {
  push();
  // Position for the whole sign assembly
  translate(scrollOffset, neonSign.y, -100);
  
  // Add a subtle highlight effect when hovered
  if (neonSign.isHovered && !neonSign.isFixed) {
    // Glow effect when hoverable
    pointLight(0, 200, 255, 0, 0, 300);
  }
  
  // Draw chains/wires holding the sign - OUTSIDE the rotation to keep them fixed upward
  let chainLeftX = -neonSign.width/2 + 50;
  let chainRightX = neonSign.width/2 - 50;
  let fixedPointY = -400; // Fixed point higher above screen
  
  stroke(180);
  strokeWeight(3);
  
  // Left chain - from tilted sign to fixed point
  let leftAttachX = chainLeftX * cos(radians(neonSign.tiltAngle));
  line(leftAttachX, 0, chainLeftX, fixedPointY);
  
  // Right chain - from tilted sign to fixed point
  let rightAttachX = chainRightX * cos(radians(neonSign.tiltAngle));
  line(rightAttachX, 0, chainRightX, fixedPointY);
  
  // Now apply tilt rotation for just the sign itself
  push();
  rotateZ(radians(neonSign.tiltAngle));
  
  // Draw sign backing
  noStroke();
  fill(20, 20, 30); // Darker for digital display
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
  fill(0, 200, 255, 20); // More blue for digital look
  plane(neonSign.width + 20, neonSign.height + 20);
  pop();
  
  pop(); // End of rotated sign
  
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
  
  // If the sign is being hovered over, start fixing it
  if (neonSign.isHovered && neonSign.loweringComplete && !neonSign.isFixed) {
    neonSign.isBeingFixed = true;
    // Prevent normal scrolling while fixing
    return false;
  }
}

function mouseDragged() {
  if (isDragging) {
    let deltaX = mouseX - lastMouseX;
    
    if (neonSign.isBeingFixed) {
      // Adjust sign tilt with mouse movement (make more responsive)
      neonSign.tiltAngle -= deltaX * 0.2;
      
      // Constrain to reasonable values
      neonSign.tiltAngle = constrain(neonSign.tiltAngle, -30, 30);
      
      // Check if sign is fixed (close to straight)
      if (abs(neonSign.tiltAngle) < 1 && !neonSign.isFixed) {
        neonSign.isFixed = true;
        neonSign.tiltAnimating = false;
        neonSign.targetTiltAngle = 0;
        neonSign.tiltAngle = 0;
        
        // Show achievement
        if (!neonSign.achievementShown) {
          achievement.visible = true;
          achievement.showTime = frameCount;
          neonSign.achievementShown = true;
        }
      }
      
      // Prevent scrolling while fixing the sign
      return false;
    } else {
      // Regular scrolling
      targetScrollOffset -= deltaX * 2;
    }
    
    lastMouseX = mouseX;
  }
}

// Enhance touch support for mobile devices
function touchStarted() {
  if (touches.length === 1) {
    isDragging = true;
    lastTouchX = touches[0].x;
    
    // Check for sign interaction on touch
    if (neonSign.isHovered && neonSign.loweringComplete && !neonSign.isFixed) {
      neonSign.isBeingFixed = true;
      return false;
    }
  }
  return false;
}

function touchMoved() {
  if (isDragging && touches.length === 1) {
    let deltaX = touches[0].x - lastTouchX;
    
    if (neonSign.isBeingFixed) {
      // Adjust sign tilt with touch movement
      neonSign.tiltAngle -= deltaX * 0.2;
      
      // Constrain to reasonable values
      neonSign.tiltAngle = constrain(neonSign.tiltAngle, -30, 30);
      
      // Check if sign is fixed
      if (abs(neonSign.tiltAngle) < 1 && !neonSign.isFixed) {
        neonSign.isFixed = true;
        neonSign.tiltAnimating = false;
        neonSign.targetTiltAngle = 0;
        neonSign.tiltAngle = 0;
        
        // Show achievement
        if (!neonSign.achievementShown) {
          achievement.visible = true;
          achievement.showTime = frameCount;
          neonSign.achievementShown = true;
        }
      }
    } else {
      // Regular scrolling
      targetScrollOffset -= deltaX * 2;
    }
    
    lastTouchX = touches[0].x;
  }
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
