jQuery.fn.protectImage = function(settings) {
	$("img[name=blank]").remove();

	settings = jQuery.extend({
		image: '/shared/img/parts/spacer.gif',
		zIndex: 10
	}, settings);
	return this.each(function() {
		var position = $(this).position();
		var height = $(this).height();
		var width = $(this).width();
		$('<img />').attr({
			width: width,
			height: height,
			src: settings.image,
			name : "blank"
		}).css({
			top: position.top,
			left: position.left,
			position: 'absolute',
			zIndex: settings.zIndex
		}).appendTo('body')
	});
};

$(window).bind('load', function() {
	$('.photo').protectImage();
});

$(window).bind('resize', function() {
	$('.photo').protectImage();
});