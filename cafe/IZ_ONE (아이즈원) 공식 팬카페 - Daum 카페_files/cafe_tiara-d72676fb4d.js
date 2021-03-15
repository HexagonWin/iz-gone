window.CafeTiara = (function () {
	if (!window.TiaraTracker) {
		return {
			setDeployment: function () {},
			trackPage: function () {},
			trackEvent: function () {},
			getSection: function () {}
		};
	}

	window.tiaraInstance = TiaraTracker.getInstance();

	var tiaraInstance = TiaraTracker.getInstance();
	var deployment = 'production';

	var setDeployment = function (deploymentString) {
		deployment = deploymentString;
	};

	var setShortUrl = function () {
		return location.origin + location.pathname + '?grpid=' + CAFEAPP.GRPID;
	};

	var trackPage = function (pageName, sectionName, externalCustomProps) {
		tiaraInstance.setSvcDomain('cafe.daum.net')
			.setPage(pageName)
			.setSection(sectionName)
			.setSessionTimeout('1800')
			.setDeployment(deployment)
			.setIgnoreQueryParams(['ts', 'dummy'])
			.trackPage(pageName)
			.customProps(getCustom(externalCustomProps));
		if(getQuery() !== null) {
			var url = setShortUrl(); // 티아라 로깅시 쿼리로 인해 url 을 인식하지 못하는 버그 회피
			tiaraInstance
				.setUrl(url)
				.actionKind('ViewSearchResults')
				.search({
					search_type: 'common',
					search_term: getQuery()
				});
		}
		tiaraInstance.track();
	};

	var getCustom = function(props){
		var custom = {
			grpid: CAFEAPP.GRPID,
			grpcode: CAFEAPP.GRPCODE,
			grpname: CAFEAPP.GRPNAME,
		};

		if(CAFEAPP.FLDID) custom.fldid = CAFEAPP.FLDID;
		if(typeof CAFEAPP.ui !== 'undefined' && typeof CAFEAPP.ui.DATAID !== 'undefined') custom.dataid = CAFEAPP.ui.DATAID;
		if(props) custom.ext = props;
		var q = getParameterByName('q');
		if(q) custom.query = q;
		return custom;
	};
	var getQuery = function(){
		var q = getParameterByName('query');
		return q ? q : null;
	};

	var getParameterByName = function(name, url) {
		if (!url) {
			url = window.location.href;
		}
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	};

	var trackEvent = function (e, track, layer, prefix) {
		var url = '';
		if(e && e.currentTarget){
			url = e.currentTarget.href ? e.currentTarget.href.slice(0, 255) : '';
		}
		var clickObject = {
			layer1: layer,
			layer2: '',
			layer3: '',
			click_url: url,
			copy: '',
			posx: 0,
			posy: 0
		};

		tiaraInstance.trackEvent(prefix + track).click(clickObject).track();
	};

	var getSection = function () {
		return tiaraInstance._section;
	};

	return {
		setDeployment: setDeployment,
		trackPage: trackPage,
		trackEvent: trackEvent,
		getSection: getSection
	};
})();
