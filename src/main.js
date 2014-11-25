var $ = require('jquery');

var gameTpl = require('../tpl/game.hbs');
$('body').html(gameTpl());

var Physics = require("./physics.js");
var Vector = require("./vector.js");
var Graphics = require("./graphics.js");

var canvas = $('canvas').get(0);
var graphics = new Graphics(canvas);

graphics.drawCircle(new Vector(canvas.width/2, canvas.height/2), 5, 'black');
