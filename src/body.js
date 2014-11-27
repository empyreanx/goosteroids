'use strict';

var Vector = require('./vector.js');

/*
 * Encapulates of body subject to Newtons Laws
 */
function Body(position, velocity, mass, maxSpeed, damping) {
	this.setMass(mass);
	this.position = position;
	this.velocity = velocity;
	this.force = new Vector(0, 0);
	this.maxSpeed = maxSpeed || -1;
	this.damping = damping || 1;
}

/*
 * Sets the mass and inverse mass of a body
 */ 
Body.prototype.setMass = function (mass) {
	if (mass == 0) {
		throw Error("Mass cannot be zero!");
	} else {
		this.mass = mass;
		this.inverseMass = 1 / mass;
	}
}

/*
 * Applies a force to a body
 */
Body.prototype.applyForce = function (force) {
	this.force = this.force.add(force);
}

/*
 * Clears all forces on a body
 */
Body.prototype.clearForces = function () {
	this.force = new Vector(0, 0);
}

/*
 * Applies an impulse to a body
 */
Body.prototype.applyImpulse = function (force, dt) {
	this.velocity = this.velocity.add(force.scale(this.inverseMass * dt));
}

module.exports = Body;
