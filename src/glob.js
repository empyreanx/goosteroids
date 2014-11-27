'use strict';

var Particle = require('./particle.js');
var Vector = require('./vector.js');

/*
 * Encapsulates of glob of grey goo
 */
function Glob(position, velocity, settings) {
	Particle.call(this, position, velocity, 1.0, settings.radius, settings.color, settings.maxSpeed, settings.damping)
	this.settings = settings;
}

/*
 * Extends Particle
 */
Glob.prototype = Object.create(Particle.prototype);
Glob.prototype.constructor = Glob;

/*
 * Update glob state by one tick
 */ 
Glob.prototype.update = function (physics, globs) {
	//check for collisions with other globs, and resolve interpenetration and velocity
	for (var i = 0; i < globs.length; i++) {
		if (globs[i] != this) {			
			if (this.position.distance(globs[i].position) < this.radius + globs[i].radius) {
				var normal = globs[i].position.sub(this.position).normalize();
				resolveInterpenetration(this, globs[i], normal);
				resolveVelocity(this, globs[i], normal, this.settings.cr);
			}
		}
	}
	
	//update position and velocity
	for (var i = 0; i < globs.length; i++) {
		this.applyForce(gravity(this, globs[i], this.settings.magnitude, this.settings.dropoff));
	}
	
	physics.update(this);
	
	this.clearForces();
}

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

/*
 * Resolves the interpenetration of colliding globs.
 */
function resolveInterpenetration(g1, g2, normal) {
	var depth = g1.radius + g2.radius - g1.position.distance(g2.position)
	g1.position = g1.position.add(normal.scale(-0.5 * depth));
	g2.position = g2.position.add(normal.scale(0.5 * depth));
}

/*
 * Resolves the velocities of colliding globs. Simplified since globs only have
 * a mass of 1.0.
 */
function resolveVelocity(g1, g2, normal, cr) {
	var relativeVelocity = g2.velocity.sub(g1.velocity);
	var closingSpeed = -relativeVelocity.dot(normal);
		
	if (closingSpeed < 0) {
		return;
	}
	
	var velocity = normal.scale(0.5 * cr * closingSpeed);
	
	g1.velocity = g1.velocity.add(velocity.scale(-1));
	g2.velocity = g2.velocity.add(velocity);
}

module.exports = Glob;
