function createPlantA(x, y, z, size) {

    if (debug) {
      console.log("createPlantA() called")
    }  
    
    const plantAGeom = new THREE.BoxGeometry(size/6, size/6, size);
    const plantAMat = new THREE.MeshBasicMaterial( {color: 0x237d15} );
  
    let backLeaf = new THREE.Mesh( plantAGeom, plantAMat );
    backLeaf.position.z += size/2
    backLeaf.rotation.x -= .6
  
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