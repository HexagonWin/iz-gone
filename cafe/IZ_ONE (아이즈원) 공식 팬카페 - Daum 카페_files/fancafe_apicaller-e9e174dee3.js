var cafe = cafe || {};
cafe.fancafe = cafe.fancafe || {};

(function (namespace, $) {
	var redirectLogin = function () {
		window.location.href = 'https://logins.daum.net/accounts/loginform.do?url=' + encodeURIComponent(window.location.href) + '&category=cafe&t__nil_navi=login';
	};

	/**
	 * @type {{cheering, generateFancafeInfo, getWidgetConfig}}
	 */
	namespace.apiCaller = (function () {
		var resultOK = 200, notLogin = 401, enough = 1000;

		/**
		 * @param {Object} config
		 * @param {function} successCallback
		 * @param {function} errorCallback
		 */
		var cheering = function (config, successCallback, errorCallback) {
			$.ajax({
				url: 'https://' + namespace.host + '/fancafe/widget/cheer/' + config.grpid + '/' + config.widgetId,
				method: "post",
				xhrFields: {
					withCredentials: true
				},
				error: errorCallback
			}).then(function (res) {
				if (res.resultCode === resultOK) {
					successCallback(res);
				} else if (res.resultCode === enough) {
					successCallback({addScore: 0});
				} else if (res.resultCode === notLogin) {
					redirectLogin();
				} else {
					errorCallback(res);
				}
			});
		};

		/**
		 * @event apiCaller#fancafe_info_generate
		 */

		/**
		 * @param {Object} config
		 * @param {string} config.grpid
		 *
		 * @fires apiCaller#fancafe_info_generate - done trigger fancafe_info_generate
		 */
		var generateFancafeInfo = function (config) {
			$.ajax({
				url: 'https://' + namespace.host + '/fancafe/' + config.grpid
			}).then(function (res) {
				namespace.fancafeInfo = res;
				$(namespace.apiCaller).trigger('fancafe_info_generate');
			});
		};

		/**
		 * @requires generateFancafeInfo - fancafe_info_generate event trigger after
		 * @param {Object} config
		 * @param {string} config.grpid
		 * @param {function} successCallback
		 * @param {function} errorCallback
		 */
		var getWidgetConfig = function (config, successCallback, errorCallback) {
			var fancafeConfig = namespace.fancafeInfo;

			if (fancafeConfig.cafe === undefined) {
				return;
			}

			$.ajax({
				url: 'https://' + namespace.host + '/fancafe/widget/' + config.grpid + '/' + fancafeConfig.cafe.cheerWidgetId,
				error: errorCallback
			}).then(function (widgetViewConfig) {
				if (widgetViewConfig.resultCode === resultOK) {
					var sloganList = [];
					$(widgetViewConfig.widget.sloganList).each(function (i, val) {
						sloganList.push(val.slogan);
					});

					var config = {
						grpid: fancafeConfig.cafe.grpid,
						widgetId: fancafeConfig.cafe.cheerWidgetId,
						starName: fancafeConfig.cafe.starName,
						sloganList: sloganList,
						dday: widgetViewConfig.remainingDay,
						bgImage: widgetViewConfig.widget.bgImage,
						fandomRank: widgetViewConfig.fandomRank,
						score: widgetViewConfig.cheerStat.score
					};

					successCallback(config);
				}
			});
		};

		return {
			cheering: cheering,
			generateFancafeInfo: generateFancafeInfo,
			getWidgetConfig: getWidgetConfig
		};
	})();
})(cafe.fancafe, jQuery);
