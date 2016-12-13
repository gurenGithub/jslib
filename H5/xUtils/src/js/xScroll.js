if (typeof $ !== 'undefined') {
	document.addEventListener('touchmove', function(e) {
		e.preventDefault();
	}, false);
	$.fn.scrollList = function(opts) {
		var $me = $(this);
		var $wrapper = $('<div class="scrollListWrapper" ></div>');
		var $scroller = $('<div class="scroller"></div>');
		var $Uploadding = $('<div class="scrollerLoadding"><span><span class="scrollerLoadding-circle"></span><span class="scrollerLoadding-text">数据加载中</span></span></div>');

		var $downloadding = $('<div class="scrollerLoadding"><span><span class="scrollerLoadding-circle"></span><span class="scrollerLoadding-text">数据加载中</span></span></div>');
		var $selector = $(this);
		$selector.wrap($wrapper).wrap($scroller);
		$Uploadding.css({
			top: 0
		});
		$downloadding.css({
			bottom: 0
		});
		$wrapper.append($Uploadding);
		$wrapper.append($downloadding);
		$Uploadding.hide();
		$downloadding.hide();
		var $UploaddingCircle = $('.scrollerLoadding-circle', $Uploadding);
		$UploaddingCircle.hide();
		var $UploaddingText = $('.scrollerLoadding-text', $Uploadding);
		var $downloaddingCircle = $('.scrollerLoadding-circle', $downloadding);
		$downloaddingCircle.hide();
		var $downloaddingText = $('.scrollerLoadding-text', $downloadding);
		var methods = {
			end: function() {
				$Uploadding.hide();
				$downloadding.hide();
				iscroll.refresh();

			}
		}
		if (typeof opts === 'string') {
			var method = methods[opts];
			if (method) {
				method.call(this)
				return;
			}
		}

		if (!opts) {
			opts = {};
		}


		var autoSize = opts.autoSize || true;
		if (autoSize && !opts.height) {
			opts.height = $wrapper.parent().height();
			$wrapper.height(opts.height);
		}
		if (!opts.onUp) {
			opts.onUp = function() {
				setTimeout(function() {
					$Uploadding.hide();
				}, 2000);
			};
		}
		if (!opts.onDown) {
			opts.onDown = function() {
				setTimeout(function() {
					$downloadding.hide();
				}, 2000);
			};
		}
		opts.probeType = 1;
		opts.mouseWheel = true;


		var iscroll = listScroll = new IScroll($wrapper[0], opts);
		var events = ['scrollEnd', 'beforeScrollStart', 'scrollStart', 'scrollCancel', 'refresh']
		iscroll.on('scrollStart', function(e, e1) {
			opts.status = "start";
			var y = this.startY;
			var maxY = this.maxScrollY;
			console.log('scrollStart:' + y);
			opts.upRefresh = false;
			opts.downRefresh = false;
			$Uploadding.hide();
			$downloadding.hide();
		});

		iscroll.on('scroll', function(e, e1) {
			var y = this.startY;
			var maxY = this.maxScrollY;
			var loaddingText;
			if (y > 0 && !opts.upRefresh) {
				$Uploadding.show();
				loaddingText = "下拉刷新...";
				$UploaddingCircle.hide();
				$UploaddingText.html(loaddingText);
			}
			if (y > 50 && !opts.upRefresh) {
				console.log('数据刷新中');
				opts.upRefresh = true;
				$UploaddingCircle.show();
				loaddingText = "数据刷新中...";
				$UploaddingText.html(loaddingText);
			} else if (maxY > y) {
				$downloadding.show();
				if (!opts.downRefresh) {
					loaddingText = "上拉刷新...";
					$downloaddingCircle.hide();
					$downloaddingText.html(loaddingText);
				}

				if (maxY - 50 > y) {
					console.log('数据刷新中');
					opts.downRefresh = true;
					$downloaddingCircle.show();
					loaddingText = "数据刷新中...";
					$downloaddingText.html(loaddingText);
				}
				console.log('下来刷新');
			}

			console.log('scroll :' + y);
		});
		iscroll.on('beforeScrollStart', function(e, e1) {
			console.log('beforeScrollStart');
		});
		iscroll.on('scrollEnd', function(e, e1) {
			console.log('scrollEnd');
			opts.status = "end";
			if (!opts.upRefresh) {
				$Uploadding.hide();
			} else {
				opts.onUp.call(this, methods);
			}
			if (!opts.downRefresh) {
				$downloadding.hide();
			} else {
				opts.onDown.call(this, methods);
			}
			opts.upRefresh = false;
			opts.Uploadding = false;
		});
		iscroll.on('scrollCancel', function(e, e1) {
			console.log('scrollCancel');
			opts.status = "cancel";
			opts.upRefresh = false;
			opts.Uploadding = false;
		});
		iscroll.on('refresh', function(e, e1) {
			console.log('refresh');
		});

		return iscroll;

	}

	var scrollerEvents = (function() {

		var methods = {
			initEvent: function(opts, element) {
				var events = ['scrollEnd', 'beforeScrollStart', 'scrollStart', 'scrollCancel', 'refresh']
				var _events = ['onScrollEnd', 'onBeforeScrollStart', 'onScrollStart', 'onScrollCancel', 'onRefresh'];
				$.each(_events, function(index, item) {
					if (typeof opts[item] === 'function') {
						element.on(events[index], opts[item]);
					}
				});
			}
		};
		return methods;
	})();
	$.fn.scrollItems = function(opts) {
		var iscroll;
		var $me = $(this);
		var $wrapper = $('<div class="scrollItemsWrapper" ></div>');
		var $scroller = $('<div class="scroller"></div>');
		$me.wrap($wrapper).wrap($scroller);
		if (!opts) {
			opts = {};
		}
		var org = {
			scrollX: true,
			scrollY: false,
			mouseWheel: true
		};
		for (var item in org) {
			opts[item] = org[item];
		}
		var totalWidth = 0;
		$me.children().each(function() {
			totalWidth += $(this).width();
		});
		var widthOpts = {
			width: totalWidth
		};
		$me.css(widthOpts);
		$scroller.css(widthOpts);
		iscroll = new IScroll($wrapper[0], opts);
		scrollerEvents.initEvent(opts, iscroll);
		return iscroll;
	}
	$.fn.scrollPage = function(opts) {

		var iscroll;
		var $me = $(this);
		var $wrapper = $('<div class="scrollerPagerWrapper" ></div>');
		var $scroller = $('<div class="scroller"></div>');
		$me.wrap($wrapper).wrap($scroller);
		if (!opts) {
			opts = {};
		}
		var newOpts = {
			scrollX: true,
			scrollY: false,
			mouseWheel: true,
			snap: true,
			momentum: false
		}
		$scroller.css({
			width: ($me.children().size() * 100) + '%'
		})
		for (var item in newOpts) {
			opts[item] = newOpts[item];
		}
		iscroll = new IScroll($wrapper[0], opts);
		scrollerEvents.initEvent(opts, iscroll);
		return iscroll;
	}

	$.fn.slider = function(opts) {
		var iscroll;
		var $me = $(this);
		var $wrapper = $('<div class="scrollerSliderWrapper"></div>');
		var $scroller = $('<div class="scroller"></div>');
		$me.wrap($wrapper).wrap($scroller);
		$wrapper.parent().css({
			position: 'relative'
		});
		if (!opts) {
			opts = {};
		}

		if (opts.class) {
			$wrapper.addClass(opts.class);
		}
		var newOpts = {
			scrollX: true,
			scrollY: false,
			mouseWheel: true,
			snap: true,
			momentum: false,
			pager: true
		};
		$scroller.css({
			width: ($me.children().size() * 100) + '%'
		});
		$.extend(opts, newOpts);
		iscroll = new IScroll($wrapper[0], opts);
		scrollerEvents.initEvent(opts, iscroll);
		if (opts.pager) {
			var $pager = $('<div class="pager"></div>');
			var $pagerUl = $('<ul></ul>');
			var pagerCount = $me.children().size();
			var activePagerClass = 'activePager';
			for (var i = 0; i < pagerCount; i++) {
				var $li = $('<li></li>');
				$li.data('pagerIndex', i);
				$li.tap(function() {
					var pagerIndex = $(this).data('pagerIndex');
					iscroll.goToPage(pagerIndex, 0);
					$pagerUl.find('li').removeClass(activePagerClass);
					$(this).addClass(activePagerClass);
				});
				$pagerUl.append($li);
			}

			$pagerUl.find('li').first().addClass(activePagerClass);
			$pager.append($pagerUl);
			$wrapper.append($pager);


			iscroll.on('scrollEnd', function() 
			{
				var currentPage = this.currentPage;
				var currentPageX = currentPage.pageX;
				$pagerUl.find('li').removeClass(activePagerClass);
				$pagerUl.find('li').eq(currentPageX).addClass(activePagerClass);
			});
		}
		return $scroller;
	}
};