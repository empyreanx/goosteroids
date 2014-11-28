var $ = require('jquery');

var Game = require('./game.js');

var templates = { game: require('../tpl/game.hbs') };

var settings = { 
	fps: 30,
	gunCooldown: 6,
	
	ship: {
		damping: 0.5,
		maxSpeed: 400,
		thrust: 450,
		turnRate: 5,
		interiorColor: 'white',
		borderColor: 'black',
		borderWidth: 3,
		base: 15,
		height: 25,
		flameStep: 2,
		flameMagnitude: 6,
		flameColor: 'blue',
		flameThickness: 2
	},
	
	glob: {
		radius: 5,
		maxSpeed: 300,
		damping: 1,
		cr: 0.9,
		color: '#b0b0b0',
		magnitude: 50,
		dropoff: 0.005
	},
	
	greyGoo: {
		minThreshold: 150,
		maxThreshold: 200,
		gradientRadius: 15,
		gradientStop0: 'rgba(80, 80, 80, 1)',
		gradientStop1: 'rgba(80, 80, 80, 0)'
	},
	
	bullet: {
		speed: 350,
		radius: 2,
		killRadius: 12.5,
		lifetime: 25,
		color: 'black' 
	},
	
	explosion: {
		glob: {
			numParticles: 15,
			magnitude: 250,
			color: '#b0b0b0',
			lifetime: 20,
			blastRadius: 30,
			blastMagnitude: 700
		},
		
		ship: {
			numParticles: 30,
			magnitude: 300,
			color: '#b0b0b0',
			lifetime: 30
		}
	}
};

$(function() {
	$('body').html(templates.game);
	
	var canvas = $('canvas').get(0);
	var game = new Game(canvas, settings);
	
	game.setupStage();
	game.startLoop();
});
