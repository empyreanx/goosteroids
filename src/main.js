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
		color: '#b0b0b0',
		magnitude: 50,
		dropoff: 0.001
	}
};

var GLOB_MAX_SPEED		 		= 400;					//400				Maxiumum particle velocity														//
var GLOB_EXPLOSION_MAGNITUDE	= 250;					//200				Explosion magnitude (particle max velocity)
var GLOB_BLAST_RADIUS			= 30;					//20				Radius of effect
var GLOB_BLAST_MAGNITUDE		= 700;					//300				Impulse to apply to globs in the radius of effect
														//
var GLOB_MASS					= 1;					//1 				Particle mass
var GLOB_CR						= 0.80;					//1.0				Coefficient of restitution
var GLOB_RADIUS					= 5;					//5					Particle radius
var GLOB_DAMPING				= 1;					//1.0				Glob velocity damping

$(function() {
	$('body').html(templates.game);
	
	var canvas = $('canvas').get(0);
	var game = new Game(canvas, settings);
	
	game.setupStage();
	game.startLoop();
});
