'use strict';

var createjs = require('createjs');

var randomInteger = require('./utilities.js').randomInteger;

var Sound = { 
	settings: {},
	enabled: true,
	muted: false,
	musicOn: false,
	music: null
};

Sound.init = function (settings) {
	Sound.settings = settings;
	
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
		
		return sound;
	}
	
	return null;
}

Sound.playMusic = function (onComplete) {
	Sound.music = Sound.play('music' + randomInteger(1, Sound.settings.numTracks), 1, false, onComplete);
}

Sound.startMusic = function () {
	Sound.musicOn = true;
	
	var onComplete = function () {
		if (Sound.musicOn) {
			Sound.playMusic(onComplete);
		}
	};
	
	Sound.playMusic(onComplete);
}

Sound.stopMusic = function () {
	Sound.musicOn = false;
	Sound.music.stop();
}

Sound.mute = function () {
	Sound.muted = true;
	createjs.Sound.setMute(true);
}

Sound.unmute = function () {
	Sound.muted = false;
	createjs.Sound.setMute(true);
}

Sound.stopAll = function () {
	if (Sound.enabled)
		createjs.Sound.stop();
}

module.exports = Sound;
