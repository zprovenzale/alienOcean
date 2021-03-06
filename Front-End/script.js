//Current jquery is the development version, will want to switch to production version eventually
 
//Three.js basics taken from Nick Howe in Computer Graphics
var debug = true
var gridLen = 12 //How many squares across the floor grid has
var speed = .1 //how fast player moves

var scene, camera, renderer; // Three.js rendering basics.
var textureLoader = new THREE.TextureLoader(); //create texture loader
var gltfLoader = new THREE.GLTFLoader();
var worldObjs = new Map();
var glbObjs = new Map();
var currLevel = "level1"
var Objs
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

      //creates walls
      var wallGeom = new THREE.PlaneGeometry(gridLen, gridLen);
      var wallMat = new THREE.MeshStandardMaterial( { color: 0xf000000 } );

      //sandMat.wrapS = THREE.RepeatWrapping;
      //sandMat.wrapT = THREE.RepeatWrapping;
      var eastWall = new THREE.Mesh( wallGeom, wallMat);
      eastWall.rotateY(3.14/2);
      eastWall.position.x = -gridLen/2;
      scene.add(eastWall);

      var westWall = new THREE.Mesh(wallGeom, wallMat)
      westWall.rotateY(-3.14/2)
      westWall.position.x = gridLen/2
      scene.add(westWall)

      var northWall = new THREE.Mesh(wallGeom, wallMat)
      northWall.rotateX(3.14/2)
      northWall.position.y = gridLen/2
      scene.add(northWall)

      var southWall = new THREE.Mesh(wallGeom, wallMat)
      southWall.rotateX(-3.14/2)
      southWall.position.y = -gridLen/2
      scene.add(southWall)
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
function createLevel(layout, levelName, z) {
  //draw floor & walls
  for (let [key, value] of layout) {
    for (let i = 0; i < value.length; i += 1) {
      //createObj(key, value[i][0], value[i][1])
      let newPlant = glbObjs.get(key).clone()
      newPlant.position.x = value[i][0]
      newPlant.position.y = value[i][1]
      newPlant.position.z = z; 
      worldObjs.set(levelName, new Object())
      worldObjs.get(levelName)[[value[i][0], value[i][1]]] = newPlant;
      worldObjs.get(levelName)[[value[i][0], value[i][1]]].name = key;
      console.log("worldObjs.name: " + worldObjs.get(levelName)[[value[i][0], value[i][1]]].name)
      scene.add(worldObjs.get(levelName)[[value[i][0], value[i][1]]])
    }
  }
}

function destroyLevel(levelName) {
  //remove floor & walls?
  for (let key of worldObjs.get(levelName)) {
    scene.remove(level[key])
  }
  worldObjs.delete(levelName) //will concurrency be a problem? This better not delete til thing above is done

}


//Handles movement
function update() {

  keyboard.update()

  //How do these vectors work? could it be 1, 1 sometimes and 1, 400 others? If so I
  //need to standardize these so they always add up to the same number or the speed
  //will be jerky

  var lookingEast = cameraDirection.x < 0
  var lookingWest = cameraDirection.x > 0
  var lookingNorth = cameraDirection.y < 0
  var lookingSouth = cameraDirection.y > 0

  var eastBoundary = gridLen/2;
  var westBoundary = -gridLen/2;
  var northBoundary = gridLen/2;
  var southBoundary = -gridLen/2;

  //player +  movement
  if (keyboard.pressed("W")) { //forward
      if ((lookingEast || player.position.x < eastBoundary) && (lookingWest || player.position.x > westBoundary))
        player.position.x += speed * cameraDirection.x;
      if ((lookingNorth || player.position.y < northBoundary) && (lookingSouth || player.position.y > southBoundary))
        player.position.y += speed * cameraDirection.y;
  } else if (keyboard.pressed("S")) { //backward
      if ((lookingWest || player.position.x < eastBoundary) && (lookingEast || player.position.x > westBoundary))
        player.position.x -= speed * cameraDirection.x;
      if ((lookingSouth || player.position.y < northBoundary) && (lookingNorth || player.position.y > southBoundary))
        player.position.y -= speed * cameraDirection.y;
  } if (keyboard.pressed("A")) { //left
      if ((lookingSouth || player.position.x < eastBoundary) && (lookingNorth || player.position.x > westBoundary))
        player.position.x -= speed * cameraDirection.y;
      if ((lookingEast || player.position.y < northBoundary) && (lookingWest || player.position.y > southBoundary))
        player.position.y += speed * cameraDirection.x;
  } else if (keyboard.pressed("D")) { //right
      if ((lookingNorth || player.position.x < eastBoundary) && (lookingSouth || player.position.x > westBoundary))
        player.position.x += speed * cameraDirection.y;
      if ((lookingWest || player.position.y < northBoundary) && (lookingEast || player.position.y > southBoundary))
        player.position.y -= speed * cameraDirection.x;
  }

  //player + camera look around
  if (keyboard.pressed("left")) {
    player.rotation.z += speed/3
    // console.log("cameraDirection.x: ", cameraDirection.x)
    // console.log("cameraDirection.y: ", cameraDirection.y)

  } else if (keyboard.pressed("right")) {
      player.rotation.z -= speed/3
    //picks up objects
  } else if (keyboard.up ("up")) {
      let playerPosKey = [Math.round(player.position.x), Math.round(player.position.y)]
      if(playerPosKey in worldObjs) {
        let invKey = worldObjs.get(currLevel)[playerPosKey].name
        console.log("invKey: " + invKey);
        inventory[invKey] += 1
        console.log("num in inv:", inventory[worldObjs.get(currLevel)[playerPosKey].name])
        scene.remove(worldObjs.get(currLevel)[playerPosKey]);
        delete worldObjs.get(currLevel)[playerPosKey];
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
  promisePlantD = loadMesh("plantD")
  promisePlayer = loadMesh("player");
  Promise.all([promisePlantA,promisePlantB,promisePlantD]).then(function() {
    level1Layout = new Map()
    level1Layout.set("plantA", [[1, 2], [3, 4],[2,3],[2,4],[5,2],[0,2],[-3,4],[3,-2], [-1,3], [-2,0], [-4,4], [-2,-3], [-4,-2]]);
    level1Layout.set("plantB", [[2, 1],[3,5],[2,5],[5,3],[4,3],[4,2]]);
    level1Layout.set("plantD", [[4,-2],[1,4],[2, -3],[1,3]])
    createLevel(level1Layout, currLevel, 0);
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

  // let newLevelCoords = new Map();
  // newLevelCoords.set("PlantA", [[2,3],[2,4]]);
  // createNewLevel(newLevelCoords)

  console.log("yes it updated")
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
