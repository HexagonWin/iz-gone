document.domain="daum.net"; 

if (getTopWindow().flag != null) {
	getTopWindow().flag=true;
}

function popup(szURL, szName, iWidth, iHeight) {
	window.open(szURL, szName, 'width=' + iWidth + ',height=' + iHeight + ',resizable=yes,scrollbars=yes,');
}

function caller(url) {
    getTopWindow().status='';
	if (getTopWindow().flag != null) {
		getTopWindow().deflag();
	}
    location.href=url;
}

function article_write(url) {
	caller(url);
}

function clearStatus() {
   //top.status='';
}

function resizeIntroFrame(w, h) {
	document.getElementById('user').width = w;
	document.getElementById('user').height = h;
	getTopWindow().status='';
	if (CAFEAPP.ui.SCROLL_TO_MEMO) {
		try {
			scrollToMemo();
		} catch (e) {}
	}
}

function scrollToMemo() {
	window.scrollTo(0, document.getElementById("memo_iframe").offsetTop);
}

function openMsgBox(idx,width,height,scrollbar,status,seq){
	var eventCookie = getCookie('pop_apology');	// cookie name in order to popup
	myleft = 100;
	mytop = 100;
	
	if (eventCookie == false) 
		window.open('/_c21_/static/noti_apology.html','_blank','scrollbars='+scrollbar+',status='+status+',left='+myleft+', top='+mytop+',width='+width+',height='+height);
}
	
if (CAFEAPP.GRPID == "17eXL") {
	openMsgBox(2,430,380,'no','no',1);
}

if(CAFEAPP.ui.ISPREVIEW) {
	if(getTopWindow().document && getTopWindow().document.getElementById("hidden")){
		getTopWindow().document.getElementById("hidden").src="";
	}
}


