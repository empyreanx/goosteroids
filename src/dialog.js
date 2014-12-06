var $ = require('jquery');

$.fn.dialog = function(onClose) {
	this.addClass('dialog');
	
	this.children().wrapAll('<div style="display:table; width:100%; height:100%; margin:0px; padding:0px;"></div>');
	
	var table = this.children().first();
		
	var header = table.children().eq(0);
	var body = table.children().eq(1);
	var footer = table.children().eq(2);
	
	header.addClass('header');
	body.addClass('body');
	footer.addClass('footer');
	
	header.append('<hr>');
	header.wrap('<div style="display:table-row;"></div>');
	header.wrap('<div style="display:table-cell; vertical-align:top;"></div>');
	
	body.wrap('<div style="display:table-row;"></div>');
	body.wrap('<div style="display:table-cell; vertical-align:middle;"></div>');
	
	footer.prepend('<hr>');
	footer.wrap('<div style="display:table-row;"></div>');
	footer.wrap('<div style="display:table-cell; vertical-align:bottom;"></div>');
	
	if (onClose)
		this.modal( { onClose: onClose } );
	else
		this.modal();
	
	return this;
}
