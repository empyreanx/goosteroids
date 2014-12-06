'use strict';

var $ = require('jquery');
require('jquery.cookie');
require('./utilities.js');

var HighScores = { scores: [] };

HighScores.load = function () {	
	var cookie = $.cookie('high-scores');
	
	if (cookie) {
		this.scores = JSON.parse(cookie);
	}
}

HighScores.save = function () {
	$.cookie('high-scores', JSON.stringify(this.scores));
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
