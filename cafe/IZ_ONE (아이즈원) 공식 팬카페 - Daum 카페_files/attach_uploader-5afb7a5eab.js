function AttachImageUploader() {
	if (window.FormData) {
		return new AttachUploaderNew('image');
	} else {
		return new AttachUploaderForLegacyBrowser('image');
	}
}

function AttachUploader() {
	if (window.FormData) {
		return new AttachUploaderNew('file');
	} else {
		return new AttachUploaderForLegacyBrowser('file');
	}
}

function AttachUploaderForLegacyBrowser(type) {
	var file, frm, uploadBtn;
	var div, id;
	var attachUploadService = new AttachUploadService();

	function init(options) {
		attachUploadService.setOptions(options);
		id = (Math.random() + '').replace('0.', '');
		uploadBtn = jQuery('#' + options.uploadBtnId);
		var img = jQuery('<img src="//t1.daumcdn.net/cafe_image/cf_img4/design/common/bt_search.gif">');
		file = jQuery('<input type="file" name="file" accept="image/*" style="width:58px;height:22px;overflow:hidden;cursor:pointer;filter:alpha(opacity=0);">');
		div = jQuery('<div><form method="post" enctype="multipart/form-data" target="attachframe' + id + '"></form></div>');
		if (options.makeBtn) {
			div.prepend(img);
		}
		frm = div.find('form'); // IE8 에서 form 따로 생성하면 이상하게 동작함..
		var iframe = jQuery('<iframe name="attachframe' + id + '" style="display: none"></iframe>');

		div.css({'z-index': '9999'});
		if (options.legacy_browser_support_form_include) {
			uploadBtn.css({position: 'relative', 'display':'inline-block'});
			uploadBtn.append(div);
			if (img) {
				img.addClass('attach_uploader_form_inside');
			}
			file.addClass('attach_uploader_form_inside');
		} else {
			jQuery('body').append(div);

			uploadBtn.click(function () {
				file.click();
			});
		}
		frm.append(iframe);
		frm.append(file);
		if (type === 'image') {
			frm.append('<input type="hidden" name="type" value="image"><input name="auto_orient" type="hidden" value="true">');
		} else {
			frm.append('<input type="hidden" name="type" value="file">');
		}
		file.change(upload);

		window['attachCallback' + id] = function (data) {
			attachUploadService.uploadSuccess(data);
		};
	}

	function upload() {
		attachUploadService.getUploadUrl(function (data) {
			uploadFile(data.method, data.url);
		});
	}

	function uploadFile(method, targetUrl) {
		targetUrl = targetUrl.replace('daumcdn', 'daum');
		frm.attr('action', targetUrl + '&script_callback=parent.attachCallback' + id + '&script_domain=daum.net');
		frm[0].submit();
	}

	function getFormData() {
		try {
			return new FormData(frm[0]);
		} catch (e) {
			// IE 10 에서만 security error로 이 코드가 동작함 ㅡㅡ
			var myData = new FormData();
			frm.find('input[type!=file]').each(function() {
				myData.append(jQuery(this).attr('name'), jQuery(this).val());
			});
			frm.find('input[type=file]').each(function() {
				myData.append(jQuery(this).attr('name'), this.files[0]);
			});
			return myData;
		}
	}

	return {
		init: init
	};
}

function AttachUploaderNew(type) {
	var file, frm, uploadBtn;
	var attachUploadService = new AttachUploadService();

	function init(options) {
		attachUploadService.setOptions(options);
		uploadBtn = jQuery('#' + options.uploadBtnId);
		if (options.makeBtn) {
			uploadBtn.html('<img src="//t1.daumcdn.net/cafe_image/cf_img4/design/common/bt_search.gif">');
		}
		file = jQuery('<input type="file" name="file" accept="image/*"/>');
		frm = jQuery('<form>');

		if (type === 'image') {
			frm.append('<input type="hidden" name="type" value="image"><input name="auto_orient" type="hidden" value="true">');
		} else {
			frm.append('<input type="hidden" name="type" value="file">');
		}
		frm.append(file);
		file.on('change', upload);

		uploadBtn.click(function () {
			file.click();
		});
	}

	function upload() {
		attachUploadService.getUploadUrl(function (data) {
			uploadFile(data.method, data.url);
		});
	}
	
	function resetFile () {
		file.val('');
		file.on('change', upload);
	}

	function uploadFile(method, targetUrl) {
		var myData = getFormData();
		file.off();
		jQuery.ajax({
			type: method,
			enctype: 'multipart/form-data',
			processData: false,
			contentType: false,
			cache: false,
			url: targetUrl,
			data: myData,
			success: function (data) {
				attachUploadService.uploadSuccess(data);
			},
			error: function () {
				attachUploadService.uploadFail();
			},
			complete: resetFile
		});
	}
	function getFormData() {
		try {
			return new FormData(frm[0]);
		} catch (e) {
			// IE 10 에서만 security error로 이 코드가 동작함 ㅡㅡ
			var myData = new FormData();
			frm.find('input[type!=file]').each(function() {
				myData.append(jQuery(this).attr('name'), jQuery(this).val());
			});
			frm.find('input[type=file]').each(function() {
				myData.append(jQuery(this).attr('name'), this.files[0]);
			});
			return myData;
		}
	}

	return {
		init: init
	};
}

function AttachUploadService() {

	var options = {
		grpid: '',
		uploadBtnId: null,
		ctx: null,
		limitFilesize: {value: 0, callback: null},
		uploadStart: null,
		success: null,
		fail: null,
		makeBtn: false,
		useExpire: false,
		legacy_browser_support_form_include: false
	};

	function uploadSuccess(data) {
		var result = {
			ctx: options.ctx,
			path: data.https.path,
			image: data.https.image,
			filesize: data.property.filesize,
			filename: data.property.filename
		};
		if (typeof options.limitFilesize === 'object') {
			if (result.filesize > options.limitFilesize.value) {
				if (typeof options.limitFilesize.callback === 'function') {
					removeFile(result.path);
					options.limitFilesize.callback();
				}
				return;
			}
		}
		if (!result.image) {
			removeFile(result.path);
			return;
		}

		options.success(result);
	}

	function removeFile(path) {
		jQuery.post('/_c21_/api/attach/remove?grpid=' + options.grpid, {path: path});
	}

	function uploadFail() {
		if (typeof options.fail === 'function') {
			options.fail();
		}
	}

	function setOptions(_options) {
		options = _options;
	}

	function getOptions() {
		return options;
	}

	function getUploadUrl(callback) {
		if (typeof options.uploadStart === 'function') {
			options.uploadStart(options.ctx);
		}

		var appendExpire = '';
		if (options.useExpire) {
			appendExpire = '&useExpire=true';
		}
		jQuery.get('/_c21_/api/attach/get-upload-url?grpid=' + options.grpid + '&timestamp=' + (+new Date()) + appendExpire, function (data, status) {
			callback(data);
		}).fail(function () {
			uploadFail();
		});
	}

	return {
		uploadSuccess: uploadSuccess,
		getUploadUrl: getUploadUrl,
		uploadFail: uploadFail,
		setOptions: setOptions,
		getOptions: getOptions
	};
}
