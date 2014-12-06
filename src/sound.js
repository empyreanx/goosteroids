'use strict';

var createjs = require('createjs');

var randomInteger = require('./utilities.js').randomInteger;

var Sound = { 
	settings: {},
	volume: 1,
	enabled: false,
	muted: false,
	musicOn: false,
	music: null
};

Sound.init = function (settings) {
	Sound.settings = settings;
	
	if (!createjs.Sound.isReady()) {
		createjs.Sound.registerPlugins([ createjs.WebAudioPlugin, createjs.HTMLAudioPlugin ]);
		
		var cap = createjs.Sound.getCapabilities();
		
		if (cap.mp3) {
			Sound.enabled = true;
		} else {
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

Sound.setVolume = function (volume) {
	Sound.volume = volume;
}

Sound.play = function (id, loop, onComplete) {
	if (Sound.enabled) {
		var sound = null;
		
		if (loop) {
			sound = createjs.Sound.play(id, createjs.Sound.INTERRUPT_NONE, 0, 0, -1, this.volume, 0);
		} else {
			sound = createjs.Sound.play(id, createjs.Sound.INTERRUPT_NONE, 0, 0, 0, this.volume, 0);
		}
	
		if (onComplete) {
			sound.addEventListener("complete", onComplete);
		}
		
		return sound;
	} else {
		return null;
	}
}

Sound.playMusic = function (onComplete) {
	if (Sound.enabled) {
		Sound.music = Sound.play('music' + randomInteger(1, Sound.settings.numTracks), false, onComplete);
	}
}

Sound.startMusic = function () {
	if (Sound.enabled) {
		Sound.musicOn = true;
		
		var onComplete = function () {
			if (Sound.musicOn) {
				Sound.playMusic(onComplete);
			}
		};
		
		Sound.playMusic(onComplete);
	}
}

Sound.stopMusic = function () {
	if (Sound.enabled) {
		Sound.musicOn = false;
		Sound.music.stop();
	}
}

Sound.mute = function () {
	if (Sound.enabled) {
		Sound.muted = true;
		createjs.Sound.setMute(true);
	}
}

Sound.unmute = function () {
	if (Sound.enabled) {
		Sound.muted = false;
		createjs.Sound.setMute(false);
	}
}

Sound.stopAll = function () {
	if (Sound.enabled)
		createjs.Sound.stop();
}

module.exports = Sound;
