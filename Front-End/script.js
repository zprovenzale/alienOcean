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

//loads a mesh with the name url and the kind of object type
function loadMesh(name) {
  let url = name + ".glb"
  return new Promise(function(resolve, reject) {
    gltfLoader.load(
      url,
      //called when loading finishes
      function( gltf ) {
        newObj = gltf.scene
        cloneableObjs.set(name, newObj); //adds loaded object to dictionary of cloneable objects
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
      let newPlant = cloneableObjs.get(key).clone()
      newPlant.position.x = value[i][0]
      newPlant.position.y = value[i][1]
      dict[[value[i][0], value[i][1]]] = newPlant;
      dict[[value[i][0], value[i][1]]].name = key
      scene.add(dict[[value[i][0], value[i][1]]])
    }
  }

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
  promisePlantA = loadMesh("plantA");
  promisePlantB = loadMesh("plantB");
  Promise.all([promisePlantA,promisePlantB]).then(function() {
    worldObjPos = new Map()
    worldObjPos.set("plantA", [[1, 2], [3, 4]]);
    worldObjPos.set("plantB", [[2, 1],[3,5],[2,5]]);
    createWorldObjects(worldObjPos);
  })
  const geometry = new THREE.BoxGeometry( 1, 1, .1 );
  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  console.log("yes it definitely updated")
  //scene.add(onePlant)
  //twoPlant = createPlantB(0, 0, 0, 1)
  //threePlant = loadPlant(2, 0, 0 , 1)
 //scene.add(onePlant)
  //scene.add(threePlant)
  //scene.remove(threePlant)
  render();
}