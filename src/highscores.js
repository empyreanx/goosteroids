'use strict';

var $ = require('jquery');
require('jquery.cookie');
require('./utilities.js');

var HighScores = { scores: [], maxScores: 5 };

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
	return (this.index(score) < this.maxScores);
}

HighScores.add = function (name, stage, time, score) {
	var index = this.index(score);
	
	if (index < this.maxScores) {
		this.scores.splice(index, 0, { name: name, stage: stage, score: score, time: time });
	}
	
	if (this.scores.length > this.maxScores) {
		this.scores.remove(this.scores.length - 1);
	}
}

module.exports = HighScores;
