'use strict';

var Body = require('./body.js');

/*
 * Encapsulates a particle
 */
function Particle(position, velocity, mass, radius, color, maxSpeed, damping) {
	Body.call(this, position, velocity, mass, maxSpeed, damping);
	this.radius = radius;
	this.color = color;
}

/*
 * Extend Body
 */ 
Particle.prototype = Object.create(Body.prototype);
Particle.prototype.constructor = Particle;

/*
 * Update particle state according to the laws of physics
 */
Particle.prototype.update = function (physics) {
	physics.update(this);
}

/*
 * Renders the particle
 */
Particle.prototype.render = function (graphics) {
	graphics.drawCircle(this.position, this.radius, this.color);
}

module.exports = Particle;
