var xModal = (function(argument) {



	function getSelector(selectorId) {

		return typeof selectorId == 'object' ? selectorId : document.getElementById(selectorId);

	}

	function closeClick(source, modal, me) {
		if (!source || !modal) {
			return;
		}
		xUtils.addEvent(source, 'click', function(e) {
			if (modal != null) {
				xModal.hide(modal);
				xUtils.cancelBubble(e);
			}
		})
	}
	var methods = {
		show: function(selectorId) {


			var $modal = getSelector(selectorId);
			$modal.style.display = 'block';
			var onShow = $modal.getAttribute("onShow");
			if (onShow) {
				eval(onShow + '(this)');
			}
		},
		hide: function(selectorId) {
			var $modal = getSelector(selectorId);
			$modal.style.display = 'none';

			var onHide = $modal.getAttribute("onHide");
			if (onHide) {
				eval(onHide + '(this)');
			}
		},
		toggle: function(selectorId) {

			var $modal = getSelector(selectorId);
			if ($modal) {

				var display = $modal.style.display;
				display != 'block' ? this.show($modal) : this.hide($modal);
			}
		},
		remove: function(selectorId) {
			var $modal = getSelector(selectorId);
			if ($modal) {
				document.removeChild($modal)
			}
		},
		render: function() {

			var xmodals = document.getElementsByClassName('xModal');

			for (var i = 0; i < xmodals.length; i++) {



				(function(i) {
					var $modal = xmodals[i];
					var $close = xUtils.getElementByClass($modal, 'close');
					var $bg = xUtils.getElementByClass($modal, 'bg');
					var $content = xUtils.getElementByClass($modal, 'body');
					if (!$close) {
						$close = xUtils.getElementByClass($content, 'close');
					}
					var $title = xUtils.getElementByClass($content, 'title');
					closeClick($title, $modal);
					closeClick($bg, $modal);
					closeClick($close, $modal);

				})(i)
			}
		}
	}
	return methods;
})()



xUtils.addEvent(window, 'load', function() {

	xModal.render()
})