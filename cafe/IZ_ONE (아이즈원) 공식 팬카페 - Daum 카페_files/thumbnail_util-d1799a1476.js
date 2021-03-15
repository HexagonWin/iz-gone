var thumbnailUtil = (function () {
	return {
		isTenth2Url: function (imageUrl) {
			return /^https?:\/\/(img|t)1(-beta|\.beta)?\.(kakao|daum)cdn\.net\/cafeattach\//.test(imageUrl);
		},
		getOriginalUrl: function (imageUrl) {
			var fnameIndex = imageUrl.indexOf('?fname=');
			if (fnameIndex < 0) {
				return imageUrl;
			}

			return decodeURIComponent(imageUrl.substr(fnameIndex + 7));
		},
		makeThumbnail: function (imageUrl, thumbSize) {
			if (imageUrl.indexOf('?fname=') > 0) {
				return imageUrl;
			}

			var host = /beta\.(kakao|daum)cdn\.net/.test(imageUrl) ? 'img1-beta.daumcdn.net' : 'img1.daumcdn.net';
			return 'https://' + host + '/thumb/' + thumbSize + '/?fname=' + encodeURIComponent(imageUrl);
		}
	};
})();
