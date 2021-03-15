(function (){
	if (typeof daum !== 'undefined' && daum.Browser) {
		var b = daum.Browser;
		b.hasUaStr = function(str){
			return b.ua.indexOf(str) > -1;
		};
		b.getOsVersion = function(){
			var res = 0;
			try{
				if(b.iphone || b.ipad || b.ipod){
					res = b.ua.match(/os ([\w|\.|-|_]+) like/g)[0]
					.replace(/^os /,'').replace(/ like$/,'');
				} else if(b.android){
					res = b.ua.match(/android ([\w|\.|-]+);/g)[0]
					.replace(/^android /,'').replace(/;$/,'');
				} 
			}catch(e){}
			return res;
		};
		b.getIeTridentVersion = function(){
			var IEVersionMatcher = navigator.userAgent.match(/Trident\/(\d.\d)/i);
			if(IEVersionMatcher != null){
				return IEVersionMatcher[1]; 
			}
		};
		b.ie10 = (b.getIeTridentVersion() === "6.0");
		b.iemobile = b.hasUaStr('msie') && !b.hasUaStr('!opera');
		b.polaris = b.hasUaStr('polaris') || b.hasUaStr('natebrowser') || /([010|011|016|017|018|019]{3}\d{3,4}\d{4}$)/.test(b.ua);
		b.chrome = b.hasUaStr('chrome');
		b.webkit = b.hasUaStr('applewebkit');
		b.opera = b.hasUaStr('opera');
		b.android = b.hasUaStr('android');
		b.safari = b.hasUaStr('safari');
		b.iphone = b.hasUaStr('iphone') && !b.hasUaStr('ipod');
		b.ipad = b.hasUaStr('ipad');
		b.ipod = b.hasUaStr('ipod');
		b.webviewer = (b.hasUaStr('wv') && b.hasUaStr('lg')) || b.hasUaStr('uzard') || b.hasUaStr('opera mini');
		b.dolfin = b.hasUaStr('dolfin');
		b.xperiax1 = b.hasUaStr('sonyerricssonx1i');
		b.uiwebview = (b.iphone || b.ipad || b.ipod) && b.webkit && b.hasUaStr('!safari');
		b.osversion = b.getOsVersion();
		b.isIOS = b.iphone || b.ipad || b.ipod;
		b.isMobile = b.android || b.iphone || b.ipad || b.ipod || b.dolfin || b.polaris || b.iemobile || b.webviewer;
	}
})();

function namespace(strNamespace){
	(function (arrNames, parentObj){
		if(!arrNames || !arrNames.length){return;}
		var pkgName = arrNames.shift();
		if(!parentObj[pkgName]){
			parentObj[pkgName] = {};
		}
		arguments.callee(arrNames, parentObj[pkgName]);
	})(strNamespace.split("."), window);
}

(function(){
    function getFunctionName(fn){
        if (typeof fn == "function") {
            return /function ([^(]*)/.exec( fn.toString() )[1]
        }
        return "It's not function";
    }

    namespace("server");
    window.server.log = function(msg, name){
        var callerName = name || getFunctionName(arguments.callee.caller.constructor);

        new daum.Ajax({
            url: "/_c21_/client_logging",
            method: "POST",
            paramString: "name=" + encodeURIComponent(name) + "&msg=" + encodeURIComponent(msg)
        }).request();
    }
})();

var clickAreaCheck = false;
document.onclick = function () {
    var cafeLayers = ["scrapLayer","reply_emoticon","bbsLayer","gradeLayer","headerLayer","goServiceLayer","nameContextMenu","cafe_favCafeListLayer", "cafeAppLayer", "viewFilterLayer","getUserListLayer","noMemberLayer","daumServiceLayer", "viewListLayer", "articleTypeLayer", "readSnsShareMore", "cmtSrchOptLayer", "cmtMediaInfoLayer","commentGradeLayer","notiLayer"];
    if (!clickAreaCheck) {
    	for(var i=0; i<cafeLayers.length; i++){      
           if(document.getElementById(cafeLayers[i])) {
                if(cafeLayers[i] == "cafe_favCafeListLayer") FavCafeList.hide();
                else if(cafeLayers[i] == "daumServiceLayer") ServiceList.hide();
                else if(cafeLayers[i] == "cafeAppLayer") cafeAppLayer.hideMiniDaum();
                else if(cafeLayers[i] == "goServiceLayer") chg_class('btnGoSvcMenu','goServiceLayer','over');
                else divDisplay (cafeLayers[i], 'none');
           }      
        }
    } else {
        clickAreaCheck = false;
    }
};

function hideOtherLayer(btnName) {  
    var cafeLayerObj = {
        "btnReplyEmoticon":"reply_emoticon",
        "aticle_movie":"bbsLayer",
        "grade_modify":"gradeLayer",
        "btnShowHeaderMenu":"headerLayer",    
        "btnGoSvcMenu":"goServiceLayer",    
        "cafe_favCafeTitle":"cafe_favCafeListLayer",
        "wrapMinidaum":"cafeAppLayer",
        "viewFilterBtn":"viewFilterLayer",
        "btnnick":"nameContextMenu",
        "daumServiceLink":"daumServiceLayer",
        "viewListBtn":"viewListLayer",
        "articleTypeBtn":"articleTypeLayer",
        "cmtSrchOptBtn":"cmtSrchOptLayer",
        "cmtMediaInfoBtn":"cmtMediaInfoLayer",
        "commentGradeBtn":"commentGradeLayer"
    };

    delete cafeLayerObj[btnName];
    for (var btn in cafeLayerObj) {          
        if(document.getElementById(cafeLayerObj[btn])) {
            if(cafeLayerObj[btn] == "cafe_favCafeListLayer") FavCafeList.hide();
            else if(cafeLayerObj[btn] == "daumServiceLayer") ServiceList.hide();
            else if(cafeLayerObj[btn] == "cafeAppLayer") cafeAppLayer.hideMiniDaum();
            else if(cafeLayerObj[btn] == "goServiceLayer") chg_class('btnGoSvcMenu','goServiceLayer','over');
            else if(cafeLayerObj[btn] == "gradeLayer");
            else if(cafeLayerObj[btn] == "commentGradeLayer");
            else divDisplay (cafeLayerObj[btn], 'none');
        }     
    }             
}

function hideLayerAll(layer) {
    switch(layer) {
        case "member" :
            if (document.getElementById("sub_list2")) divDisplay ("sub_list2", 'none'); // 등급변경 레이어
            break;
        case "grade" :
            if (document.getElementById("nameContextMenu")) divDisplay ("nameContextMenu", 'none'); // 회원정보 레이어 
            break;
        case "reserved" :
            if (document.getElementById("calendarBox")) divDisplay ("calendarBox", 'none'); // 예약발송메일 달력 레이어
            break;          
    }
}

var FavCafeList = {
	wrap : null,
	title : null,
	list : null,
	backboard : null,
	isLoaded : false,
	isVisible : false,
	login : '',
	init : function(){
		this.backboard.style.top = this.list.style.top = this.wrap.offsetHeight + 8 + 'px';		
	},
	load : function(){
		var loadingTxt = document.createElement('LI');		
		loadingTxt.className = 'favor_msg';
		if(this.login == "false"){
		loadingTxt.innerHTML = '';
		} else {
		loadingTxt.innerHTML = '자주가는카페목록 로딩중입니다..';
		}
		this.list.insertBefore(loadingTxt,this.list.firstChild);
		var url = '/_c21_/founder_FavoriteCafeList';
		cubeAjax.Request(url, {
            onComplete: function(req){
	           FavCafeList.list.removeChild(FavCafeList.list.firstChild);
               FavCafeList.add.call(FavCafeList,req.responseText);     
            }
	     });
	},
	clear : function(){
		var li = this.list.getElementsByTagName('LI');
		var LiLength = "";
		if(this.login == "false"){
			LiLength = li.length;						
		} else {
			LiLength = li.length-5;
		}
		for(var i=0,max=LiLength; i<max; i++){
			this.list.removeChild(li[0]);
		}		
	},
	add : function(data){
		var info;
		data = eval(data);
		if(this.login == "false"){
			var li = document.createElement('LI');		
			li.innerHTML = '<a href="javascript:;" onclick="mini_poplogin();">로그인해주세요</a>';
			this.list.insertBefore(li,this.list.firstChild);
			return;
		}
		if(data.length > 0){
			while( (info = data.pop()) ){			
				this.list.insertBefore(this.makeList(info),this.list.firstChild);
			}
			this.isLoaded = true;
		}else{
			var li = document.createElement('LI');
			li.className = 'favor_msg';
			li.innerHTML = '등록된 카페가 없습니다.';
			this.list.insertBefore(li,this.list.firstChild);
		}
	},
	makeList : function(data){
		var li = document.createElement('LI');

		if(parseInt(data.newdt,10) > 0){
			li.className = 'newdt';
		}
		li.innerHTML = '<a href="https://cafe.daum.net/' + data.grpcode + '" target="_top">' + data.grpname + '</a>';
		return li;
	},
	toggle : function(){
		if(this.isVisible){
			this.hide();
		}else{
			this.show();
		}
	},
	show : function(){
		clickAreaCheck = true;
		if(this.isLoaded == false){
			this.clear();
			this.load();
		}
		if(this.title) this.title.className = 'on #cafenavi-favoritecafe_btn';
		if(this.layer) this.layer.style.display = 'block';
		window.setTimeout(function(b,l){
			return function(){
				b.style.height = l.offsetHeight + 'px';
				b.style.width = l.offsetWidth + 'px';
			}
		}(this.backboard,this.list),300);
		this.isVisible = true;
		hideOtherLayer(this.title.id);
	},
	hide : function(){
		if(this.title) this.title.className = '#cafenavi-favoritecafe_btn';
		if(this.layer) this.layer.style.display = 'none';
		this.isVisible = false;
	}
};

var ServiceList = {	
	btn : "daumServiceLink",
	layer : "daumServiceLayer",
	isVisible : false,	
	toggle : function(){
		if(this.isVisible){
			this.hide();
		}else{
			this.show();			
		}
	},
	show : function(){
		clickAreaCheck = true;
		var btn = document.getElementById(this.btn);
		var layer = document.getElementById(this.layer);
		layer.style.display = "block";
		btn.className = "on #cafenavi-shortcut_btn";
		this.isVisible = true;		
		hideOtherLayer(this.btn);
	},
	hide : function(){
		var btn = document.getElementById(this.btn);
		var layer = document.getElementById(this.layer);
		layer.style.display = "none";	
		btn.className = "#cafenavi-shortcut_btn";
		this.isVisible = false;
	}					
};

function selectCheckboxes(combos){
    if(!combos) { return; }
    
    if(combos.length > 0){
        for(var i = 0; i < combos.length; i++) {
        	combos[i].checked=true;
        }
    } else {
    	combos.checked=true;
    }
}

function reload () {
	window.location.reload();
}

function cancelCheckboxes(combos){
    if(!combos) { return; }
    
    if(combos.length > 0){
        for(i = 0; i < combos.length; i++){
        	combos[i].checked = false;
        }
    } else{
    	combos.checked = false;
    } 
}

function toggleAll(formctrList) {
    toggleCheckboxes(formctrList);
}

function toggleCheckboxes(combos) {
	if (!combos) { return; }
	if (combos.length > 0) {
    	var chkcnt=0;
    	for (var i=0;i<combos.length;i++) {
        	if (combos[i].checked) {
        		chkcnt++;
        	}
        }
    	var docheck = !(chkcnt == combos.length);
    	for (i=0;i<combos.length;i++) {
    		combos[i].checked=docheck;
    	}
    }
    else {
    	combos.checked=!combos.checked;
    }
}

function getAbsoluteTop(oNode){
    var oCurrentNode=oNode;
    var iTop=0;
    var scroll = (oCurrentNode.scrollTop) ? oCurrentNode.scrollTop : 0;
    while(oCurrentNode){
        if (oCurrentNode.tagName == "HTML") break;        
        var top = (oCurrentNode.offsetTop) ? oCurrentNode.offsetTop : 0;        
        iTop+=top;
        oCurrentNode=oCurrentNode.offsetParent;
    }   
    iTop = iTop + scroll;
    return iTop;
}
function getAbsoluteLeft(oNode){
    var oCurrentNode=oNode;
    var iLeft=0;
    while(oCurrentNode){
        if (oCurrentNode.tagName == "HTML") break;        
        var left = (oCurrentNode.offsetLeft) ? oCurrentNode.offsetLeft : 0;
        iLeft+=left;
        oCurrentNode=oCurrentNode.offsetParent;
    }
    return iLeft;
}

function showMenuList(){	
	var menuFolder = daum.$("menu_folder");
	var menuFolderList = daum.$("menu_folder_list");
	if(menuFolder && menuFolderList){
		daum.Element.hide(menuFolder);
		daum.Element.show(menuFolderList);
	} else {
		try{
			parent.showMenuList();
		}catch(e){}
	}
	var leftMenu = daum.$("leftmenu");
	if(leftMenu){
		try{
			leftMenu.contentWindow.reSize();			
		}catch(e){}
	}
}

function hideMenuList(){
	var menuFolder = daum.$("menu_folder");
	var menuFolderList = daum.$("menu_folder_list");
	if(menuFolder && menuFolderList){
		daum.Element.show(menuFolder);
		daum.Element.hide(menuFolderList);
	} else {
		try{
			parent.hideMenuList();
		}catch(e){}
	}
	var leftMenu = daum.$("leftmenu");
	if(leftMenu){
		try{
			leftMenu.contentWindow.reSize();			
		}catch(e){}
	}
}

/**
 * [FROM] scriptForCookie.html
 * @param name
 * @return
 */
function getCookie(name) {

    var Found = false;
    var start, end;
    var i = 0;
    while(i <= document.cookie.length) {
        start = i;
        end = start + name.length;
        if(document.cookie.substring(start, end) == name) {
            Found = true;
            break;
        }
        i++;
    }
    if(Found == true) {
        start = end + 1;
        end = document.cookie.indexOf(';', start); 
        if(end < start)
            end = document.cookie.length; 
        return document.cookie.substring(start, end);
    } 
}

function setCookie(name, value, expiredays, domain) {
    var exdate = new Date();
    exdate.setDate( exdate.getDate() + expiredays );
    if (typeof(domain) == 'undefined') { domain = document.location.hostname; }    
    document.cookie=name+ "=" +escape(value)+"; path=/; domain=" + domain + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());    
}

function deleteCookie(name, domain)
{
	var expireDate = new Date();
	expireDate.setDate( expireDate.getDate() - 1 );
	if (typeof(domain) == 'undefined') { domain = document.location.hostname; }
	document.cookie = name + "= " + "; path=/; domain=" + domain + "; expires=" + expireDate.toGMTString() + ";";
}

var CafeCookie = {
	taskQueue: [],
	init: function() {
		this.frame = daum.createElement("iframe", {style: "display:none;"});
		var appendTarget = daum.$("upper") ? daum.$("upper") : document.body;
		appendTarget.appendChild(this.frame);
		
		daum.Event.addEvent(this.frame, "load", function() {
			this.frameContents = this.frame.contentWindow || this.frame.contentDocument;
			this.executeCookieTask();
		}.bind(this));
		
		this.frame.src = "https://top.cafe.daum.net/_include/_cookie_template.html";
	},
	
	executeTask: function() {
		if(!this.processing) {
			this.processing = true;
			this.executeCookieTask();
		}
	},
	
	executeCookieTask: function() {
		if(this.frame && this.frameContents) {
			
			for(var i = this.taskQueue.length; i-- ;) {
				var item = this.taskQueue.shift();
				
				if(item) {
					switch(item.type) {
					case "set":
						this.frameContents.setCookie(item.name, item.value, item.expireDays);
						this.processing = false;
						break;
					case "get":
						var cookie = this.frameContents.getCookie(item.name); 
						if(typeof item.callback === "function") {
							item.callback(cookie);
						}
						this.processing = false;
						break;
					case "delete":
						this.frameContents.deleteCookie(item.name);
						this.processing = false;
						break;
					}
				}
			}
		} else {
			this.init();
		}
	},
	
	setCookie: function(name, value, expireDays) {
		this.taskQueue.push({
			type: "set",
			name: name,
			value: value,
			expireDays: expireDays
		});
		
		this.executeTask();
	},
	
	getCookie: function(name, callback) {
		this.taskQueue.push({
			type: "get",
			name: name,
			callback: callback
		});
		this.executeTask();
	},
	
	deleteCookie: function(name) {
		this.taskQueue.push({
			type: "delete",
			name: name
		});
		this.executeTask();
	}
};

function changeSearchViewType(type){
	var srchList = $('searchList');
	var srchCafeList = $('searchCafeList');
    if(type == '1'){ // 제목보기 , 목록형 보기
    	if(srchList && srchList.className.indexOf("bbsList all") > -1){
    		srchList.className  = "bbsList tit";
        }
        if(srchCafeList && srchCafeList.className.indexOf("bbsList all") > -1){
        	srchCafeList.className  = "bbsList tit";
        }
		getTopWindow().comment_area_fold = 1;
    } else if(type == '2'){ // 제목+내용 , 요약형 보기      
    	if(srchList && srchList.className.indexOf("bbsList tit") > -1){
    		srchList.className  = "bbsList all";
        }
        if(srchCafeList && srchCafeList.className.indexOf("bbsList tit") > -1){
        	srchCafeList.className  = "bbsList all";
        }
		getTopWindow().comment_area_fold = 0;
        if($C(document, 'thumImages')){
        	resizeImage_reload();
        }

    }
    SearchUtil.setViewtype();
}

function deleteMyAlimi(pagenum) {
	var form = (document.innerSearchForm) ? document.innerSearchForm : null;
	if(!form) {
        return;
    }

    var page = (pagenum == "" || !pagenum) ? 1 : pagenum;
    var dataInfo = form.datainfo;
    var infosForDelete = "";
    var cnt = 0;
    var datasize = dataInfo.length;

    if(datasize > 0){
        for(var i=0; i<datasize; i++){
            if(dataInfo[i].checked == true){
                if(cnt == 0){
                    infosForDelete += dataInfo[i].value;
                } else {
                    infosForDelete += ","+dataInfo[i].value;
                }
                cnt++;
            }
        }
    } else {
        if (dataInfo.checked) {
            infosForDelete = dataInfo.value;
        }
    }

    if(infosForDelete == ""){
        alert("삭제 할 내용을 선택 해주세요.");
    } else {
        form.infosForDelete.value = infosForDelete;
        form.cmd.value = "REMOVE";
        form.page.value = page;
        form.submit();
    }
}
 
function isEmptyString(str) {
    var splits = str.split(" ");
    return (str.length + 1 == splits.length);
}

function trim(s) {
    while (s.substring(0,1) == ' ') {
        s = s.substring(1,s.length);
    }
    while (s.substring(s.length-1,s.length) == ' ') {
        s = s.substring(0,s.length-1);
    }
    return s;
}

function strtrim(str) {
    while (str.charAt(0) == ' ')
        str = str.substring(1);
    while (str.charAt(str.length - 1) == ' ')
        str = str.substring(0, str.length - 1);
    return str;
}

function chop(str, length) {
    var strLength = 0;
    var retstr = "";
    
    for ( var i = 0; i < str.length ; i++) {
        if (escape(str.charAt(i)).length > 3) {
            strLength +=2;
            if (strLength > length) {
                retstr = retstr+"..";
                break;
            }
            retstr+= str.charAt(i);
        } else {
            strLength++;
            if (strLength > length) {
                retstr = retstr+"..";
                break;
            }
            retstr += str.charAt(i);
        }
    }
    return retstr;
}

function getKEStringBytes(str) {
    return(str.length + (escape(str) + "%u").match(/%u/g).length - 1);
}

function cutKEString(str, cut) {
    var i;
    var res = "";
    var count = 0;

    for (i = 0; i < str.length; i++) {
        if (count >= cut) {
            return res;
        }
        var ch = str.charAt(i);
        if (escape(ch).length > 4) {
            if (count + 2 <= cut) {
                res += ch;
            }
            count += 2;
        } else {
            res += ch;
            count++;
        }
    }

    return res;
}

function cutContent(content, size) {
    var slen = getKEStringBytes(content);
    if (slen > size) {
        content = cutKEString(content, size-2) + "..";
    }
    document.write(content);
}
 
function changeSideContPage(page, contype){
    var type = contype + "_page";
	var page1El = document.getElementById(type + "1");
	var page2El = document.getElementById(type + "2");
	var typeEl = document.getElementById(type);

	if (page1El.className != "none") {
        if (page == 1) {
            return;
        }
        page1El.className = "none";
        page2El.className = "block";
        typeEl.innerHTML = "<span class='arrow'>◀</span><a href='javascript:;' onclick=\"changeSideContPage(1,'"+contype+"');\" class='p11'>이전</a>";
    } else {
        if (page == 2) {
            return;
        }
        page1El.className = "block";
        page2El.className = "none";
        typeEl.innerHTML = "<a href='javascript:;' onclick=\"changeSideContPage(2,'"+contype+"');\" class='p11'>다음</a><span class='arrow'>▶</span>";
    }
}

function updateCharter(obj,view_obj,max_cnt)
{ 
    var str_cnt = 0;
    var tempStr, tempStr2;  
    var str_cnt_viewer = document.getElementById(view_obj);
    
    for(i=0; i<obj.value.length; i++)
    {
        tempStr = obj.value.charAt(i);
        if(escape(tempStr).length > 4) str_cnt += 1;
        else str_cnt += 0.5 ;
    }

    if (str_cnt > max_cnt){
        alert("최대 " + max_cnt + "자이므로 초과된 글자수는 자동으로 삭제됩니다.");       
        str_cnt = 0;        
        tempStr2 = "";
        for(i = 0; i < obj.value.length; i++) 
        {
            tempStr = obj.value.charAt(i);  
            if(escape(tempStr).length > 4) str_cnt += 1;
            else str_cnt += 0.5;
            if (str_cnt > max_cnt)
            {
                if(escape(tempStr).length > 4) str_cnt -= 1;
                else str_cnt -= 0.5 ;   
                break;              
            }
            else tempStr2 += tempStr;
        }       
        obj.value = tempStr2;
    }
    if(str_cnt_viewer){
    	str_cnt_viewer.innerHTML = parseInt(str_cnt);
    }
}
function updateRealCharter_forCafeMsg(obj,view_obj,max_cnt) {
	var enter_cnt = 0;
	var str_cnt_viewer = document.getElementById(view_obj);
	var str_cnt = obj.value.length;

	var ua = navigator.userAgent.toLowerCase();
	if(ua.indexOf("msie") == -1 && ua.indexOf("opera") == -1){
		enter_cnt = countEnterKey(obj.value);
	}
	str_cnt += enter_cnt;
	
	if (str_cnt > max_cnt){
		alert("최대 " + max_cnt + "자까지 입력 가능하며 초과된 글자수만큼 내용이 삭제됩니다");
		obj.value = obj.value.substring(0, max_cnt - enter_cnt);
		str_cnt = max_cnt; 
	}
	str_cnt_viewer.innerHTML = parseInt(str_cnt);
}

function countEnterKey(strValue){
	var encodedChar = encodeURIComponent(strValue);
	return encodedChar.split("%0A").length - 1;
}

function goManager(grpid, euserid, mgrpid) {
    if (typeof(mgrpid) == "undefined")  {       
        document.location.href = "/_c21_/cafe_profile?grpid="+grpid+"&view=manager";
    } else {
        window.open('/_c21_/group_member_manager?grpid='+grpid+'&mgrpid='+mgrpid+'&userid='+euserid, "manager", 'width=650,height=350,resizable=yes,scrollbars=yes');
    }
}

function divDisplay(id, act) {
    if (typeof(id) == "object") id.style.display = act;
    else document.getElementById(id).style.display = act;
}

function hideSideView() {
    if (document.getElementById("nameContextMenu")) {
        divDisplay ("nameContextMenu", 'none');
    }
}

function chg_class(target, div_id, val){
    clickAreaCheck = true;    
    var layer = document.getElementById(div_id);
    if(typeof(target) == "string") targetObj = document.getElementById(target);
    
    if(val && val == "over"){
        targetObj.className = 'out';        
        divDisplay (div_id, 'none');  
        return;  
    }
    if(layer.style.display != "none"){
        targetObj.className = 'out';        
        divDisplay (div_id, 'none');    
    }else{
        targetObj.className = 'over';
        divDisplay (div_id, 'block');        
        hideOtherLayer(target);
    }
}

function getStyle(e, cssProperty, mozCssProperty){          
    var mozCssProperty = mozCssProperty || cssProperty;                                 
    return (e.currentStyle) ? e.currentStyle[cssProperty] : document.defaultView.getComputedStyle(e, null).getPropertyValue(mozCssProperty);  
}
function getCoords(e, permissibleRange){
    var scope = permissibleRange ? permissibleRange : null;   
                         
    if(typeof(e) == 'object'){
         var element = e;
    } else {
         var element = document.getElementById(e);
    }   
    var w = element.offsetWidth;
    var h = element.offsetHeight;   
    var coords = { "left" : 0, "top" : 0, "right" : 0, "bottom" : 0 , "width" : 0 , "height" : 0 };
    while(element){
        if(element.tagName == "HTML") break;                                                                     
        coords.left += element.offsetLeft || 0;
        coords.top += element.offsetTop || 0; 
        element = element.offsetParent;   
        if(!scope && element){                
            var isPosRel = getStyle(element, "position");
            if(isPosRel !== "static") break;
        }          
        if(scope && element && element.tagName != "BODY" && element.tagName != "HTML") {           
           coords.top -= element.scrollTop; 
        } 
    }                               
    coords.width = w;
    coords.height = h;  
    coords.right = coords.left + w;                                                                 
    coords.bottom = coords.top + h;                            

    return coords;
}

function showLayerMenu(menu, btn, diff) {
    clickAreaCheck = true;
    
    if (typeof menu == 'string') { menu = document.getElementById(menu); }
    if (typeof btn == 'string') { btn = document.getElementById(btn); }
    
    hideOtherLayer(btn.id);
    
    if (menu.style.display == "block"){
    	divDisplay(menu, 'none');
    	return;
    }
    
    var layerPos = getCoords(btn);
    if (diff && diff.left) { layerPos.left+=diff.left; }
    if (diff && diff.top) { layerPos.top+=diff.top; }
    
    menu.style.left = layerPos.left + "px";
    menu.style.top = layerPos.top + layerPos.height + "px";
    divDisplay(menu, 'block');
}


function directGoUrl(url, p) {
	getTopWindow().document.location.href=url;
}

function removeSpecialSpace(str) {
	return str.replace("/　/", "");
}

function onclickSnsShareOnReply(event){
	var elCheck = daum.Event.getElement(event);
	sendSNSUtil.send(elCheck);
}

var sendSNSUtil = {
	send: function(element) {
		var serviceName = element.className;
		
		if (serviceName === "yozm") {
			this.checkYozm(element);
		} else if(CAFEAPP.ui.sns.allows && CAFEAPP.ui.sns.allows.contains(serviceName) == false) {
			this.popShare(element);
		}
	},
	checkYozm: function(element) {
		WISNSShareService.isSecededUser(this.didReceiveDataByYozmCheck.bindAsEventListener(this, element));
	},
	didReceiveDataByYozmCheck: function(data, element) {
		var jsonData = daum.Ajax.jsonToObject(data);
		
		if (jsonData.status && jsonData.status != 200) {
			if (jsonData.result_msg.indexOf("ErrorCode 4040") > -1) {
				alert("요즘 서비스 탈퇴 처리 중입니다. 탈퇴한 후 48시간이 경과되지 않았습니다.");
				element.checked = false;
			}
		}
	},
	popShare: function(element) {
		if(element.checked) {
			var url = "http://profile.daum.net/api/popup/JoinProfile.daum?service_name=" + [element.className] + "&callback=sendSNSUtil.didReceiveDataByPopShare";
			var sendSns = window.open(url, 'send_sns', 'width=500, height=400, resizable=no, scrollbars=no');
			
			if(!sendSns || sendSns.outerWidth == 0) {
				alert("팝업 차단을 해제해 주세요.");
			}
			
			element.checked = false;
		}
	},
	didReceiveDataByPopShare: function(serviceName) {
		if(CAFEAPP.ui.sns.allows.contains(serviceName) == false) {
			CAFEAPP.ui.sns.allows.push(serviceName);
			setTimeout(this.checkService.bind(this, serviceName), 100);
		}
	},
	checkService: function(serviceName) {
		var contentWrap = daum.$("content");
		var element = daum.$$("input." + serviceName, contentWrap)[0];
		
		element.checked = true;
		alert(serviceName + " 서비스에 연결되었습니다.");
		
		this.applyAllows();
	},
	applyAllows: function() {
		var contentWrap = daum.$("content");
		var allows = CAFEAPP.ui.sns.allows;
		
		for(var i = allows.length; i--;) {
			var arrAllowLabels = daum.$$("." + allows[i]+"_label", contentWrap);
			
			for(var j = arrAllowLabels.length; j--;) {
				var targetNode = arrAllowLabels[j].parentNode;
				targetNode.className = targetNode.className.replace(/sns_not_connected/g, "");
			}
		}
	}
};


(function(){
	namespace("daum.cafe.bbs");
	var sns = daum.cafe.bbs.Sns = function(elId){
		this._init(elId);
	};
	sns.prototype = {
		_init : function(elId){
			var el = daum.$(elId);
			if(!el){return;}
			this._el = el;
			
			
			daum.Event.addEvent(daum.$$(".mypeople", el)[0], "click", this.sendSnsPopup.bindAsEventListener(this));
			daum.Event.addEvent(daum.$$(".twitter", el)[0], "click", this.sendSnsPopup.bindAsEventListener(this));
			daum.Event.addEvent(daum.$$(".nate", el)[0], "click", this.sendSnsPopup.bindAsEventListener(this));
			
			daum.Event.addEvent(daum.$$(".facebook", el)[0], "click", this.sendSnsPopup.bindAsEventListener(this));
			daum.Event.addEvent(daum.$$(".me2day", el)[0], "click", this.sendSnsPopup.bindAsEventListener(this));
			
			daum.Event.addEvent(daum.$$(".show_more_sns", el)[0], "click", this.toggleShowMore.bindAsEventListener(this));
			
			this._elSendCount = daum.$$(".sns_send_count", el)[0];
			
			this._callbackId = "sendSnsCallback" + elId;
			
			this._elMoreList = daum.$$(".sns_more_items", el)[0];
			
			window[this._callbackId] = this.sendSnsCallback.bind(this);
		},
		
		sendSnsPopup : function(ev){
			daum.Event.stopEvent(ev);
			hideOtherLayer();
			var el = daum.Event.getElement(ev);
			if(el.tagName.toLowerCase() != "a"){
				el = el.parentNode;
			}
			var url = el.href;
			url += "&callback=" + this._callbackId;
			if(daum.Element.hasClassName(el, "mypeople")){
				var send_sns = window.open(url, 'send_sns', 'width=700,height=560,resizable=no,scrollbars=no');
			} else {
				var send_sns = window.open(url, 'send_sns', 'width=500,height=400,resizable=no,scrollbars=no');
			}
			
			send_sns.focus();
			this.hide();
		},
		
		toggleShowMore : function(ev){
			daum.Event.stopEvent(ev);
			if(daum.Element.visible(this._elMoreList)){
				this.hide();
			} else {
				this.show();
			}
		},
		
		show: function(){
			var elMenus = daum.$("menus");
			if(elMenus && this._elMoreList.parentNode != elMenus){
				elMenus.appendChild(this._elMoreList);
				
			}
			this.updatePosition();
			hideOtherLayer("showMoreSns");
			daum.Element.show(this._elMoreList);
		},
		
		updatePosition: function(){
			var coords = daum.Element.getCoords(this._el);
			var offsetX = 0;
			var offsetY = -12;
			if(daum.Browser.ie){
				offsetX = -40;
				offsetY = -2;
			}
			daum.Element.setPosition(this._elMoreList, coords.left + offsetX, coords.bottom + offsetY);
		},
		
		hide: function(){
			daum.Element.hide(this._elMoreList);
		},
		
		sendSnsCallback : function(post_id, service_name, message, permalink){
			try{
				this.updateToSnsCount(post_id, service_name, message, permalink);
				this.updateUI();
			}catch(e){
				alert(e);
			}
		},
		
		updateToSnsCount : function(post_id, service_name, message, permalink){
			WISNSShareService.reportSNSShareResult(
					{
						grpid : CAFEAPP.GRPID,
						fldid : CAFEAPP.FLDID,
						dataid : CAFEAPP.ui.DATAID,
						serviceName : service_name || "", 
						postid : post_id || "",
						message : message || "",
						permalink : permalink || ""
					},
					{
						callback : function(){
							try{
								console.log("report ok");
							}catch(e){}
						},
						errorHandler:function(errStr, e) {
							try{
								console.error('error [SNS 보내기 카운트 업데이트에 실패했습니다.] : ', e);
							}catch(e){
								//alert('SNS 보내기 카운트 업데이트에 실패했습니다. ');
							}
						}
					}
			);
		},
		
		updateUI : function(){
			var cnt = parseInt(this._elSendCount.innerHTML) || 0;
			cnt++;
			this._elSendCount.innerHTML = cnt;
		}
	};
})();

(function () {
	namespace("daum.cafe");

	daum.cafe.scrap = function () {
		var TYPE_META = {
			'cafe': {height: 460},
			'mail': {height: 400},
			'blog': {height: 530}
		};
		var getHeight = function (scrapTarget) {
			for (var type in TYPE_META) {
				if (scrapTarget.classList.contains(type)) {
					return TYPE_META[type].height;
				}
			}
			return TYPE_META['cafe'].height;
		};
		return {
			showPopup: function (scrapTarget) {
				return !window.open(scrapTarget.href, 'scrap', 'width=620, height=' + getHeight(scrapTarget) + ', resizable=yes,scrollbars=yes');
			}
		}
	}();
})();

function popup(szURL, szName, iWidth, iHeight, properties) {
    var p ;
    if (typeof(properties) == "undefined")  {
        p= 'resizable=yes,scrollbars=yes,';
    }else{
        p = properties;
    }
       window.open(szURL, szName, 'width=' + iWidth + ',height=' + iHeight + ', '+p);
}

function logout(){
    if (CAFEAPP.CAFEINFO_currentPublic) {
		var url = CAFEAPP.LOGIN_URL + "/accounts/logout.do?url=" + encodeURIComponent(document.location.href);
    } else {
        var dummy = new Date().getTime() + Math.round(Math.random() * 100000);
        var img = new Image();
        img.src = 'https://www.daum.net/doc/loginoutClick.html?t__nil_navi=logout&nil_src=cafebbs&dummy=' + dummy
		var url = CAFEAPP.LOGIN_URL + "/accounts/logout.do?url=https://top.cafe.daum.net/";
    }
    
    if(getTopWindow().down==null){
        document.location.href = url;
    }else{
        if (CAFEAPP.CAFEINFO_currentPublic) {
			getTopWindow().down.location.href = url;
        } else {
			getTopWindow().location.href = url;
        }

		getTopWindow().power_editor_load = 0;
    }
    
}

function login(reffer){
	var reffer = reffer || (getTopWindow().down ? getTopWindow().down.location.href : getTopWindow().location.href);
	var url = CAFEAPP.LOGIN_URL + "/accounts/loginform.do?url=" + encodeURIComponent(reffer) + "&category=cafe&t__nil_navi=login";
	getTopWindow().location.href = url;
}

function poplogin_simple(strActionName){
	strActionName = strActionName || "글 작성";
	
	if(window.confirm("간편아이디는 회원 인증 후 " + strActionName + "이 가능합니다.\n회원 인증 페이지로 이동하시겠습니까?")){
		window.open('/_c21_/poplogin?grpid=' + CAFEAPP.GRPID + '&checksimpleid=Y', 'poplogin', 'width=700,height=300,resizable=no,scrollbars=no');
	}
}

function getTopWindow() {
	if(typeof getTopWindow.topWindow == "undefined") {
		var temp = window;
		while(temp != window.top) {
			try{
				temp.parent.document;
			}catch(e){
				break;
			}
			temp = temp.parent;
		}
		getTopWindow.topWindow = temp;
	}
	return getTopWindow.topWindow;
}

function caller(url) {
    if(CAFEAPP.NOT_EDITOR){
        getTopWindow().status='';
        if (getTopWindow().flag != null) {
            getTopWindow().deflag();
        }
    }
    location.href=url;
}

function article_write(url) {
	caller(url);
}

var human = ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010"];
var plant = [ "011", "015", "020", "025", "030", "035", "040", "045","050"];
var animal  = [ "051", "055", "060", "065", "070", "075","080", "085", "090"];
var food = ["091","095", "100", "105", "110", "115", "120", "125", "130"];
var communi = ["131","135", "140", "145", "150", "155", "160", "165", "170"];
var medal = ["171","189", "193", "197", "198", "202", "206", "208", "209", "210"];
var ranking = [human, plant, animal, food, communi, medal];  

function isRankingGroup(rankgroup,rank) {
    if ( rankgroup[0] <= rank &&  rankgroup[ rankgroup.length-1 ] >= rank ){
        return true;
    } else {
        return false;
    }
}
function addEvent(el, type, fn) {
    if (window.addEventListener) {
        el.addEventListener(type, fn, false);
    }
    else if (window.attachEvent) {
        el.attachEvent('on' + type, fn);
    }
    else {
        el['on' + type] = fn;
    }
}

function resizeContentImg(){
	var contentEl = document.getElementById('bbs_contents');
	var userContWidth = contentEl.offsetWidth;
	var imgEls = contentEl.getElementsByTagName("img");
	for(var i=0; i < imgEls.length; i++){
		var currentImgEl = imgEls[i];
		var offsetWidth = currentImgEl.offsetWidth;
		if(offsetWidth >= userContWidth - 20){
			currentImgEl.style.width = userContWidth + 'px';
			var actualWidth = currentImgEl.actualWidth;
			if (actualWidth) {
				var offsetHeight = currentImgEl.offsetHeight;
				currentImgEl.style.height = (offsetHeight / (actualWidth / offsetWidth)) + "px";
			}
		}
	}
}

function resizeMinWidthWrap() {
    var ele = document.getElementById("wrap");
    ele.style.width = (document.body.clientWidth < 1024) ?  "971px" : "auto";      
    window.setTimeout('resizeMinWidthWrap()',250);    	
}

/**
 * [FROM] _cafenoti_mini.html
 * Generated by Blues System
 */
Scrolling = function(preid,interval,height)
{
    this.preid = preid;
    this.speed = 1;             
    this.height = height;       
    this.div = document.getElementById(this.preid);
    this.div_scroll = document.getElementById(this.preid+"_scroll");
    this.div_scroll_list = this.div_scroll.getElementsByTagName("li");
    this.cnt = this.div_scroll_list.length;
    this.interval = interval;
    this.tmp = 0; this.ncnt=1;
    if(this.cnt > 0 ) this.div.style.display = "block";
    if(this.cnt > 1 ){
        var self=this;
	    for(var i=0,len=this.cnt; i<len; i++){
	        var cur = i+1;
	        this.div_scroll_list[i].innerHTML += '<span class="noti_cnt">&nbsp;&nbsp; <a class="num" href="#" onclick="ScrollNoti.isover=true;ScrollNoti.showLayer();return false;">(<strong class="txt_point b">'+cur+'</strong> / '+this.cnt+')</a> &nbsp;<span class="arrowB">▼</span></span>';
	    }
        this.div.onmouseover=this.div_scroll.onmouseover=function(){ this.isover=true; }
        this.div_scroll.onmouseout=function(){ this.isover=false; setTimeout(function(){self.hideLayer()},500); }        
        window.setTimeout(function(){self.play()}, 5000);
    }
    
}
Scrolling.prototype.play = function() {
    var self=this;    
    var top = 0;
    if(!self.div_scroll.isover) {
        top = parseInt(self.div_scroll.style.top) || 0;
        if(++self.tmp > self.cnt-1)
        {
            this.div_scroll.style.top=0; self.ncnt=1; 
            self.tmp=0;
            window.setTimeout(function(){self.play()}, this.interval);
            return;
        }
        else {
            this.div_scroll.style.top=top-self.height+"px";
        }
    }     
    window.setTimeout(function(){self.play()},this.interval);
}
Scrolling.prototype.showLayer = function(){
    this.div.className ="more_notice";
    this.div_scroll.className = "bg_sub";
    this.div_scroll.style.top = 0;
    this.ncnt=1;
}
Scrolling.prototype.hideLayer = function(){    
    if(this.div_scroll.isover == true) return;
    this.div.className ="simple_notice";
    this.div_scroll.className = "";
    this.div_scroll.style.top = 0;
    this.ncnt=1;                
}

/**
 * [FROM] cafeinfobox.html
 */

var alimNewImageTag = "<img src=\"//t1.daumcdn.net/cafe_image/cf_img4/skin/W01/10_new.png\" width=\"10\" height=\"10\" alt=\"new\" />";

function goHanmailBox() {
	if (document.getElementById("mail_cnt").innerText === "생성하기")
		mailModule.openMailPopupWithCallback(loadPersonalCount, "MYINFO");
	else
		window.open('https://mail.daum.net');
}

function initPersonalArea() {
	var topWindow = getTopWindow();
	if (topWindow.cleanPersonalArea) {
		topWindow.cleanPersonalArea(CAFEAPP.CAFE_ENCRYPT_LOGIN_USERID);
	}
    loadPersonalCount();
    loadMyArticleFeedback(); //내글 반응 불러오기
}

function loadPersonalCount() {
    if (getTopWindow().personal_count) {
        var count = getTopWindow().personal_count.split(":");
        if (count.length == 3) {
            setPersonalCount(count[0], count[1], count[2]);
            return;    
        }
    }
    var url = "/_c21_/personal_count?callback=cbPersonalCount";
    var headElement = document.getElementsByTagName("head").item(0);
    var scriptTag = document.createElement("script");
    scriptTag.setAttribute("id", "PersonalScript");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", url);
    headElement.appendChild(scriptTag);
}

function loadMyArticleFeedback(){
	var alimCount = daum.getCookie("alimcnt" + CAFEAPP.GRPID);
	var alimParam = "?grpid=" + CAFEAPP.GRPID + "&timeout=120";
	
	if (CAFEAPP.MEMBER_MEMBER) {
		if (typeof alimCount === "undefined") {
			var img = new Image();
			img.src = "/_c21_/my_alimi_cnt.gif" + alimParam;
			img.onload = function() {
				insertMyAlimCnt(daum.getCookie("alimcnt" + CAFEAPP.GRPID));
				delete img;
			}
		} else {
			insertMyAlimCnt(alimCount);
		}
    }
}

function setInnerHtmlWithElementId(elId, value){
	var el = document.getElementById(elId);
	if(el){
		el.innerHTML = value;
	}
}
// used personal_count callback function
function cbPersonalCount(mail, pmsg, gmsg) {
    setPersonalCount(mail, pmsg, gmsg);
	getTopWindow().personal_count = mail + ":" + pmsg + ":" + gmsg;
}

function setPersonalCount(mail, pmsg, gmsg) {
    insertNewMailCount(mail);
    insertNewMsgCount(pmsg, gmsg);
}

function insertNewMailCount(mailCount) {
	var cntText = "확인";
	var cntMini = '';
	if (!isNaN(mailCount) && parseInt(mailCount) > 0) {
		cntMini = cntText = mailCount;
		if (parseInt(mailCount) > 99) {
			cntMini = '99+';
		}
	}
	if (mailModule && mailModule.isMailSendable()) {
		cntMini = cntText = "생성하기";
	}

	setInnerHtmlWithElementId('mail_cnt', cntText);
	setInnerHtmlWithElementId('mail_cnt_mini', cntMini);
}
function insertNewMsgCount(pCount, gCount) {
    var cntText = "확인";
    var cntPersonal = parseInt(pCount);
    var cntGroup = parseInt(gCount);

    var msgCount = 0;
    if (!isNaN(cntPersonal) && cntPersonal > 0) {
        msgCount += cntPersonal;
    }
    if (!isNaN(cntGroup) && cntGroup > 0) {
        msgCount += cntGroup;
    }
    if (msgCount > 0) {
        cntText = msgCount;
        setInnerHtmlWithElementId('alimi_new', alimNewImageTag);
        setInnerHtmlWithElementId('msgbox_new', alimNewImageTag);
        
    }
    setInnerHtmlWithElementId('msgbox_cnt', cntText);
}

function insertMyAlimCnt(count) {
	count = parseInt(count);
	
	if(typeof count == "number" && !isNaN(count)){
		if (count > 0){
			setInnerHtmlWithElementId('my_alimi_new', alimNewImageTag);
			setInnerHtmlWithElementId('alimi_new', alimNewImageTag);
		}
	}
}

var key;    
function blockKeyCode(e){                   
    if(window.event) {
        // for IE, e.keyCode or window.event.keyCode can be used
        key = e.keyCode;            
    }
    else if(e.which) {
        // netscape,firefox
        key = e.which;  
    }
    else {
        // no event, so pass through
        key=0;
    }
}

/**
 * [FROM] bbs_read.html
 * 플래시에서 호출하는 함수
 */
function onClipBoard(isSuccess, title, url){
    if(isSuccess) {
        alert(title + " 주소가 복사되었습니다.");
    }
    else { alert(title + " 주소가 복사되지 않았습니다.\n아래 주소를 직접 드래그하여 복사해주세요.\n\n" + url); }
}

function replaceImageToOriginal(url) {
    var replace_url = url.replace("image", "original");
    albumViewer('viewer', replace_url);
}

function showOriginalImage(ex) {
	
	var target;
	
	if(ex.target) {
		target = ex.target;
	} else if (ex.srcElement) {
		target = ex.srcElement;		
	} else {
		return;
	}
	
	if(target.parentNode.tagName.toLowerCase() == "a") {
		return;
	}
	
    replaceImageToOriginal(target.src);
}

/**
 * [FROM] components
 */
function changeSideCont_pupular(obj) {                                                                              
    if(obj == "count"){                                     
        document.getElementById('popular_cnt').className = "inBox block";
        document.getElementById('popular_reply').className = "inBox none";
        changeSideContPage(1,'popular_cnt');
    } else {
        document.getElementById('popular_cnt').className = "inBox none";
        document.getElementById('popular_reply').className = "inBox block";
        changeSideContPage(1,'popular_reply');
    }
}

function changeSideCont_member(obj) {                                               
    if(obj == "visit"){
        document.getElementById('member_visit').className = "inBox block";
        document.getElementById('member_article').className = "inBox none";
        document.getElementById('member_reply').className = "inBox none";
        if (document.getElementById('member_visit_page1')) changeSideContPage(1,'member_visit');
    } else if(obj == "article") {
        document.getElementById('member_visit').className = "inBox none";
        document.getElementById('member_article').className = "inBox block";
        document.getElementById('member_reply').className = "inBox none";
        if (document.getElementById('member_article_page1')) changeSideContPage(1,'member_article');
    } else {
        document.getElementById('member_visit').className = "inBox none";
        document.getElementById('member_article').className = "inBox none";
        document.getElementById('member_reply').className = "inBox block";
        if (document.getElementById('member_reply_page1')) changeSideContPage(1,'member_reply');                            
    }
}

function changeSideCont_noti(obj) {                                                                             
    if(obj == "visit"){                                     
        document.getElementById('member_noti_visitor').className = "inBox block";
        document.getElementById('member_noti_join').className = "inBox none";
        changeSideContPage(1,'visitor');
    } else {
        document.getElementById('member_noti_visitor').className = "inBox none";
        document.getElementById('member_noti_join').className = "inBox block";
        changeSideContPage(1,'join');                           
    }
}

function changeSideCont_cafeqa(obj) {                                               
    if(obj == "answer"){
        document.getElementById('cafeqa_answer').className = "inBox block";
        document.getElementById('cafeqa_faq').className = "inBox none";
        if (document.getElementById('cafeqa_answer_page1')) changeSideContPage(1,'cafeqa_answer');
    } else {
        document.getElementById('cafeqa_answer').className = "inBox none";
        document.getElementById('cafeqa_faq').className = "inBox block";
        if (document.getElementById('cafeqa_faq_page1')) changeSideContPage(1,'cafeqa_faq');
    }
}

function goDownFrame(url){
	getTopWindow().down.location.href=url;
    if (CAFEAPP.CAFE_TEMPLATE_TYPE_CODE == "1"){
        document.location.reload();
    }
}

/* textarea resizing + byte check */
function resizeArea(curObj, min, max, limit, limitcnt){
	
	updateCharter(curObj,limit,300);
	
	textarea = curObj;
	if (navigator.userAgent.indexOf("SV1") > 0){   } 
	else if(navigator.userAgent.indexOf("MSIE 7")>0) {  }
	else { max = 300; }

	if (navigator.userAgent.indexOf("Chrome/2") > 0){
		scrollheight = curObj.scrollHeight - 4;
	} 
	else { scrollheight = curObj.scrollHeight; }

	if(scrollheight<=min) {
		textarea.style.height = min + 'px';
		textarea.style.overflowY = "hidden";
	}else if(scrollheight>max){
		textarea.style.height = max + 'px';
		textarea.style.overflowY = "auto";
	}else{
		textarea.style.height = scrollheight + 'px';
		textarea.style.overflowY = "hidden";
	}
}

// component: cafestat
function changeCafeStat(id){
	var obj = document.getElementById('tab_' + id + "_stat");
	if(obj && obj.className=="txt_point"){
		return false;
	}
	document.getElementById('grph_homevisit').className="none";
	document.getElementById('grph_newjoin').className="none";
	document.getElementById('grph_newarticle').className="none";
	document.getElementById('grph_newcomment').className="none";
	
	document.getElementById('tab_homevisit_stat').className="opacity";
	document.getElementById('tab_newjoin_stat').className="opacity";
	document.getElementById('tab_newarticle_stat').className="opacity";
	document.getElementById('tab_newcomment_stat').className="opacity";
	
	document.getElementById('grph_'+id).className="grph_wrap";
	obj.className="txt_point";
	return false;
}

function showGrph(id){
	//세로선 관련 옵션들 
	var hGridGap = 24;
	var hGridCount = 4;
	var hGridOffsetTop = 24;
	var grph =  document.getElementById(id);
	var dd = grph.getElementsByTagName("DD");
	if(dd.length == 0){return;}
	
	
	if (!grph.hasHGrid) {
		var hGrid = document.createElement("div");
		hGrid.className = "divLine component_tit_line opacity";
		
		for (var i = 0; i < hGridCount; i++) {
			hGrid.style.top = (hGridOffsetTop + (hGridGap * i)) + "px";
			var cNode = hGrid.cloneNode(false);
			if(i == hGridCount-1){
				cNode.className += " bottomLine" 
			}
			grph.appendChild(cNode);
		}
	}
	grph.hasHGrid = true;
	
	
	var max = 0;
	for(var i = 0;i < dd.length; i++){
		var n = parseInt(dd[i].innerHTML);
		if(isNaN(n) || ((typeof n).toLowerCase() == "number" && 0 > n)){n=0;}
		if(max < n){max=n;}
	}
	var unit = max / 74;
	for(var i = 0; i < dd.length; i++){
		var n = parseInt(dd[i].innerHTML);
		if(isNaN(n)){n=0;}
		var height = Math.ceil(n / unit);
		if(isNaN(height) || ((typeof height).toLowerCase() == "number" && 0 >= height)){ height = 1;}
		dd[i].style.height = height + "px";
	}
	
	if(!grph.hasTooltip){
		var grph_tooltip = document.createElement("div");
		grph_tooltip.className="grph_tooltip none";
		
		var dt = grph.getElementsByTagName("DT");
		
		for(var i = 0; i < dd.length;i++){
			var grph_tt = grph_tooltip.cloneNode(false);
			grph_tt.id = id + "_tooltip" + (i+1);
			
			var d = dt[i].innerHTML.replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, "$1.$2.$3");
			dt[i].innerHTML = dt[i].innerHTML.replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, "$3");
			var v = dd[i].innerHTML.replace(/([0-9]+)([0-9]{3})/, "$1,$2").replace(/([0-9]+)([0-9]{3})/, "$1,$2");
			grph_tt.innerHTML = "<p>" + d + "</p><p class=\"txt_point\">" + v + "</p>";
			grph.appendChild(grph_tt);
		}
		
		grph.onmouseover = function(evt){
			evt = window.event || evt;
			var el = evt.target || evt.srcElement;
			var tooltip_id = this.id + "_tooltip" + el.className.replace(/[^\d]*/, "");
			if(el.tagName.toLowerCase() == "dd" || el.tagName.toLowerCase() == "dt" || el == document.getElementById(tooltip_id)){
				
				var dd = this.getElementsByTagName("dd");
				var height = dd[el.className.replace(/[^\d]*/, "") - 1].offsetHeight;
				
				showTooltip(tooltip_id, el.offsetLeft, el.offsetWidth, this.offsetWidth, height);	
			}
		}
		grph.onmouseout = function(evt){
			evt = window.event || evt;
			var el = evt.target || evt.srcElement;
			var tooltip_id = this.id + "_tooltip" + el.className.replace(/[^\d]*/, "");
			if(el.tagName.toLowerCase() == "dd" || el.tagName.toLowerCase() == "dt"){
				closeTooltip(tooltip_id);	
			}
		}
	}
	grph.hasTooltip = true;		
	
	for(var i = 0; i < dd.length; i++){
		new growUp(dd[i], 700);
	}
}

function showTooltip(id, left, width, maxRight, height){
	var tooltip = document.getElementById(id);
	tooltip.className = tooltip.className.replace(/\snone/, "");
	
	left = left + width / 2 - tooltip.offsetWidth / 2;
	if(left < 0){left = 0;}
	else if(left + tooltip.offsetWidth > maxRight){left = maxRight-tooltip.offsetWidth;}
	tooltip.style.left = left + "px";
	tooltip.style.top = (74 - height - 29) + "px"; 
}

function closeTooltip(id){
	var tooltip = document.getElementById(id);
	tooltip.className = tooltip.className.replace(/\snone/, "");
	tooltip.className += " none";
}

function growUp(obj, duration){
	var dest = obj.offsetHeight;
	var gap = (dest<20)?2:10;
	var height = 0;
	var interval = parseInt(duration / 36);
    obj.style.height = "0px";
	var growTimer = setInterval(function(){
        if(height >= dest){
			clearInterval(growTimer);
			obj.style.height = dest + "px";
			return;
		}
		height += gap;
		obj.style.height =  height + "px";
		if(gap!=1) gap--;
	}, interval);
}

function daumtrans(){
	var date = new Date().getTime().toString();
	document.getElementById('daumtrans').src = CAFEAPP.LOGIN_URL + "/accounts/auth.gif?" + date;
	window.setTimeout('daumtrans()',1200000);    	
}

/*
 * 말풍선 레이어: 이거 TTLayer (tool tip layer)로 이름 바꾸는게 좋을듯.
 * 이름 둘다 어렵긴 마찬가지..
 */
var BalloonLayer={
	dir: {
		TOP: 1,
		RIGHT: 2,
		BOTTOM: 3,
		LEFT: 4
	},
	show:function(elm, where, diff){
		var icon=daum.$(elm);
		var layer=daum.$(icon.hash.substr(1));
		
		var c=daum.Element.getCoords(icon, true);
		
		var dx=0,dy=0;
		if (diff && diff.x) { dx = diff.x; }
		if (diff && diff.y) { dy = diff.y; }
		
		daum.Element.show(layer);
		
		switch(where) {
		case BalloonLayer.dir.TOP:
			daum.Element.setPosition(layer, (c.left-(layer.offsetWidth-icon.offsetWidth)/2)+dx, (c.top-layer.offsetHeight)+dy);
			break;
		case BalloonLayer.dir.RIGHT:
			daum.Element.setPosition(layer, c.left+icon.offsetWidth+dx, c.top+dy);
			break;
		case BalloonLayer.dir.BOTTOM:
			daum.Element.setPosition(layer, (c.left-(layer.offsetWidth-icon.offsetWidth)/2)+dx, c.top+c.offsetHeight+dy);
			break;
		case BalloonLayer.dir.LEFT:
			daum.Element.setPosition(layer, c.left-layer.offsetWidth+dx, c.top+dy);
			break;
		}
	},
	hide: function(elm){
		var icon=daum.$(elm);
		var layer=daum.$(icon.hash.substr(1));
		daum.Element.hide(layer);
	}
};

/* 특수문자인지 여부 */
function isSpecialCharacter(c){
	var code = c.charCodeAt(0);
	if (code <= 0x7e) { return false; } // keyboard letter
	if (code >= 0x3131 && code <= 0x318e) { return false; } // Hangul Letter
	if (code >= 0x3041 && code <= 0x3093) { return false; } // Hiragana
	if (code >= 0x30a1 && code <= 0x30f6) { return false; } // Katakana
	if (code >= 0x4e00 && code <= 0x9fa5) { return false; } // CJK Unified Ideograph
	if (code >= 0xac00 && code <= 0xd7a3) { return false; } // Hangul syllable
	if (code >= 0xf900 && code <= 0xfa0b) { return false; } // CJK compatibility Ideograph
	return true;
}

/* IE10 에서 frame이 렌더링이 안되는 버그 -> 문서 로드 이후 리사이즈 */
/* _bbs_footer.html에서 사용*/
function resizeContentFrame(){
	var contentFrame = parent.document.getElementById("down");
	if(contentFrame){
	daum.Element.hide(contentFrame);
	contentFrame.style.width = "0px";
	contentFrame.style.height = "0px";
  	
	contentFrame.style.width = "100%";
	contentFrame.style.height = "100%";
	daum.Element.show(contentFrame);
	}
}

/* 팝업 리사이즈 */
function resizeToAutoHeight(width, heightOffset, offsets){
	var gap = 0;
	heightOffset = heightOffset?heightOffset:0;
	if(offsets){
		for(var i = 0;i < offsets.length; i++){
			if(offsets[i].bw){heightOffset = offsets[i].offset;}
		}
	}
	width = width?width:document.documentElement.scrollWidth;
	if(daum.Browser.cr){
		if (document.documentElement.clientHeight > 0) { gap = 50; }
		window.resizeTo(width, document.body.clientHeight + gap + heightOffset);
		return;
	}//Chrome
	var height = daum.Browser.sf ? document.body.clientHeight : document.body.scrollHeight;
	window.resizeTo(width, height); //set Standard Size...
	var innerHeight=document.documentElement.scrollHeight?document.documentElement.scrollHeight:document.body.scrollHeight;
	var contentHeight=0;
	if(daum.Browser.ie || daum.Browser.op){
		contentHeight = document.documentElement.clientHeight?document.documentElement.clientHeight:document.body.clientHeight;
		if(daum.Browser.ie_sv1){innerHeight = document.body.scrollHeight;}
	}
	else if(daum.Browser.ff){
		contentHeight = window.innerHeight;
	}
	else if(daum.Browser.sf)
	{
		innerHeight = document.body.clientHeight;
		contentHeight = window.innerHeight;
	}
	if(innerHeight && contentHeight && innerHeight != contentHeight){
		gap = innerHeight - contentHeight;
	}

	window.resizeTo(width, height+gap+heightOffset);
}

/* 전사 통합 신고 팝업으로 신고 팝업 띄우기 */
function openSpam119(isMine, isLogin, grpid, fldid, dataid, title) {
	if (isMine) {
		alert("본인이 작성한 게시물은 신고하실 수 없습니다.");
		return;
	}

	var docurl = encodeURIComponent("https://cafe.daum.net/_c21_/bbs_read?grpid=" + grpid + "&fldid=" + fldid + "&datanum=" + dataid);

	var gourl = "/_c21_/bridge/spam_report?viewUrl=" + docurl + "&serviceCode=1&platformCode=CAFE&contentType=ARTICLE"
	            + "&siteId=" + grpid +"&bbsId=" + fldid + "&articleId=" + dataid + "&title=" + encodeURIComponent(title);
	var url = "";
	if (!isLogin) {
		if (confirm("Daum로그인 후 신고하실 수 있습니다. 계속하시겠습니까?")) {
			var encodeParam = encodeBase64(gourl);
			url = "/_c21_/poplogin?grpid=" + grpid + "&otherSite=Y&reloadSelf=Y" + "&param="+encodeParam;
		}
	} else {
		url = gourl;
	}

	var popBbs = window.open(url, 'bbsReport', 'width=522, height=602, resizable=yes, scrollbars=no');
	popBbs.focus();
}

/* 게시글 목록수 보기 */
function setListNum(listNum) {
	if (typeof listNum == "undefined") return;
	var form;
	if (document.pageForm && document.pageForm.listnum) {
		form = document.pageForm;
	} else if (document.searchForm && document.searchForm.listnum) {
		form = document.searchForm;
	} else if (document.listForm && document.listForm.listnum) {
		form = document.listForm;
	} else {
		return;
	}
	
	form.listnum.value = listNum;
	if (typeof CAFEAPP != "undefined" && typeof CAFEAPP.ui != "undefined") CAFEAPP.ui.LISTNUM = listNum;
	goPage(1);
}

/* 더보기 */
function toggleMoreLess(obj) {
	var _elWrap = obj.parentNode.parentNode;
	if(!_elWrap.className) {
		return;
	}
	if(_elWrap.className.indexOf("txc-moreless-spread") > -1) {
		_elWrap.className = 'txc-moreless';
	} else {
		_elWrap.className = 'txc-moreless-spread';
	}
}

/*친구카페 컴포넌트*/
function friendCafeListPage(btn, pageType){
	var isDisableBtn = daum.Element.hasClassName(btn,"opacity");
	
	if(!isDisableBtn){
		var btnBox = daum.$('friendCafePageBox');
		var prevBtn = daum.$$('.prev',btnBox)[0];
		var nextBtn = daum.$$('.next',btnBox)[0];

		if(pageType == "prev"){
			daum.Element.replaceClassName(daum.$("friendCafePage1"),"none","block");
			daum.Element.replaceClassName(daum.$("friendCafePage2"),"block","none");
			daum.Element.addClassName(prevBtn,"opacity");
			daum.Element.removeClassName(nextBtn,"opacity");
		}else{
			daum.Element.replaceClassName(daum.$("friendCafePage1"),"block","none");
			daum.Element.replaceClassName(daum.$("friendCafePage2"),"none","block");
			daum.Element.addClassName(nextBtn,"opacity");
			daum.Element.removeClassName(prevBtn,"opacity");
		}
	}
}

TooltipLayer = {	
	tooltipLayers : [],
	
	makeTooltipLayer : function(helpIcons){
        var tooltip = daum.Element.getNext(helpIcons);
		
		if(tooltip && tooltip.tagName.toLowerCase() == "p"){
			this.tooltipLayers.push({"icon" : helpIcons, "tooltip" : tooltip});
			document.body.appendChild(tooltip);
			
			if(tooltip){
				daum.Element.show(tooltip);			
				this.setTooltipPosition(helpIcons, tooltip);			
			}
		}
	},	
	setTooltipPosition : function(helpIcons, tooltip){
		if(tooltip){
			var position = daum.Element.getCoords(helpIcons);
			var layerWidth = tooltip.offsetWidth;
			var layerHeight = tooltip.offsetHeight;			
			var iconWidth = (helpIcons.width)? helpIcons.width : 0;
			
			var posX = parseInt(layerWidth/2 - (iconWidth/4));
			var posY = layerHeight + 1;			
			
			daum.Element.setLeft(tooltip, position.left - posX);
			daum.Element.setTop(tooltip, position.top - posY);
		}
	},
	showTooltip : function(elem){
		var tooltipLayer = this.getTooltipLayer(elem);
		
		if(tooltipLayer){
			daum.Element.show(tooltipLayer);
			this.setTooltipPosition(elem, tooltipLayer);
		} else {
			this.makeTooltipLayer(elem);
		}
	},
	hideTooltip : function(elem){		
		var tooltipLayer = this.getTooltipLayer(elem);		
		
		if(tooltipLayer){
			daum.Element.hide(tooltipLayer);
		}
	},
	getTooltipLayer : function(elem){
		if(this.tooltipLayers){		
	    	for(var i=0; i<this.tooltipLayers.length; i++){	    		
	    		if(this.tooltipLayers[i].icon == elem){
	    			return this.tooltipLayers[i].tooltip; 
	    		}
	    	}
		}    			
	}
};

/* 게시글 추천 */
function recommendBBS(grpid, fldid, dataid) {
	if (CAFEAPP.CAFE_ENCRYPT_LOGIN_USERID == '') {
		if(confirm("게시글을 추천하시려면\n로그인 해주세요.")){ login(); }
		return;
	}
	if (!CAFEAPP.MEMBER_MEMBER) {
		if(confirm("카페 회원만 추천할 수 있습니다.\n카페에 가입하시겠습니까?")){ document.location.href = "/_c21_/join_register?grpid="+grpid; }
		return;
	}
	handleRecommend(grpid, fldid, dataid); // bbs_recommend.js
}

/*!
 * @overview Blinder Javascript widget
 * Copyright (c) 2011 Ft4 Front-end Technology Center, Daum Communications.
 * 
 * $Version : 1.0.0 $
 * $Date : 2011-09-07 14:12 $
 * $Description : darkLayer$
 * $Required : namespace (function), jigu$
 * $CSS : 
 * 				#darkBg {z-index:99999; position:fixed; top:0; left:0; background-color:#000;width:100%;height:100%;background-color:#000;opacity:0.5; filter:alpha(opacity=50);}
 * 				* html #darkBg {position:absolute;}
 *				.light_box {position:fixed; z-index:100000;}
 *				* html .light_box {position:absolute;}
 *
 */

(function(){
	namespace("daum.cafe.widget");
    
    if (!daum.Browser) {return;}
    
	daum.cafe.widget.Blinder = (function() {
        var makeDarkBg = function(){
            var el = document.createElement("div");
            el.id = "darkBg";
            el.style.display = "none";
            document.body.appendChild(el);
            return el;
        }
        
        var isOldIe = daum.Browser.ie && daum.Browser.version < 9;

        
        return {
            layerEl : null,
            shadowEl : null,
            darkBgEl : null,
        	layerEl_OffsetX : 0,
    

            show : function(layerEl, shadowEl, offsetX, isMove){
                if(!this.darkBgEl){
                    this.darkBgEl = makeDarkBg();
                    daum.Event.addEvent(window, "resize", this.updateUI.bindAsEventListener(this));
                    daum.Event.addEvent(window, "scroll", this.updateUI.bindAsEventListener(this));
                    daum.Event.addEvent(this.darkBgEl, "click", this.hide.bind(this));
                }

                this.setOffsetX(offsetX);
                this.layerEl = daum.$(layerEl);

                if(this.layerEl && isMove){
                    daum.$("dialogs").appendChild(this.layerEl);
                }

                this.shadowEl = daum.$(shadowEl);
                
                if(this.shadowEl) {
                    this.shadowEl.style.display = 'block';
                }

                if(this.shadowEl && isMove){
                    daum.$("dialogs").appendChild(this.shadowEl);
                }
                

                daum.Element.addClassName(this.layerEl, "light_box");
                daum.Element.show(this.darkBgEl);
                daum.Element.show(this.layerEl);

                this.layerEl.style.top = '-1000px';

                this.didFixPosition = false;

                var initUpdateTimer = setInterval(this.updateUI.bind(this), 300);
                setTimeout(function(){
                    clearInterval(initUpdateTimer);
                }.bind(this), 2000);
            },

            hide : function(){
                clearTimeout(this.darkLayerTimer);
                daum.Element.hide(this.layerEl);
                daum.Element.hide(this.darkBgEl);
                
                if(this.shadowEl) {
                    daum.Element.hide(this.shadowEl);
                }
                
                this.layerEl = null;
                this.shadowEl = null;
                this.layerEl_OffsetX = 0;
            },

            updateUI : function(){
                this.updateLayerPosition();
                this.updateDarkBgElementSize();
            },

            updateLayerPosition : function(){
                if(!this.layerEl){return;}

                var elOffset = daum.Element.getCoords(this.layerEl, true),
                    bOffset = daum.Browser.getWindowSize(),
                    w = elOffset.right - elOffset.left,
                    h = elOffset.bottom - elOffset.top,
                    x =  this.calcCenter(bOffset.width, w),
                    y =  this.calcCenter(bOffset.height, h);
                

                if(h >= bOffset.height || w >= bOffset.width){
                    if(!this.didFixPosition && daum.Browser.ie6){
                        this.offsetScrollX = this.getScrollLeft();
                        this.offsetScrollY = this.getScrollTop();
                        this.didFixPosition = true;
                    }

                    if(isOldIe){
                        x += this.offsetScrollX;
                        y += this.offsetScrollY;
                    } else {
                        x -= this.getScrollLeft();
                        y -= this.getScrollTop();
                    }

                } else {

                    if(isOldIe) {
                        this.didFixPosition = false;
                        x += this.getScrollLeft();
                        y += this.getScrollTop();
                    }
                }
                daum.Element.setPosition(this.layerEl, (parseInt(x, 10) + this.layerEl_OffsetX), parseInt(y, 10));
                this.updateShadowElementPositionAndSize (x, y);
            },

            updateDarkBgElementSize: function(){
                if(daum.Browser.ie && this.darkBgEl){
                    var bOffset = daum.Browser.getWindowSize();

                    var winHeight = Math.max(bOffset.height, document.body.scrollHeight);
                    var winWidth = Math.max(bOffset.width, document.body.scrollWidth);


                    var isHeightChange = winHeight!= this.darkBgEl.offsetHeight;
                    var isWidthChange = winWidth != this.darkBgEl.offsetWidth;
                    if(isHeightChange){
                        this.darkBgEl.style.height = winHeight.px();
                    }
                    if(isWidthChange){
                        this.darkBgEl.style.width = winWidth.px();
                    }
                    
                }
            },


            updateShadowElementPositionAndSize : function(x, y){
                if(this.shadowEl){
                    this.shadowEl.style.left = parseInt(x).px();
                    this.shadowEl.style.width = (this.layerEl.offsetWidth).px();

                    this.shadowEl.style.top = parseInt(y).px();
                    this.shadowEl.style.height = (this.layerEl.offsetHeight).px();
                }
            },

            calcCenter: function(nParent, nChild) {
                return Math.abs((nParent - nChild) * 0.5);
            },

            setOffsetX : function(offsetX){
                offsetX = parseInt(offsetX, 10);
                if(!!offsetX){
                    this.layerEl_OffsetX = offsetX;
                } else {
                    this.layerEl_OffsetX = 0;
                }
            },

            getScrollLeft : function(){
                return daum.Browser.getScrollOffsets().left;
            },

            getScrollTop : function(){
                return daum.Browser.getScrollOffsets().top;
            }

        };
    })();

})();

/* 상세검색 관련 by wracker1 2010.11.10 - change3 */
CafeMenuInfo = function(param){
	this.li = null;
	this.refer = null;
	this.title = param.title;
	this.fldid = param.fldid;
	this.index = param.index;
	this.type = param.type;		
    if(param.elem){
    	this.li = param.elem.cloneNode(true);
		this.refer = param.elem;
    }
};

/* 상세검색 카페리스트 셀렉터 */
ListSelector = {
	listWrap: null,
	btnWrap: null,
    init: function(){
    	this.template = new daum.Template("<li><input type='checkbox' id='check_#{fldid}' /><label  for='check_#{fldid}' class='hand opacity'>#{title}</label></li>");
		this.dataList = [];
		this.checkedList = [];
		this.list = daum.$$("#cafeMenuListWrap ul", this.listWrap)[0];
		
		this.getListData();
	},
	getListData: function(){
		WICafeSearch.listSearchableFolders(CAFEAPP.GRPID, {
	        callback: function(data){
	        	ListSelector.makeList(data);
	        }
	    });
	},
	makeList: function(data){
		if(data){
			var checkedString = "<li><input type='checkbox' id='selectAllMenu' /><label for='selectAllMenu' tabindex='1' class='hand opacity'>게시판 전체</label></li>";
			var unCheckedString = "";
			var unCheckedList = [];
			var state = false;
			var fldid = DetailSearchManager.form.fldid.value.split(",");
        	var filidLength = fldid.length;
			for(var i=0, len = data.length; i < len; i++){
				state = false;
				for(var j=0; j<filidLength; j++){
                    if(fldid[j] == data[i].fldid){
                		state = true;
                    }
                }
                if (state == true){
                	this.checkedList.push(new CafeMenuInfo({title:data[i].fldname, fldid:data[i].fldid, type:"icon_"+data[i].fldtype}));
					checkedString += this.template.evaluate({title:data[i].fldname, fldid:data[i].fldid, type:"icon_"+data[i].fldtype});
                } else {
                	unCheckedList.push(new CafeMenuInfo({title:data[i].fldname, fldid:data[i].fldid, type:"icon_"+data[i].fldtype}));
					unCheckedString += this.template.evaluate({title:data[i].fldname, fldid:data[i].fldid, type:"icon_"+data[i].fldtype});
                }
			}
			this.dataList = this.checkedList.concat(unCheckedList);
			if(this.dataList.length == unCheckedList.length && fldid.length == 0){
				this.checkedList = unCheckedList;
			}
			this.list.innerHTML = checkedString + unCheckedString;
		}
		this.boardNumber = data.length;
		this.registEventListener();
		DetailSearchManager.setInputsByFormElements(DetailSearchManager.form);
	},
	getTotalBoardNumber: function(){
		return this.boardNumber;
	},
	getCheckedList: function(){
		var checkedList = [];
		for(var i=0; i<this.dataList.length; i++){
			if (this.list.childNodes[i+1].childNodes[0].checked){
				checkedList.push(this.dataList[i]);
			}
		}
		return checkedList;
	},
	checkAll: function(ev){
		var elem = daum.getElement(ev);
		if(this.selectAll.checked){
			this.checkAllList(true);
		} else {
			this.checkAllList(false);
		}
	},
	checkAllList: function(checked){
		var listChildNodes = this.list.childNodes;
		var checkbox;
		for(var i=0, len=listChildNodes.length; i<len; i++){
			checkbox = daum.Element.getFirstChild(listChildNodes[i])
			checkbox.checked = checked;
			this.changeTextByCheck(checkbox);
		}
	},
	registEventListener: function(){
		this.checkBoxList = daum.$$("input", this.list);
		this.selectAll = this.checkBoxList.shift();
		daum.Event.addEvent(this.selectAll, "click", this.checkAll.bind(this));
		
		(this.checkBoxList).each((function(checkbox){
			daum.Event.addEvent(checkbox, "click", this.onclickCheckbox.bind(this));
		}).bind(this));
	},
	onclickCheckbox: function(e){
		var target = daum.Event.getElement(e);
		this.changeTextByCheck(target);
	},
	changeTextByCheck: function(target){
		var targetLabel = daum.Element.getNext(target);
		if (target.checked == true){
			targetLabel.className = "hand";
		} else if (target.checked == false) {
			targetLabel.className = "hand opacity";
			if (target !== this.selectAll){
				this.uncheckedSelectAll();
			}
		}
	},
	uncheckedSelectAll: function(){
		this.selectAll.checked = false;
		daum.Element.getNext(this.selectAll).className = "hand opacity"
	},
	getAllBoardList: function(){
		return this.dataList;
	},
	checkList: function(){
		var len = this.checkedList.length;
		if (this.dataList.length == len){
			this.checkListItem(-1);
		}
		for(var i=0; i < len; i++){
			this.checkListItem(i);
		}
	},
	checkListItem: function(index){
		var listChildNodes = this.list.childNodes;
		var checkbox = daum.Element.getFirstChild(listChildNodes[index+1])
		checkbox.checked = true;
		this.changeTextByCheck(checkbox);
	}
}


/* 상세검색에 사용하는 달력 */
Calendar = {
	inited: false,
	today: null,
	init: function(){
		this.calendarDiv = daum.$E('calendarDiv');
		this.calendarBackground = daum.$E('calendarBackground');
		this.btnCalPrev = daum.$E('btnCalPrev');
		this.btnCalNext = daum.$E('btnCalNext');
		this.curDate = daum.$E('curDate');
		this.calendarBody = daum.$E('calendarBody');
		
		daum.Event.addEvent(this.calendarBody, 'click', this.onClickDate.bind(this));
		daum.Event.addEvent(this.calendarBody, 'mouseover', this.onOverDate.bind(this));
		daum.Event.addEvent(this.calendarBody, 'mouseout', this.onOutDate.bind(this));
		daum.Event.addEvent(this.btnCalPrev, 'click', this.prevMonth.bind(this));
		daum.Event.addEvent(this.btnCalNext, 'click', this.nextMonth.bind(this));
		this.inited = true;
	},
	showCalendar: function(ev, calEl, inpEl, today){		
		daum.Event.stopEvent(ev);
		if (!ev) ev = window.event; 
		if(!this.inited) this.init();
		
		this.calEl = daum.$E(calEl);
		this.inpEl = daum.$E(inpEl);
		
		if(!this.today) this.today = this.strToDate(today);		
		
		this.selectedDate = this.strToDate(this.inpEl.value);
		this.setDate();		
		this.setPosition();
		
		var elem = daum.Event.getElement(ev);
		if(this.elem != elem){ 
			this.calendarDiv.show();
			this.calendarBackground.show();
		} else if(this.calendarDiv.visible()){
			this.calendarDiv.hide();
			this.calendarBackground.hide();
		} else {
			this.calendarDiv.show();
			this.calendarBackground.show();
		}
		this.elem = elem;
	},
	setDate: function() {
		this.sDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
		this.eDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth()+1, -1);
		this.sDay = this.sDate.getDay();
		this.tDay = this.sDate.getDay() + this.eDate.getDate();
		this.week = parseInt((this.tDay)/7);
		this.onRender();
	},
	onRender: function() {
		this.curDate.innerHTML = this.selectedDate.getFullYear() +"."+ (this.selectedDate.getMonth()+1);
		var cnt = 0, arrCalEl = [];

		for (j=0; j<=this.week ;j++ ){		
			for (i=0; i<7 ; i++){
				if (this.eDate.getDate() >= cnt){
					if ( i < this.sDay && j==0){
						var span = document.createElement('SPAN');						
						arrCalEl.push(span);
					}else{
						cnt++;
						var span = document.createElement('SPAN');
						if(i == 0) daum.$E(span).addClassName('holiday');	// 일요일
						if(this.checkToday(cnt)) daum.$E(span).addClassName('today'); // 오늘
						if(this.checkEnable(cnt)) { // 사용여부
							daum.$E(span).addClassName('enable');
						} else {
							if(i!=0 || !this.checkToday(cnt)) daum.$E(span).addClassName('disable txt_sub');
						}
						span.innerHTML = cnt;
						arrCalEl.push(span);
					}
				}
			}
		}
		Dom.removeNodes(this.calendarBody);
		for(var i=0; i< arrCalEl.length; i++) {
			this.calendarBody.appendChild(arrCalEl[i]);
		}
	},
	strToDate: function(str){
		return new Date(parseInt(str.substr(0,4)), (str.substr(5,2))-1, str.substr(8,2));
	},
	onClickDate: function(ev) {
		daum.Event.stopEvent(ev);
		var span = daum.Event.getElement(ev);
		if (span == undefined || span.tagName.toLowerCase() != "span") return;		
		if (daum.Element.hasClassName(span, 'enable')) {
			
			var day = (span.innerHTML.length<2) ? "0" +span.innerHTML : span.innerHTML;
			var month = (this.selectedDate.getMonth()+1).toString();
			if (month.length<2) month = "0"+ month;
 
			this.inpEl.value = this.selectedDate.getFullYear() +"."+  month +"."+ day;
			this.closeLayer();			
		}
	},
	onOverDate: function(ev) {
		var span = daum.Event.getElement(ev);		
		if (span == undefined || span.tagName.toLowerCase() != "span") return;
		if (daum.Element.hasClassName(span, 'enable') && !daum.Element.hasClassName(span, 'today')) {
			daum.Element.addClassName(span, 'bg_sub');
		}
	},
	onOutDate: function(ev) {
		var span = daum.Event.getElement(ev);
		if (span == undefined || span.tagName.toLowerCase() != "span") return;
		if (daum.Element.hasClassName(span, 'enable') && !daum.Element.hasClassName(span, 'today')) {
			daum.Element.removeClassName(span, 'bg_sub');
		}
	},
	prevMonth:function(ev){
		daum.Event.stopEvent(ev);
		var prevDate = new Date(this.selectedDate.getFullYear(),this.selectedDate.getMonth()-1,this.selectedDate.getDate());
		this.selectedDate = prevDate;
		this.setDate();
	},
	nextMonth:function(ev){
		daum.Event.stopEvent(ev);
		var nextDate = new Date(this.selectedDate.getFullYear(),this.selectedDate.getMonth()+1,this.selectedDate.getDate());
		this.selectedDate = nextDate;
		this.setDate();
	},
	closeLayer: function() { 
		this.calendarDiv.hide();
		this.calendarBackground.hide();
	},
	setPosition: function() {
		var p = daum.Element.getCoords(this.calEl, false, this.calEl.parentNode);
		this.calendarDiv.style.top = (p.top+19)+"px";
		this.calendarDiv.style.left = p.left+"px";
		this.calendarBackground.style.top = (p.top+19)+"px";
		this.calendarBackground.style.left = p.left+"px";
	},
	checkToday: function(cnt) {
		var selectedDate = Date.parse(new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), cnt));
		var today = Date.parse(this.today);
		return (selectedDate==today) ? true : false;
	},
	checkEnable: function(cnt) {
		var selectedDate = Date.parse(new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), cnt));
		return selectedDate <= this.today;
	}
};

Dom = {
	indexNum : 0,
	insertAfter: function(newEl, targetEl) {
		var parent = targetEl.parentNode;
		if (parent.lastChild == targetEl) {
			parent.appendChild(newEl);
		} else {
			parent.insertBefore(newEl, targetEl.nextSibling);
		}
	},
	removeNodes: function(el) {
		while(el.firstChild) {
			childNode = el.firstChild;
			el.removeChild(childNode);
		}
	},
	createIndex: function() {
		return "d2w"+ this.indexNum++;
	}
};

/* 새로운 상세검색 관리 */
DetailSearchManager = {
	layers: [],	
	inited: false,
	showed: false,
	form: null,
	offset: "top",
	params: {
		item: "searchContentType",
		query: "searchKeyword",
		nickname: "writer",
		searchPeriod: "selectTerm",
		docTypeSelect: "docTypeSelect"
	},
	init: function(){
		this.form = document.searchForm ? document.searchForm : document.innerSearchForm;
		this.detailSearchLayer = daum.$("detail_search_wrap");		
		this.searchBoxTop = daum.$C(document, "search_box_top_new")[0];
		this.searchBoxBottom = daum.$C(document, "search_box_bottom_new")[0];
		this.searchBoxTop.appendChild(this.detailSearchLayer);

		
		this.initParams();		
		ListSelector.init();
		this.initEvent();
		
	},
	initParams: function(){
		this.item = daum.$(this.params.item, this.detailSearchLayer);
		this.query = daum.$(this.params.query, this.detailSearchLayer);
		this.nickname = daum.$(this.params.nickname, this.detailSearchLayer);
		this.searchPeriod = daum.$(this.params.searchPeriod, this.detailSearchLayer);
		this.docTypeSelect = daum.$(this.params.docTypeSelect, this.detailSearchLayer);
		this.duration = daum.$C(this.detailSearchLayer, "sel_body")[0];
		
		this.footerBtn = $$(".footer_btn_wrap > a", this.detailSearchLayer);
		this.resetBtn = $$(".footer_btn_wrap > .reset", this.detailSearchLayer)[0];
	},
	initEvent: function(){
		daum.Event.addEvent(this.footerBtn[0], "click", this.onClickSearchListener.bind(this));
		daum.Event.addEvent(this.footerBtn[1], "click", this.hideDetailSearchLayer.bind(this));
		daum.Event.addEvent(this.resetBtn, "click", this.resetComponentValue.bind(this));
	},
	showDetailSearchLayer: function(el, offset){
		if(!CAFEAPP.DETAIL_SEARCH_INITED){
			this.init();
			CAFEAPP.DETAIL_SEARCH_INITED = true;
		}
		if(el){
			daum.Element.hide(el.parentNode);
			if (this.offset === offset){
				daum.Element.show(this.detailSearchLayer);
			} else {
				if (offset === "top"){
					this.searchBoxBottom.removeChild(this.detailSearchLayer);	
					this.searchBoxTop.appendChild(this.detailSearchLayer);
					daum.Element.show(this.detailSearchLayer);
				} else if (offset === "bottom"){
					this.searchBoxTop.removeChild(this.detailSearchLayer);
					this.searchBoxBottom.appendChild(this.detailSearchLayer);
					daum.Element.show(this.detailSearchLayer);
				}
				if (this.preNormalSearchLayer) {
					daum.Element.show(this.preNormalSearchLayer);
				}
				this.offset = offset;
			}
			daum.Element.show(this.docTypeSelect);
			this.preNormalSearchLayer = el.parentNode;
		}		
	},
	hideDetailSearchLayer: function(e){
		daum.Event.preventDefault(e);
		daum.Element.hide(this.detailSearchLayer);
		daum.Element.show(this.preNormalSearchLayer);
	},
	onClickSearchListener: function(ev){
		daum.Event.stopEvent(ev);
		
		var checked = this.isCheckedParams(this.form);
		
		if(checked){
			var fldids = this.form.fldid.value.split(",");
			if(fldids.length > 1 || fldids == ""){ 
				if(this.form.item.value == "cmtContent" || this.form.item.value == "cmtNicknameNgram"){
					this.form.action = "/_c21_/search_cmt";
				}else{
					this.form.action = "/_c21_/cafesearch";
				}
			}
			this.form.submit();
		}
		
	},
	resetComponentValue: function(ev){
		daum.Event.stopEvent(ev);
		// 검색범위
		if (this.item != null) {
			this.item.selectedIndex = 0;
		}
		// 검색단어
		this.query.value = "";
		// 글작성자
		this.nickname.value = "";
		// 기간선택
		this.searchPeriod.selectedIndex = 0;
		// 문서유형
		this.docTypeSelect.selectedIndex = 0;
		// 게시판 선택
		ListSelector.checkAllList(false);	
	},	
	isCheckedParams: function(form){
		// 검색어
		var query = daum.String.trim(this.query.value);
		// 글쓴이
		var nickname = daum.String.trim(this.nickname.value);

		if(query || nickname){ // 검색어가 있을 경우
			if (this.item != null) {
				if(nickname && !query){
	                form.item.value = "writer";
	            } else if (!nickname && query && form.item.value) {
					// nickname && query, !nickname && !query
				} else {
	                form.item.value = this.item.value;
	            }
			} else {
				if(nickname && !query){
	                form.item.value = "cmtNicknameNgram";
	            } else {
	                form.item.value = "cmtContent";
	            }
			}
			form.query.value = query;
			form.nickname.value = nickname;
		} else if(!query && !nickname){
			alert("검색어 또는 글쓴이를 입력해 주세요.");
			return false;
		}
		
		// 게시판선택
		var bbsList = ListSelector.getCheckedList();
		var fldid = "";
		var bbslen = bbsList.length
		if(bbslen != ListSelector.getTotalBoardNumber() || bbslen == 0){
			for(var i=0; i<bbsList.length; i++){
				if(i == 0){
					fldid += bbsList[i].fldid;
				} else {
					fldid += "," + bbsList[i].fldid;
				}
			}
		}
		form.fldid.value = fldid;
		
		// 기간선택
		if(this.searchPeriod.value == "#DURATION"){
			form.searchPeriod.value = this.searchPeriod[this.searchPeriod.selectedIndex].innerHTML;
		} else {
			form.searchPeriod.value = this.searchPeriod.value;
		}
		
		// 문서유형
		var docType = this.docTypeSelect.value;
		if(docType == "i" || docType == "m" || docType == "image" || docType == "movie"){
			form.media_info.value = docType;
			if (form.attachfile_yn) {
				form.attachfile_yn.value = "";
			}
		} else if(docType == "A,B" || docType == "A"){
			if (form.attachfile_yn) {
				form.attachfile_yn.value = docType;
			}
			form.media_info.value = "";
		} else {
			if (form.attachfile_yn) {
				form.attachfile_yn.value = "";
			}
			form.media_info.value = "";
		}
		
		if(form.head) form.head.value = "";
		
		return true;
	},
	setInputsByFormElements: function(form){
        //검색어
		if (this.item != null) {
	        if(form.item.value == "subject" || form.item.value == "onlytitle" || form.item.value == "filename"){
	            this.item.value = form.item.value;
	        } else {
	             this.item.value = "subject";
	        }
		} 
        //쿼리, 글쓴이
        this.query.value = decodeURIComponent(form.query.value);
        this.nickname.value = form.nickname.value;
               
        //게시판선택
        if(form.fldid.value == ''){
        	ListSelector.checkAllList(true);
        }else{
        	ListSelector.checkList();
        }
                
        //기간선택
        var searchPeriod = form.searchPeriod.value;
        if(searchPeriod == "aWeek" || searchPeriod == "aMonth") {
            this.searchPeriod.value = searchPeriod;
        } else if(searchPeriod == "all" || searchPeriod == "") {
            this.searchPeriod.value = "all";
        } else {
            var dates = searchPeriod.split("-");
            if(dates.length > 1){
                this.searchPeriod.value = "#DURATION";
                
                var options = this.searchPeriod.options
                for (var i=0,len=options.length; i<len; i++){
                	if (options[i].value == "#DURATION"){
                		options[i].innerHTML = searchPeriod;
                	}
                }
            }
        }
        
        //문서유형
        if (form.media_info && form.media_info.value) {
			this.docTypeSelect.value =form.media_info.value;
		} else {
			if (form.attachfile_yn && form.attachfile_yn.value){
				this.docTypeSelect.value = form.attachfile_yn.value;
			}else{
				this.docTypeSelect.value = "all";
			}
		}
    }
};

/* 날짜 검색 */
var SelectMaker = function(target, className, date1, date2){
	this.targetSelect = daum.$(target);
	this.data = [];
	this.date1 = date1;
	this.date2 = date2;
	this.className = className;
	this.id = this.getIdentification();
	this.closeEventHandler = this.closeEvent.bind(this);
	if (this.targetSelect){
		this.init();
	}	
};

SelectMaker.prototype = {
	init : function(){
        var body;
        this.targetSelect.onmousedown = function(e){
			var e = e || window.event;
			var target = e.target || e.srcElement;
			$('s_b_'+this.id).style.left = $E(this.targetSelect).getCoords(true,$('wrap')).left + 'px';
			SelectMaker.toggle('s_b_'+this.id);
			if(!daum.ff){
				target.disabled = 'disabled';
				setTimeout(function(){
					target.disabled = '';
				},400);
				daum.stopEvent(e);
			}
		}.bind(this);
		
		this.targetSelect.onfocus = function(e){
			var e = e || window.event;
			var target = e.target || e.srcElement;
			daum.stopEvent(e);
			target.blur();
		}
		
		this.getDataFromSelect();
		body = daum.createElement(this.createBodyElm());

		var next;
		if(next = $E(this.targetSelect).getNext()){			
			this.targetSelect.parentNode.insertBefore(body, next);
		}else{
			this.targetSelect.parentNode.appendChild(body);
		}

		SelectMaker.hash[this.id] = this;
		daum.addEvent(document, 'mouseup', this.closeEventHandler, false);
	},
	closeEvent : function(e){
		var e = e || window.event;
		var target = e.target || e.srcElement;
		
		if(target == this.targetSelect) return;
		do{
			if(target.id == 's_b_'+this.id) return;
		}while((target = target.parentNode) && target.tagName != 'BODY');
		
		var selectDiv = daum.$E($('s_b_'+this.id));
		selectDiv.hide();
		this.showNextSelect(selectDiv);
	},
	showNextSelect: function(selectDiv){
		if (selectDiv.getPrev().id === "selectTerm"){
			var selectWrap = selectDiv.parentNode.parentNode;
			var nextSelect = daum.$("docTypeSelect",selectWrap);
			if (nextSelect){
				daum.Element.show(nextSelect);
			}
		}
	},
	getDataFromSelect : function(){
		var i,loop,opts = $A(this.targetSelect.options);
		for(i=0, loop=opts.length; i<loop; i++){
			this.data.push({value : opts[i].value, text : opts[i].text});
		}
	},

    createBodyElm : function(){
		var tmp = [];
		tmp.push('<div class="'+ this.className+'_body box bg" style="display:none;" id="s_b_' + this.id + '">');
		tmp.push('<ul>');
		for(var i=0,loop=this.data.length;i<loop;i++){
			tmp.push('<li>');
			if(this.data[i].value.indexOf('#DURATION') > -1){
				tmp.push(this.createDurationElm(i));
			}else{
				tmp.push('<a href="javascript:;" onclick="SelectMaker.clickEvent('+this.id+',\''+this.data[i].value+'\',\''+this.data[i].text+'\')">'+this.data[i].text+'</a>');
			}
			tmp.push('</li>');
		}
		tmp.push('</ul>');
		tmp.push('</div>');

		return tmp.join('');
	},

	createDurationElm : function(i){
		var tmp = [];
        tmp.push('직접 입력<br /><p><input type="text" id="s_t_1_'+this.id+'" value="'+this.date1+'" class="inp" />-');
		tmp.push('<input type="text" id="s_t_2_'+this.id+'"  value="'+this.date2+'" class="inp" /></p>');
		tmp.push('<p class="button_set" onclick="SelectMaker.clickEvent('
			+ '\'' + this.id + '\''
			+ ', $(\'s_t_1_'
			+ this.id
			+ '\').value + \'\' +'
			+ ' $(\'s_t_2_'
			+ this.id
			+ '\').value'
			+ ', null, \''
			+ this.data[i].value
			+ '\')">');
		tmp.push('<span class="btn_bg bg08"></span><span class="btn_txt bt08 w03">확인</span></p>');

		return  tmp.join('');
	},
	getInputs : function(){
		return $A($('s_b_' + this.id).getElementsByTagName('INPUT'));
	},
	clickEvent : function(value, text, type){
		var num = type ? this.getIndexForValue(type) : this.getIndexForValue(value);
		if(type == '#DURATION'){
			var tmp = value.match(/([1-2][0-9]{3})\.(0[0-9]|1[0-2])\.([0-2][0-9]|3[0-1])([1-2][0-9]{3})\.(0[0-9]|1[0-2])\.([0-2][0-9]|3[0-1])/);
			if(tmp){
				if(new Date(tmp[1], tmp[2], tmp[3]).getTime() > new Date(tmp[4], tmp[5], tmp[6]).getTime()){
					alert("시작 날짜가 잘못되었습니다.");
					return;
				}else{
					var num_text = tmp[1] + '.' + tmp[2] + '.' + tmp[3] + '-' + tmp[4] + '.' + tmp[5] + '.' + tmp[6];
					SearchUtil.setDuration(num_text);					
				}				
			}else{
				alert('입력양식이 잘못되었습니다.');
				return;
			}

			this.targetSelect.value = '#DURATION';
			this.targetSelect.options[num].innerHTML = num_text;
			
		}else{
			this.targetSelect.options[num].value = value;
			this.targetSelect.value = value;
		}
		var selectDiv = daum.$E($('s_b_'+this.id));
		selectDiv.toggle();
		this.showNextSelect(selectDiv);
	},

	getIdentification : function(){
		return new Date().getTime() * Math.floor(Math.random() * 100);
	},

	getIndexForValue : function(v){
		for(var i=0, loop=this.data.length; i<loop; i++){
			if(this.data[i].value == v) return i;
		}
	}
};

SelectMaker.hash = {};
SelectMaker.clickEvent = function(id, value , text,  type){
	SelectMaker.hash[id].clickEvent(value, text, type);
};
SelectMaker.toggle = function(id){
	var selectEl = daum.$(id);
	var selectWrap = selectEl.parentNode.parentNode;
	var nextSelect = daum.$("docTypeSelect",selectWrap);
	if(selectEl.style.display == 'none'){
		selectEl.style.display = 'block';
		if (nextSelect){
			daum.Element.hide(nextSelect);
		}
	}else{
		selectEl.style.display = 'none';
		if (nextSelect){
			daum.Element.show(nextSelect);
		}
	}
};

/* 말머리 검색 */
function checkHeadCont(elem) {
	if(elem.tagName.toLowerCase() == "select"){
		var headContSelect = daum.Element.getNext(elem);
        if(headContSelect.tagName.toLowerCase() == "select" && elem.value == "head"){
			headContSelect.style.display = "";
		} else {
			headContSelect.style.display = "none";
		}
	}
}

var SearchUtil = {
	form: null,
	inited: false,
	init: function(){
		this.form = daum.$("searchForm");
		this.inited = true;
	},
	searchType: function(value){ // 리스트 필터: 전체, 이미지, 동영상, 첨부파일
		if(!this.inited){ this.init(); }
		if(this.form){
			if(value == "A,B" || value == "A"){ // 첨부파일 있는 경우 or 문서만 있는 경우
				this.form.attachfile_yn.value = value;
				this.form.media_info.value = "";
			} else if(value == "image" || value == "m"){ // image: 이미지가 있는 경우, m: 동영상이 있는 경우
				this.form.media_info.value = value;
				this.form.attachfile_yn.value = "";
			} else if(value == "all") { // 모든 종류 검색
				this.form.media_info.value = "";
				this.form.attachfile_yn.value = "";
			}
			this.form.submit();
		}
	},
	
	setDuration : function(dur){
		if(!this.inited){ this.init(); }
		this.form['searchPeriod'].value = dur;
	},
	
	setViewtype : function() {
		if(daum.$("viewTypeTit")){
			if(!this.inited){ this.init(); }
			if(daum.$("viewTypeTit") && daum.$("viewTypeTit").checked){ // 게시판 리스트 형태
				this.form.viewtype.value = "tit"; // 목록형
			} else {
				this.form.viewtype.value = "all"; // 요약형
			}
		}
	},

	searchBBS: function (elem) { // 게시판 검색
		if (!this.inited) {
			this.init();
		}
		var searchWrap = (elem.className == "btn_search" || elem.className == "suggest") ? elem.parentNode : null;
		if (this.form && searchWrap) {
			var selects = $$("select", searchWrap);
			var query = $$(".query", searchWrap)[0];
			var isMemberArticleSearchPage = (this.form.action.indexOf("member_article") > -1) || (this.form.action.indexOf("member_cmt_search") > -1); // 내가 쓴 글, 남이 쓴 글 페이지인지 아닌지...

			if (query) {
				this.form.query.value = query.value;
			}

			for (var i = 0; i < selects.length; i++) {
				if (selects[i].name == "searchPeriod" && selects[i].value != '#DURATION') { //기간
					this.form.searchPeriod.value = selects[i].value;
				} else if (selects[i].name == "item") {
					if (isMemberArticleSearchPage && this.form.query.value == "") {
						this.form.item.value = "writer";
					} else {
						this.form.item.value = selects[i].value;
					}
				} else if (selects[i].name == "head" && daum.Element.visible(selects[i])) {
					this.form.head.value = selects[i].value;
					if (this.form.headsort) {
						this.form.headsort.value = "";
					}
				} else if (this.form.head && !daum.Element.visible(selects[i])) {
					this.form.head.value = "";
				}
			}

			if (this.isNicknameSearch()) {
				this.form.nickname.value = query.value;
				this.form.query.value = "";
			} else if (!isMemberArticleSearchPage) {
				this.form.nickname.value = "";
			}

			this.setViewtype();

			this.formCheck();
		}
	},
	
	isQueryRequired: function () {
		if (this.isHeadSearch() || this.isMemberContentSearch()) {
			return false;
		}

		if (this.isNicknameSearch() && this.form.nickname.value != "") {
			return false;
		}
		
		return this.form.query.value == ""; 
	},
	
	formCheck : function(){

		if (this.isHeadSearch() && this.form.head.value == "head_selected") {				
			alert('말머리를 선택해 주세요');
			this.form.head.style.display = "block";
			return false;
		}
		
		if (this.isQueryRequired()) {
			alert('검색어를 입력해 주세요');
			return false;
		}

		if (this.form.item.value == "preview") {
			this.form.action = "/_c21_/searchpreview";
		} else if (this.form.action.indexOf("member_article") > -1) {
			this.form.action = "/_c21_/member_article_cafesearch";
		} else if (this.form.action.indexOf("member_cmt_search") > -1) {
			this.form.action = "/_c21_/member_cmt_search";
		} else if (this.form.item.value == "cmtContent" || this.form.item.value == "cmtNicknameNgram") {
			this.form.action = "/_c21_/search_cmt";
		} else {
			this.form.action = "/_c21_/cafesearch";
		}
		if (this.form.pagenum) {
			this.form.pagenum.value = "";
		}

		if (this.form.sorttype.value == "") {
			this.form.sorttype.value = 0;
		}

		this.form.submit();
	},
	
	searchRelevantKeyword: function(keyword){
		if(!this.inited){ this.init(); }
		
		if(keyword){
			this.form.nickname.value = "";
			this.form.pagenum.value = "1";
			this.form.searchPeriod.value = "all";
			this.form.attachfile_yn.value = "";
			this.form.media_info.value = "";
			if (this.form.action){
				var action = this.form.action;
				if(action.indexOf("searchpreview") > -1){
					this.form.item.value = "preview";	
				}else if(action.indexOf("search_cmt") > -1){
					this.form.item.value = "cmtContent";
				}
			}else{
				this.form.item.value = "subject";
			}
			this.form.query.value = keyword;
			this.form.submit();
		}
	},
	
	headcontSearch: function(elem){
		if(!this.inited){ this.init(); }
		
		var headcont = "";
		if(elem.tagName && elem.tagName.toLowerCase() == "select"){
			headcont = elem.value;
		} else {
			headcont = elem;
		}
		
		this.form.head.value =  headcont;
		this.form.pagenum.value = "1";
		this.form.query.value = ""; // 검색했다가 다시 뒤로온경우 쿼리가 남는 경우가 있다.
		
		if(headcont == ""){
			var url = this.getListURL(document.location.pathname);
			this.form.item.value = "";
			this.form.action = url;
		} else {
			this.form.item.value = "head";
		}
		
		if(this.form.headsort) this.form.headsort.value = "Y";
		this.form.submit();
	},
	
	getListURL: function(pathname){
		var url = "";
		if(pathname.indexOf("album_") > -1){
			url = "/_c21_/album_list";
		} else if(pathname.indexOf("bbs_") > -1){
			url = "/_c21_/bbs_list";
		}
		
		return url;
	},

	isHeadSearch: function () {
		return this.form.item.value == "head";
	}, 
	isMemberContentSearch: function () {
		return this.form.enc_userid;
	}, 
	isNicknameSearch: function () {
		return this.form.item.value == "writer" || this.form.item.value == "cmtNicknameNgram";
	}
};


Suggest = {
	init: function(){
		var layerElements = document.getElementsByClassName('suggest');

		for(var index = 0; index < layerElements.length; index++){
			var currentElement = layerElements[index];
			var inputElement = currentElement.getElementsByClassName('inp')[0];
			var suggestBoxElement = currentElement.getElementsByClassName('suggest_box')[0];

			inputElement.id = 'q' + index;
			suggestBoxElement.id = 'suggest_box' + index;

			new suggest.Suggest(layerElements[index], {
				inputEl: inputElement.id, suggestBoxEl: suggestBoxElement.id, APIServer: {
					host: 'https://dapi.kakao.com/suggest/v2/pc.json',
					apiType: suggest.Suggest.APITYPE.DAPISUGGEST,
					appkey: "f7c12d7cc6ccced8dd9ad6e08e56f36b",
					queries: {
						'limit': '5',
						'_caller1': "ver_cafe_225"
					}
				}
			});

			(function(index){
				var suggestSearchBtnId = 'suggest_search' + index;
				daum.addEvent($(inputElement.id), 'keydown', function(e){
					var ev = e || window.event;
					if(ev.keyCode == 13){
						var elem = daum.Event.getElement(ev);
						if(elem){
							ev.preventDefault();
							$(suggestSearchBtnId).click();
						}
					}
				});
			})(index);
		}
	}
};


/* 검색 리스트 이미지 에러처리 */
var errorImage = function(thisimage){
	thisimage.src = "//t1.daumcdn.net/cafe_image/cf_img2/img_blank2.gif";
	thisimage.width = 0;
	thisimage.height = 0;
};

/* 검색 리스트 이미지 리사이즈 */
var resizeImage = function(img){
	var landscope = img.width < img.height ? true : false;

    if(img.offsetWidth > 100 || img.offsetHeight > 100){
		if(landscope){
			img.height = "100";
		}else{
			img.width = "100";
		}
	}
	
	if(img.width == 0 || img.height == 0) setTimeout(function(){resizeImage(img)},500);
};

var resizeImage_reload = function(){
	$C(document, 'thumImages').each(function(el){
	    resizeImage(el);
	});
};

//관련 검색어
RelevantSearch = {
	init: function(fldid, dataid, keywords){
		this.relevantUl = daum.$("relevantResultList");
		this.relevantTableWrap = daum.$("resultTableWrap");
		this.keywordArr = keywords;
		this.fldid = fldid;
		this.dataid = dataid;
		
		var keywordList = [];
		for(var i=0; i<this.keywordArr.length; i++){
			var keyword = this.keywordArr[i];
			if(i == 0){
				this.selectedIndex = i;
				keywordList.push("<li class='box_point'><a href='#' class='txt_point'>"+keyword.shortKeyword+"<span class='arrow'>▶</span></a></li>");
			} else {
				keywordList.push("<li><a href='#'>"+keyword.shortKeyword+"</a></li>");
			}
		}
		this.relevantUl.innerHTML = keywordList.join("");
		this.getRelevantSearchData(this.keywordArr[this.selectedIndex].keyword);		
	},
	getRelevantSearchData: function(keyword){
		WICafeSearch.getRelevantArticleList(CAFEAPP.GRPID, this.fldid, this.dataid, keyword, {
	        callback: function(data){
	        	RelevantSearch.makeTable(data, keyword);
	        }
	    });
	},
	makeTable: function(data, keyword){
		var relevantTable = [];
		relevantTable.push("<table id='relevantResultTable'><thead>");
		relevantTable.push("<tr><th class='title line'>제목</th><th class='author line'>글쓴이</th><th class='line'>작성일</th><th class='view line'>조회</th></tr></thead><tbody>");
		var bbsLink = "/_c21_/bbs_nsread?grpid="+CAFEAPP.GRPID+"&query="+keyword+"&search_ctx="+data.searchCtx+"&searchlist_uri=/_c21_/cafesearch";
		if(data.articleList && data.articleList.length > 0){
			var first = "class='first'";
			for(var i=0; i<data.articleList.length; i++){
				if(i == 0){
					relevantTable.push("<tr class='first'>");
				} else {
					relevantTable.push("<tr>");
				}
				relevantTable.push("<td class='title'>");
				
				if(data.articleList[i].curArticle){
					relevantTable.push("<span class='txt_point'>현재글</span>");
				}
				relevantTable.push("<a href='"+bbsLink+"&fldid="+data.articleList[i].fldid+"&contentval="+data.articleList[i].bbsdepth+"&datanum="+data.articleList[i].dataid+"&page=1&cpage=0&sorttype=0&from=total'>"+data.articleList[i].dataname+"</a>");
				
				if(data.articleList[i].shrtcmtcnt == 0){
					relevantTable.push("</td>");
				} else {
					relevantTable.push("<span class='txt_point'>["+data.articleList[i].shrtcmtcnt+"]</span></td>");
				}
				
				relevantTable.push("<td nowrap='nowrap' class='author'>");
				if(data.articleList[i].anonymouse){
					relevantTable.push("비공개");
				} else {
					var rolecodeImg = (data.articleList[i].rolecode && data.articleList[i].rolecode != "1Z")? "<img src='//t1.daumcdn.net/cafe_image/cf_img2/bbs2/roleicon/2/"+CAFEAPP.ui.ROLEICONTYPE+"_level_"+data.articleList[i].rolecode+".gif' width='16' height='16' alt='회원등급' />" : "";
					relevantTable.push(rolecodeImg + "<a href='#"+data.articleList[i].encUserid+"'>"+data.articleList[i].nickname+"</a>");
				}
				relevantTable.push("</td>");
				relevantTable.push("<td class='date'>"+data.articleList[i].regdtshow+"</td>");
				relevantTable.push("<td class='view'>"+data.articleList[i].viewcount+"</td></tr>");
			}
			if(data.more){
				relevantTable.push("<tr><td class='more' colspan='4'><a href='/_c21_/cafesearch?grpid="+CAFEAPP.GRPID+"&query="+keyword+"&item=subject'>검색결과 더보기</a><span class='arrow'>▶</span></td></tr>");
			}
		} else {
			relevantTable.push("<tr class='empty_data'><td colspan='4'>검색결과가 없습니다.<p class='txt_sub'>"+keyword+"(으)로 검색한 다른 카페글 <a href='http://search.daum.net/search?w=cafe&enc=utf8&ASearchType=1&m=board&q="+encodeURIComponent(keyword)+"' target='_blank'>보기</a><span class='arrow'>▶</span></p></td></tr>");
		}
		relevantTable.push("</tbody></table>");
		this.relevantTableWrap.innerHTML = relevantTable.join("");
		this.initEvent();
	},
	initEvent: function(){
		daum.addEvent(this.relevantUl, "click", this.onclickLiAction.bind(this));
		daum.addEvent(this.relevantTableWrap, "click", this.onclickAuthorAction.bind(this));
	},
	onclickLiAction: function(ev){
		var elem = daum.getElement(ev);
		daum.stopEvent(ev);
		
		if(elem.tagName.toLowerCase() == "a" && elem.parentNode.className.indexOf("box_point") < 0){
			var li = $$("li", this.relevantUl);
			for(var i=0; i<li.length; i++){
				if(elem.parentNode == li[i]){
					elem.parentNode.className = "box_point";
					elem.className = "txt_point";
					elem.innerHTML += "<span class='arrow'>▶</span>";
					break;
				}
			}
			var lastLi = li[this.selectedIndex];
			daum.$E(lastLi).removeClassName("box_point");
			lastLi.innerHTML = "<a href='#'>"+this.keywordArr[this.selectedIndex].shortKeyword+"</a>";
			this.selectedIndex = i;
			var keyword = this.keywordArr[this.selectedIndex].keyword;
			
			if(keyword){
				this.getRelevantSearchData(keyword);
			}
		}
	},
	onclickAuthorAction: function(ev){
		var elem = daum.getElement(ev);
		if(elem.tagName.toLowerCase() == "a" && elem.parentNode.className == "author"){
			daum.Event.stopEvent(ev);
			var eUserId = elem.hash.substr(1);
			var nickname = elem.firstChild.nodeValue;
			showSideView(elem, eUserId, nickname);
		}
	}
};

/**
 * cafemenu.html -> menu_folderlist.html 에서 가져온 함수들
 * 같은 역할을 하는 함수들로 교체해야함.
*/
function goBBS(url, fldid) {
	var listnum = null;

	if (url.match(/\/_c21_\/favor_bbs_list/)) {
		listnum = 100;
	} else if (window.sessionStorage != undefined) {
		listnum = sessionStorage.getItem(fldid);
	}

	if (listnum && listnum >= 0) {
		url = url + "&listnum=" + listnum;
	}

	location.href = url;
}

function goAllowed(url) {
	if (!isAllowedFldLink(url)) {
		alert("허용되지 않은 링크 주소입니다.");
		return;
	}

	window.open(url, '_blank');
}

function isAllowedFldLink(url) {
	return /^(mailto:)|^(https?:\/\/)/.test(url);
}

function toggleFoldingGroupMenu(elIdx) {
	daum.cafe.menu.MenuGroupManager.toggle(elIdx);
}

function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}


(function(){

    namespace("daum.cafe.util");
    daum.cafe.util.CafeLocalStorage = (function(){

        return {
            
            setItem: function(key, obj){
                if (!!window.localStorage) {
                    window.localStorage.setItem(key, obj);
                } else {
                    daum.setCookie(key, obj);
                }
            },
            
            getItem: function(key) {
                if (!!window.localStorage) {
                    return window.localStorage.getItem(key);
                } else {
                    return daum.getCookie(key);
                }
            },
            
            removeItem: function(key) {
                if(!!window.localStorage) {
                    window.localStorage.removeItem(key);
                } else {
                    daum.delCookie(key);
                }
            }

        }
    })();

    daum.cafe.util.anchor = (function(){
    	var anchor = getURLParameter('anchor');

    	return {
    		id: anchor,
    		anchor: function(){
    			if(anchor){
					location.hash = '#' + anchor;
				}
			}
    	}
	})();

    namespace("daum.cafe.menu");
    daum.cafe.menu.MenuGroupManager = {
        storage: daum.cafe.util.CafeLocalStorage,
        
        applyMenuGroup: function(){
            var menuGroupList = this.getMenuGroupList();
            for(var i = 0; i < menuGroupList.length; i++) {
                this.closeMenuGroup(menuGroupList[i]);
            }
        },

        closeMenuGroup: function (elIdx) {
            var elMenuGroup = daum.$("title_" + elIdx);
            daum.Element.hide(elMenuGroup);
            var elMenuGroupHandler = daum.$("div_menu_title_" + elIdx);
            var elSpan = daum.$$(".group_ic a span", elMenuGroupHandler)[0];
            var elImg = daum.$$(".group_ic a img", elMenuGroupHandler)[0];
            elSpan.innerHTML = "▼";
            elImg.className = "icon_view01";
            this.add(elIdx);
        },
        
        openMenuGroup: function (elIdx) {
            var elMenuGroup = daum.$("title_" + elIdx);
            daum.Element.show(elMenuGroup);
            var elMenuGroupHandler = daum.$("div_menu_title_" + elIdx);
            var elSpan = daum.$$(".group_ic a span", elMenuGroupHandler)[0];
            var elImg = daum.$$(".group_ic a img", elMenuGroupHandler)[0];
            elSpan.innerHTML = "▲";
            elImg.className = "icon_view02";
            this.remove(elIdx);
        },
        
        toggle: function(elIdx){
            var elMenuGroup = daum.$("title_" + elIdx);
            if(elMenuGroup){
                if(daum.Element.visible(elMenuGroup)){
                    this.closeMenuGroup(elIdx);
                } else {
                    this.openMenuGroup(elIdx);
                }
            }
        },
        
        toString: function(obj){
            if (window.JSON) {
                return JSON.stringify(obj);
            }
            
            return daum.toJSON(obj);
        },
        
        getMenuGroupList: function () {
            if(!CAFEAPP || !CAFEAPP.GRPID) {
                return [];
            }
            var menuGroupList = eval("(" + this.storage.getItem(CAFEAPP.GRPID) + ")");
            if (!menuGroupList) {
                menuGroupList = []
            }
            return menuGroupList;
        },
        
        add: function(elIdx){

            var menuGroupList = this.getMenuGroupList();
            if(menuGroupList.indexOf(elIdx) == -1) {
                menuGroupList.push(elIdx);
                var string = this.toString(menuGroupList);

				if (CAFEAPP && CAFEAPP.GRPID) {
                	this.storage.setItem(CAFEAPP.GRPID, string);
				}
            }
            
        },
        
        remove: function(elIdx){
            var menuGroupList = this.getMenuGroupList();
            var index = menuGroupList.indexOf(elIdx);
            if(index != -1) {
                menuGroupList.splice(index, 1);
				if (CAFEAPP && CAFEAPP.GRPID) {
                	this.storage.setItem(CAFEAPP.GRPID, this.toString(menuGroupList));
				}

            }
        }
        
    };

	setTimeout(function () {
		try {
            daum.cafe.menu.MenuGroupManager.applyMenuGroup();
		} catch (ignore) {
		}
	}, 100);
    
})();



/* 개별 미니다음 앱설치 레이어 */
(function() {
	function $(obj) {
        return typeof obj == 'string' ? document.getElementById(obj) : obj;
    }

	var loadScript = (function() {
		var prefix = "minidaumJsonp";
		if(typeof window[prefix+'Count'] == 'undefined') window[prefix+'Count'] = 0;
		var jsre = /\=\?(&|$)/,
			head = document.getElementsByTagName("head")[0] || document.documentElement;
		
		return function(url, callback) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.charset = 'utf-8';
			
			if(callback) {
				var jsonp = prefix + String(window[prefix+'Count']++);			 
				if(jsre.test(url)) url = url.replace(jsre, "=" + jsonp + "$1");

				window[jsonp] = function() {
					if (typeof callback == 'function') {
						callback.apply(null, Array.prototype.slice.apply(arguments));
					}

					window[ jsonp ] = undefined;
					try {
						delete window[ jsonp ];
					} catch( jsonpError ) {}

					if (head) head.removeChild( script );
				};
			}

	        script.src = url;
			head.insertBefore(script, head.firstChild);
		};
	})();
    
    var minidaum = (function() {
		function drawExtra() {
            var layer, wrap = $('daum_app_layer'),
                div = document.createElement('div');
                div.id = 'innerMinidaum';
                wrap.appendChild(div);

            layer = document.createElement('div');
            layer.id = 'minidaumAppsLayer';
            layer.className = 'minidaum_layer';
            div.appendChild(layer);
           	minidaum.daumApps.init(layer);
		}

        return {
            init: function() {
               	drawExtra();
            }
        }
    })();

	minidaum.daumApps = (function(){
		var cafeApp = {
			name: "카페",
			title: "모든 이야기의 시작!",
			appName: "카페앱",
			appNameColor: "#ed3e49",
			qrcode: "//t1.daumcdn.net/cafe_image/161007_pc/app_install.png",
			eventName: "[소개] 모바일앱으로 즐기는 카페앱!",
			eventUrl: "https://cafe.daum.net/_app"
		};

		var layerHTML = '' +
			'<p class="minidaum_extra_title">' + cafeApp.title + ' <span style="color:' + cafeApp.appNameColor + '">' + cafeApp.appName + '</span></p>' +
			'<p class="minidaum_extra_desc">설치 URL 문자보내기 (무료)</p>' +
			'<div class="minidaum_extra_form">' +
			'	<fieldset>' +
			'		<legend class="screen_out">무료문자전송</legend>' +
			'		<input type="text" id="minidaumAppsPhone" name="minidaumAppsPhone" value="" title="휴대폰 번호 입력">' +
			'		<button class="btn_send" id="minidaumAppsPhoneBtn" type="button"><span class="screen_out">보내기</span></button>' +
			'	</fieldset>' +
			'</div>' +
			'<p class="minidaum_extra_qrcode"><img src="' + cafeApp.qrcode + '" width="58" height="58" border="0"></p>' +
			'<p class="minidaum_extra_event"><a href="' + cafeApp.eventUrl + '" target="_top">' + cafeApp.eventName + '</a></p>' +
			'<button id="minidaumAppLayerClose" class="minidaum_extra_close" type="button">창닫기</button>';

		var layerContents = document.createElement('div');
		layerContents.className = "minidaum_extra_content";
		layerContents.innerHTML = layerHTML;

		var attachEventHandler = function () {
			var phoneElem = $('minidaumAppsPhone'),
				phoneBtn = $('minidaumAppsPhoneBtn'),
				closeElem = $('minidaumAppLayerClose');

			phoneElem.onkeydown = function (e) {
				minidaum.daumApps.sender.keyCheck(e, phoneElem);
			};
			phoneBtn.onclick = function () {
				minidaum.daumApps.sender.send(phoneElem);
			};
			closeElem.onclick = function () {
				cafeAppLayer.hideMiniDaum();
			};
		};

		var render = function (element) {
			element.appendChild(layerContents);
		};

		return {
			init: function(element){
				render(element);
				attachEventHandler();
			}
		};
	})();

	minidaum.daumApps.sender = {
		url: "https://top.cafe.daum.net/_c21_/cafesms?callback=?&code=CAFE_APP_V2_DOWNLOAD&mobile=%s",
		daumAppPhoneRegExp1: /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-[0-9]{3,4}-[0-9]{4}$/,
		daumAppPhoneRegExp2: /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/,

		keyCheck: function(e, phoneElem) {
			var evt = e || window.event,
				keyCode = evt.keyCode;
			if((keyCode > 57 || keyCode < 48) && (keyCode > 105 || keyCode < 96) && (keyCode < 37 || keyCode > 40) && keyCode != 189 && keyCode != 109 && keyCode != 8 && keyCode != 9 && keyCode != 46 && keyCode != 13){
				if (evt.preventDefault) {
                    evt.preventDefault();
                } else {
                    evt.returnValue = false;
                }
			}
			
			if(keyCode == 13) {
				this.send(phoneElem);
			}
		},
		
		callback: function(r) {
			var retData = r,
				code = retData.code;

			switch(code){
			case '200':
				alert('문자가 성공적으로 발송되었습니다.');
				break;
			default :
				alert('SMS가 발송되지 않았습니다. 잠시 후 다시 시도해주세요. 계속 발송되지 않으면 다음 고객센터에 문의해주세요.');
				break;
			}
		},

		sendUrl: function(phoneNumber) {
			if(phoneNumber.indexOf('-') != -1){
				phoneNumber=phoneNumber.split('-').join('');
			}
			var url = this.url.replace('%s', phoneNumber),
				self = this;
			loadScript(url,function(r){
				self.callback(r);
			});
		},
		
		send: function(phoneElem) {
			var userInputNum = phoneElem.value;
            
			if(this.daumAppPhoneRegExp1.test(userInputNum) || this.daumAppPhoneRegExp2.test(userInputNum)){
				this.sendUrl(userInputNum);
			}else{
				alert("전화번호를 확인해주세요");
				phoneElem.focus();
			}
		}
	};
    window.minidaum = minidaum;
})();

var cafeAppLayer = {
	showMiniDaum: function(element){
		if(typeof daum !== 'undefined' && daum.Browser.ipad){
			this.sendIphoneAppLink();
		} else if(typeof daum !== 'undefined' && daum.Browser.android){
			this.sendAndAppLink();
		} else {
			clickAreaCheck = true;
			this.wrapObj = daum.$('daum_app_layer');
			this.layer = daum.$('minidaumAppsLayer');
			if(this.wrapObj){
				var baseCoords = daum.Element.getCoords($('cafe_gnb'));
				var elementCoords = daum.Element.getCoords(element);
				var layerWidth = parseInt(daum.Element.getStyle(this.layer, 'width'));

				if(elementCoords.right < document.body.clientWidth / 2 + layerWidth) {
					this.layer.style.left = elementCoords.left - baseCoords.left + 'px';
				} else {
					this.layer.style.left = elementCoords.right - baseCoords.left - layerWidth - 2 + 'px';
				}

				this.layer.style.top = elementCoords.bottom + 2 + 'px';
				hideOtherLayer("wrapMinidaum");
				this.wrapObj.style.display = 'block';
			}
		}
	},

	hideMiniDaum: function(){
		this.wrapObj = daum.$('daum_app_layer');
		if(this.wrapObj){
			this.wrapObj.style.display = 'none';
		}
	},
	
	sendIphoneAppLink: function(){
		window.open('http://itunes.apple.com/kr/app/id369302790?mt=8&t__nil_view=downios');		
	},
	sendAndAppLink: function(){
		window.open('market://details?id=net.daum.android.cafe&t__nil_view=downand')
	}
}

var levelupNotiLayer = {

	cookieName: 'lvup',
	getCookie: function(cookieName) {
		var B = cookieName + "=";
		var D = document.cookie + ";";
		var E = D.indexOf(B);
		if(E!=-1) {
			var A = D.indexOf(";",E);
			return decodeURIComponent(D.substring(E+B.length,A).replaceAll('"', ''));
		}
	},
	
	deleteCookie: function(cookieName) {
		var expireDate = new Date();
		expireDate.setDate(expireDate.getDate() - 1);
		document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
	},

	checkAndShowLayer : function() {
		setTimeout(function() {
			var lvup = levelupNotiLayer.getCookie(levelupNotiLayer.cookieName);
			if(!lvup) {
				return ;
			}

			var jsonLvup = JSON.parse(lvup);

			var img_url = '//t1.daumcdn.net/cafe_image/cafe/img_131129/img_levelup0' + jsonLvup.levelupType + '.png';
			var message;
			var detail;
			var two_row = '';

			if (jsonLvup.torolecodename.length > 5) {
				two_row = ' two_row';
			}

			if(jsonLvup.levelupType == '1') {
				if (jsonLvup.torolecodename.length > 5) {
					message = jsonLvup.torolecodename + '<br />으로 등업하기 위한';
				} else {
					message = jsonLvup.torolecodename + '으로 등업하기 위한';
				}
				if (jsonLvup.actionType == 'HV') {
					detail = '방문일 (' + jsonLvup.count + '/' + jsonLvup.count + ')<br />활동완료!';
				} else if (jsonLvup.actionType == 'NC') {
					detail = '새 댓글 (' + jsonLvup.count + '/' + jsonLvup.count + ')<br />활동완료!';
				} else if (jsonLvup.actionType == 'NA') {
					detail = '새 글수 (' + jsonLvup.count + '/' + jsonLvup.count + ')<br />활동완료!';
				}

			} else {
				message = '축하드려요~';
				if (jsonLvup.torolecodename.length > 5) {
					detail = jsonLvup.torolecodename.substring(0, 5) + '<br />' + jsonLvup.torolecodename.substring(5) + '으로<br />등업되셨어요!';
				} else {
					detail = jsonLvup.torolecodename + '으로<br />등업되셨어요!';
				}
			}

			var div = document.createElement("div");
			div.id = 'levelupNotiLayer';
			div.innerHTML = '<img id="levelupNotiLayerCloseBtn" class="close_btn" src="//t1.daumcdn.net/cafe_image/cf_img3/admin/btn_close.gif">' +
							'<span class="message" >' + message +'</span>' +
							'<span class="message_detail' + two_row + '">' + detail + '</span>' +
							'<a id="levelupNotiLayerDetailBtn" href="#" class="detail_btn' + two_row + '">자세히보기</a>' +
							'<img class="congaturation_image" src="' + img_url + '">';
			
			daum.cafe.widget.Blinder.show(div, null, 0, true);
			var levelupNotiLayerCloseBtn = daum.$("levelupNotiLayerCloseBtn");
			var levelupNotiLayerDetailBtn = daum.$("levelupNotiLayerDetailBtn");

			daum.Event.addEvent(levelupNotiLayerCloseBtn, "click", function() {
				daum.cafe.widget.Blinder.hide();
			}.bind(this));
			
			daum.Event.addEvent(levelupNotiLayerCloseBtn, "load", function() {
				if (CAFEAPP && CAFEAPP.GRPID) {
					levelupNotiLayerDetailBtn.href = '/_c21_/my_alimi?grpid=' + CAFEAPP.GRPID + '&showlayer=true';
				}
			}.bind(this));
            			
			levelupNotiLayer.deleteCookie(levelupNotiLayer.cookieName);
		}, 1500);
	}
};
levelupNotiLayer.checkAndShowLayer();

var mailModule = (function() {
	var makeMailProcess = (function () {
		var mailSignUpOpener;
		var successCallback = function(popup) {
		};

		function makeMail(_successCallback, contentFlag, redirectImmediately) {
			successCallback = _successCallback;
			var queryAppender = '?contentFlag=' + (contentFlag ? contentFlag : '');
			queryAppender += redirectImmediately ? '&redirectImmediately=true' : '';
			var width = 500;
			var height = 400;

			if (redirectImmediately) {
				width = 1000;
				height = 700;
			}
			mailSignUpOpener = window.open('/_c21_/make_daum_mail' + queryAppender, 'MailPopup', 'width=' + width + ',height=' + height + ',resizable=yes,scrollbars=yes,toolbar=no');
		}

		function makeMailDone() {
			successCallback(mailSignUpOpener);
		}

		function makeMailCancel() {
			mailSignUpOpener.close();
		}

		return {
			makeMail: makeMail,
			makeMailDone: makeMailDone,
			makeMailCancel: makeMailCancel
		}
	})();
	function isMailSendable() {
		return CAFEAPP && CAFEAPP.MEMBER_MAIL_SENDABLE === false;
	}

	function createDaumId(targetUrl, contentFlag, redirectImmediately) {
		makeMailProcess.makeMail(function(popup) {
			popup.close();
			redirectPage(targetUrl);
		}, contentFlag, redirectImmediately);
	}

	function redirectPage(url) {
		document.location.href = url;
	}

	function redirectIfDaumMailExist(targetUrl, contentFlag) {
		if (isMailSendable()) {
			makeMailProcess.makeMail(function(popup) {
				popup.close();
				redirectPage(targetUrl);
			}, contentFlag);
			return;
		}
		redirectPage(targetUrl);
	}

	function openMailPopup(targetUrl, contentFlag) {
		if (isMailSendable()) {
			makeMailProcess.makeMail(function(popup) {
				popup.document.location.href = targetUrl;
			}, contentFlag);
			return;
		}

		var popMail = window.open(targetUrl, "MailPopup", "toolbar=no,channelmode=no,left=0,top=0,location=no,directories=no,width=1000,height=580,resizable=yes,menubar=no,scrollbars=yes");
		popMail.focus();
	}

	function openMailPopupWithCallback(successCallback, contentFlag) {
		if (isMailSendable()) {
			makeMailProcess.makeMail(successCallback, contentFlag);
			return;
		}
		successCallback();
	}

	return {
		isMailSendable: isMailSendable,
		makeMailProcess: makeMailProcess,
		createDaumId: createDaumId,
		redirectIfDaumMailExist: redirectIfDaumMailExist,
		openMailPopup: openMailPopup,
		openMailPopupWithCallback: openMailPopupWithCallback
	}
})();

// 버튼 권한 처리
function initActionBtn(selector, options) {
	var button = jQuery(selector);

	if (!options.showBtn) {
		if (options.dim) {
			button.attr('disabled', true);
		} else {
			button.hide();
		}

		return;
	}

	if (!CAFEAPP.ui.IS_LOGIN) {
		button.on('click', function(){
			poplogin();
		});
	} else if (options.checkSimpleId && CAFEAPP.ui.IS_NO_AUTH_SIMPLEID) {
		button.on('click', function () {
			poplogin_simple(options.simpleIdAlertText);
		});
	} else if (
		CAFEAPP.ui.HAS_WRITE_PERM
		|| ((['delete', 'modify'].indexOf(options.type) > -1) && CAFEAPP.ui.IS_MINE)
	) {
		button.on('click', function () {
			if (CAFEAPP.FLDTYPE === 'V' && CAFEAPP.ui.ESCROW && [3, 33].indexOf(CAFEAPP.ui.ESCROW.ITEM_STATUS) > -1) {
				alert('거래중이거나 거래완료된 상품은 ' + (options.type === 'modify' ? '수정' : '삭제') + '할 수 없습니다.');
			} else if (options.url) {
				location.href = options.url;
			} else if (options.callback) {
				options.callback();
			}
		});
	} else {
		if (options.dim) {
			button.attr('disabled', true);
		} else {
			button.hide();
		}
	}
}

function initArticleViewBtns(permission, _options) {
	var options = _options || {};
	var useKEditor = true;

	initActionBtn('#article-write-btn-bottom', {
		showBtn: permission.write,
		url: getWriteUrl(options.writeUrlType || 'common', useKEditor),
		checkSimpleId: true,
		dim: true
	});

	initActionBtn('#article-modify-btn-top, #article-modify-btn-bottom', {
		showBtn: permission.modify,
		url: getModifyUrl(),
		type: 'modify',
	});

	initActionBtn('#article-reply-btn-top, #article-reply-btn-bottom', {
		showBtn: permission.reply,
		callback: function () {
			check_reply(CAFEAPP.ui.PARBBSDEPTH);
		},
		dim: true
	});

	initActionBtn('#article-delete-btn-top, #article-delete-btn-bottom', {
		showBtn: permission._delete,
		callback: del,
		type: 'delete',
	});

	initActionBtn('#article-spam-btn-top, #article-spam-btn-bottom', {
		showBtn: permission.spam,
		callback: spam,
	});
}

// 댓글팝업
function viewShortComment(fldid, dataid) {
	var shrtmcmtWindow = window.open(
		"/_c21_/shortcomment_read?grpid=" + CAFEAPP.GRPID + "&fldid=" + fldid + "&dataid=" + dataid,
		"shortcomment", "width=815,height=850,toolbar=no,resizable=yes,scrollbars=yes,statusbar=yes"
	);
	shrtmcmtWindow.focus();
}

var openchatManager = (function(){
	var chat_list = [];
	function init() {
		jQuery.ajax({
			method: 'GET',
			url: '/_c21_/openchat/latest?grpid=' + CAFEAPP.GRPID + "&limit=3"
		}).done(function(res){
			chat_list = res.chatList;
			if(chat_list.length === 0){
				jQuery('#cafeChatLayout').removeClass('list_on');
			} else {
				jQuery('#cafeChatLayout').addClass('list_on');
				render();
				setEvents();
			}
		});
	}
	function render(){
		var l = (chat_list.length > 3) ? 3 : chat_list.length;
		var $list = jQuery('<ul></ul>');
		for(var i = 0;i < l;i++){
			var data = chat_list[i];
			var $li = jQuery('<li></li>');
			if(data.locked){
				$li.addClass('icon_lock');
			} else {
				$li.append('<span class="icon_dot">ㆍ</span>')
			}
			var $link = jQuery('<a href="' + data.webUrl + '" data-link-id="' + data.linkId + '" class="chat_join" target="_blank" title="' + data.title + '">' + data.title + '</a>');
			$li.append($link);
			$li.append('<span class="txt_sub num">' + data.memberCount +  '</span>');
			$list.append($li);
		}
		jQuery('#chatList').append($list);
	}
	function setEvents() {
		jQuery('#chatList').on('click', '.chat_join', function (e) {
			e.preventDefault();
			var currentTarget = jQuery(e.currentTarget);
			var linkId = currentTarget.data('linkId');
			openChattingEnterKey(linkId).done(function (enterKey) {
				window.open(currentTarget.prop('href') + enterKey.webJoinKey, '_blank');
			}).fail(onFail);
		});
	}

	var onFail = function (error) {
		if (!error.responseJSON) {
			alert('알 수 없는 오류가 발생하였습니다. 페이지를 새로 고침한 후 다시 시도해주세요.');
			return;
		}
		if (error.responseJSON.code == 'NEED_INTEGRATED_ACCOUNT_FOR_OPENCHAT') {
			if (!confirm('오픈채팅은 카카오톡 계정으로 통합한 회원만 이용 가능합니다.\n' +
				'카카오톡 계정으로 통합하시겠습니까?')) {
				return;
			}
			window.location.assign('https://accounts.daum.net/integration/start?rtnUrl=' + encodeURIComponent(window.location.href));
			return;
		}
		if (error.responseJSON.code == 'NEED_KAKAOTALK_CONNECTED_ACCOUNT_FOR_OPENCHAT') {
			alert('해당 ID는 카카오톡 계정과 통합되어있지 않습니다.\n' +
				'오픈채팅은 카카오톡 계정으로 통합한 회원만 이용 가능합니다.');
			return;
		}
		alert(error.responseJSON.message);
	};

	var openChattingEnterKey = function (linkId) {
		return jQuery.ajax({
			url: '/_c21_/openchat/' + linkId + '?grpid=' + CAFEAPP.GRPID,
			type: 'PUT'
		});
	}
	
	return {
		init: init
	}
})();

var favoriteCafeManager = (function ($) {
	var favoriteCafeBtn;
	var isOn = false;
	var url = '/_c21_/favorite/cafe?grpid=';

	var init = function () {
		favoriteCafeBtn = $('#favorite-cafe-btn');
		loadInitialStatus();
		initEvents();
	};

	var loadInitialStatus = function () {
		$.ajax({
			method: 'GET',
			url: url + CAFEAPP.GRPID,
			cache: false,
		}).done(function (data) {
			if (data.isFavorite) {
				turnOn();
			}
		});
	};

	var initEvents = function () {
		favoriteCafeBtn.on('click', function () {
			$.ajax({
				method: isOn ? 'DELETE' : 'POST',
				url: url + CAFEAPP.GRPID,
				cache: false,
			}).done(function (data) {
				data.isFavorite ? turnOn() : turnOff();

				if (isOn) {
					alert(data.message);
				}
			});
		});
	};

	var turnOn = function () {
		favoriteCafeBtn.addClass('favorite-star--on');
		isOn = true;
	};

	var turnOff = function () {
		favoriteCafeBtn.removeClass('favorite-star--on');
		isOn = false;
	};

	return {
		init: init,
	};
})(jQuery);

window.AjaxCaller = (function ($) {
	var call = function (method, url, data, options) {
		var _options = {
			method: method,
			url: url,
			data: data || null,
		};

		if (options) {
			var keys = Object.keys(options);
			for (var i=0; i<keys.length; i++) {
				_options[keys[i]] = options[keys[i]];
			}
		}

		return $.ajax(_options);
	};

	return {
		get: function (url, data, options) {
			return call('GET', url, data, options);
		},

		post: function (url, data, options) {
			return call('POST', url, JSON.stringify(data), options);
		},

		put: function (url, data, options) {
			return call('PUT', url, JSON.stringify(data), options);
		},

		del: function (url, data, options) { // 예약어 충돌 이슈 대응
			return call('DELETE', url, JSON.stringify(data), options);
		},
	};
})(jQuery);
