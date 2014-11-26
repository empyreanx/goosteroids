'use strict';

var keys = { spacebar: 32, shift: 16, left: 37, right: 39, up: 38, down: 40 };

function Keyboard(enabled) {
	this.enabled = enabled || false;
	
	this.clearHandlers();
	
	document.onkeyup = (function (self) { 
							return function(event) {
								return self.onKeyUp(event);
							}
						})(this);
	
	document.onkeydown = (function (self) { 
							return function(event) {
								return self.onKeyDown(event);
							}
						})(this);
}

Keyboard.keys = keys;

Keyboard.prototype.enableEvents = function() {
	this.enabled = true;
}

Keyboard.prototype.disableEvents = function () {
	this.enabled = false;
}

Keyboard.prototype.clearHandlers = function () {
	this.handlers = { up: [], down: [] };
}

Keyboard.prototype.keyUp = function (code, handler) {
	this.handlers.up[code] = handler;
}

Keyboard.prototype.keyDown = function (code, handler) {
	this.handlers.down[code] = handler;
}

Keyboard.prototype.onKeyUp = function (event) {
	if (this.enabled) {
		var code = event.which || window.event.keyCode;
		
		if (this.handlers.up[code]) {
			this.handlers.up[code].call();
			event.preventDefault();
		}
	}
}

Keyboard.prototype.onKeyDown = function (event) {
	if (this.enabled) {
		var code = event.which || window.event.keyCode;
		
		console.log(code);
		
		if (this.handlers.down[code]) {
			this.handlers.down[code].call();
			event.preventDefault();
		}
	}
}

module.exports = Keyboard;
