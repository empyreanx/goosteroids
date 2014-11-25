'use strict';

var Vector = function (x, y) {
	this.x = x;
	this.y = y;
}

Vector.prototype.add = function (v) {
	return new Vector(this.x + v.x, this.y + v.y);
}
	
Vector.prototype.sub = function (v) {
	return new Vector(this.x - v.x, this.y - v.y);
}
	
Vector.prototype.scale = function (c) {
	return new Vector(c * this.x, c * this.y);
}
	
Vector.prototype.dot = function (v) {
	return (this.x * v.x + this.y * v.y);
}
	
Vector.prototype.cross = function (v) {
	return (this.x * v.y - this.y * v.x);
}
	
Vector.prototype.angle = function() {
	return Math.atan(this.y, this.x);
}	

Vector.prototype.norm = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
}
	
Vector.prototype.normalize = function() {
	var c = this.norm();
		
	if (c == 0) {
		return this;
	} else {
		return this.scale(1 / c);
	}
}
	
Vector.prototype.distance = function(v) {
	return this.sub(v).norm();
}
	
Vector.prototype.toString = function() {
	return "Vector(" + this.x + ", " + this.y + ")";
}

module.exports = Vector;
