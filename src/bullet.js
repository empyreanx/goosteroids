'use strict';

var Particle = require('./particle.js');
var PolarVector = require('./polarvector.js');

/*
 * Encapsulates a bullet fire from the ship
 */
function Bullet(position, angle, settings) {
	Particle.call(this, position, new PolarVector(angle, settings.speed), 1.0, settings.radius, settings.color);
	console.log(this.color);
	this.settings = settings;
	this.lifetime = settings.lifetime;
}

/*
 * Extend particle
 */
Bullet.prototype = Object.create(Particle.prototype);
Bullet.prototype.constructor = Particle.prototype;

/*
 * Updates bullet state from one tick
 */
Bullet.prototype.update = function (physics) {
	physics.update(this);
	this.lifetime--;
}


module.exports = Bullet;
