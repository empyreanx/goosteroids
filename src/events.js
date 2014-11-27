'use strict';

/*
 * Global event handling
 */
var Events = { handlers: [] };

Events.clearHandlers = function () {
	Events.handlers = [];
}

Events.on = function(name, handler) {
	Events.handlers[name] = handler;
}

Events.trigger = function (name, data) {
	Events.handlers[name].call(null, data);
}

module.exports = Events;
