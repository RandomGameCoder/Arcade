const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,                                       //field of view
    window.innerWidth / window.innerHeight,  //aspect ratio
    0.1,                                      //near clipping plane
    1000                                     //far clipping plane
);
camera.position.set(0, 4, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const groundGeo = new THREE.PlaneGeometry(50, 50);
const groundMat = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeo, groundMat);

ground.rotation.x = Math.PI / 2;

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

cube.position.set(0, 4, 0);
cube.scale.set(6, 8, 6);     // width, height, depth

camera.lookAt(0, 4, 0);  // look at center of building

const fogGeo = new THREE.BoxGeometry(80, 30, 80);
const fogMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.35,
    side: THREE.BackSide,
    depthWrite: false
});

const fogBox = new THREE.Mesh(fogGeo, fogMat);
fogBox.position.set(0, 15, 0);

const fogTexture = new THREE.TextureLoader().load('../assets/images/smoke.png');
fogTexture.wrapS = fogTexture.wrapT = THREE.RepeatWrapping;
fogTexture.repeat.set(4, 4);

fogMat.map = fogTexture;
fogMat.alphaMap = fogTexture;

for (let i = 0; i < 3; i++) {
  const layer = fogBox.clone();
  layer.scale.multiplyScalar(1 + i * 0.15);
  layer.material = fogMat.clone();
  layer.material.opacity = 0.25 - i * 0.05;
  scene.add(layer);
}

scene.add(ground);
scene.add(cube);

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();