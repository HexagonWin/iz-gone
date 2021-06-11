// -------------------------------------------------------------------------------- //
// jquery.matchHeight
// -------------------------------------------------------------------------------- //
$(function() {
	$('.list_with_photo .list_inner li a').matchHeight();
});

// -------------------------------------------------------------------------------- //
// loading
// -------------------------------------------------------------------------------- //
$(window).on('load' , function(){
	$('.loader_area').delay(200).fadeOut(500);
	$('.loader').delay(300).fadeOut(600);
});

// -------------------------------------------------------------------------------- //
// effect：inview + animate.css
// -------------------------------------------------------------------------------- //
$(function() {
	$('.animated').css("opacity","0");

	$('.inviewfadeIn').on('inview', function(event, isInView) {
		if (isInView) {
			$(this).addClass('fadeIn');
			$(this).css('opacity',1);
		} else {
		}
	});
	$('.inviewbounceIn').on('inview', function(event, isInView) {
		if (isInView) {
			$(this).addClass('bounceIn');
			$(this).css('opacity',1);
		} else {
		}
	});
	$('.inviewlightSpeedIn').on('inview', function(event, isInView) {
		if (isInView) {
			$(this).addClass('lightSpeedIn');
			$(this).css('opacity',1);
		} else {
		}
	});
	$('.inviewbounceInUp').on('inview', function(event, isInView) {
		if (isInView) {
			$(this).addClass('bounceInUp');
			$(this).css('opacity',1);
		} else {
		}
	});
	$('.inviewfadeInDown').on('inview', function(event, isInView) {
		if (isInView) {
			$(this).addClass('fadeInDown');
			$(this).css('opacity',1);
		} else {
		}
	});
	$('.inviewfadeInUp').on('inview', function(event, isInView) {
		if (isInView) {
			$(this).addClass('fadeInUp');
			$(this).css('opacity',1);
		} else {
		}
	});
	$('.inviewbounceInLeft').on('inview', function(event, isInView) {
		if (isInView) {
			$(this).addClass('bounceInLeft');
			$(this).css('opacity',1);
		} else {
		}
	});
	$('.inviewbounceInRight').on('inview', function(event, isInView) {
		if (isInView) {
			$(this).addClass('bounceInRight');
			$(this).css('opacity',1);
		} else {
		}
	});
	$('.inviewzoomIn').on('inview', function(event, isInView) {
		if (isInView) {
			$(this).addClass('zoomIn');
			$(this).css('opacity',1);
		} else {
		}
	});
});

// -------------------------------------------------------------------------------- //
// effect
// -------------------------------------------------------------------------------- //
$(function() {
	$('#fc_news_area ul').on('inview', function(event, isInView) {
		if (isInView) {
			$(this).find('li').each(function(i) {
				$(this).css('opacity',0);
				$(this).delay(150 * i).queue(function() {
					$(this).addClass('show_item').dequeue();
				});
			});
		}
	});
});
$(function() {
	$('.membersmenu_list').on('inview', function(event, isInView) {
		if (isInView) {
			$(this).find('li').each(function(i) {
				$(this).css('opacity',0);
				$(this).delay(250 * i).queue(function() {
					$(this).addClass('show_item').dequeue();
				});
			});
		}
	});
});
$(function() {
	$('.footernav_sns ul').on('inview', function(event, isInView) {
		if (isInView) {
			$(this).find('li').each(function(i) {
				$(this).css('opacity',0);
				$(this).delay(150 * i).queue(function() {
					$(this).addClass('show_item').dequeue();
				});
			});
		}
	});
});
$(function() {
	$('.list_with_photo_nolink .list_inner').on('inview', function(event, isInView) {
		if (isInView) {
			$(this).find('li').each(function(i) {
				$(this).css('opacity',0);
				$(this).delay(200 * i).queue(function() {
					$(this).addClass('show_item').dequeue();
				});
			});
		}
	});
});
$(function() {
	$('.list_reading .list_inner').on('inview', function(event, isInView) {
		if (isInView) {
			$(this).find('li').each(function(i) {
				$(this).css('opacity',0);
				$(this).delay(5 * i).queue(function() {
					$(this).addClass('show_item').dequeue();
				});
			});
		}
	});
});
$(function() {
	$('.menu_list').on('inview', function(event, isInView) {
		if (isInView) {
			$(this).find('li').each(function(i) {
				$(this).css('opacity',0);
				$(this).delay(120 * i).queue(function() {
					$(this).addClass('show_item').dequeue();
				});
			});
		}
	});
});

// -------------------------------------------------------------------------------- //
// mainvisual footervisual
// -------------------------------------------------------------------------------- //
/* iOSのbackground-attachment対策 */
jQuery(function($){
var ua = navigator.userAgent;
if ( ua.indexOf( 'iPhone' ) > 0 || ua.indexOf( 'iPad' ) > 0) {
// iPhone or iPad
$('.parallax_bg').css({
'background-attachment': 'scroll',
});
}
});

// -------------------------------------------------------------------------------- //
// object-fit-images
// -------------------------------------------------------------------------------- //
$(function () {
	objectFitImages('.thumbnail img');
});

// -------------------------------------------------------------------------------- //
// Back To Top Scroll
// -------------------------------------------------------------------------------- //
function getScrolled() {
	return ( window.pageYOffset !== undefined ) ? window.pageYOffset: document.documentElement.scrollTop;
}
var topButton = document.getElementById( 'nav_to_top' );
window.onscroll = function() {
	( getScrolled() > 400 ) ? topButton.classList.add( 'fade-in' ): topButton.classList.remove( 'fade-in' );
};
function scrollToTop() {
	var scrolled = getScrolled();
	window.scrollTo( 0, Math.floor( scrolled / 1 ) );
	if ( scrolled > 0 ) {
		window.setTimeout( scrollToTop, 100 );
	}
};
topButton.onclick = function() {
	scrollToTop();
};

// -------------------------------------------------------------------------------- //
// tab
// -------------------------------------------------------------------------------- //
$(function(){
	$('.tab_area .tab_content > div[id != "tab_japanese"]').hide();
	$(".tab_area a").click(function(){
		$(".tab_area .tab_content > div").hide();
		$($(this).attr("href")).show();
		$(".current").removeClass("current");
		$(this).addClass("current");
        return false;
	});
});

// -------------------------------------------------------------------------------- //
// Decision android Default Browser
// -------------------------------------------------------------------------------- //
var ua = navigator.userAgent;
if ((/Android/.test(ua) && /Linux; U;/.test(ua) && !/Chrome/.test(ua)) ||
	(/Android/.test(ua) && /Chrome/.test(ua) && /Version/.test(ua)) ||
	(/Android/.test(ua) && /Chrome/.test(ua) && /SamsungBrowser/.test(ua))) {
	// android標準ブラウザでアクセスした場合の処理
	$('html').addClass('android_defaultbrowser');
}

// -------------------------------------------------------------------------------- //
// Back To Top Scroll
// -------------------------------------------------------------------------------- //
$(document).ready(function() {
	var scrollTop = $("#nav_to_top");
	$(window).scroll(function() {
		var topPos = $(this).scrollTop();
		if (topPos > 100) {
		$(scrollTop).css("opacity", "1");
		} else {
		$(scrollTop).css("opacity", "0");
		}
	});
	$(scrollTop).click(function() {
		$('html, body').animate({
			scrollTop: 0
			}, 800);
		return false;
	});
});

// -------------------------------------------------------------------------------- //
// 特定の位置までスクロールしたらヘッダー固定表示
// -------------------------------------------------------------------------------- //
/*
$(function() {
  var $win = $(window),
      $fixedNav = $('header').clone().addClass('fixed_nav').appendTo('body'),
      showClass = 'nav_show';

  $win.on('load scroll', function() {
    var value = $(this).scrollTop();
    if ( value > 700 ) {
      $fixedNav.addClass(showClass);
    } else {
      $fixedNav.removeClass(showClass);
    }
  });
});
*/
