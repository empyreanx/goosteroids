'use strict';

var createjs = require('createjs');

var Sound = { 
	enabled: true,
	muted: false
};

Sound.init = function () {
	if (!createjs.Sound.isReady()) {
		createjs.Sound.registerPlugins([ createjs.WebAudioPlugin, createjs.HTMLAudioPlugin ]);
		
		var cap = createjs.Sound.getCapabilities();
		
		if (!cap.mp3) {
			Sound.enabled = false;
		}
	}
}

Sound.load = function (manifest, onComplete, onProgress) {
	if (Sound.enabled) {
		var queue = new createjs.LoadQueue();
		
		queue.installPlugin(createjs.Sound);
		queue.addEventListener("complete", onComplete);
		
		if (onProgress)
			queue.addEventListener("progress", onProgress);
			
		queue.loadManifest(manifest);
	}
}

Sound.play = function (id, volume, loop, onComplete) {
	if (Sound.enabled) {
		volume = (volume == undefined) ? 1 : volume; 
		
		var sound = null;
		
		if (loop) {
			sound = createjs.Sound.play(id, createjs.Sound.INTERRUPT_NONE, 0, 0, -1, volume, 0);
		} else {
			sound = createjs.Sound.play(id, createjs.Sound.INTERRUPT_NONE, 0, 0, 0, volume, 0);
		}
	
		if (onComplete) {
			sound.addEventListener("complete", onComplete);
		}
	}
}

Sound.mute = function () {
	Sound.muted = true;
	createjs.Sound.setMute(true);
}

Sound.unmute = function () {
	Sound.muted = false;
	createjs.Sound.setMute(true);
}



module.exports = Sound;
