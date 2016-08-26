"use strict";

var THREE = require("three");

var container;
var camera;
var scene;
var renderer;
var hemisphereLight;
var directionalLight;

var player;

init();
animate();

function initOrthographic() {
  camera = new THREE.OrthographicCamera(
    window.innerWidth / -2, //frustum left plane
    window.innerWidth / 2, //frustum right plane
    window.innerHeight / 2, //frustum top plane
    window.innerHeight / -2, //frustum bottom plane
    -500, //frustum near plane
    2000 //frustum far plane
  );
  camera.position.set(200, 100, 200);
  camera.position.set(400, 200, 400);
}

function initPerspective() {
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.set(800, 500, 800);
}

function init() {
  container = document.createElement('div');
  document.body.appendChild( container );

  //setup camera
  //initPerspective();
  initOrthographic();

  //setup scene
  scene = new THREE.Scene();

  //setup ground grid
  scene.add( createGround() );

  //var groundHelper = new THREE.GridHelper( 1000, 100, 0x0000ff, 0x808080 );
  //scene.add( groundHelper );

  var axisHelper = new THREE.AxisHelper( 500 );
  scene.add( axisHelper );

  //add some random cubes
  var geometry = new THREE.BoxGeometry( 50, 50, 50);
  var wallMaterial = new THREE.MeshLambertMaterial({
    color: 0xcccccc
  });
  var wireframeMaterial = new THREE.MeshBasicMaterial({ wireframe: true});
  var cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0x2194ce
  });
  var phongMaterial = new THREE.MeshPhongMaterial({
    color: 0x2194ce,
    overdraw: 0.5
  });
  //for( var i = 0; i < 10; i++) {
  //  scene.add( randomCube(geometry, cubeMaterial) );
  //}
  scene.add(cube(geometry, cubeMaterial, 0, 0));

  // build the walls from cubes
  for ( var gridX = -10; gridX < 10; gridX++ ) {
    for ( var gridY = -10; gridY < 10; gridY++ ) {
      if ( !(gridX > -10 && gridY > -10) || !(gridX < 9 && gridY < 9) ) {
        scene.add( cube(geometry, wallMaterial, gridX, gridY));
      }
    }
  }


  //lighting
  hemisphereLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
  hemisphereLight.position.set( 0, 100, 0 );
  scene.add( hemisphereLight );

  directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
  directionalLight.position.set( 1000, 1000, -400);
  //directionalLight.color.setHSL( 0.1, 1, 0.95 );
  //directionalLight.position.multiplyScalar( 50 );
  scene.add( directionalLight );

  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;

  var d = 1000;

  directionalLight.shadow.camera.left = -650;
  directionalLight.shadow.camera.right = 650;
  directionalLight.shadow.camera.top = 500;
  directionalLight.shadow.camera.bottom = -450;

  directionalLight.shadow.camera.near = 800;
  directionalLight.shadow.camera.far = 2000;
  directionalLight.shadow.darkness = 0.5;
  directionalLight.shadow.bias = -0.0001;

  directionalLight.target = scene;
  scene.add( new THREE.DirectionalLightHelper(directionalLight, 0.2) );
  scene.add( new THREE.CameraHelper( directionalLight.shadow.camera ));

  //setup renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor( 0xf0f0f0 );
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.enabled = true;
  //renderer.shadowMap.soft = true;
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.renderReverseSided = false;

  renderer.shadowMapBias = 0.0039;
  renderer.shadowMapDarkness = 0.5;
  container.appendChild( renderer.domElement );

  //add event listeners
  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'keydown', onKeyDown, false );

  onWindowResize();
}


function onWindowResize () {
  camera.left = window.innerWidth / - 2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = window.innerHeight / - 2;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function createGround() {

  var groundGeo = new THREE.PlaneBufferGeometry( 1000, 1000 );
  var groundMat = new THREE.MeshPhongMaterial( { color: 0xcccccc, specular: 0x050505 } );
  groundMat.color.setHSL( 0.095, 1, 0.75 );

  var ground = new THREE.Mesh( groundGeo, groundMat );
  ground.rotation.x = -Math.PI/2;

  ground.receiveShadow = true;

/*
  var material = new THREE.MeshLambertMaterial({
    color: 0xcccccc
  });

  var geometry = new THREE.PlaneGeometry(1000,1000);

  var ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI/2;
  ground.receiveShadow = true;
*/
  return ground;
}

function randomCube(geometry, material) {
  var gridX = Math.floor( ( Math.random() * 1000 - 500 ) / 50);
  var gridY = Math.floor( ( Math.random() * 1000 - 500 ) / 50);
  return cube(geometry, material, gridX, gridY);
  /*
  var cube = new THREE.Mesh( geometry, material );
  cube.position.x = Math.floor( ( Math.random() * 1000 - 500 ) / 50 ) * 50 + 25;
  cube.position.y = 25;
  cube.position.z = Math.floor( ( Math.random() * 1000 - 500 ) /50 ) * 50 + 25;
  cube.castShadow = true;
  cube.receiveShadow = true;
  return cube;
   */
}

function cube(geometry, material, gridX, gridY) {
  var cube = new THREE.Mesh( geometry, material );
  cube.position.y = 25; //raise it to floor level

  var coords = gridToCoord(gridX, gridY);
  cube.position.x = coords[0];
  cube.position.z = coords[1];

  cube.castShadow = true;
  cube.receiveShadow = true;
  return cube;
}

function gridToCoord(x, y) {
  var xCoord = x * 50 + 25;
  var yCoord = y * 50 + 25;
  return [xCoord, yCoord];
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

function onKeyDown ( event ) {

  switch ( event.keyCode ) {

  case 65: // a

    camera.position.x = camera.position.x - 50;
    camera.position.z = camera.position.z - 50;
    break;

  case 90: // z

    camera.position.x = camera.position.x + 50;
    camera.position.z = camera.position.z + 50;
    break;

  }

}
