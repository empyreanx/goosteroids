var $ = require('jquery');

var Game = require('./game.js');
var Events = require('./events.js');

var templates = { game: require('../tpl/game.hbs') };

var settings = { 
	fps: 30,
	lives: 3,
	globsPerStage: 13,
	pointsPerGlob: 10,
	textColor: 'black',
	textFont: 'Arial',
	
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
		respawnTime: 3,
		gunCooldown: 200,
		
		flames: {
			step: 2,
			magnitude: 6,
			color: 'blue',
			thickness: 2
		},
		
		turbo: {
			fuel: 100,
			consumption: 5,
			thrust: 2500,
			maxSpeed: 800,
			recharge: 2,
			rechargeCooldown: 2000,
			
			flames: {
				step: 3,
				magnitude: 17
			}
		}
	},
	
	glob: {
		radius: 5,
		maxSpeed: 300,
		damping: 1,
		cr: 0.9,
		color: '#b0b0b0',
		magnitude: 50,
		dropoff: 0.005,
		killRadius: 10
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
		lifetime: 830,
		color: 'red' 
	},
	
	explosion: {
		glob: {
			numParticles: 15,
			magnitude: 250,
			color: '#b0b0b0',
			lifetime: 660,
			blastRadius: 30,
			blastMagnitude: 700
		},
		
		ship: {
			numParticles: 30,
			magnitude: 300,
			color: 'black',
			lifetime: 1000
		}
	}
};

var stage = 1;

Events.on('stageOver', function () {
	this.stopLoop();
	alert('stage over');
	this.setupStage(++stage);
	this.startLoop();
});

$(function() {
	$('body').html(templates.game);
	
	var canvas = $('canvas').get(0);
	var game = new Game(canvas, settings);
	
	game.setupStage(stage);
	game.startLoop();
});
