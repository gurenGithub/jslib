var xDialog = (function(argument) {

	var methods = {

		alert: function(content, title, opts) {

			var _opts = {
				title: title ? title : '提示信息',
				titleClass: 'alert-info',
				content: content,
				isModal: false,
				width: 300,
				height: 120
			}
			for (var item in opts) {
				_opts[item] = opts[item];
			}
			this.modal(_opts);
		},
		conform: function(content, onSure, onCacel, title, opts) {
			var _opts = {
				title: title ? title : '是否确定',
				titleClass: 'alert-warning',
				content: content,
				isModal: false,
				width: 300,
				height: 120,
				buttons: [{
					'title': '确定',
					click: onSure
				}, {
					'title': '取消',
					click: onCacel
				}]
			}
			for (var item in opts) {
				_opts[item] = opts[item];
			}
			this.modal(_opts);
		},
		success: function(content, title, opts) {
			var _opts = {
				title: title ? title : '成功提示',
				titleClass: 'alert-success',
				content: content,
				isModal: false,
				width: 300,
				height: 120
			}
			for (var item in opts) {
				_opts[item] = opts[item];
			}
			this.modal(_opts);
		},
		error: function(content, title, opts) {


			var _opts = {
				title: title ? title : '错误提示',
				titleClass: 'alert-error',
				content: content,
				isModal: false,
				width: 300,
				height: 120
			}
			for (var item in opts) {
				_opts[item] = opts[item];
			}
			this.modal(_opts);
		},
		loadding: function() {

			var _opts = {
				content: "<span class='loadding'>数据加载中...</span>",
				width: 200,
				height: 50,
				isAutoClose: false
			}

			this.modal(_opts);
		},
		close: function(onClose) {
			var $modalDialog = document.getElementById('modalDialog');
			if ($modalDialog != null) {
				document.body.removeChild($modalDialog);
				if(onClose){
						onClose(this);
					}
			}
		},
		modal: function(opts, templateId) {
			var title = opts.title;
			var width = opts.width ? opts.width : 400;
			var height = opts.height ? opts.height : 300;
			var buttons = opts.buttons;
			var content = opts.content;
			var src = opts.src;
			var onClose=opts.onClose;
			var id = opts.id;
			var _height = parseFloat(height);
			var _contentHeight = _height;
			var _isModal = opts.isModal;

			var $modalDialog = document.createElement('div');

			$modalDialog.id = 'modalDialog';
			$modalDialog.className = 'xmodal-dialog';
			var $dialogBackup = document.createElement('div');
			$dialogBackup.className = 'dialog-backup fade';
			if(_isModal==true){
			$modalDialog.appendChild($dialogBackup)
}

			var fn_removeModal=function() {
				document.body.removeChild($modalDialog);
				if (onClose) {
					onClose(this);
				}

			}
			xUtils.addEvent($dialogBackup, 'click', function() {
				fn_removeModal()
			})

			var $dialogBody = document.createElement('div');
			$dialogBody.className = 'dialog-body';
			xUtils.addEvent($dialogBody, 'click', function(e) {
				xUtils.cancelBubble(e);
			})
			if (opts.title) {
				var $title = document.createElement('div');
				$title.className = 'title ' + (opts.titleClass ? opts.titleClass : '');
				_contentHeight -= 40;
				var $closeButton = document.createElement('span');
				$closeButton.className = 'close';
				$closeButton.innerHTML = 'x';

				var $titleSpan = document.createElement('span');
				$titleSpan.innerHTML = title;
				$title.appendChild($closeButton)
				$title.appendChild($titleSpan)
				$dialogBody.appendChild($title);

				xUtils.addEvent($closeButton, 'click', function() {
					fn_removeModal();
				})
			}

			if (width) {
				var _width = parseFloat(width);
				$dialogBody.style.width = _width + 'px';
				$dialogBody.style.marginLeft = -(_width / 2) + 'px';
			}
			if (height) {

				$dialogBody.style.height = _height + 'px';
				$dialogBody.style.marginTop = -(_height / 2) + 'px';
			}

			var $content = document.createElement('div');
			$content.className = 'content';
			if (content) {
				if (typeof content == 'object') {
					$content.appendChild(content);
				} else {
					$content.innerHTML = content;
				}
			}

			if (opts.buttons) {


				var $buttons = document.createElement('div');
				$buttons.className = 'buttons';
				_contentHeight -= 40;
				$dialogBody.appendChild($buttons)

				for (var i = 0; i < opts.buttons.length; i++) {


					(function(i) {
						var button = opts.buttons[i];

						var $button = document.createElement('span');
						$button.innerHTML = button.title;
						$button.className = 'button ' + (i == opts.buttons.length - 1 ? " lastButton" : "");
						xUtils.addEvent($button, 'click', function() {
							fn_removeModal();
							if (button.click) {
								button.click.call(this);
							}
							
						});


						$buttons.appendChild($button);
					})(i)
				}
			}

			if (opts.src) {
				var $iframe = document.createElement('Iframe');
				$iframe.setAttribute('frameborder', '0');
				$iframe.setAttribute('marginheight', '0');
				$iframe.setAttribute('marginwidth', '0');
				$iframe.setAttribute('scrolling', 'none');
				$iframe.setAttribute('width', '100%');
				$iframe.setAttribute('height', (_contentHeight - 10) + 'px');
				$iframe.setAttribute('src', opts.src);
				$content.innerHTML = "";
				$content.appendChild($iframe);


			}
			$content.style.height = (_contentHeight) + 'px';
			$dialogBody.appendChild($content);

			$modalDialog.appendChild($dialogBody);
			$modalDialog.style.display = 'block';
			document.body.appendChild($modalDialog);

		

		}

	}
	return methods;
})()