'use strict';

var Body = require('./body.js');

function Particle(mass, radius, position, velocity, color, maxSpeed, damping) {
	Body.call(this, mass, position, velocity, maxSpeed, damping);
	this.radius = radius;
	this.color = color;
}

Particle.prototype = Object.create(Body.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.update = function (physics) {
	physics.update(this);
}

Particle.prototype.render = function (graphics) {
	graphics.drawCircle(this.position, this.radius, this.color);
}

module.exports = Particle;
