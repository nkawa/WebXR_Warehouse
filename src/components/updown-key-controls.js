
var CLAMP_VELOCITY = 0.00001;
var MAX_DELTA = 0.2;

var KEYS = ['KeyQ', 'KeyE'];
/**
 * WASD component to control entities using WASD keys.
 */
AFRAME.registerComponent('updown-key-controls', {
  schema: {
    acceleration: {default: 65},
  },
  after: ['look-controls'],

  init: function () {
    // To keep track of the pressed keys.
    console.log("Initialize updown-key-controls!!");
    this.keys = {};
    this.easing = 1.1;

    this.velocity = new THREE.Vector3();

    // Bind methods and add event listeners.
    this.onBlur = this.onBlur.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.attachVisibilityEventListeners();
    console.log("init done!!");
  },

  tick: function (time, delta) {
    var data = this.data;
    var el = this.el;
    var velocity = this.velocity;

    if (!velocity.y &&
        isEmptyObject(this.keys)) { 
          return; 
      }

    // Update velocity.
    delta = delta / 1000;
    this.updateVelocity(delta);

    // Get movement vector and translate position.
    el.object3D.position.add(this.getMovementVector(delta));
  },

  remove: function () {
    this.removeKeyEventListeners();
    this.removeVisibilityEventListeners();
  },

  play: function () {
    this.attachKeyEventListeners();
  },

  pause: function () {
    this.keys = {};
    this.removeKeyEventListeners();
  },

  updateVelocity: function (delta) {
    var acceleration;
    var data = this.data;
    var keys = this.keys;
    var velocity = this.velocity;
    var wsSign;

    // If FPS too low, reset velocity.
    if (delta > MAX_DELTA) {
      velocity.y = 0;
      console.log("Exceed delta",delta, MAX_DELTA)
      return;
    }

    var scaledEasing = Math.pow(1 / this.easing, delta * 60);
    // Velocity Easing.
    if (velocity.y !== 0) {
      velocity.y = velocity.y * scaledEasing;
    }

    // Clamp velocity easing.
    if (Math.abs(velocity.y) < CLAMP_VELOCITY) { velocity.y = 0; }

    // Update velocity using keys pressed.
    acceleration = data.acceleration;
    if (keys.KeyQ ) { 
      velocity.y -=  acceleration * delta; 
    }
    if (keys.KeyE ) { 
      velocity.y +=  acceleration * delta; 
    }
    
  },

  getMovementVector: (function () {
    var directionVector = new THREE.Vector3(0, 0, 0);

    return function (delta) {
      var velocity = this.velocity;
      directionVector.copy(velocity);
      directionVector.multiplyScalar(delta);
      // Absolute.
       return directionVector; 
    };
  })(),

  attachVisibilityEventListeners: function () {
    window.oncontextmenu = this.onContextMenu;
    window.addEventListener('blur', this.onBlur);
    window.addEventListener('focus', this.onFocus);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  },

  removeVisibilityEventListeners: function () {
    window.removeEventListener('blur', this.onBlur);
    window.removeEventListener('focus', this.onFocus);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  },

  attachKeyEventListeners: function () {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  },

  removeKeyEventListeners: function () {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  },

  onContextMenu: function () {
    var keys = Object.keys(this.keys);
    for (var i = 0; i < keys.length; i++) {
      delete this.keys[keys[i]];
    }
  },

  onBlur: function () {
    this.pause();
  },

  onFocus: function () {
    this.play();
  },

  onVisibilityChange: function () {
    if (document.hidden) {
      this.onBlur();
    } else {
      this.onFocus();
    }
  },

  onKeyDown: function (event) {
//    console.log("KeyDown",event.code, event);
    var code;
      code = event.code 
    if (KEYS.indexOf(code) !== -1) { this.keys[code] = true; }
  },

  onKeyUp: function (event) {
    var code;
    code = event.code ;
    delete this.keys[code];
  }
});

function isEmptyObject (keys) {
  var key;
  for (key in keys) { return false; }
  return true;
}