'use strict';

var createjs = require('createjs');

var Images = { };

Images.load = function (manifest, onComplete) {
	var queue = new createjs.LoadQueue();
		
	if (onComplete)
		queue.addEventListener("complete", onComplete);
				
	queue.loadManifest(manifest);
}

module.exports = Images;
