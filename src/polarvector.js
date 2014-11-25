'use strict';

var Vector = require("./vector.js");

function PolarVector(angle, length) {
	Vector.call(this, length * Math.cos(angle), length * Math.sin(angle));
}

PolarVector.prototype = new Vector();

module.exports = PolarVector;
