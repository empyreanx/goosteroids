'use strict';

var clamp = require("./utilities.js").clamp;

function Physics(width, height, dt) {
	this.setBounds(width, height);
	this.dt = dt;
}

Physics.prototype.setBounds = function (width, height) {
	this.width = width;
	this.height = height;
}

Physics.prototype.update = function (body) {
	//compute acceleration
	var acceleration = body.force.scale(body.inverseMass);
	
	//perform Euler integration with damping
	body.position = body.position.add(body.velocity.scale(this.dt));
	body.velocity = body.velocity.scale(Math.pow(body.damping, this.dt)).add(acceleration.scale(this.dt));
	
	//clamp body speed
	if (body.maxSpeed >= 0) {
		body.velocity = body.velocity.normalize().scale(clamp(body.velocity.norm(), 0, body.maxSpeed));
	}
	
	//bounds correction
	if (body.position.x > this.width) {
		body.position.x = 0;
	}
		
	if (body.position.x < 0) {
		body.position.x = this.width;
	}
		
	if (body.position.y > this.height) {
		body.position.y = 0;
	}
		
	if (body.position.y < 0) {
		body.position.y = this.height;
	}
}

module.exports = Physics;
