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

/*
 * Clears event handlers
 */
Keyboard.prototype.clearHandlers = function () {
	this.handlers = { up: [], down: [] };
}

/*
 * Enables event handlers
 */
Keyboard.prototype.enableEvents = function() {
	this.enabled = true;
}

/*
 * Disables event handlers
 */
Keyboard.prototype.disableEvents = function () {
	this.enabled = false;
}

/*
 * Bind key up event handler
 */
Keyboard.prototype.keyUp = function (code, obj, handler) {
	this.handlers.up[code] = handler;
	this.handlers.up[code].obj = obj; //hack to attach calling object to this
}

/*
 * Bind key down event handler
 */
Keyboard.prototype.keyDown = function (code, obj, handler) {
	this.handlers.down[code] = handler;
	this.handlers.down[code].obj = obj; //hack to attach calling object to this
}

/*
 * Internal key up event handler
 */
Keyboard.prototype.onKeyUp = function (event) {
	if (this.enabled) {
		var code = event.which || window.event.keyCode;
		
		if (this.handlers.up[code]) {
			this.handlers.up[code].call(this.handlers.up[code].obj);
			event.preventDefault();
		}
	}
}

/*
 * Internal key down event handler
 */
Keyboard.prototype.onKeyDown = function (event) {
	if (this.enabled) {
		var code = event.which || window.event.keyCode;
				
		if (this.handlers.down[code]) {
			this.handlers.down[code].call(this.handlers.down[code].obj);
			event.preventDefault();
		}
	}
}

module.exports = Keyboard;
