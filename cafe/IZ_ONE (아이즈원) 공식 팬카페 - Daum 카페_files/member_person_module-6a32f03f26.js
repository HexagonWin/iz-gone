document.domain='daum.net';

function SidwViewRow(idx, name, text, onclickEvent, isAdmin) {
	this.idx = idx;
	this.name = name;
	this.text = text;
	this.isAdmin = isAdmin;
	this.onclickEvent = onclickEvent;

	this.renderRow = function() {

		var target = "";
		if (isAdmin=="admin") {
			target = "target=\"_blank\"";
		}
		var str = "<li id='sideViewRow_"+this.name+"'>"
					+ "<a href=\"#\" onclick=\"hideSideView(); clickAreaCheck=true;"+this.onclickEvent+"; return false;\">"
						+ this.text
					+ "</a>"
				+ "</li>";

		if (this.name=="article") str+= "<li class='layer_dotline'></li>";
		return str;
	};
}

function SideView(curObj, enc_userid, targetNick, rolecode, isAdmin, isGuest, isMine) {
	var grpid = CAFEAPP.GRPID;
	var targetObj = 'nameContextMenu';
	var menuItems = [];


	var createMenuItem = function(name, text, evt) {
		var idx = menuItems.length;
		var menuItem = new SidwViewRow(idx, name, text, evt);
		menuItems[idx] = menuItem;
		return menuItem;
	};

	if (isGuest == "GUEST") {
	} else {
		createMenuItem("member", "회원정보", "goProfile('" + grpid + "', '" + enc_userid + "', '" + rolecode + "', '" + isMine + "')");
		createMenuItem("article", "작성글보기", "goArticle('" + enc_userid + "','" + grpid + "', '" + targetNick + "', '" + isAdmin + "', '" + isMine + "')");

		if (rolecode >= 25) {
			createMenuItem("msg", "쪽지 보내기", "sendWebMemo('" + grpid + "','" + enc_userid + "', '" + isMine + "')");
			createMenuItem("mail", "메일 보내기", "sendEmail('" + grpid + "', '" + enc_userid + "')");
		} else {
			createMenuItem("msg", "쪽지 보내기", "alert('해당 서비스는 정회원 이상만 사용 가능합니다.')");
			createMenuItem("mail", "메일 보내기", "alert('해당 서비스는 정회원 이상만 사용 가능합니다.')");
		}
	}


	return {
		createMenuItem : function(name, text, evt) {
			createMenuItem(name, text, evt);
		},

		showLayer: function () {
			clickAreaCheck = true; //global
			var oSideViewLayer = document.getElementById(targetObj) || (function() {
					var oSideViewLayer = document.createElement("div");
					oSideViewLayer.className = "commLayer layer_opt";
					document.body.appendChild(oSideViewLayer);
					return oSideViewLayer;
				})();

			oSideViewLayer.id = targetObj;
			oSideViewLayer.innerHTML = (function(){
				var str = "<ul>";
				for (var j=0; j < menuItems.length; j++) {

					str += menuItems[j].renderRow();
				}

				str += "</ul>";
				return str;
			})();

			var objDisplay = document.getElementById(targetObj);
			var layerPos = getCoords(curObj, "all");
			oSideViewLayer.style.left = layerPos.left + "px";
			oSideViewLayer.style.top = layerPos.top + layerPos.height + 3 + "px";
			hideOtherLayer(curObj);
			if (objDisplay.style.display != "block") {
                document.getElementById(targetObj).style.display = "block";
			} else {
                document.getElementById(targetObj).style.display = "none";
			}
		}
	};
}



function getCafeUrl(url) {
	return "https://" + document.location.host + url;
}

function goProfile(grpid, enc_userid, rolecode, isMine) {
	var realUrl = '/_c21_/member_profile?grpid='+grpid+'&userid='+enc_userid+'&enc_userid='+enc_userid;

	if (rolecode === '1Z' && isMine === "true") {
		document.location.href = realUrl;
		return;
	}

	window.open(realUrl, 'DaumCafeMemberProfileWindow', 'width=540,height=550,resizable=no,scrollbars=yes');
}

function sendEmail(grpid, enc_userid) {
	var realUrl = '/_c21_/mailto_popup?grpid=' + grpid + '&userid=' + enc_userid + '&euserid=' + enc_userid;
	mailModule.openMailPopup(realUrl);
}

function sendWebMemo(grpid, enc_userid, isMine) {
	if (isMine === "true") {
		alert('자신에게는 쪽지를 보낼 수 없습니다.');
		return;
	}

	var msgboxUrl = (window.CAFEAPP ? window.CAFEAPP.MSGBOX_URL : null) || 'https://msgbox.cafe.daum.net';
    var target = enc_userid.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "");
	var realUrl = msgboxUrl + "/client/chat?grpid=" + grpid + "&targetUserid=" + enc_userid;
	window.open(realUrl, 'DaumCafeMsgbox_' + target, 'width=360,height=530,scrollbars=yes').focus();
}


function goArticle(enc_userid, grpid, targetNick, isAdmin, isMine) {
	var isWithoutFrameset = function (){
		return parent.document.location.href.indexOf("cafe.daum.net") != -1;
	};

	var targetNick = targetNick.replace(/(<b>|<\/b>)/g, "");
	var url = "";
	if (isMine == "true") {
		url = getCafeUrl("/_c21_/member_article_cafesearch?item=userid&grpid=" + grpid);
	} else {
		url = getCafeUrl('/_c21_/member_article_cafesearch?grpid=' + grpid + '&item=writer&nickname=' + Base64.encodeURI(unescape(targetNick)) + '&nickname_enc=base64&enc_userid=' + (enc_userid || ""));
	}


    var usePopup = (isAdmin === "admin") && !daum.ie;
	if (usePopup) {
		window.open(url,'pop_article');
	} else {
		if (opener) {
			opener.document.location.href = url;
			opener.focus();
			return;
		}

		if (isWithoutFrameset()) {
			document.location.href = url;
		} else {
			parent.document.location.href = url;
		}
	}
}

/*
 * $Id: base64.js,v 2.15 2014/04/05 12:58:57 dankogai Exp dankogai $
 *
 *  Licensed under the MIT license.
 *    http://opensource.org/licenses/mit-license
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */
(function(global) {
	'use strict';
	// existing version for noConflict()
	var _Base64 = global.Base64;
	var version = "2.1.8";
	// if node.js, we use Buffer
	var buffer;
	if (typeof module !== 'undefined' && module.exports) {
		buffer = require('buffer').Buffer;
	}
	// constants
	var b64chars
		= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	var b64tab = function(bin) {
		var t = {};
		for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
		return t;
	}(b64chars);
	var fromCharCode = String.fromCharCode;
	// encoder stuff
	var cb_utob = function(c) {
		if (c.length < 2) {
			var cc = c.charCodeAt(0);
			return cc < 0x80 ? c
				: cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
			+ fromCharCode(0x80 | (cc & 0x3f)))
				: (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
			+ fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
			+ fromCharCode(0x80 | ( cc         & 0x3f)));
		} else {
			var cc = 0x10000
				+ (c.charCodeAt(0) - 0xD800) * 0x400
				+ (c.charCodeAt(1) - 0xDC00);
			return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
			+ fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
			+ fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
			+ fromCharCode(0x80 | ( cc         & 0x3f)));
		}
	};
	var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
	var utob = function(u) {
		return u.replace(re_utob, cb_utob);
	};
	var cb_encode = function(ccc) {
		var padlen = [0, 2, 1][ccc.length % 3],
			ord = ccc.charCodeAt(0) << 16
				| ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
				| ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
			chars = [
				b64chars.charAt( ord >>> 18),
				b64chars.charAt((ord >>> 12) & 63),
				padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
				padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
			];
		return chars.join('');
	};
	var btoa = global.btoa ? function(b) {
		return global.btoa(b);
	} : function(b) {
		return b.replace(/[\s\S]{1,3}/g, cb_encode);
	};
	var _encode = buffer ? function (u) {
			return (u.constructor === buffer.constructor ? u : new buffer(u))
				.toString('base64')
		}
			: function (u) { return btoa(utob(u)) }
		;
	var encode = function(u, urisafe) {
		return !urisafe
			? _encode(String(u))
			: _encode(String(u)).replace(/[+\/]/g, function(m0) {
			return m0 == '+' ? '-' : '_';
		}).replace(/=/g, '');
	};
	var encodeURI = function(u) { return encode(u, true) };
	// decoder stuff
	var re_btou = new RegExp([
		'[\xC0-\xDF][\x80-\xBF]',
		'[\xE0-\xEF][\x80-\xBF]{2}',
		'[\xF0-\xF7][\x80-\xBF]{3}'
	].join('|'), 'g');
	var cb_btou = function(cccc) {
		switch(cccc.length) {
			case 4:
				var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
						|    ((0x3f & cccc.charCodeAt(1)) << 12)
						|    ((0x3f & cccc.charCodeAt(2)) <<  6)
						|     (0x3f & cccc.charCodeAt(3)),
					offset = cp - 0x10000;
				return (fromCharCode((offset  >>> 10) + 0xD800)
				+ fromCharCode((offset & 0x3FF) + 0xDC00));
			case 3:
				return fromCharCode(
					((0x0f & cccc.charCodeAt(0)) << 12)
					| ((0x3f & cccc.charCodeAt(1)) << 6)
					|  (0x3f & cccc.charCodeAt(2))
				);
			default:
				return  fromCharCode(
					((0x1f & cccc.charCodeAt(0)) << 6)
					|  (0x3f & cccc.charCodeAt(1))
				);
		}
	};
	var btou = function(b) {
		return b.replace(re_btou, cb_btou);
	};
	var cb_decode = function(cccc) {
		var len = cccc.length,
			padlen = len % 4,
			n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
				| (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
				| (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
				| (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
			chars = [
				fromCharCode( n >>> 16),
				fromCharCode((n >>>  8) & 0xff),
				fromCharCode( n         & 0xff)
			];
		chars.length -= [0, 0, 2, 1][padlen];
		return chars.join('');
	};
	var atob = global.atob ? function(a) {
		return global.atob(a);
	} : function(a){
		return a.replace(/[\s\S]{1,4}/g, cb_decode);
	};
	var _decode = buffer ? function(a) {
		return (a.constructor === buffer.constructor
			? a : new buffer(a, 'base64')).toString();
	}
		: function(a) { return btou(atob(a)) };
	var decode = function(a){
		return _decode(
			String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
				.replace(/[^A-Za-z0-9\+\/]/g, '')
		);
	};
	var noConflict = function() {
		var Base64 = global.Base64;
		global.Base64 = _Base64;
		return Base64;
	};
	// export Base64
	global.Base64 = {
		VERSION: version,
		atob: atob,
		btoa: btoa,
		fromBase64: decode,
		toBase64: encode,
		utob: utob,
		encode: encode,
		encodeURI: encodeURI,
		btou: btou,
		decode: decode,
		noConflict: noConflict
	};
	// if ES5 is available, make Base64.extendString() available
	if (typeof Object.defineProperty === 'function') {
		var noEnum = function(v){
			return {value:v,enumerable:false,writable:true,configurable:true};
		};
		global.Base64.extendString = function () {
			Object.defineProperty(
				String.prototype, 'fromBase64', noEnum(function () {
					return decode(this)
				}));
			Object.defineProperty(
				String.prototype, 'toBase64', noEnum(function (urisafe) {
					return encode(this, urisafe)
				}));
			Object.defineProperty(
				String.prototype, 'toBase64URI', noEnum(function () {
					return encode(this, true)
				}));
		};
	}
	// that's it!
	if (global['Meteor']) {
		Base64 = global.Base64; // for normal export in Meteor.js
	}
})(this);
