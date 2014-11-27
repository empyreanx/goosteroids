'use strict';

function Events() {
	this.clearHandlers();
}

Events.prototype.clearHandlers = function () {
	this.handlers = [];
}

Events.prototype.on = function (name, handler) {
	this.handlers[name] = handler;
}

Events.prototype.trigger = function (name, data) {
	this.handlers[name].call(null, data);
}

module.exports = Events;
