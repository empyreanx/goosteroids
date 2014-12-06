/*
 * JQuery imports
 */ 
var $ = require('jquery');

global.jQuery = $;

require('jquery-ui');
require('./progressbar.js');

/*
 * Game imports
 */
var Game = require('./game.js');
var HighScores = require('./highscores.js');
var Events = require('./events.js');
var Sound = require('./sound.js');

/*
 * Game settings
 */
var settings = { 
	fps: 30,					//default frames per second
	lives: 0,
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
		
		speedBoost: {
			fuel: 100,
			thrust: 2500,
			maxSpeed: 800,
			rechargeCooldown: 2000,
			rechargeTime: 2000,
			boostTime: 1000,
			
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
	introduction: require('../tpl/introduction.hbs'),
	stage: require('../tpl/stage.hbs'),
	game: require('../tpl/game.hbs'),
	gameOver: require('../tpl/gameover.hbs'),
	scores: require('../tpl/scores.hbs')
};

/*
 * Globals
 */
 
var screens = {
	splash: null,
	introduction: null,
	game: null,
	gameOver: null,
	scores: null
};

var game = null;

/*
 * Register event handlers
 */
Events.on('stageOver', function () {
	this.stopLoop();
	
	game.nextStage();
	
	var stageScreen = $(templates.stage({ stage: game.stage }));
	$('body').append(stageScreen);
	
	fade(screens.game, stageScreen, function () {
		fade(stageScreen, screens.game, function () {
			stageScreen.remove();
		});
		
		game.startLoop();
	});
	
});

Events.on('gameOver', function () {
	Sound.stopMusic();
	Sound.stopAll();
	
	$('body').append(screens.gameOver);
	
	fade(screens.game, screens.gameOver, function () {
		game.stopLoop();
	
		HighScores.load();
		
		HighScores.add('James', game.stage, game.score, '1min');
		
		HighScores.save();
	
		screens.scores = $(templates.scores({ score: game.score, scores: HighScores.scores }));
		$('body').append(screens.scores);
		
		fade(screens.gameOver, screens.scores, function () {
			screens.gameOver.remove();
		});
	});
});

function playGame(screen) {
	game = new Game($('#canvas').get(0), settings);
	game.nextStage();
	
	var stageScreen = $(templates.stage({ stage: 1 }));
	$('body').append(stageScreen);
	
	fade(screen, stageScreen, function () {
		screen.remove();
			
		fade(stageScreen, screens.game, function ()  {
			stageScreen.remove();
		});
			
		game.startLoop();
	});
}

/*
 * Main
 */
$(function() {
	screens.splash = $(templates.splash());
	screens.introduction = $(templates.introduction());
	screens.game = $(templates.game());
	screens.gameOver = $(templates.gameOver());
	
	$('#sound-toggle').click(function () {
		if (Sound.muted) {
			Sound.unmute();
			$(this).find('img').attr('src', 'image/sound-on.png');
		} else {
			Sound.mute();
			$(this).find('img').attr('src', 'image/sound-off.png');
		}
	});
	
	Sound.init(settings.sound);
	
	$('body').append(screens.splash);
	
	var progressBar = $('#progress-bar').progressBar();
	screens.splash.show();
	
	$('body').append(screens.introduction);
	
	Sound.load(sounds, function () {
		fade(screens.splash, screens.introduction, function () {
			screens.splash.remove();
		});
		
		$('body').append(screens.game);
			
		$('#play-button').click(function () {
			Sound.startMusic();
			playGame(screens.introduction);
		});
	}, function (data) {
		progressBar.progress(data.progress * 100);
	});
});

/*
 * Utility function for fading from one screen to another.
 */
function fade(screenOut, screenIn, onComplete) {	
	screenOut.fadeOut(2000);
	
	if (onComplete)
		screenIn.fadeIn(2000, onComplete);
	else
		screenIn.fadeIn(2000);
}
