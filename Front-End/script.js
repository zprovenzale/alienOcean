//Current jquery is the development version, will want to switch to production version eventually
 
//Three.js basics taken from Nick Howe in Computer Graphics
var debug = true
var gridLen = 12 //How many squares across the floor grid has
var speed = .1 //how fast player moves

var scene, camera, renderer; // Three.js rendering basics.
var textureLoader = new THREE.TextureLoader(); //create texture loader
var gltfLoader = new THREE.GLTFLoader();
var objCoords = new Object();
var glbObjs = new Map();
var player;

var inventory = new Map()
inventory["plantA"] = 0;
inventory["plantB"] = 0;

var keyboard = new KeyboardState(); //tracks when keys are pressed

var canvas; // The canvas on which the image is rendered.

var cameraDirection = new THREE.Vector3() //Every time you move the camera, adjust this

//creates camera, lights, and floor
function createWorld() {
      if (debug)
        console.log("createWorld() called")

      renderer.setClearColor(0x23157d); // Set background color
      scene = new THREE.Scene(); // Create a new scene which we can add objects to.
      
      // creates camera
      camera = new THREE.PerspectiveCamera();
      camera.rotation.x = 1.2
      camera.position.x = 0
      camera.position.y = -3
      camera.position.z = 2
      camera.getWorldDirection(cameraDirection)

      // creates lights
      var light1 =  new THREE.DirectionalLight( 0xffffff, .6 );
      light1.position.set(.5, 0, 1);
      scene.add(light1);
      const lightAmbient = new THREE.AmbientLight( 0xffffff, .4 );
      scene.add( lightAmbient );

      //creates floor
      var floorGeom = new THREE.PlaneGeometry(gridLen, gridLen);
      var sandTexture = textureLoader.load("sand3color.jpg");
      var sandMat = new THREE.MeshStandardMaterial( { map: sandTexture } );
      sandMat.bumpMap = textureLoader.load("sand3bump.jpg")
      sandMat.normalMap = textureLoader.load("sand3normal.jpg")
      //sandMat.wrapS = THREE.RepeatWrapping;
      //sandMat.wrapT = THREE.RepeatWrapping;
      var floor = new THREE.Mesh( floorGeom, sandMat);
      floor.position.x = 0;
      floor.position.y = 0;
      scene.add(floor);
}

//loads a mesh with the name url and the kind of object type
function loadMesh(name) {
  if (debug)
    console.log(name + " loading")
  let url = name + ".glb"
  return new Promise(function(resolve, reject) {
    gltfLoader.load(
      url,
      //called when loading finishes
      function( gltf ) {
        newObj = gltf.scene
        glbObjs.set(name, newObj); //adds loaded object to dictionary of cloneable objects
        resolve()
      },
      //called while loading
      function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      },
      // called when loading has errors
      function ( error ) {
        console.log( 'An error happened' );
        reject()
      }
    )
  })
}

//iterates through world object keys which are types of object.,
//for each key iterates through the array of values, which are [x, y] coords
//for each of these objects and coordinates, clones the correct type of object,
//positions that object, and add the object and its name to the dict of objects in the world
function createWorldObjects(worldObjPos) {
  for (let [key, value] of worldObjPos) {
    for (let i = 0; i < value.length; i += 1) {
      //createObj(key, value[i][0], value[i][1])
      let newPlant = glbObjs.get(key).clone()
      newPlant.position.x = value[i][0]
      newPlant.position.y = value[i][1]
      objCoords[[value[i][0], value[i][1]]] = newPlant;
      objCoords[[value[i][0], value[i][1]]].name = key;
      console.log("objCoords.name: " + objCoords[[value[i][0], value[i][1]]].name)
      scene.add(objCoords[[value[i][0], value[i][1]]])
    }
  }

}

//Handles movement
function update() {

  keyboard.update()

  //How do these vectors work? could it be 1, 1 sometimes and 1, 400 others? If so I
  //need to standardize these so they always add up to the same number or the speed
  //will be jerky

  //player +  movement
  if (keyboard.pressed("W")) { //forward
    player.position.x += speed * cameraDirection.x;
    player.position.y += speed * cameraDirection.y;
  } else if (keyboard.pressed("S")) { //backward
    player.position.x -= speed * cameraDirection.x;
    player.position.y -= speed * cameraDirection.y;
  } if (keyboard.pressed("A")) { //left
    player.position.x -= speed * cameraDirection.y;
    player.position.y += speed * cameraDirection.x;
  } else if (keyboard.pressed("D")) { //right
    player.position.x += speed * cameraDirection.y;
    player.position.y -= speed * cameraDirection.x;
  }

  //player + camera look around
  if (keyboard.pressed("left")) {
    player.rotation.z += speed/3
  } else if (keyboard.pressed("right")) {
      player.rotation.z -= speed/3
    //picks up objects
  } else if (keyboard.up ("up")) {
      let playerPosKey = [Math.round(player.position.x), Math.round(player.position.y)]
      if(playerPosKey in objCoords) {
        let invKey = objCoords[playerPosKey].name
        console.log("invKey: " + invKey);
        inventory[invKey] += 1
        console.log(inventory[objCoords[playerPosKey].name])
        scene.remove(objCoords[playerPosKey]);
        delete objCoords[playerPosKey];
      }
  } else if (keyboard.pressed("down")) {
    //camera.rotation.x -= speed/3.14
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
  promisePlantA = loadMesh("plantA");
  promisePlantB = loadMesh("plantB");
  promisePlayer = loadMesh("player");
  Promise.all([promisePlantA,promisePlantB]).then(function() {
    worldObjPos = new Map()
    worldObjPos.set("plantA", [[1, 2], [3, 4]]);
    worldObjPos.set("plantB", [[2, 1],[3,5],[2,5]]);
    createWorldObjects(worldObjPos);
  })
  promisePlayer.then(function() {
    if (debug)
      console.log("player loaded")
    player = glbObjs.get("player")
    scene.add(player)
    player.add(camera)
  })
  //size reference cube
  const geometry = new THREE.BoxGeometry( 1, 1, .1 );
  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  const cube = new THREE.Mesh( geometry, material );
  //scene.add( cube );

  console.log("yes updated")
  Promise.all([promisePlantA,promisePlantB,promisePlayer]).then(function() {
    render();
  })
  //scene.add(onePlant)
  //twoPlant = createPlantB(0, 0, 0, 1)
  //threePlant = loadPlant(2, 0, 0 , 1)
 //scene.add(onePlant)
  //scene.add(threePlant)
  //scene.remove(threePlant)
}