'use strict';

var Glob = require('./glob.js');
var Graphics = require('./graphics.js');
var Events = require('./events.js');
var Keyboard = require('./keyboard.js');
var Particle = require('./particle.js');
var Physics = require('./physics.js');
var Ship = require('./ship.js');
var Vector = require('./vector.js');

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
	
	this.ship = new Ship(new Vector(canvas.width / 2, canvas.height / 2), settings.ship);
	
	this.globs = [];
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
}

/*
 * Resizes game canvas. Can be called on the fly.
 */
Game.prototype.resizeCanvas = function (width, height) {
	this.graphics.resizeCanvas(width, height);
	this.physics.setBounds(width, height);
}

/*
 * Setup stage
 */
Game.prototype.setupStage = function (stage) {
	this.ship.position = new Vector(this.canvas.width / 2, this.canvas.height / 2);

	this.globs.push(new Glob(new Vector(0, 0), new Vector(5, 10), this.settings.glob));
	this.globs.push(new Glob(new Vector(this.canvas.width / 2, this.canvas.height / 2), new Vector(-10, 5), this.settings.glob));
	
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
}

/*
 * Render game entities
 */
Game.prototype.render = function () {
	this.graphics.clear();
	
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].render(this.graphics);
	}
	
	this.ship.render(this.graphics);
	
	for (var i = 0; i < this.globs.length; i++) {
		this.globs[i].render(this.graphics);
	}
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
