var $ = require('jquery');

var gameTpl = require('../tpl/game.hbs');
$('body').html(gameTpl());

var settings = require('./settings.js');

var Game = require('./game.js');

var canvas = $('canvas').get(0);

var game = new Game(canvas, settings);

game.setupStage();
game.startLoop();

