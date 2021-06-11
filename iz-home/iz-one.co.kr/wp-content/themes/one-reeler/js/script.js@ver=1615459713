window.$ = jQuery;

var page = $('body').data('page-label');

if (page === 'photos') {
	
	document.addEventListener("DOMContentLoaded", function(){
		yall({
			events: {
				load: function (event) {
					if (!event.target.classList.contains("lazy") && event.target.nodeName == "IMG") {
						event.target.classList.add("loaded");
					}
				}
			}
		});
	});
	
	var initPhotoSwipeFromDOM = function(gallerySelector) {
		var parseThumbnailElements = function(el) {
			var thumbElements = el.childNodes,
				numNodes = thumbElements.length,
				items = [],
				figureEl,
				linkEl,
				size,
				item;
	
			for(var i = 0; i < numNodes; i++) {
	
				figureEl = thumbElements[i];
				if(figureEl.nodeType !== 1) {
					continue;
				}
				linkEl = figureEl.children[0];
				size = linkEl.getAttribute('data-size').split('x');
				item = {
					src: linkEl.getAttribute('href'),
					w: parseInt(size[0], 10),
					h: parseInt(size[1], 10)
				};
	
				if(figureEl.children.length > 1) {
					item.title = figureEl.children[1].innerHTML; 
				}
	
				if(linkEl.children.length > 0) {
					item.msrc = linkEl.children[0].getAttribute('src');
				} 
	
				item.el = figureEl;
				items.push(item);
			}
	
			return items;
		};
	
		var closest = function closest(el, fn) {
			return el && ( fn(el) ? el : closest(el.parentNode, fn) );
		};
	
		var onThumbnailsClick = function(e) {
			e = e || window.event;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
	
			var eTarget = e.target || e.srcElement;
	
			var clickedListItem = closest(eTarget, function(el) {
				return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
			});
	
			if(!clickedListItem) {
				return;
			}
	
			var clickedGallery = clickedListItem.parentNode,
				childNodes = clickedListItem.parentNode.childNodes,
				numChildNodes = childNodes.length,
				nodeIndex = 0,
				index;
	
			for (var i = 0; i < numChildNodes; i++) {
				if(childNodes[i].nodeType !== 1) { 
					continue; 
				}
	
				if(childNodes[i] === clickedListItem) {
					index = nodeIndex;
					break;
				}
				nodeIndex++;
			}
	
			if(index >= 0) {
				openPhotoSwipe( index, clickedGallery );
			}
			return false;
		};
	
		var photoswipeParseHash = function() {
			var hash = window.location.hash.substring(1),
			params = {};
	
			if(hash.length < 5) {
				return params;
			}
	
			var vars = hash.split('&');
			for (var i = 0; i < vars.length; i++) {
				if(!vars[i]) {
					continue;
				}
				var pair = vars[i].split('=');  
				if(pair.length < 2) {
					continue;
				}           
				params[pair[0]] = pair[1];
			}
	
			if(params.gid) {
				params.gid = parseInt(params.gid, 10);
			}
	
			return params;
		};
	
		var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
			var pswpElement = document.querySelectorAll('.pswp')[0],
				gallery,
				options,
				items;
	
			items = parseThumbnailElements(galleryElement);
	
			options = {
	
				galleryUID: galleryElement.getAttribute('data-pswp-uid'),
	
				getThumbBoundsFn: function(index) {
					var thumbnail = items[index].el.getElementsByTagName('img')[0],
						pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
						rect = thumbnail.getBoundingClientRect(); 
	
					return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
				}
	
			};
	
			if(fromURL) {
				if(options.galleryPIDs) {
					for(var j = 0; j < items.length; j++) {
						if(items[j].pid == index) {
							options.index = j;
							break;
						}
					}
				} else {
					options.index = parseInt(index, 10) - 1;
				}
			} else {
				options.index = parseInt(index, 10);
			}
	
			if( isNaN(options.index) ) {
				return;
			}
	
			if(disableAnimation) {
				options.showAnimationDuration = 0;
			}
	
			gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
			gallery.init();
		};
	
		var galleryElements = document.querySelectorAll( gallerySelector );
	
		for(var i = 0, l = galleryElements.length; i < l; i++) {
			galleryElements[i].setAttribute('data-pswp-uid', i+1);
			galleryElements[i].onclick = onThumbnailsClick;
		}
	
		var hashData = photoswipeParseHash();
		if(hashData.pid && hashData.gid) {
			openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
		}
	};
	
	// Execute Photoswipe
	initPhotoSwipeFromDOM('.gallery');
}

function resizeBg() {
	var w = $(window).width(),
		h = $(window).height();
		
	var min = Math.min(w, h);
		
	if (w < h) {
		$('.site-bg').addClass('portrait');
	} else {
		$('.site-bg').removeClass('portrait');
	}
	
	if ((w / h) > 1.5) {
		$('body').addClass('fullsize-cover');
	} else {
		$('body').removeClass('fullsize-cover');
	}
	
	if ((h / w) < 0.5625) {
		$('.site-bg .video').css({		
			'width': w,
			'height': (w * 9) / 16
		});
	} else {
		$('.site-bg .video').css({		
			'height': min,
			'width': (min * 16) / 9
		});
	}
}

function resizeEnd() {
    if (new Date() - rtime < delta) {
        setTimeout(resizeEnd, delta);
    } else {
        timeout = false;
        resizeBg();
    }               
}

function initScrollmagic() {

	var h = window.innerHeight,
		c, p;
	
	// Set section heights
		
	if ($(window).width() < 600) {
		c = 4.5;
		$('.cover-section').css('height', h * 5);
	} else {
		c = 1.7;
		$('.cover-section').css('height', h * 2);
	}
	
	p = 2.5;
	$('.profile-section').css('height', h * 2.5);
	
	// Init controller
	
	var controller = new ScrollMagic.Controller();
	
	// Cover
	
	if ($(window).width() < 600) {
		
		new ScrollMagic.Scene({triggerElement: '#profile-cover', offset: h * 0.46, duration: h * 3})
			.setTween(TweenMax.to('.cover', 1, {x: '-65%', ease: 'power1.in'}))
			.addTo(controller);
			
		new ScrollMagic.Scene({triggerElement: '#profile-cover', offset: (h * c - 500), duration: 500})
			.setTween(TweenMax.to('.cover, .main-logo', 1, {opacity: 0, ease: Linear.easeNone}))
			.addTo(controller);
			
	} else {
		
		new ScrollMagic.Scene({triggerElement: '#profile-cover', offset: h * 0.5, duration: h})
			.setTween(TweenMax.to('.main-logo', 1, {y: '-60%', opacity: 0, ease: Linear.easeNone}))
			.addTo(controller);
			
		new ScrollMagic.Scene({triggerElement: '#profile-cover', offset: (h * c - 500), duration: 500})
			.setTween(TweenMax.to('.cover', 1, {opacity: 0, ease: Linear.easeNone}))
			.addTo(controller);		
	}
	
	$('.profile-section').each(function(index, elem){
				
		var target = $(this).attr('id').replace('profile-', '');
		
		new ScrollMagic.Scene({triggerElement: elem, offset: 0, duration: 500})
			.setTween(TweenMax.from('.' + target, 1, {opacity: 0, ease: Linear.easeNone}))
			.addTo(controller);
			
		new ScrollMagic.Scene({triggerElement: elem, offset: (h * p) - 300, duration: 100})
			.setTween(TweenMax.to('.' + target, 1, {opacity: 0, ease: Linear.easeNone}))
			.addTo(controller);
		
		new ScrollMagic.Scene({triggerElement: elem, offset: h * 0.3, duration: (h * p) - 500})
			.setClassToggle('#profile-' + target + ' .profile-block', 'active')
			.setPin('#profile-' + target + ' .profile-block')
			.addTo(controller);
	});
}

$(document).ready(function(){
	
	var vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
	
	resizeBg();

    $('.menu-item[data-menu-label="' + page + '"]').addClass('current-menu-item');
    
    if ( page === 'home' ) {
	    
	    $('.site-bg').prependTo($('.frame-container'));
	    
	    initScrollmagic();
	    
    } else {
	    
        $('html').removeClass('loading').addClass('loaded');
    }

    if ($('body').is('.single-post')) {
        $('.menu-item[data-menu-label="notice"]').addClass('current-menu-item');
    }

    $('.burger').click(function(){
		$('body').toggleClass('menu-opened')
				 .find('.site-navigation').fadeToggle(150);
    });
    
    // Album Navigation
    
    $('.tab-navigation .nav-item').click(function(){
	   
	   var target = $(this).data('tab-for');
	   
	   $('.tab-navigation .nav-item, .tab-content').removeClass('is-active');
	   $(this).addClass('is-active');
	   $('.tab-content[data-tab-label="' + target + '"]').addClass('is-active');
	    
    });
    
    // YouTube Video
    
	$('.play-button').click(function(){
		
		var play_target = $(this).attr('for');
		
		$('.video-container').removeClass('is-playing');
		$(this).parent().addClass('is-playing');
		
		$('.video-container').each(function(){
			$(this).find('iframe')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
		});
		$('#' + play_target)[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
	});
    
});

$(window).on('load', function(){
	if ( page === 'home' ) {
		$('html').removeClass('loading').addClass('loaded');
    }
});

var lst = 0;

$(window).on('scroll', function(event){
   var st = $(this).scrollTop();
   if (st > lst){
       $('body').removeClass('scroll-up').addClass('scroll-down');
   } else {
      $('body').removeClass('scroll-down').addClass('scroll-up');
   }
   lst = st;
});

var rtime,
	timeout = false,
	delta = 200;

$(window).on('resize', function() {
	rtime = new Date();
    if (timeout === false) {
        timeout = true;
        setTimeout(resizeEnd, delta);
    }
});