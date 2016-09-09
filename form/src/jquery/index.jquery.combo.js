function xCombo(argument) {
	this.opts = {}
	this.eles = {}
	this.selectedItems = [];
	this.isFirstTime = true;
	// body...
}
xCombo.prototype.render = function(opts) {
	var me = this;
	this.opts = opts;
	var $selector = opts.selector;
	var tField = opts.tField || 'text';
	var vField = opts.vField || 'value';
	var pField = opts.vField || 'parent';
	var subNode = opts.subNode;
	var value = opts.value || '';
	var isMultiSelect = opts.isMultiSelect || 'N';
	var data = opts.data;
	var onFilter = opts.onFilter;
	var onSelect = opts.onSelect;
	var onShow = opts.onShow;
	var onHide = opts.onHide;
	var onLoadData = opts.onLoadData;
	this.eles.$ul = jQuery('<ul></ul');
	$selector.append(this.eles.$ul)
	this.eles.$text = jQuery('>input', $selector);
	this.eles.$selector = $selector;
	this.eles.$hValue = jQuery('<input type="hidden" />');

	var name = this.eles.$text.attr('name');
	if (name) {
		this.eles.$hValue.attr('name', name);
		this.eles.$text.attr('name', name + 'Desc');
	}
	this.eles.$hValue.val(this.opts.value);
	$selector.append(this.eles.$hValue);

	this.eles.$selector.on('click', function(event) {
		var isVisible = me.eles.$ul.is(':visible');
		if (isVisible) {
			me.hide();
		} else {
			me.show();
		}
		event.stopPropagation();
	});

	this.eles.$text.keyup(function(event) {

		var _text = jQuery(this).val();
		me.selectedItems = [];
		me.clearValue();
		me.renderItems(me.opts.data, function(item, text) {
			return me.getParentFilterExpress(item) && text.indexOf(_text) > -1;
		})
	});

	this.eles.$ul.hover(function() {}, function() {
		me.hide()
	})


	if (this.opts.onLoadData) {

		this.eles.$ul.append('<li>数据加载中...</li>');
		eval(this.opts.onLoadData + '.call(this)')
	} else {
		this.setValue(value);
		this.renderItems(opts.data);
	}
}

xCombo.prototype.onFilter = function(text) {
	return true;
}

xCombo.prototype.isMultiSelect = function() {


	return this.opts.isMultiSelect == 'Y';

}

xCombo.prototype.getData = function() {

	return [];
}
xCombo.prototype.refresh = function(data) {
	this.opts.data = data;
	this.eles.$ul.append('<li>数据加载中...</li>');
	this.setValue(this.getValue());
	this.renderItems(data);

}

xCombo.prototype.renderItems = function(data, onFilter) {

	if (!data || data.length == 0) {
		return;
	}
	var me = this;
	this.eles.$ul.empty();
	for (var i = 0; i < data.length; i++) {
		var item = data[i];
		(function(item) {

			var text, value, parent;
			if (typeof item == "string") {
				text = value = item;
			} else {
				text = item[me.opts.tField];
				value = item[me.opts.vField];
				parent = item[me.opts.pField];
			}
			if (onFilter && onFilter(item, text) == false) {
				return;
			}
			var $li = jQuery('<li></li>');
			if (me.opts.renderItem) {
				$li.append(me.opts.renderItem(item, text))
			}
			if (me.isMultiSelect()) {
				$li.addClass('item');
			}
			$li.html(text);
			$li.attr('value', value);
			$li.attr(me.opts.pField, parent);
			$li.click(function(event) {


				if (value == me.getValue()) {
					return;
				}
				if (me.opts.isMultiSelect == 'Y') {

					var hasActive = $li.hasClass('active');
					if (hasActive) {
						me.removeItem(item);
						$li.removeClass('active');

					} else {
						me.addItem(item);
						$li.addClass('active');
					}

				} else {
					me.hide();
					me.selectedItems = [];
					$li.siblings().removeClass('active');
					$li.addClass('active');
					me.setValue(value, text);
				}
				event.stopPropagation();
			})
			if (jQuery.inArray(item, me.selectedItems) > -1) {
				$li.addClass('active');
			}
			me.eles.$ul.append($li);

		})(item)
	}
}

xCombo.prototype.show = function() {


	this.FilterForParent();
	this.eles.$ul.show();
}
xCombo.prototype.hide = function() {


	this.eles.$selector.attr('isValid', this.selectedItems.length > 0 ? 'Y' : 'N')
	this.eles.$ul.hide();
}
xCombo.prototype.getValue = function() {
	return this.eles.$hValue.val()
}
xCombo.prototype.addItem = function(item) {
	this.selectedItems.push(item);
	this.renderValue()
}
xCombo.prototype.removeItem = function(item) {


	for (var i = 0; i < this.selectedItems.length; i++) {
		var _item = this.selectedItems[i];
		if (_item == item) {
			this.selectedItems.splice(i, 1);
		}
	}
	this.renderValue()
}
xCombo.prototype.selectedItems = [];
xCombo.prototype.setValue = function(value, text) {
	var me = this;
	if (text) {
		this.eles.$text.val(text);
	}

	if (this.opts && this.opts.data) {
		for (var i = 0; i < this.opts.data.length; i++) {
			var item = this.opts.data[i];
			var _value;
			if (typeof item == "string") {
				_value = item;
			} else {
				_value = item[me.opts.vField];
			}
			if (_value) {
				if (value.toString().indexOf(_value.toString()) > -1) {
					this.selectedItems.push(item)

				}
			}
		}
	}

	this.renderValue();
}
xCombo.prototype.clearValue = function() {
	this.eles.$hValue.val('');
	this.setSubCombo();
}
xCombo.prototype.renderValue = function() {

	var me = this;
	var texts = [],
		values = [];

	for (var i = 0; i < this.selectedItems.length; i++) {
		var item = this.selectedItems[i];
		var _value, _text;
		if (typeof item == "string") {
			_text = _value = item;
		} else {
			_text = item[me.opts.tField];
			_value = item[me.opts.vField];
		}

		texts.push(_text);
		values.push(_value);
	}

	this.eles.$text.val(texts.join(','));
	this.eles.$hValue.val(values.join(','));

	if (this.opts.onSelect) {
		this.opts.onSelect.call(this);
	}

	this.setSubCombo();

}

xCombo.prototype.getParentFilterExpress = function(item) {
	var me = this;
	$parentNode = jQuery('.combo[id=' + this.eles.$selector.attr('pId') + ']');
	if ($parentNode && $parentNode.length > 0) {
		var parentCombo = combo.get($parentNode);
		if (parentCombo) {
			var parentValue = parentCombo.getValue();
			var parentNodepField = this.opts.pField;
			return parentValue.toString().indexOf(item[parentNodepField]) > -1;

		}
	}
	return true;
}
xCombo.prototype.FilterForParent = function() {
	var me = this;

	this.renderItems(this.opts.data, function(item) {
		return me.getParentFilterExpress(item);
	});


}
xCombo.prototype.isFirstTime = true;
xCombo.prototype.setSubCombo = function() {


	if (this.isFirstTime) {
		this.isFirstTime = false;
		return;
	}
	var me = this;
	$subNode = jQuery('.combo[pId=' + this.eles.$selector.attr('id') + ']');
	if ($subNode && $subNode.length > 0) {
		var subCombo = combo.get($subNode);
		if (subCombo) {
			var parentValue = this.getValue();
			var subNodepField = $subNode.attr('pField');
			subCombo.renderItems(subCombo.opts.data, function(item) {
				return item[subNodepField] == me.getValue();
			});
			subCombo.selectedItems = [];
			subCombo.setValue('');
		}
	}
}
if(typeof window.xForm != 'undefined' ){


window.xForm.combo = (function() {

	var combos = [];
	var members = {

		get: function(selector) {
			if (typeof selector === "number") {
				return combos[selector];
			} else if (typeof selector === 'string') {
				selector = jQuery(selector);
			} else {
				for (var i = 0; i < combos.length; i++) {
					var item = combos[i];
					if (item.opts.selector &&
						jQuery(item.opts.selector)[0] == jQuery(selector)[0]) {
						return item;
					}
				}
			}
			return null;
		},
		render: function(selector) {
			if (!selector) {
				$selectors = jQuery('.combo');
			}
			var me = this;
			for (var i = 0; i < $selectors.length; i++) {



				(function(i) {

					var seletor = $selectors[i];
					var $seletor = jQuery(seletor);
					var opts = {};
					opts.selector = $seletor;
					opts.tField = $seletor.attr('tField');
					var _data = {}
					eval('(' + '_data={data:' + ($seletor.attr('data') || '[]') + '}' + ')');
					opts.data = _data.data;
					opts.vField = $seletor.attr('vField');

					opts.onLoadData = $seletor.attr('onLoadData');
					opts.pField = $seletor.attr('pField');
					opts.subNode = $seletor.attr('subNode');
					opts.value = $seletor.attr('value') || jQuery('>input:first', $seletor).val();
					opts.isMultiSelect = $seletor.attr('isMultiSelect');
					var xcombox = new xCombo();

					opts.onSelect = function() {
						var me = this;
						var onSelect = this.eles.$selector.attr('onSelect');
						if (onSelect) {
							eval(onSelect + '.call($seletor,me.getValue(),me.getText())');
						}
					}
					combos.push(xcombox);
					xcombox.render(opts);

				})(i)
			}

		},
		getValue: function(selector) {

		},
		setValue: function(selector) {

		}
	}

	return members;
})()
}