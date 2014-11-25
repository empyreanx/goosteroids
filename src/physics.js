'use strict';

var clamp = require("./utilities.js").clamp;

function Physics(width, height) {
	this.setBounds(width, height);
}

Physics.prototype.setBounds = function (width, height) {
	this.width = width;
	this.height = height;
}

Physics.prototype.update = function (body, dt) {
	//compute acceleration
	body.acceleration = body.force.scale(body.inverseMass);
	
	//perform Euler integration
	body.velocity = body.velocity.scale(Math.pow(body.damping, dt)).add(body.acceleration.scale(dt));
	
	if (body.maxSpeed >= 0) {
		body.velocity = body.velocity.normalize().scale(clamp(body.velocity.norm(), 0, body.maxSpeed));
	}
		
	body.position = body.position.add(body.velocity.scale(dt)).add(body.acceleration.scale(dt*dt));
	
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
