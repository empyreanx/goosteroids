'use strict';

var Time = {};

Time.milliseconds = function () {
	return new Date().getTime();
}

Time.seconds = function () {
	return Time.milliseconds() / 1000.0;
}

module.exports = Time;
