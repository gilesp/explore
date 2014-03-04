var container;
var camera, scene, renderer;

init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild( container );

    //setup camera
    camera = new THREE.OrthographicCamera(
        window.innerWidth / -2, //frustum left plane
        window.innerWidth / 2, //frustum right plane
        window.innerHeight / 2, //frustum top plane
        window.innerHeight / -2, //frustum bottom plane
            -500, //frustum near plane
        1000 //frustum far plane
    );

    camera.position.x = 200;
    camera.position.y = 100;
    camera.position.z = 200;

    //setup scene
    scene = new THREE.Scene();

    //camera.lookAt( scene.position );

    //setup ground grid
    scene.add( createGround() );

    //add some random cubes
    var geometry = new THREE.BoxGeometry( 50, 50, 50);
    var material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        shading: THREE.FlatShading,
        overdraw: 0.5
    });


      for( var i = 0; i < 10; i++) {
      scene.add( randomCube(geometry, material) );
      }

    for ( var gridX = -10; gridX < 10; gridX++ ) {
        for ( var gridY = -10; gridY < 10; gridY++ ) {
            if ( !(gridX > -10 && gridY > -10) || !(gridX < 9 && gridY < 9) ) {
                scene.add( cube(geometry, material, gridX, gridY));
            }
        }
    }


    //lighting
    var ambientLight = new THREE.AmbientLight( 0x111111 );
    scene.add(ambientLight);

    //var light = new THREE.PointLight( 0xffffff );
    var light = new THREE.DirectionalLight( 0xffffff, 1);

    light.position.set( 200, 500, -100 );
//    light.position.multiplyScalar(1.3);

    light.castShadow = true;
    //light.shadowCameraVisible = true; //enable to view & debug camera position
    light.shadowCameraLeft = -750;
    light.shadowCameraRight = 750;
    light.shadowCameraTop = 750;
    light.shadowCameraBottom = -750;
    light.shadowCameraFar = 1000;
    light.shadowDarkness = 0.2;

    scene.add(light);

    //setup renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor( 0xf0f0f0 );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;

    container.appendChild( renderer.domElement );

    //add event listeners
    window.addEventListener( 'resize', onWindowResize, false );

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
    var material = new THREE.MeshLambertMaterial({
        color: 0xcccccc
    });

    var geometry = new THREE.PlaneGeometry(1000,1000);

    var ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI/2;
    ground.receiveShadow = true;

    return ground;
}

function randomCube(geometry, material) {
    var cube = new THREE.Mesh( geometry, material );
    //cube.scale.y = Math.floor( Math.random() * 2 + 1);
    cube.position.x = Math.floor( ( Math.random() * 1000 - 500 ) / 50 ) * 50 + 25;
    //cube.position.y = ( cube.scale.y * 50 ) / 2;
    cube.position.y = 25;
    cube.position.z = Math.floor( ( Math.random() * 1000 - 500 ) /50 ) * 50 + 25;
    cube.castShadow = true;
    cube.receiveShadow = true;
    return cube;
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
    requestAnimationFrame(animate); //do I need to use something like this shim instead (http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)
    render();
}

function render() {
    var time = Date.now() * 0.0001;

    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
