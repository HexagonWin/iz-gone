// TO TOP
$(function() {	
	$("#toTop a").click(function () {
		$('html,body').animate({ scrollTop: 0 }, 'fast');
		return false;
	});
});


// SCROLL
$(function() {
  var offsetY = -10;
  var time = 500;

  $('.nav-anchor a').click(function() {
    var target = $(this.hash);
    if (!target.length) return ;
    var targetY = target.offset().top+offsetY;
    $('html,body').animate({scrollTop: targetY}, time, 'swing');
    window.history.pushState(null, null, this.hash);
    return false;
  });
});



// SVG非対応対策
!function(n,e,o){function t(n,e){return typeof n===e}function s(){var n,e,o,s,a,f,l;for(var c in i)if(i.hasOwnProperty(c)){if(n=[],e=i[c],e.name&&(n.push(e.name.toLowerCase()),e.options&&e.options.aliases&&e.options.aliases.length))for(o=0;o<e.options.aliases.length;o++)n.push(e.options.aliases[o].toLowerCase());for(s=t(e.fn,"function")?e.fn():e.fn,a=0;a<n.length;a++)f=n[a],l=f.split("."),1===l.length?Modernizr[l[0]]=s:(!Modernizr[l[0]]||Modernizr[l[0]]instanceof Boolean||(Modernizr[l[0]]=new Boolean(Modernizr[l[0]])),Modernizr[l[0]][l[1]]=s),r.push((s?"":"no-")+l.join("-"))}}var i=[],a={_version:"3.5.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(n,e){var o=this;setTimeout(function(){e(o[n])},0)},addTest:function(n,e,o){i.push({name:n,fn:e,options:o})},addAsyncTest:function(n){i.push({name:null,fn:n})}},Modernizr=function(){};Modernizr.prototype=a,Modernizr=new Modernizr,Modernizr.addTest("svg",!!e.createElementNS&&!!e.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect);var r=[];s(),delete a.addTest,delete a.addAsyncTest;for(var f=0;f<Modernizr._q.length;f++)Modernizr._q[f]();n.Modernizr=Modernizr}(window,document);

$(function(){
	if (!Modernizr.svg){
		$('img').each(function() {
			$(this).attr('src', $(this).attr('src').replace(/\.svg/gi,'.png'));
		});
	}
});


// メニュー
$(window).on('load resize', function(){
    var w = $(window).width();
    var x = 1039;
    if (w <= x) {
        var radius = Math.sqrt(Math.pow(window.innerHeight, 2) + Math.pow(window.innerWidth, 2));
        var diameter = radius * 2;
        $("#nav-overlay").width(diameter);
        $("#nav-overlay").height(diameter);
        $("#nav-overlay").css({"margin-top": -radius, "margin-left": -radius});
    } else {
        $("#nav-overlay").width("0");
        $("#nav-overlay").height("0");
        $("#nav-overlay").css({"margin-top": "0", "margin-left": "0"});
    }
});

$(document).ready(function() {
    $("#nav-toggle").click(function() {
        $("body, #nav-toggle, #nav-overlay, #nav-fullscreen").toggleClass("open");
    });
});