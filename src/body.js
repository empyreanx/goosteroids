'use strict';

var Vector = require('./vector.js');

function Body(position, velocity, mass, maxSpeed, damping) {
	this.setMass(mass);
	this.position = position;
	this.velocity = velocity;
	this.force = new Vector(0, 0);
	this.maxSpeed = maxSpeed || -1;
	this.damping = damping || 1;
}

Body.prototype.setMass = function (mass) {
	if (mass == 0) {
		throw Error("Mass cannot be zero!");
	} else {
		this.mass = mass;
		this.inverseMass = 1 / mass;
	}
}

Body.prototype.applyForce = function (force) {
	this.force = this.force.add(force);
}

Body.prototype.clearForces = function () {
	this.force = new Vector(0, 0);
}

Body.prototype.applyImpulse = function (force, dt) {
	this.velocity.add(force.scale(this.inverseMass * dt));
}

module.exports = Body;
