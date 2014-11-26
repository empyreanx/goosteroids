var $ = require('jquery');

var Game = require('./game.js');

var templates = { game: require('../tpl/game.hbs') };

var settings = { 
	fps: 30
};

$(function() {
	$('body').html(templates.game);
	
	var canvas = $('canvas').get(0);
	var game = new Game(canvas, settings);
	
	game.setupStage();
	game.startLoop();
});
