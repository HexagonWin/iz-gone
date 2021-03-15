var cafe = cafe || {};
cafe.fancafe = cafe.fancafe || {};
cafe.httpResponse = cafe.httpResponse || {
	OK: 200,
	UNAUTHORIZED: 401,
	HEART_OVER: 1000
};

(function (namespace, $) {
	// util
	var shuffle = function (a) {
		if (!a || !a.length) {
			return;
		}
		var j, x, i;
		for (i = a.length; i; i--) {
			j = Math.floor(Math.random() * i);
			x = a[i - 1];
			a[i - 1] = a[j];
			a[j] = x;
		}
	};

	var numberFormat = function (number) {
		var reg = /(^[+-]?\d+)(\d{3})/;
		var n = (number + '');

		while (reg.test(n)) {
			n = n.replace(reg, '$1,$2');
		}

		return n;
	};

	/**
	 * @requires cafe.fancafe.apiCaller
	 * @type {{init, customEventList, activate, deactivate}}
	 */
	namespace.widget = (function () {
		var grpId, widgetId;

		var wrapElement, widgetSection, cheerCount,
			rankingNumber, fancafeInfo, starName, thanksMessage, cheerButton, cheerText, sloganList, bgImage;

		var nextThanksMsgIndex;

		var myHearts = 0, count = 0, total = 0;

		var stateEvents = {
			idle: 'IDLE',
			charging: 'CHARGING',
			cheering: 'CHEERING',
			result: 'RESULT'
		};

		var init = function (config) {
			if (cafe.fancafe.fancafeInfo.cafe.useCheerWidget === false) {
				return;
			}

			wrapElement = $(config.wrapElement);
			selectUseElements();
			setConfigValue(config);
			setIdleState();
			cheerButton.on('mouseover', function () {
				widgetSection.addClass('hover');
			});
			cheerButton.on('mouseout', function () {
				widgetSection.removeClass('hover');
			});
			showCheerWidget();
		};

		var cheerAjax = function (method, url, data) {
			if (data && method !== 'GET') {
				data = JSON.stringify(data);
			}

			var host = 'https://' + namespace.host + '/fancafe/widget/cheer';

			return $.ajax({
				method: method,
				url: host + url,
				data: data || null,
				accept: 'application/json',
				xhrFields: {
					withCredentials: true
				}
			});
		};
		var chargeHeart = function () {
			return cheerAjax('POST', '/charge/visit/' + CAFEAPP.GRPID);
		};
		var cheer = function (count) {
			return cheerAjax(
				'POST',
				'/' + CAFEAPP.GRPID + '/' + namespace.fancafeInfo.cafe.cheerWidgetId + '?count=' + count
			);
		};

		var setNextThanksMsg = function () {
			thanksMessage.html(sloganList[nextThanksMsgIndex++]);

			if (nextThanksMsgIndex >= sloganList.length) {
				nextThanksMsgIndex = 0;
				shuffle(sloganList);
			}
		};

		var lastIndex = 0;
		var notiConditionSatisfied = false;
		var notiShown = false;
		var cheerStarted = false;

		var cheerTimeout = function () {
			return setTimeout(function () {
				cheerButton.off('click');
				widgetSection.removeClass('cheering');
				setResultState();
			}, 1000);
		};
		var consumeHeart = function () {
			cheerStarted = true;

			if (myHearts > 0) {
				myHearts--;
				count++;
			} else {
				notiConditionSatisfied = true;
			}
		};

		var onClickHandlers = {
			effect: function () {
				var heartEffectArea, pulseEffectArea;

				var pulseEffect = $('<div class="pulse_effect"></div>').on('animationend', function () {
					pulseEffectArea.find('.pulse_effect:first-child').remove();
				});

				var heartClasses = ['center', 'left_first', 'left_second', 'right_first', 'right_second'];
				var heartEffect = $('<div class="heart_effect"></div>').on('animationend', function () {
					heartEffectArea.find('.heart_effect:first-child').remove();
				});

				pulseEffectArea = widgetSection.find('.pulse_effect_area');
				heartEffectArea = widgetSection.find('.heart_effect_area');

				var index = Math.floor(Math.random() * heartClasses.length);
				if (index === lastIndex) index = (index + 1) % heartClasses.length;
				heartEffect.addClass(heartClasses[index]);
				lastIndex = index;

				pulseEffectArea.append(pulseEffect);
				heartEffectArea.append(heartEffect);
			},
			idle: function () {
				cheerButton.off('click', onClickHandlers.idle);
				widgetSection.removeClass('idle');
				setChargingState();
			},
			cheering: function (timer) {
				return function () {
					consumeHeart();
					cheerText.html(myHearts);
					widgetSection.addClass('cheer');
					setTimeout(function () {
						widgetSection.removeClass('cheer');
					}, 100);

					if (timer) {
						clearTimeout(timer);
					}

					timer = cheerTimeout();
				};
			}
		};

		var isCharged = false;
		var setIdleState = function () {
			wrapElement.trigger(stateEvents.idle);
			widgetSection.addClass('idle');

			thanksMessage.html('');
			if (localStorage.getItem('cheer_tutorial')) {
				cheerText.html('응원시작');
			} else {
				cheerText.html('연타 응원 시작!');
			}

			cheerButton.on('click', onClickHandlers.effect);
			cheerButton.on('click', onClickHandlers.idle);
		}, setChargingState = function () {
			wrapElement.trigger(stateEvents.charging);
			widgetSection.addClass('charging');

			if (isCharged) {
				consumeHeart();
				setCheeringState();
			} else {
				chargeHeart().done(function (res) {
					if (res.resultCode === cafe.httpResponse.UNAUTHORIZED) {
						login();
					} else if (res.resultCode === cafe.httpResponse.OK) {
						total = res.stat.widgetScore;
						myHearts = res.pocket.totalHeartCount;
						isCharged = true;
					} else {
						total = 0;
						myHearts = 0;
					}

					widgetSection.removeClass('charging');
					localStorage.setItem('cheer_tutorial', true);
					setCheeringState();
				});
			}
		}, setCheeringState = function () {
			wrapElement.trigger(stateEvents.cheering);
			widgetSection.addClass('cheering');

			var timer = cheerTimeout();
			cheerText.html(myHearts);
			cheerButton.on('click', onClickHandlers.cheering(timer));
		}, setResultState = function () {
			wrapElement.trigger(stateEvents.result);
			widgetSection.addClass('result');
			if (!cheerStarted) {
				cheerText.addClass('hide');
			}

			var afterCheer = function () {
				cheerCount.html(numberFormat(total));
				if (notiConditionSatisfied && !notiShown) {
					if (CAFEAPP.MEMBER_MEMBER) {
						thanksMessage.html('매 시간 응원버튼<br>누르고 하트 +20!');
					} else {
						thanksMessage.html('카페 가입하면<br>응원하트가 +20!');
					}
					notiShown = true;
				} else {
					setNextThanksMsg();
				}

				// 각 delay 정보는 fancafe_widget.css의 result, before_idle 값을 참조하세요.
				var delay = 500;
				setTimeout(function () {
					cheerText.html('+' + count);
					count = 0;
				}, delay);

				delay += 1700;
				setTimeout(function () {
					widgetSection.removeClass('result');
					widgetSection.addClass('before_idle');
				}, delay);

				delay += 500;
				setTimeout(function () {
					cheerText.html('응원시작');
				}, delay);

				delay += 800;
				setTimeout(function () {
					widgetSection.removeClass('before_idle');
					cheerText.removeClass('hide');
					setIdleState();
				}, delay);
			};

			if (count) {
				cheer(count)
					.done(function (res) {
						if (res.resultCode === cafe.httpResponse.OK) {
							total = res.totalScore;
						} else if (res.resultCode === cafe.httpResponse.UNAUTHORIZED) {
							login();
						} else if (res.resultCode === cafe.httpResponse.HEART_OVER) {
							chargeHeart().done(function () {
								total = res.stat.widgetScore;
								myHearts = res.pocket.totalHeartCount;
							});
						}
					}).fail(function () {
						myHearts += count;
						count = 0;
					}).always(afterCheer);
			} else {
				afterCheer();
			}
		};

		var updateRanking = function (rank) {
			rankingNumber.html(rank);
		};

		var setBgImage = function (backgroundImageUrl) {
			bgImage.attr('src', thumbnailUtil.makeThumbnail(backgroundImageUrl, 'C182x236'));
		};

		var useragentConfigSetting = function () {
			if (navigator.userAgent.indexOf('OS X') > 0) {
				widgetSection.addClass('osx');
			}

			if (navigator.userAgent.indexOf('MSIE 10') > 0) {
				widgetSection.addClass('ie10');
			} else if (navigator.userAgent.indexOf('MSIE') > 0) {
				widgetSection.addClass('ie');
			}
		};

		var setTiaraTag = function () {
			cheerButton.addClass('#fancafe_widget_button ?c_source=' + namespace.fancafeInfo.cafe.grpcode + '&c_title=' + encodeURI(namespace.fancafeInfo.cafe.grpname));
		};

		var setConfigValue = function (config) {
			if (!config) {
				return;
			}
			grpId = config.grpid;
			widgetId = config.widgetId;
			nextThanksMsgIndex = 0;
			sloganList = config.sloganList;
			shuffle(sloganList);
			setBgImage(config.bgImage);
			updateRanking(config.fandomRank);
			starName.html(config.starName);
			setTiaraTag();
			useragentConfigSetting();
		};

		var showCheerWidget = function () {
			widgetSection.css('display', 'block');
		};

		var selectUseElements = function () {
			widgetSection = wrapElement.find('#fancafe-widget');
			rankingNumber = wrapElement.find('#fancafe-ranking-number');
			fancafeInfo = wrapElement.find('.fancafe_info');
			starName = wrapElement.find('#fancafe-ranking-star-name');
			thanksMessage = wrapElement.find('#fancafe-thanks-message');
			cheerCount = wrapElement.find('#fancafe-cheer-count');
			cheerButton = wrapElement.find('#fancafe-widget-cheer');
			cheerText = wrapElement.find('.fancafe_cheer_text');
			bgImage = wrapElement.find("#fancafe-widget-bg-image");
		};

		return {
			init: init,
			customEventList: stateEvents
		};
	})();
})(cafe.fancafe, jQuery);
