// 3D Arcade Machines Placeholder for Gallery Page
let machines = [];
let camAngle = 0;
let scrollOffset = 0;
let targetScrollOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight * 0.8, WEBGL);
  
  // Create many machines for infinite scrolling effect
  machines = [];
  let count = 30;
  let spacing = 400;
  for (let i = 0; i < count; i++) {
    machines.push({
      x: (i - count/2) * spacing, // Center the machines around 0
      y: 0,
      z: 0,
      w: 200,
      h: 350,
      d: 150
    });
  }
}

function draw() {
  background('#10131a');
  
  // Smooth scrolling
  scrollOffset = lerp(scrollOffset, targetScrollOffset, 0.08);
  
  // Camera setup - position to see the machines clearly
  camera(scrollOffset, -150, 700, scrollOffset, 0, 0, 0, 1, 0);
  
  // Lighting
  ambientLight(80);
  directionalLight(255, 255, 255, 0, 0.5, -1);
  
  // Draw machines in a loop for infinite effect
  for (let i = 0; i < machines.length; i++) {
    push();
    let m = machines[i];
    translate(m.x, m.y, m.z);
    drawArcadeMachine();
    pop();
    
    // Create infinite loop effect in both directions
    let totalWidth = machines.length * 400;
    if (m.x + 200 < scrollOffset - width) {
      m.x += totalWidth;
    }
    if (m.x - 200 > scrollOffset + width) {
      m.x -= totalWidth;
    }
  }
}

function drawArcadeMachine() {
  // Main body - much larger size
  fill('#23263a');
  box(200, 300, 150);
  
  // Screen - much larger
  push();
  translate(0, -70, 76);
  fill('#000000');
  box(140, 100, 8);
  pop();
  
  // Marquee - much larger
  push();
  translate(0, -150, 71);
  fill('#00bfae');
  box(140, 40, 20);
  pop();
  
  // Controls - much larger
  push();
  translate(0, 70, 76);
  fill('#e0e0e0');
  box(100, 25, 8);
  pop();
  
  // Joystick - much larger
  push();
  translate(-30, 85, 82);
  fill('#ff0055');
  sphere(12);
  pop();
  
  // Buttons - much larger
  for (let i = 0; i < 3; i++) {
    push();
    translate(15 + i*25, 85, 82);
    fill('#00bfae');
    sphere(8);
    pop();
  }
}

function mouseWheel(event) {
  targetScrollOffset += event.delta * 3;
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight * 0.8);
}
