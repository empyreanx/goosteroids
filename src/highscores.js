'use strict';

var $ = require('jquery');
require('jquery.cookie');
require('./utilities.js');

var HighScores = { scores: [] };

HighScores.load = function () {	
	var cookie = $.cookie('goosteroids');
	
	if (cookie) {
		var scores = JSON.parse(cookie).highScores;
		
		console.log(scores);
		
		if (scores) {
			this.scores = scores;
		}
	}
}

HighScores.save = function () {
	var cookie = $.cookie('goosteroids');
	var goosteroids = {};
	
	if (cookie) {
		goosteroids = JSON.parse(cookie);
	}
	
	goosteroids.highScores = this.scores;
	
	$.cookie('goosteroids', JSON.stringify(goosteroids));
}

HighScores.index = function (score) {
	var index = 0;
	
	while (index < this.scores.length) {
		if (score < this.scores[index].score)
			index++;
		else
			break;
	}
	
	return index;
}

HighScores.isHigh = function (score) {
	return (this.index(score) < 10);
}

HighScores.add = function (name, stage, score, time) {
	var index = this.index(score);
	
	if (index < 10) {
		this.scores.splice(index, 0, { name: name, stage: stage, score: score, time: time });
	}
	
	if (this.scores.length > 10) {
		this.scores.remove(this.scores.length - 1);
	}
}

module.exports = HighScores;
