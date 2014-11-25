'use strict';

Vector = require('./vector.js');

function Body(mass, position, velocity, maxSpeed, damping) {
	this.setMass(mass);
	this.position = position;
	this.velocity = velocity;
	this.acceleration = new Vector(0, 0);
	this.force = new Vector(0, 0);
	this.maxSpeed = maxSpeed || -1;
	this.damping = damping || 0;
}

Body.prototype.setMass = function (mass) {
	if (mass == 0) {
		throw Error("Mass cannot be zero!");
	} else {
		this.mass = mass;
		this.inverseMass = 1.0 / mass;
	}
}

Body.prototype.applyForce = function (force) {
	this.force = this.force.add(force);
}

Body.prototype.clearForces = function () {
	this.force = new Vector(0, 0);
}
