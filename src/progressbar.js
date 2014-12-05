'use strict';

var $ = require('jquery');

$.fn.progressBar = function() {
	this.addClass('progress-bar');
	this.append('<div></div>');
	
	this.progress = function (percent) {
		this.find('div').width(percent * this.width() / 100);
	}
	
	return this;
}
