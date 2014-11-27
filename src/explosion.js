'use strict';

var Particle = require('./particle.js');
var PolarVector = require('./polarvector.js');

var random = require('./utilities.js').random;

var Explosion = { };

Explosion.create = function (particles, position, settings) {
	for (var i = 0; i < settings.numParticles; i++) {
		var velocity = new PolarVector(Math.random() * 2 * Math.PI, Math.random() * settings.magnitude);
		particles.push(new Particle(position, velocity, 1.0, 2.0, settings.color, -1, 0.8, settings.lifetime));
	}
}

module.exports = Explosion;
