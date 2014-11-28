'use strict';

var Body = require('./body.js');
var Vector = require('./vector.js');
var PolarVector = require('./polarvector.js');

var random = require('./utilities.js').random;

/*
 * Encapsulates the ship game object
 */
function Ship(position, settings) {
	Body.call(this, position, new Vector(0, 0), 1.0, settings.maxSpeed, settings.damping);
	
	this.settings = settings;
	
	this.model = isoscelesTriangle(settings.base, settings.height);;
	
	this.orientation = -Math.PI / 2;									//note the value is negative because we are working in screen coordinates
	this.accelerating = 0;												//equal to 1 if the ship is accelerating, 0 otherwise
	this.turning = 0;													//equal to -1 if turning counter-clockwise, 1 turning clockwise, 0 otherwise
}

/*
 * Extend Body
 */
Ship.prototype = Object.create(Body.prototype);
Ship.prototype.constructor = Ship;

/*
 * Returns a vector pointing to the front of the ship
 */
Ship.prototype.getFront = function () {
	var front = this.model[1];
	front = new PolarVector(front.angle() + this.orientation - Math.PI / 2, front.norm() + 2 * this.settings.borderWidth);
	front = front.add(this.position);
	return front;
}

/*
 * Generate engine flames
 */
Ship.prototype.getEngineFlames = function(flameStep, magnitude) {
	var start = this.model[0];
	
	var flames = [ start ];
	
	for (var dist = flameStep; dist < this.settings.base; dist += flameStep) {
		flames.push(new Vector(start.x + dist, start.y - random(0, magnitude) - 2));
	}
	
	flames.push(this.model[this.model.length - 1]);
	
	return flames;
}

/*
 * Updates the state of the ship by one tick
 */
Ship.prototype.update = function (physics) {
	//update physics
	this.orientation += this.turning * this.settings.turnRate * physics.dt;
	
	this.applyForce(new PolarVector(this.orientation, 1).scale(this.accelerating * this.settings.thrust));
	
	physics.update(this);
	
	this.clearForces();
}

/*
 * Renders the ship and engine flames
 */ 
Ship.prototype.render = function (graphics) {
	graphics.drawPolyLine(this.position, this.orientation - Math.PI / 2, this.model, this.settings.borderWidth, this.settings.borderColor, this.settings.interiorColor, true);
	
	if (this.accelerating) {
		graphics.drawPolyLine(this.position, this.orientation - Math.PI / 2, this.getEngineFlames(this.settings.flameStep, this.settings.flameMagnitude), this.settings.flameThickness, this.settings.flameColor);
	}
}

/*
 * Returns true if the ship is colliding with the glob, false ofherwise.
 */
Ship.prototype.collidingWith = function (glob) {
	//write glob position in ship's coordinate frame
	var position = new PolarVector(glob.position.angle() - this.orientation + Math.PI / 2, glob.position.sub(this.position).norm());
	return circleIntersectsTriangle(position, glob.settings.killRadius, this.model[0], this.model[1], this.model[2]);
}

/*
 * Generates an isosceles triangle
 */
function isoscelesTriangle(base, height) {
	var hypotenuse = Math.sqrt(height * height + (1.0 / 4.0) * base * base);
	var theta = Math.atan((2.0 * height) / base);
	
	var v1 = new Vector(0, 0);
	var v2 = new PolarVector(theta, hypotenuse);
	var v3 = new PolarVector(0, base);
	
	var center = v1.add(v2.add(v3)).scale(1/3); //find centroid
	
	v1 = v1.sub(center);
	v2 = v2.sub(center);
	v3 = v3.sub(center);
	
	return [ v1, v2, v3 ];
}

/*
 * Test if p1 and p2 are on the same side of the line l(x) = v1 + x(v2 - v1)
 */
function sameSide(p1, p2, v1, v2) {
	var cp1 = p1.sub(v1).cross(v2.sub(v1));
	var cp2 = p2.sub(v1).cross(v2.sub(v1));
	return (cp1 * cp2 >= 0);
}

/*
 * Tests if p is in the triangle [v1, v2, v3]
 */
function inTriangle(p, v1, v2, v3) {
	return (sameSide(p, v3, v1, v2) && 
			sameSide(p, v1, v2, v3) && 
			sameSide(p, v2, v3, v1));
}

/*
 * Computes the orthogonal projection of p onto the line l(x) = v1 + x(v2 - v1) 
 */
function orthogonalProjection(p, v1, v2) {
	var t = p.sub(v1).dot(v2.sub(v1)) / v2.sub(v1).dot(v2.sub(v1));
	var v = v1.add(v2.sub(v1).scale(t));
	return { t: t, v: v };
}

/*
 * Tests if the circle (center, radius) is in the triangle [v1, v2, v3]
 */
function circleIntersectsTriangle(center, radius, v1, v2, v3) {
	if (inTriangle(center, v1, v2, v3))
		return true;
	
	if (center.distance(v1) < radius ||
		center.distance(v2) < radius ||
		center.distance(v3) < radius)
		return true;
		
	var proj = orthogonalProjection(center, v1, v2);
	
	if (0 < proj.t && proj.t < 1 && center.distance(proj.v) < radius)
		return true;
	
	proj = orthogonalProjection(center, v2, v3);
	
	if (0 < proj.t && proj.t < 1 && center.distance(proj.v) < radius)
		return true;
	
	proj = orthogonalProjection(center, v3, v1);
	
	if (0 < proj.t && proj.t < 1 && center.distance(proj.v) < radius)
		return true;
	
	return false;
}

module.exports = Ship;
