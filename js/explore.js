var container;
var camera, scene, renderer;

init();


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

    //setup ground grid
    scene.add( createGround() );

    //setup renderer
    renderer = new THREE.WebGLRenderer();
    //renderer.setClearColor( 0xf0f0f0 );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );

    //add event listeners
    window.addEventListener( 'resize', onWindowResize, false );

    onWindowResize();


    function onWindowResize () {
        camera.left = window.innerWidth / - 2;
        camera.right = window.innerWidth / 2;
        camera.top = window.innerHeight / 2;
        camera.bottom = window.innerHeight / - 2;

        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function createGround() {
        var size = 500, step = 50;
        var geometry = new THREE.Geometry();

        for ( var i = -size; i <= size; i+=step ){
            geometry.vertices.push( new THREE.Vector3( -size, 0, i ));
            geometry.vertices.push( new THREE.Vector3( size, 0, i ));
            geometry.vertices.push( new THREE.Vector3( i, 0, -size ));
            geometry.vertices.push( new THREE.Vector3( i, 0, size ));
        }

        var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );

        var line = new THREE.Line( geometry, material );
        line.type = THREE.LinePieces;

        return line;
    }
}
