//Three.js basics taken from Nick Howe in Computer Graphics

var debug = true
var view = "front"; //front or top
var gridLen = 100 //How many squares across the floor grid has
var speed = .1 //how fast player moves

var scene, camera, renderer; // Three.js rendering basics.

var keyboard = new KeyboardState(); //tracks when keys are pressed

var canvas; // The canvas on which the image is rendered.

var cameraDirection = new THREE.Vector3() //Every time you move the camera, adjust this


function createWorld() {
      if (debug) {
        console.log("createWorld() called")
      }
      renderer.setClearColor(0x23157d); // Set background color
      scene = new THREE.Scene(); // Create a new scene which we can add objects to.
    
      // create a camera
      camera = new THREE.PerspectiveCamera();
      if (view == "front") {
        camera.rotation.x = 3.14/2
        camera.position.x = 0
        camera.position.y = -3
        camera.position.z = 1
      }

      //TODO make this actually work
      if (view == "leftSide") {
        camera.rotation.x = 1.2
        camera.rotation.z = 3.14/2
        camera.position.y = 0
        camera.position.x = 3
        camera.position.z = 1
      }

      if (view == "top"){
        camera.position.z = 3
      }

      camera.getWorldDirection(cameraDirection)
      scene.add(camera)


      // create main light
      var light1 =  new THREE.DirectionalLight( 0xffffff, .5 );
      light1.position.set(10, 0, 5);
      scene.add(light1);

      // create secondary light
      var light2 =  new THREE.DirectionalLight( 0xffffff, .1 );
      scene.add(light2);

      var floorGeom = new THREE.PlaneGeometry(gridLen, gridLen);
      var floorMat = new THREE.MeshLambertMaterial({color: 0xff0000});
      var floor = new THREE.MeshLambertMaterial()
      floor = new THREE.Mesh( floorGeom, floorMat);
      floor.position.x = 0;
      floor.position.y = 0;
      scene.add(floor);
}

//Handles movement
function update() {

  keyboard.update()

  //These make the camera move in relation to the direction its facing in the world
  let cameraAngX = cameraDirection.x/(cameraDirection.x+cameraDirection.y)
  let cameraAngY = cameraDirection.y/(cameraDirection.x+cameraDirection.y)

  if (keyboard.pressed("W")) { //up
    camera.position.x += speed * cameraAngX;
    camera.position.y += speed * cameraAngY;
  } else if (keyboard.pressed("S")) { //down
    camera.position.x -= speed * cameraAngX;
    camera.position.y -= speed * cameraAngY;
  } if (keyboard.pressed("A")) { //left
    camera.position.x -= speed * cameraAngY;
    camera.position.y += speed * cameraAngX;
  } else if (keyboard.pressed("D")) { //right
    camera.position.x += speed * cameraAngY;
    camera.position.y -= speed * cameraAngX;
  }

  // if (keyboard.pressed("up")) {
  //   camera.rotation.x += .1
  // } else if (keyboard.pressed("down")) {
  //   camera.rotation.x -= .1
  // }
  if (keyboard.pressed("left")) {
    camera.rotation.y += .1
  } else if (keyboard.pressed("right")) {
    camera.rotation.y -= .1
  }

  camera.getWorldDirection(cameraDirection)

}

//render the scene
function render() {
  update();
  renderer.render(scene, camera);
  requestAnimationFrame( render);
}

// The init() function is called by the onload event when the document has loaded.
function init() {
  try {
    canvas = document.getElementById("glcanvas");
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true} );
  }
  catch (e) {
    document.getElementById("canvas-holder").innerHTML = "<h3><b>WebGL is not available.</b><h3>";
    return;
  }
  
  createWorld();
  cube = createPlantA(0, 0, 0, 1)
  scene.add(cube)
  render();
}