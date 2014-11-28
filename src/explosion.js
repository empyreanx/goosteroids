'use strict';

var Particle = require('./particle.js');
var PolarVector = require('./polarvector.js');

var Explosion = { };

Explosion.debris = function (particles, center, settings) {
	for (var i = 0; i < settings.numParticles; i++) {
		var velocity = new PolarVector(Math.random() * 2 * Math.PI, Math.random() * settings.magnitude);
		particles.push(new Particle(center, velocity, 1.0, 2.0, settings.color, -1, 0.8, settings.lifetime));
	}
}

Explosion.blast = function (particles, center, settings) {
	for (var i = 0; i < particles.length; i++) {
		var particle = particles[i];
		
		if (particle.position.distance(center) < settings.blastRadius) {
			particle.velocity = particle.velocity.add(new PolarVector(particle.position.sub(center).angle(), settings.blastMagnitude));
		}
	}
}

module.exports = Explosion;
