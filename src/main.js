/*
 * JQuery imports
 */ 
var $ = require('jquery');

require('jquery-ui');
require('./progressbar.js');

/*
 * Game imports
 */
var Game = require('./game.js');
var Events = require('./events.js');
var Sound = require('./sound.js');

/*
 * Game settings
 */
var settings = { 
	fps: 30,					//default frames per second
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
		invulnerable: 1500,
		
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
		magnitude: 50,							//gravitational magnitude
		dropoff: 0.005,							//gravitational dropoff
		killRadius: 10							//used in detecting ship/glob collisions
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
		killRadius: 12.5,						//used in detecting bullet/glob collisions
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
	},
	
	sound: {
		numTracks: 3
	}
};

var sounds = [
	{
		id: 'laser',
		src: 'sound/mp3/laser.mp3'
	},
	{
		id: 'pop',
		src: 'sound/mp3/pop.mp3'
	},
	{
		id: 'explosion',
		src: 'sound/mp3/explosion.mp3'
	},	
	{
		id: 'music1',
		src: 'sound/mp3/music1.mp3'
	},
	{
		id: 'music2',
		src: 'sound/mp3/music2.mp3'
	},
	{
		id: 'music3',
		src: 'sound/mp3/music3.mp3'
	}
];

/*
 * Templates
 */ 
var templates = {
	splash: require('../tpl/splash.hbs'), 
	game: require('../tpl/game.hbs')
};

/*
 * Globals
 */
var stage = 1;
var game = null;

/*
 * Register event handlers
 */
Events.on('stageOver', function () {
	this.stopLoop();
	alert('stage over');
	this.setupStage(++stage);
	this.startLoop();
});

Events.on('gameOver', function () {
	Sound.stopMusic();
	Sound.stopAll();
	alert('gameOver: ' + this.score);
});

function fade(screenOut, screenIn, onComplete) {	
	screenOut.fadeOut(2000);
	
	if (onComplete)
		screenIn.fadeIn(2000, onComplete);
	else
		screenIn.fadeIn(2000);
}

function startGame() {
	Sound.startMusic();
	
	game = new Game($('#canvas').get(0), settings);
	game.setupStage(stage);
	game.startLoop();
}

$(function() {
	Sound.init(settings.sound);
	
	var splashScreen = $(templates.splash());
	
	$('body').append(splashScreen);
	var progressBar = $('#progress-bar').progressBar();
	splashScreen.show();
	
	var gameScreen = $(templates.game());
	$('body').append(gameScreen);
	
	Sound.load(sounds, function () {
		fade(splashScreen, gameScreen, function () {
			splashScreen.remove();
		});
		
		startGame();
	}, function (data) {
		progressBar.progress(data.progress * 100);
	});
});
