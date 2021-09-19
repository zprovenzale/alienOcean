function createPlantA(x, y, z, size) {

    if (debug) {
      console.log("createPlantA() called")
    }  
    
    const plantAGeom = new THREE.BoxGeometry(size/6, size/6, size);
    const plantAMat = new THREE.MeshBasicMaterial( {color: 0x237d15} );
  
    let backLeaf = new THREE.Mesh( plantAGeom, plantAMat );
    backLeaf.position.z += size/2
    backLeaf.rotation.x -= .4
  
    let leftLeaf = new THREE.Mesh(plantAGeom, plantAMat);
    leftLeaf.rotation.y -= .3;
    leftLeaf.rotation.x += .2
    leftLeaf.position.x -= size/5
    leftLeaf.position.y -= size/3
    leftLeaf.position.z += size/2
  
    let rightLeaf = new THREE.Mesh(plantAGeom, plantAMat);
    rightLeaf.rotation.y += .3;
    rightLeaf.rotation.x += .2
    rightLeaf.position.x += size/5
    rightLeaf.position.y -= size/3
    rightLeaf.position.z += size/2
  
  
    backLeaf.attach(leftLeaf)
    backLeaf.attach(rightLeaf)
    backLeaf.position.x += x
    backLeaf.position.y += y
    backLeaf.position.z += z
  
    return backLeaf
  }

  function createPlantB(x, y, z, size) {
    if (debug) {
      console.log("createPlantB() called")
    }
    const baseGeom = new THREE.SphereGeometry(size/3, 8, 8);
    const mat = new THREE.MeshBasicMaterial( { color: 0x237d15 } );
    let base = new THREE.Mesh(baseGeom, mat);

    const midGeom = new THREE.SphereGeometry(size/4, 8, 8);
    let mid = new THREE.Mesh(midGeom, mat);
    mid.position.z += size/3

    base.attach(mid)
    
    base.position.x += x
    base.position.y += y
    base.position.z += size/3 + z
    
    return base
  }
