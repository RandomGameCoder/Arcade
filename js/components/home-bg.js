// 3D animated background for Arcade Home using p5.js
let angle = 0;
let colors;
let dragging = false;
let lastX, lastY;
let rotY = 0, rotX = 0;
let targetRotY = 0, targetRotX = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colors = [color('#00bfae'), color('#10131a'), color('#e0e0e0')];
  noStroke();
}

function draw() {
  background('#10131a');
  // Smoothly interpolate rotation for a nice feel
  rotY += (targetRotY - rotY) * 0.15;
  rotX += (targetRotX - rotX) * 0.15;
  rotateY(angle * 0.3 + rotY);
  rotateX(angle * 0.15 + rotX);
  let num = 18;
  let radius = min(width, height) * 0.32;
  for (let i = 0; i < num; i++) {
    let phi = map(i, 0, num, 0, PI);
    for (let j = 0; j < num * 2; j++) {
      let theta = map(j, 0, num * 2, 0, TWO_PI);
      let x = radius * sin(phi) * cos(theta);
      let y = radius * sin(phi) * sin(theta);
      let z = radius * cos(phi);
      push();
      translate(x, y, z);
      fill(lerpColor(colors[0], colors[2], abs(sin(angle + i + j))));
      sphere(16 + 8 * sin(angle + i + j));
      pop();
    }
  }
  angle += 0.008;
}

function mousePressed() {
  if (mouseY > 0 && mouseY < height) {
    dragging = true;
    lastX = mouseX;
    lastY = mouseY;
  }
}

function mouseDragged() {
  if (dragging) {
    let dx = (mouseX - lastX) * 0.01;
    let dy = (mouseY - lastY) * 0.01;
    targetRotY += dx;
    targetRotX += dy;
    lastX = mouseX;
    lastY = mouseY;
  }
}

function mouseReleased() {
  dragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
