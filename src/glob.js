'use strict';

var Particle = require('./particle.js');
var Vector = require('./vector.js');

/*
 * Calculates the force of "gravity" exerted on g1 by g2
 */
function gravity(g1, g2, magnitude, dropoff) {
	var r = g1.position.distance(g2.position);
	
	if (r < g1.radius + g2.radius) {
		return new Vector(0, 0);	
	} else {
		var c = magnitude * Math.exp(-(dropoff) * r); //modified law of gravitation	
		return g2.position.sub(g1.position).normalize().scale(c);
	}
}

function Glob(position, velocity, settings) {
	Particle.call(this, position, velocity, 1.0, settings.radius, settings.color, settings.maxSpeed, settings.damping)
	this.settings = settings;
}

Glob.prototype = Object.create(Particle.prototype);
Glob.prototype.constructor = Glob;

Glob.prototype.update = function (physics, globs) {
	for (var i = 0; i < globs.length; i++) {
		this.applyForce(gravity(this, globs[i], this.settings.magnitude, this.settings.dropoff));
	}
	
	physics.update(this);
	
	this.clearForces();
}

module.exports = Glob;
