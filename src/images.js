'use strict';

var createjs = require('createjs');

var Images = { };

Images.load = function (manifest, onComplete, onProgress) {
	var queue = new createjs.LoadQueue();
		
	if (onComplete)
		queue.addEventListener("complete", onComplete);
	
	if (onProgress)
			queue.addEventListener("progress", onProgress);
	
	queue.loadManifest(manifest);
}

module.exports = Images;
