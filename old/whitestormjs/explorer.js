"use strict";

var colours = {
  primary: 0x236467,
  secondary: 0x2e4272,
  tertiary: 0x268632,
  complementary: 0xaa6d39
};

var EXPLORE = {
  world: new WHS.World({
    stats: "fps",
    autoresize: true,

    gravity: {
      x: 0,
      y: -100,
      z: 0
    },

    camera: {
      far: 10000,
      y: 20,
      z: 100
    },

    helpers: {
      grid: true,
      axis: true
    }
  }),

  ambient: new WHS.AmbientLight( {
    light: {
      color: 0xffffff,
      intensity: 0.5
    }
  }),

  light: new WHS.SpotLight( {
    light: {
      color: 0xffffff,
      intensity: 0.6,
      distance: 500
    },

    shadowmap: {
      width: 2048,
      height: 2048,
      top: 0,
      fov: 90
    },

    pos: {
      x: 250,
      y: 300,
      z: 200
    },

    target: {
      x: 0,
      y: 0,
      z: 0
    }
  }),

  ground: new WHS.Plane({
    geometry: {
      buffer: true,
      width: 500,
      height: 400
    },

    mass: 0,

    material: {
      kind: "phong",
      color: colours.tertiary
    },

    pos: {
      x: 0,
      y: 0,
      z: 0
    },

    rot: {
      x: -Math.PI/2
    }
  }),

  createRoom: function (width, length) {

    var room = {
      wall1: new WHS.Box({
        geometry: {
          buffer: true,
          width: width,
          height: 10,
          depth: 2
        },

        mass: 1,
        softbody: false,
        material: {
          kind: "phong",
          color: colours.primary
        },

        pos: {
          x: 0,
          y: 0,
          z: -(length/2)
        }
      }),

      wall2: new WHS.Box({
        geometry: {
          buffer: true,
          width: length,
          height: 10,
          depth: 2
        },

        mass: 1,
        softbody: false,
        material: {
          kind: "phong",
          color: colours.primary
        },

        pos: {
          x: -(width/2),
          y: 0,
          z: 0
        },

        rot: {
          y: -Math.PI/2
        }
      }),

      wall3: new WHS.Box({
        geometry: {
          buffer: true,
          width: width,
          height: 10,
          depth: 2
        },

        mass: 1,
        softbody: false,
        material: {
          kind: "phong",
          color: colours.primary
        },

        pos: {
          x: -(width/2),
          y: 0,
          z: -(length/2)
        }
      }),

      wall4: new WHS.Box({
        geometry: {
          buffer: true,
          width: length,
          height: 10,
          depth: 2
        },

        mass: 1,
        softbody: false,
        material: {
          kind: "phong",
          color: colours.primary
        },

        pos: {
          x: (-width/2),
          y: 0,
          z: 0
        },

        rot: {
          y: -Math.PI/2
        }
      }),

      addTo: function (world) {
        this.wall1.addTo(world);
        this.wall2.addTo(world);
        this.wall3.addTo(world);
        this.wall4.addTo(world);
      }
    };

    return room;
  },

  init: function () {
    this.ambient.addTo(this.world);
    this.light.addTo(this.world);

    this.ground.addTo(this.world);
    this.ground.getNative();

    this.room = this.createRoom(150, 300);
    this.room.addTo(this.world);

    this.world.start();
  }
};

EXPLORE.init();
