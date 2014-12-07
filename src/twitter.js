'use strict';

var Twitter = { };

Twitter.tweet = function (text, url, hashTags) {
	var	href = 'https://twitter.com/intent/tweet?';
	href += 'hashtags=' + encodeURIComponent(hashTags + ',');
	href += '&url=' + encodeURIComponent(url); 
	href += '&text=' + encodeURIComponent(text)
	href += '&tw_p=tweetbutton';
	window.open(href);
}

module.exports = Twitter;
