'use strict';

/*
 * Encapsulates the "grey goo" effect.
 */
function GreyGoo(width, height, settings) {
	this.settings = settings;
	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.resizeCanvas(width, height);
}

/*
 * Resizes internal canvas. Can be called in the fly.
 */
GreyGoo.prototype.resizeCanvas = function (width, height) {
	this.canvas.width = width;
	this.canvas.height = height;
}

/*
 * Render grey goo to 'canvas' using meta-ball technique.
 */
GreyGoo.prototype.render = function (canvas, globs) {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	//draw gradients
	for (var i = 0; i < globs.length; i++) {
		var glob = globs[i];
		
		this.ctx.beginPath();
		
		var gradient = this.ctx.createRadialGradient(glob.position.x, glob.position.y, glob.radius, glob.position.x, glob.position.y, this.settings.gradientRadius);
		gradient.addColorStop(0, this.settings.gradientStop0);
		gradient.addColorStop(1, this.settings.gradientStop1);
		
		this.ctx.fillStyle = gradient;
		this.ctx.arc(glob.position.x, glob.position.y, glob.radius + this.settings.gradientRadius, 0, 2 * Math.PI);
		this.ctx.fill();
	}
	
	//filter alpha channel
	var image = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
	var imageData = image.data;
	
	for (var i = 0; i < imageData.length; i += 4) {
		var j = i + 3;

		if (imageData[j] < this.settings.minThreshold) {
			imageData[j] = 0;	
		} else if (this.settings.minThreshold <= imageData[j] && imageData[j] <= this.settings.maxThreshold) {
			imageData[j] = 255;	
		} else if (imageData[j] > this.settings.maxThreshold) {
			imageData[j] = 255;
		}
	}
	
	canvas.getContext('2d').putImageData(image, 0, 0);
}

module.exports = GreyGoo;
