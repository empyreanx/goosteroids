/*
 * JQuery imports
 */ 
var $ = require('jquery');

global.jQuery = $;				//for plugins

require('jquery-ui');			//for effects
require('jquery.cookie');		//for persistence

require('./dialog.js');			//custom dialog plugin
require('./progressbar.js');	//custom progress bar plugin

/*
 * Game imports
 */
var Game = require('./game.js');
var HighScores = require('./highscores.js');
var Images = require('./images.js');
var Events = require('./events.js');
var Sound = require('./sound.js');
var Twitter = require('./twitter.js');

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
	minCanvasHeight: 584,
	maxCanvasHeight: 768,
	canvasMargin: 50,
	
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

var splashImages = [
	{
		id: 'goosteroids-logo-large',
		src: 'images/goosteroids-logo-large.png'
	},
	{
		id: 'sound-on',
		src: 'images/sound-on.png'
	},
	{
		id: 'sound-off',
		src: 'images/sound-off.png'
	}
];

var images = [
	{
		id: 'goosteroids-logo-small',
		src: 'images/goosteroids-logo-small.png'
	},
	{
		id: 'github-logo-small',
		src: 'images/github-logo-small.png'
	},
	{
		id: 'twitter-logo-small',
		src: 'images/twitter-logo-small.png'
	},
	{
		id: 'up-arrow',
		src: 'images/up-arrow.png'
	},
	{
		id: 'left-arrow',
		src: 'images/left-arrow.png'
	},
	{
		id: 'right-arrow',
		src: 'images/right-arrow.png'
	}
];

var sounds = [
	{
		id: 'laser',
		src: 'sounds/mp3/laser.mp3'
	},
	{
		id: 'pop',
		src: 'sounds/mp3/pop.mp3'
	},
	{
		id: 'explosion',
		src: 'sounds/mp3/explosion.mp3'
	},	
	{
		id: 'music1',
		src: 'sounds/mp3/music1.mp3'
	},
	{
		id: 'music2',
		src: 'sounds/mp3/music2.mp3'
	},
	{
		id: 'music3',
		src: 'sounds/mp3/music3.mp3'
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
	scores: require('../tpl/scores.hbs'),
	dialogs: {
		highScore: require('../tpl/dialogs/highscore.hbs'),
		twitter: require('../tpl/dialogs/twitter.hbs'),
		about: require('../tpl/dialogs/about.hbs'),
		credits: require('../tpl/dialogs/credits.hbs')
	}
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

var game = null;		//global game object
var startTime = 0;		//game start time
var endTime = 0;		//game end time

/*
 * Dialog display functions
 */
function highScoreDialog() {
	var dialog = $(templates.dialogs.highScore()).dialog();
		
	dialog.find('button.submit').click(function () {
		var name = dialog.find('input.name').val().trim();
	
		if (name.length > 0) {
			HighScores.add(name, game.stage, timeToString(endTime - startTime), game.score);
			HighScores.save();
			
			$.modal.close();
			
			scoresScreen();
		} else {
			dialog.find('span.message').html('Bragging requires a name!<br>Please enter your name below:');
		}
	});
	
	dialog.find('button.cancel').click(function () {
		HighScores.add('Anonymous Coward', game.stage, timeToString(endTime - startTime), game.score);
		HighScores.save();
		
		$.modal.close();
		
		scoresScreen();
	});
}

function twitterDialog() {
	var dialog = $(templates.dialogs.twitter()).dialog();
		
	dialog.find('button.submit').click(function () {
		var name = dialog.find('input.name').val().trim();
		
		if (name.length > 0) {
			Twitter.tweet(name + ' got a score of ' + game.score + ' playing Goosteroids! Play now at', 'http://goosteroids.com', 'Goosteroids');
			$.modal.close();
		} else {
			dialog.find('span.message').html('Tweeting requires a name!<br>Please enter your name below:');
		}
	});
	
	dialog.find('button.cancel').click(function () {
		$.modal.close();		
	});
}

function aboutDialog() {
	var dialog = $(templates.dialogs.about()).dialog();
		
	dialog.find('button.close').click(function () {
		$.modal.close();
	});
}

function creditsDialog() {
	var dialog = $(templates.dialogs.credits()).dialog();
		
	dialog.find('button.close').click(function () {
		$.modal.close();
	});
}

/*
 * Screen display functions
 */
function scoresScreen() {
	screens.scores = $(templates.scores( { score: game.score, scores: HighScores.scores } ));
	
	addScreen(screens.scores);
	
	screens.scores.find('img.twitter').click(function () {
		twitterDialog();
	});
	
	screens.scores.find('button.about').click(function () {
		aboutDialog();
	});
	
	screens.scores.find('button.play').click(function () {
		playGame(screens.scores);
	});
	
	screens.scores.find('button.credits').click(function () {
		creditsDialog();
	});
	
	fade(screens.gameOver, screens.scores, function () {
		screens.gameOver.remove();
	});
}

function playGame(fromScreen) {
	Sound.startMusic();
	
	game = new Game($('#canvas').get(0), settings);
	game.nextStage();
	
	var stageScreen = $(templates.stage( { stage: 1 } ));
	addScreen(stageScreen);
	
	fade(fromScreen, stageScreen, function () {
		fromScreen.remove();
		
		$(window).on('resize', resizeCanvas);
		
		fade(stageScreen, screens.game, function ()  {
			stageScreen.remove();
		});
		
		resizeCanvas();
		
		startTime = new Date().getTime();	
		game.startLoop();
	});
}

/*
 * Register event handlers
 */
Events.on('stageOver', function () {
	this.stopLoop();
	
	game.nextStage();
	
	var stageScreen = $(templates.stage( { stage: game.stage } ));
	addScreen(stageScreen);
	
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
	
	addScreen(screens.gameOver);
	
	fade(screens.game, screens.gameOver, function () {
		$(window).unbind('resize');
		
		game.stopLoop();
		
		endTime = new Date().getTime();
		
		HighScores.load();
		
		if (HighScores.isHigh(game.score)) {
			highScoreDialog();
		} else {
			scoresScreen();
		}
	});
});

function isMobile() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
}

/*
 * Main
 */
$(function() {
	if (!isMobile()) {
		screens.splash = $(templates.splash());
		screens.introduction = $(templates.introduction());
		screens.game = $(templates.game());
		screens.gameOver = $(templates.gameOver());
		
		Sound.init(settings.sound);
		
		Images.load(splashImages, function() {
			initMuteToggle();
			
			addScreen(screens.splash);
			
			var progressBar = $('#progress-bar').progressBar();
			screens.splash.show();
			
			Images.load(images, function () {
				Sound.load(sounds, function () {
					addScreen(screens.introduction);
					
					fade(screens.splash, screens.introduction, function () {
						screens.splash.remove();
					});
					
					addScreen(screens.game);
						
					screens.introduction.find('button.play').click(function () {
						playGame(screens.introduction);
					});
				}, function (data) {
					progressBar.progress(50 + data.progress * 50);
				});
			}, function (data) {
				progressBar.progress(data.progress * 50);
			});
		});
	} else {
		alert('Sorry, mobile browsers not supported! Get on a PC and come back!');
	}
});

/*
 * Iteratively resize canvas to fit window. TODO: Make this function more generic, and 
 * if possible, more efficient.
 */
function resizeCanvas() {
	var i = 1;
	
	while($('#canvas').height() + 2 * settings.canvasMargin > $(window).height() && $('#canvas').height() > settings.minCanvasHeight) {
		$('#canvas').attr('width', $('#canvas').width() - 4*i);
		$('#canvas').attr('height', $('#canvas').height() - 3*i);	
		i++;
	}
	
	i = 1;
	
	while($('#canvas').height() + 2 * settings.canvasMargin < $(window).height() && $('#canvas').height() < settings.maxCanvasHeight) {
		$('#canvas').attr('width', $('#canvas').width() + 4*i);
		$('#canvas').attr('height', $('#canvas').height() + 3*i);	
		i++;
	}
}

/*
 * Initializes the mute sound toggle button.
 */
function initMuteToggle() {
	var toggle = $('#mute-toggle');
	
	var muted = $.cookie('muted');
	
	if (muted && muted == 'true') {
		Sound.mute();
		toggle.find('img').attr('src', 'images/sound-off.png');
	}	
	
	toggle.show();
	
	toggle.click(function () {
		if (Sound.muted) {
			Sound.unmute();
			$(this).find('img').attr('src', 'images/sound-on.png');
			$.cookie('muted', 'false', { expires: 365 } );
		} else {
			Sound.mute();
			$(this).find('img').attr('src', 'images/sound-off.png');
			$.cookie('muted', 'true', { expires: 365 } );
		}
	});
}

/*
 * Utiltity function for adding a screen to the body.
 */
function addScreen(screen) {
	$('body').append(screen);
}

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

/*
 * Utilitiy function for converting a time in milliseconds to a string
 */
function timeToString(time) {
	time = Math.round(time / 1000);				//convert time to seconds
	
	var hours = Math.round(time / (60 * 60));	//calculuate hours
	
	time = time % (60 * 60);					
	
	var minutes = Math.round(time / 60);		//calculate minutes
	
	time = time % 60;
	
	var seconds = time;
	
	var str = '';
	
	if (hours > 0) {
		str += hours + 'h ';
	}
	
	if (minutes > 0) {
		str += minutes + 'm ';
	}
	
	if (seconds > 0) {
		str += seconds + 's';
	}
	
	return str;
}
