'use strict';

exports.clamp = function (c, min, max) {
	if (c < min)
		return min;
	else if (c > max)
		return max
	else
		return c;
}
