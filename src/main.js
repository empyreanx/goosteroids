var $ = require('jquery');

var Game = require('./game.js');

var templates = { game: require('../tpl/game.hbs') };

var settings = { 
	fps: 30,
	
	ship: {
		damping: 0.5,
		maxSpeed: 400,
		thrust: 450,
		turnRate: 7.5,
		interiorColor: 'white',
		borderColor: 'black',
		borderWidth: 3,
		base: 15,
		height: 25
	},
	
	glob: {
		radius: 5,
		maxSpeed: 400,
		damping: 1,
		cr: 0.8,
		color: '#b0b0b0',
		magnitude: 50,
		dropoff: 0.001
	}
};

$(function() {
	$('body').html(templates.game);
	
	var canvas = $('canvas').get(0);
	var game = new Game(canvas, settings);
	
	game.setupStage();
	game.startLoop();
});
