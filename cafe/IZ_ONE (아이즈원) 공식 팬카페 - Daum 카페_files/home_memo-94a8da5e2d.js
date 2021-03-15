
/*
 * home 한줄메모 js
 */

MemoHomeWrite = {
	fldid: null,
	submit : function(fldid) {
		if(CAFEAPP.IS_NO_AUTH_SIMPLEID){
			return;
		}
		this.fldid = fldid;
		var editor = window["HomeEditor_"+ fldid];
		var content = encodeURIComponent(editor.$textarea.value);
		var hideyn = editor.isHidden ? "Y" : "";
		var texticonyn = editor.isTexticon ? "Y" : "";
		var imageUrl = editor.imageUrl ? editor.imageUrl : "";
		var imageName = editor.imageName ? editor.imageName : "";
		var imageSize = editor.imageSize ? editor.imageSize : "";
		
		var params = "act=write"
					+ "&grpid="+ CAFEAPP.GRPID 
			        + "&mgrpid="+ CAFEAPP.MGRPID  
			        + "&content=" + content
			        + "&fldid="+ fldid
			        + "&texticonyn=" + texticonyn
			        + "&hideyn=" + hideyn
			        + "&imageurl=" + imageUrl
			        + "&imagename=" + imageName
			        + "&imagesize=" + imageSize;
		var options = {   
			url: "/_c21_/home_memoboard_action",
			method: "POST",   
			async: true,   
			timeout: 5000,
			paramString: params,
			encoding: "utf-8",
			headers : {'X-Requested-With' : 'XMLHttpRequest'},			
			onsuccess: this.getMemoWriteResponseData.bind(this),   
			onfailure: function(){alert("내용 등록에 실패 하였습니다.");},   
			onloading: function(){},
			ontimeout: function(){}
		}
		new daum.Ajax(options).request(); 
		editor.clear();
	},
	getMemoWriteResponseData : function(req){
		 var result = req.responseText;
		// alert(result);
	     daum.$('homelist_draw_'+ this.fldid).innerHTML = result;
	     this.fldid = null;
	     // 코클소스
	     cafeActionPV();
	}
};

/* sub page로 이동 */
function view_reply(dataid, fldid){
    window.location.href = "/_c21_/memo_list?grpid="+CAFEAPP.GRPID+"&mgrpid="+CAFEAPP.MGRPID+"&fldid="+ fldid + "&openmemoid=" + dataid;
}

/* login popup */
function poplogin() {
    window.open("/_c21_/poplogin?grpid="+CAFEAPP.GRPID,"poplogin", 'width=700,height=630,resizable=no,scrollbars=no');
}

