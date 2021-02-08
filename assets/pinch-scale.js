/* global AFRAME, THREE */

AFRAME.registerComponent("pinch-scale", {
  schema: {
    min: { default: 0.3 },

    max: { default: 8 }
  },

  init: function() {
    this.initialScale = this.el.object3D.scale.clone();

    this.scaleFactor = 1;

    this.handleEvent = this.handleEvent.bind(this);

    this.el.sceneEl.addEventListener("twofingermove", this.handleEvent);
    
    this.modelA = this.el.sceneEl.querySelector("#bowser-model");
    this.modelAPosition = new THREE.Vector3();
  },

  remove: function() {
    this.el.sceneEl.removeEventListener("twofingermove", this.handleEvent);
  },

  handleEvent: function(event) {
    let touch = new THREE.Vector2()
    let camera = AFRAME.scenes[0].camera;
    camera.parent.updateMatrixWorld();
    const rect = document.querySelector('canvas').getBoundingClientRect();
    this.modelAPosition.setFromMatrixPosition(this.modelA.object3D.matrixWorld);
    touch.x = ( (event.detail.positionRaw.x - 0) / 360 ) * 2 - 1;
    touch.y = - ( (event.detail.positionRaw.y - 0) / 681 ) * 2 + 1;
    let vector = new THREE.Vector3( touch.x, touch.y, -1 ).unproject( camera );
    console.log(vector);
    
    console.log(this.modelAPosition);
    
    this.scaleFactor *=
      1 + event.detail.spreadChange / event.detail.startSpread;

    this.scaleFactor = Math.min(
      Math.max(this.scaleFactor, this.data.min),
      this.data.max
    );

    this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x;

    this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;

    this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z;
  }
});
