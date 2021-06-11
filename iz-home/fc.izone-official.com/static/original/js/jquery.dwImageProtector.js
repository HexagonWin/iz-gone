/*
	Class:    	dwIMageProtector
	Author:   	David Walsh
	Website:    https://davidwalsh.name
	Version:  	1.0.0
	Date:     	08/09/2008
	Built For:  jQuery 1.2.6
*/


jQuery.fn.protectImage = function(settings) {
	settings = jQuery.extend({
		image: 'https://fc.izone-official.com/static/izone/fanclub/common/spacer.gif',
		zIndex: 10
	}, settings);
	return this.each(function() {
		var position = $(this).position();
		var height = $(this).height();
		var width = $(this).width();
		$('<img>').attr({
			width: width,
			height: height,
			src: settings.image
		}).css({
			border: 'none',
			top: position.top,
			left: position.left,
			position: 'absolute',
			zIndex: settings.zIndex
		}).appendTo('.guard')
	});
};

$(window).bind('load', function() {
	$('.protect').protectImage();
});

$(window).bind('resize', function() {
	$('.protect').protectImage();
});