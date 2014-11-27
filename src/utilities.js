'use strict';

exports.clamp = function (c, min, max) {
	if (c < min)
		return min;
	else if (c > max)
		return max
	else
		return c;
}

exports.random = function (min, max) {
	return min + Math.random() * (max - min);
}

exports.randomInteger = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;	
}
