'use strict';

var Bullet = require('./bullet.js');
var Glob = require('./glob.js');
var GreyGoo = require('./greygoo.js');
var Graphics = require('./graphics.js');
var Events = require('./events.js');
var Keyboard = require('./keyboard.js');
var Particle = require('./particle.js');
var Physics = require('./physics.js');
var Ship = require('./ship.js');
var Vector = require('./vector.js');

var random = require('./utilities').random;
/*
 * Encapuslates game control
 */
function Game(canvas, settings) {
	this.canvas = canvas;
	this.settings = settings;
	
	this.dt = 1 / settings.fps;
	
	this.keyboard = new Keyboard();
	this.graphics = new Graphics(canvas);
	this.physics = new Physics(canvas.width, canvas.height, this.dt);	
	this.greyGoo = new GreyGoo(canvas.width, canvas.height, settings.greyGoo);
	this.ship = new Ship(new Vector(canvas.width / 2, canvas.height / 2), settings.ship);
	
	this.globs = [];
	this.bullets = [];
	this.particles = [];
	
	this.setupEvents();
}

/*
 * Setup event handlers
 */
Game.prototype.setupEvents = function() {
	this.keyboard.keyUp(Keyboard.keys.up, this, function() {
		this.ship.accelerating = 0;
	});
	
	this.keyboard.keyDown(Keyboard.keys.up, this, function() {
		this.ship.accelerating = 1;
	});
	
	this.keyboard.keyUp(Keyboard.keys.left, this, function() {
		this.ship.turning = 0;
	});
	
	this.keyboard.keyDown(Keyboard.keys.left, this, function() {
		this.ship.turning = -1;
	});
	
	this.keyboard.keyUp(Keyboard.keys.right, this, function() {
		this.ship.turning = 0;
	});
	
	this.keyboard.keyDown(Keyboard.keys.right, this, function() {
		this.ship.turning = 1;
	});
	
	this.keyboard.keyDown(Keyboard.keys.spacebar, this, function() {
		this.bullets.push(new Bullet(this.ship.getFront(), this.ship.orientation, this.settings.bullet));
	});
}

/*
 * Resizes game canvas. Can be called on the fly.
 */
Game.prototype.resizeCanvas = function (width, height) {
	this.graphics.resizeCanvas(width, height);
	this.greyGoo.resizeCanvas(width, height);
	this.physics.setBounds(width, height);
}

/*
 * Setup stage
 */
Game.prototype.setupStage = function (stage) {
	this.ship.position = new Vector(this.canvas.width / 2, this.canvas.height / 2);

	for (var i = 0; i < 15; i++) {
		var x = random(0, this.canvas.width);
		var y = random(0, this.canvas.height);
		this.globs.push(new Glob(new Vector(x, y), new Vector(0, 0), this.settings.glob));
	}
	
	this.globs.push(new Glob(new Vector(0, 0), new Vector(50, 50), this.settings.glob));
	this.globs.push(new Glob(new Vector(this.canvas.width, this.canvas.height), new Vector(-50, -50), this.settings.glob));
	
	this.keyboard.enableEvents();
}

/*
 * Update game state
 */
Game.prototype.update = function () {
	for (var i = 0; i < this.globs.length; i++) {
		this.globs[i].update(this.physics, this.globs);
	}
	
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].update(this.physics);
	}
	
	this.ship.update(this.physics);
	
	for (var i = 0; i < this.bullets.length; i++) {
		this.bullets[i].update(this.physics);
		
		if (this.bullets[i].lifetime == 0) {
			this.bullets.splice(i, 1);
		}
	}
}

/*
 * Render game entities
 */
Game.prototype.render = function () {
	this.graphics.clear();
	
	this.greyGoo.render(this.canvas, this.globs);
	
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].render(this.graphics);
	}
	
	for (var i = 0; i < this.bullets.length; i++) {
		this.bullets[i].render(this.graphics);
	}
	
	this.ship.render(this.graphics);
}

/*
 * Render heads up display (health, score, lives remaining etc...)
 */
Game.prototype.renderHUD = function () {
	
}

/*
 * Main game loop
 */
Game.prototype.loop = function () {
	this.update();
	this.render();
	this.renderHUD();
}

/*
 * Starts game loop
 */
Game.prototype.startLoop = function () {
	this.loopId = setInterval((function(self) { return function() { self.loop(); }})(this), this.dt * 1000);
}

/*
 * Stops game loop
 */
Game.prototype.stopLoop = function () {
	clearInterval(this.loopId);
}

module.exports = Game;
