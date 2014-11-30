'use strict';

Array.prototype.remove = function (index) {
	return this.splice(index, 1);
}

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

exports.remove = function (array, index) {
	array.splice(index, 1);
}
