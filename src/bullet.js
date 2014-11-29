'use strict';

var Particle = require('./particle.js');
var PolarVector = require('./polarvector.js');

/*
 * Encapsulates a bullet fire from the ship
 */
function Bullet(position, angle, settings) {
	Particle.call(this, position, new PolarVector(angle, settings.speed), 1.0, settings.radius, settings.color, -1, 1, settings.lifetime);
	this.settings = settings;
}

/*
 * Extend particle
 */
Bullet.prototype = Object.create(Particle.prototype);
Bullet.prototype.constructor = Particle.prototype;

Bullet.prototype.intersecting = function (glob) {
	return (this.position.distance(glob.position) < this.settings.killRadius);
}

module.exports = Bullet;
