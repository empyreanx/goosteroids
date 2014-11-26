'use strict';

var Graphics = require('./graphics.js');
var Particle = require('./particle.js');
var Physics = require('./physics.js');
var Vector = require('./vector.js');
var Keyboard = require('./keyboard.js');

function Game(canvas, settings) {
	this.settings = settings;
	this.dt = 1 / settings.fps;
	
	this.keyboard = new Keyboard();
	this.graphics = new Graphics(canvas);
	this.physics = new Physics(canvas.width, canvas.height, this.dt);	
	
	this.ship = null;
	this.particles = [];
	
	this.setupEvents();
}

Game.prototype.resizeCanvas = function (width, height) {
	this.graphics.resizeCanvas(width, height);
	this.physics.setBounds(width, height);
}

Game.prototype.setupEvents = function() {
	this.keyboard.keyUp(Keyboard.keys.spacebar, function() {
		alert('hi');
	});
}

Game.prototype.setupStage = function () {
	var particle = new Particle(1, 5, new Vector(this.physics.width / 2, this.physics.height / 2), new Vector(0, 10), 'black');
	
	particle.applyForce(new Vector(0, 10));
	
	this.particles.push(particle);
	
	this.keyboard.enableEvents();
}

Game.prototype.update = function () {
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].update(this.physics);
	}
}

Game.prototype.render = function () {
	this.graphics.clear();
	
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].render(this.graphics);
	}
}

Game.prototype.loop = function () {
	this.update();
	this.render();
}

Game.prototype.startLoop = function () {
	this.loopId = setInterval((function(self) { return function() { self.loop(); }})(this), this.dt * 1000);
}

Game.prototype.stopLoop = function () {
	clearInterval(this.loopId);
}

module.exports = Game;
