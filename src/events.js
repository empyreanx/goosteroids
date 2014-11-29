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

Events.trigger = function (name, ctx) {
	if (Events.handlers[name]) {
		if (ctx == undefined) {
			ctx = null;
		}
		
		Events.handlers[name].call(ctx);
	}
}

module.exports = Events;
