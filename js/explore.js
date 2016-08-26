"use strict";

var THREE = require("three");
var colours = require("./colors");

var container;
var camera;
var scene;
var renderer;
var hemisphereLight;
var directionalLight;

var player;

//NOTE: Units are in metres.
//A room will be around 20 metres large along any length

function createCamera() {
  var camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 5);
  return camera;
}

function createFog() {
  return new THREE.Fog(colours.light2, 15, 50);
}

function createCube(size, x, y) {

}

function createScene() {
  var scene = new THREE.Scene();

  // Add a fog effect to the scene; same color as the
  // background color used in the style sheet
  scene.fog = createFog();

  scene.add(createCube(1, 0, 0));

  return scene;
}

function init() {

  scene = createScene();

  //setup camera
  camera = createCamera();

  // Create the renderer
  renderer = new THREE.WebGLRenderer({
    // Allow transparency to show the gradient background
    // we defined in the CSS
    alpha: true,

    // Activate the anti-aliasing; this is less performant,
    // but, as our project is low-poly based, it should be fine :)
    antialias: true
  });

  // Define the size of the renderer; in this case,
  // it will fill the entire screen
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add the DOM element of the renderer to the
  // container we created in the HTML
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  //add event listeners
  window.addEventListener( 'resize', onWindowResize, false );

  onWindowResize();
}

function onWindowResize () {
  camera.left = window.innerWidth / - 2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = window.innerHeight / - 2;
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  //var timer = Date.now() * 0.0001;

  //move camera around scene
  //camera.position.x = Math.cos( timer ) * 200;
  //camera.position.z = Math.sin( timer ) * 200;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

init();
animate();
