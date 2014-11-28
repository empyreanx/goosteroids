'use strict';

function Graphics(canvas) {
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
}

Graphics.prototype.resizeCanvas = function (width, height) {
	this.canvas.width = width;
	this.canvas.height = height;
}

Graphics.prototype.clear = function () {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Graphics.prototype.drawCircle = function (position, radius, color) {
	this.ctx.beginPath();
	this.ctx.fillStyle = color;
	this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
	this.ctx.closePath();
	this.ctx.fill();
}

Graphics.prototype.drawPolyLine = function (position, orientation, vertices, borderWidth, borderColor, interiorColor, isClosed) {
	this.ctx.save();
	
	this.ctx.translate(position.x, position.y);
	this.ctx.rotate(orientation);
	
	this.ctx.beginPath();
	this.ctx.moveTo(vertices[0].x, vertices[0].y);
	
	for (var i = 1; i < vertices.length; i++) {
		this.ctx.lineTo(vertices[i].x, vertices[i].y);
	}
	
	if (interiorColor) {
		this.ctx.fillStyle = interiorColor;
		this.ctx.fill();
	}
	
	if (borderWidth) {
		this.ctx.lineWidth = borderWidth;
		
		if (borderColor) {
			this.ctx.strokeStyle = borderColor;
		}
		
		if (isClosed) {
			this.ctx.closePath();
			this.ctx.stroke();
		} else {
			this.ctx.stroke();
		}
	}
	
	this.ctx.restore();
}

module.exports = Graphics;
