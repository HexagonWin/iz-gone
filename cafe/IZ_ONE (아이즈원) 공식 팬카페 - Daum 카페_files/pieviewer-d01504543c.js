function PieMosaicViewer() {
	this.gethtml = function (obj){
		var html = '<object ';
		if (!obj.id && !obj.name){
			var r = Math.round(Math.random()*100);
			html += 'id="daumActiveXObject'+r+'" name="daumActiveXObject'+r+'" ';
		} else {
			if (obj.id) html += 'id="'+obj.id+'" ';
			else html += 'id="'+obj.name+'" ';
			if (obj.name) html += 'name="'+obj.name+'" ';
			else html += 'name="'+obj.id+'" ';
		}
		if (obj.type) html += 'type="'+obj.type+'" ';
		if (obj.classid) html += 'classid="'+obj.classid+'" ';
		if (obj.width) html += 'width="'+obj.width+'" ';
		if (obj.height) html += 'height="'+obj.height+'" ';
		if (obj.codebase) html += 'codebase="'+obj.codebase+'" ';
		html += '>\n';
		// append params
		for (var i in obj.param){
			html += '<param name="'+obj.param[i][0]+'" value="'+obj.param[i][1]+'"/>\n';
		}

		// for ns embed
		html += '<embed ';
		if (!obj.id && !obj.name){
			var r = Math.round(Math.random()*100);
			html += 'id="daumActiveXObject'+r+'" name="daumActiveXObject'+r+'" ';
		} else {
			if (obj.id) html += 'id="'+obj.id+'" ';
			if (obj.name) html += 'name="'+obj.name+'" ';
		}
		if (obj.type) html += 'type="'+obj.type+'" ';
		if (obj.width) html += 'width="'+obj.width+'" ';
		if (obj.height) html += 'height="'+obj.height+'" ';
		// append params
		for( var i=0; i<obj.param.length; i++){
			if (obj.param[i]){
				if (obj.param[i][0]=='movie' || obj.param[i][0]=='src'){
					var _src = obj.param[i][1];
				}
				if (obj.param[i][0].toLowerCase()=='flashvars'){
					if (_src){
						var tmpArr = html.split('src="'+_src+'"');
						html = tmpArr[0]+' src="'+_src+'&'+obj.param[i][1]+'" '+tmpArr[1];
					} else {
						obj.param[obj.param.length] = obj.param[i];
					}
				} else {
					html += obj.param[i][0]+'="'+obj.param[i][1]+'" ';
				}
			}
		}
		html += '></embed>\n';
		html += '</object>';
		return html;
    }

	this.embed = function (obj, div) {
		// generate html code
		var html = this.gethtml(obj);
		// for ie obejct
				var isIE = (document.all)?true:false;
		if (isIE) {
			document.getElementById(div).innerHTML = html;
		} else if (obj.type=='application/x-shockwave-flash' || obj.classid=='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000') {
			document.getElementById(div).innerHTML = html;
		}
	}

	this.render = function (id, divid, extra, gethtml) {
		var obj = new Object();
		obj.type = 'application/x-shockwave-flash';
		obj.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
		obj.codebase = 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0';
		if(this.service == "CAFE"){
			obj.width = '730px';
			obj.height = '500px';
		}
		else{
			obj.width = '500px';
			obj.height = '517px';
		}
		
		if (gethtml) {
			obj.id = 'mosaic_'+id ;
		} else {
			obj.id = 'mosaic_'+divid ;
		}
		var swfurl = gethtml?'http://pie.daum.net/p/flash/puzzle/mosaic.swf?ver=1.2':'http://pie.daum.net/p/flash/puzzle/mosaic.swf?ver=1.0';
			var puzzleIdParam = 'puzzleId=' + id;
		var serviceParam = "";
		serviceParam = "service="+this.service;
		var extraparam = "";
		if(extra !=undefined){
		
			extraparam = "&" + extra;
		}
		/*
		if (this.scrap) {
			serviceParam = "service=SCRAP";
		else if (this.view) {
			serviceParam = "service=VIEW";
		} else{
			serviceParam = "service=CAFE";	
		}
		*/

		obj.param = [
			['allowScriptAccess','always'],
			['movie',swfurl],
			['src',swfurl + "&" + puzzleIdParam + "&" + serviceParam + extraparam],
			['quality','high'],
			['FlashVars', puzzleIdParam + "&" + serviceParam+ extraparam],
			['wmode','transparent'],
			['salign','LT'],
			['scale','noscale'],
			['swLiveConnect','true'],
			['pluginspage','http://www.macromedia.com/go/getflashplayer'],
			['name',obj.id],

		];
		if (gethtml) {
			return this.gethtml(obj);
		}
		else {
			return this.embed(obj,divid);
		}
	}
	

}

function setItemViewURL(URL) {
    deleteObj = document.getElementsByName("itemView");
    if (deleteObj != null) {
        for(var i=0; i<deleteObj.length;i++){
            document.body.removeChild(deleteObj[i]);
        }
    }

    if (document.createElement) {
        try {
            var tempIFrame=document.createElement('iframe');
            tempIFrame.setAttribute('id','itemView');
            tempIFrame.setAttribute('name','itemView');
            tempIFrame.src=URL;
            tempIFrame.style.border='0px';
            tempIFrame.style.width='0px';
            tempIFrame.style.height='0px';
            document.body.appendChild(tempIFrame);
        } catch (ignore) {
            /*
            var iframeHTML ='\<iframe id="itemView" src="'+URL+'" name="itemView" style="';
            iframeHTML +='frameborder:0px;';
            iframeHTML +='width:0px;';
            iframeHTML +='height:0px;';
            iframeHTML +='"><\/iframe>';
            document.body.innerHTML+=iframeHTML;
            */
        }
    }

    return false;
}

function viewScrapItem(inItemId, puzzleId) {
	setItemViewURL("http://cafe.daum.net/_pieinfo.html");
}
function viewMissionItem(inItemId, puzzleId) {
	setItemViewURL("http://cafe.daum.net/_pieinfo.html");
}
function viewSlideItem(inItemId, puzzleId) {
	setItemViewURL("http://cafe.daum.net/_pieinfo.html");
}

function viewMosaic(id, service, div, extra) {
	var viewer = new PieMosaicViewer();
	service = (service == null) ? "" : service;
	viewer.service = service;
	viewer.render(id, div, extra, false);
}
function opensource(id){
	var viewer = new PieMosaicViewer();
	viewer.service = "EXTERN";
	var openTag = viewer.render(id, "","", true);
	return openTag;
}