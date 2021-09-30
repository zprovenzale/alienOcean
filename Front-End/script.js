//Current jquery is the development version, will want to switch to production version eventually
 
//Three.js basics taken from Nick Howe in Computer Graphics
var debug = true
var gridLen = 12 //How many squares across the floor grid has
var speed = .1 //how fast player moves

var scene, camera, renderer; // Three.js rendering basics.
var textureLoader = new THREE.TextureLoader(); //create texture loader
var gltfLoader = new THREE.GLTFLoader();
var dict = new Object()
var cloneableObjs = new Map()

var keyboard = new KeyboardState(); //tracks when keys are pressed

var canvas; // The canvas on which the image is rendered.

var cameraDirection = new THREE.Vector3() //Every time you move the camera, adjust this

//creates camera, lights, and floor
function createWorld() {
      if (debug) {
        console.log("createWorld() called")
      }

      renderer.setClearColor(0x23157d); // Set background color
      scene = new THREE.Scene(); // Create a new scene which we can add objects to.
      
      // create a camera
      camera = new THREE.PerspectiveCamera();
      camera.far = 2
      camera.rotation.x = 3.14/2
      camera.position.x = 0
      camera.position.y = -3
      camera.position.z = 1
      camera.getWorldDirection(cameraDirection)
      scene.add(camera)

      // creates lights
      var light1 =  new THREE.DirectionalLight( 0xffffff, .6 );
      light1.position.set(.5, 0, 1);
      scene.add(light1);
      const lightAmbient = new THREE.AmbientLight( 0xffffff, .4 );
      scene.add( lightAmbient );

      //create floor
      var floorGeom = new THREE.PlaneGeometry(gridLen, gridLen);
      var sandTexture = textureLoader.load("sand3color.jpg");
      var sandMat = new THREE.MeshStandardMaterial( { map: sandTexture } );
      sandMat.bumpMap = textureLoader.load("sand3bump.jpg")
      sandMat.normalMap = textureLoader.load("sand3normal.jpg")
      //sandMat.wrapS = THREE.RepeatWrapping;
      //sandMat.wrapT = THREE.RepeatWrapping;
      //var floorMat = new THREE.MeshLambertMaterial({color: 0xff0000});
      //var floor = new THREE.MeshLambertMaterial()
      var floor = new THREE.Mesh( floorGeom, sandMat);
      floor.position.x = 0;
      floor.position.y = 0;
      scene.add(floor);
}

function loadMeshes() {
  if (debug) {
    console.log("loadMeshes() called")
  }
  gltfLoader.load(
    "4leafcurlplant82.glb",
    //let plantAPromise = new Promise(function(resolve, reject))
    // function below is called when the resource is loaded
    function ( gltf ) {
      cloneableObjs.set("plantA", gltf.scene);  // search through the loaded file for the object we want
      //createWorldObjects()
      //requestAnimationFrame( render );  // we don't want to start rendering until the model is loaded
    },
        
    // called while loading is progressing
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
      console.log( 'An error happened' );
    }
  );
  gltfLoader.load(
    "6oddleafplant3.glb",
    // function below is called when the resource is loaded
    function ( gltf ) {
      cloneableObjs.set("plantB", gltf.scene);  // search through the loaded file for the object we want
      //requestAnimationFrame( render );  // we don't want to start rendering until the model is loaded
    },
        
    // called while loading is progressing
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
      console.log( 'An error happened' );
    }
  );
}

window.addEventListener('load', (event) => {
  console.log('fully loaded and parsed');
  let worldObjPos = new Object()
  worldObjPos.plantA = [[2,3],[1,0],[4,5]]
  worldObjPos.plantB = [[1,4],[2,5],[0,3]]
  createWorldObjects(worldObjPos)
});

function createWorldObjects(worldObjPos) {
  for (let i = 0; i < worldObjPos.plantA.length; i += 1) {
    createObj("plantA", worldObjPos.plantA[i][0], worldObjPos.plantA[i][1])
  }
  for (let i = 0; i < worldObjPos.plantB.length; i += 1) {
    createObj("plantB", worldObjPos.plantB[i][0], worldObjPos.plantB[i][1])
  }
}

function createObj(type, x, y) {
  let newPlant = cloneableObjs.get(type).clone()
  newPlant.position.x = x
  newPlant.position.y = y
  dict[[x, y]] = newPlant;
  dict[[x, y]].name = type
  scene.add(dict[[x, y]])
}

//Handles movement
function update() {

  keyboard.update()

  //How do these vectors work? could it be 1, 1 sometimes and 1, 400 others? If so I
  //need to standardize these so they always add up to the same number or the speed
  //will be jerky

  //camera movement
  if (keyboard.pressed("W")) { //forward
    camera.position.x += speed * cameraDirection.x;
    camera.position.y += speed * cameraDirection.y;
  } else if (keyboard.pressed("S")) { //backward
    camera.position.x -= speed * cameraDirection.x;
    camera.position.y -= speed * cameraDirection.y;
  } if (keyboard.pressed("A")) { //left
    camera.position.x -= speed * cameraDirection.y;
    camera.position.y += speed * cameraDirection.x;
  } else if (keyboard.pressed("D")) { //right
    camera.position.x += speed * cameraDirection.y;
    camera.position.y -= speed * cameraDirection.x;
  }
//camera look around
  if (keyboard.pressed("left")) {
    camera.rotation.y += speed/3.14 //3.14 so when you rotate and move to the side at the same time, you move in a circle
  } else if (keyboard.pressed("right")) {
    camera.rotation.y -= speed/3.14
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
  loadMeshes();
  const geometry = new THREE.BoxGeometry( 1, 1, .1 );
  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  console.log("yes it updated")
  //scene.add(onePlant)
  //twoPlant = createPlantB(0, 0, 0, 1)
  //threePlant = loadPlant(2, 0, 0 , 1)
 //scene.add(onePlant)
  //scene.add(threePlant)
  //scene.remove(threePlant)
  render();
}