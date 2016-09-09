
function xAutoComplete(opts) {

	this.opts = opts || {}
   this.eles = {
     $selector: null,
     $ul: null
   };
	// body...
}
xAutoComplete.prototype.render = function(opts) 
{

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
	var onLoadData=opts.onLoadData;
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
		if(me.getText()==''){
			me.loadData('');
		}else{
		    me.renderItems(me.opts.data,function(item){
		    	return _getValue(item,me.opts.tField).indexOf(me.getText())>-1;
		    });
	    }
		event.stopPropagation();
	});

	this.eles.$text.keyup(function(event) {

		  var _text = jQuery(this).val();
          me.eles.$ul.show();
		  me.loadData(_text);
	});

	this.eles.$ul.hover(function(){},function(){me.hide()})
	
/*
	if(this.opts.onLoadData)
	{

		this.eles.$ul.append('<li>数据加载中...</li>');
		eval(this.opts.onLoadData+'.call(this)')
	}else{
	   this.setValue(value);
	   this.renderItems(opts.data);	
	}
*/
	
};
xAutoComplete.prototype.clearLi=function(){
	this.eles.$ul.empty();
}
 xAutoComplete.prototype.hide = function() {
   this.onHide();
   this.eles.$ul.hide();
 }
 xAutoComplete.prototype.show = function() {
   //this.parentFilter();
   this.onShow();
   this.eles.$ul.show();
 
 }

  xAutoComplete.prototype.onShow = function() {
   var onShow = this.opts.onShow;
   if(typeof this.opts.onShow =='function'){
     this.opts.onShow.call(this,me.getValue(),me.getText());
   }
   else if (onShow) {
     eval(onShow + '.call(this,this.getValue(),this.getText())');
   }
 }

xAutoComplete.prototype.onSelect = function() {
   var onSelect = this.opts.onSelect;
   if(typeof this.opts.onSelect =='function'){
     this.opts.onSelect.call(this,me.getValue(),me.getText());
   }
   else if (onSelect) {
     eval(onSelect + '.call(this,this.getValue(),this.getText())');
   }
 }
  xAutoComplete.prototype.onHide = function() {
   var onHide = this.opts.onHide;
   if(typeof this.opts.onHide =='function'){
     this.opts.onHide.call(this,me.getValue(),me.getText());
   }
   else if (onHide) {
     eval(onHide + '.call(this,this.getValue(),this.getText())');
   }
 }
xAutoComplete.prototype.getValue=function(){
    return this.eles.$hValue.val();
}
xAutoComplete.prototype.getText=function(){
  
  return this.eles.$text.val();
}
xAutoComplete.prototype.setValue=function(value,text)
{
     var me=this;
     if(value!=undefined){
          this.eles.$hValue.val(value);
     }
     if(text!=undefined){
     	 this.eles.$text.val(text);
     }else{
           if(!(this.opts && this.opts.data&& this.opts.data.length>0)){
             	return ;
           }
     	for (var i = 0; i < this.opts.data.length; i++) {
     		
     		var item=this.opts.data[i];

     		var text =_getValue(item,me.opts.tField);
     		this.eles.$text.val(text);
     		return ;
     	}
     }
   
}

xAutoComplete.prototype.renderItems=function(data,onFilter){

var me=this;
  this.eles.$ul.empty();
 if(!( this.opts && this.opts.data && this.opts.data.length>0)){return;}
	for (var i = 0; i < this.opts.data.length; i++) {
		
          var item=this.opts.data[i];
          if(onFilter && onFilter(item)==false){
               continue;
          }
		(function(item){
             
            var $li=me.renderItem(item);
            me.eles.$ul.append($li);
		})(item)
	}
}
xAutoComplete.prototype.renderItem = function(item) {

	var me = this;
	var $content;
	var renderItem = this.opts.renderItem;
	if (typeof this.opts.renderItem == 'function') {
		$content = this.opts.renderItem.call(this, item);
	} else if (renderItem) {
		eval('$content= ' + renderItem + '.call(this,item)');
	} else {
		$content = jQuery('<div></div>');
		var text = _getValue(item, this.opts.tField);
		var value = _getValue(item, this.opts.vField);
		$content.html(text);
		$content.attr('value', value);
	}

	var $li = jQuery('<li></li>');
	$li.click(function(event) {
		me.setValue(value, text);
		me.hide();
        event.stopPropagation();
	})
   
   return  typeof  $content  =='string'  ? $li.html($content) :$li.append($content);
}

function _getValue(item,field){

	return   typeof item == 'string'? item :(!field ? item : ( item[field] || item));
}

xAutoComplete.prototype.onItemClick=function(item)
{
   var text= _getValue(item,this.opts.tField);
   var value= _getValue(item,this.opts.vField);
}
xAutoComplete.prototype.loadData=function(){
   var me=this;
   me.clearLi();
   this.eles.$ul.append('<li>loadding...</li>');
   
  
  var loadData = this.opts.loadData;
   if(typeof this.opts.loadData =='function'){
      this.opts.loadData.call(this,me.getText());
   }
   else if (loadData) {
     eval( ' '+loadData + '.call(this,this.getText())');
   }else{

   	   this.renderItems(this.opts.data,function(item){
               
               return _getValue(item,me.opts.tField).indexOf(me.getText())>-1;

 
   	   })
   }
}
xAutoComplete.prototype.refresh=function(data)
{
  
  this.opts.data=data;
  this.renderItems(data);
}


if(typeof window.xUi == 'undefined' )
{
   window.xUi={};
} 

window.xUi.autocomplete = (function(window) {

   var controls = [];
   var members = {
     get: function(selector)
      {
      if (typeof selector === "number") {
        return controls[selector];
      } else if (typeof selector === 'string') {
        selector = jQuery(selector);
      } else {
        for (var i = 0; i < controls.length; i++) {
          var item = controls[i];
          if (item.opts.selector &&
            jQuery(item.opts.selector)[0] == jQuery(selector)[0]) {
            return item;
          }
        }
      }
      return null;
     },
     render: function(selector, opts) {

       if (!selector) {
         selector = '.autocomplete';
       }
       if (!opts) {
         opts = {};
       }
       
       var me=this;
       jQuery(selector).each(function(item) 
       {
        var $selector = jQuery(this);
        var newOpts={};
        for (var item in opts){
           newOpts.item=opts[item];
        }
         newOpts.tField=$selector.attr('tField');
          newOpts.vField=$selector.attr('vField');
         newOpts.onShow=$selector.attr('onShow');
         newOpts.onHide=$selector.attr('onHide');
         newOpts.onSelect=$selector.attr('onSelect');
         newOpts.loadData=$selector.attr('loadData');
         newOpts.renderItem=$selector.attr('renderItem');
         var _data = {}
		  eval('(' + '_data={data:' + ($selector.attr('data') || '[]') + '}' + ')');
		  newOpts.data = _data.data;
         newOpts.selector = $selector;
         var xautocomplete = new xAutoComplete(newOpts);
         controls.push(xautocomplete);
         xautocomplete.render(newOpts);
         
       })
     }

   };
   return members;
 })(window);

function xCheckbox(opts) {

	this.opts=opts || {};
    this.eles = {}
}
xCheckbox.prototype.render = function(opts) 
{

var me=this;
  this.opts=opts || this.opts;
   var $selector=opts.selector;
   this.eles.$selector=$selector;
   this.eles.$checkbox=jQuery('>label>input[type=checkbox]',$selector);
   this.eles.$label=jQuery('>label:first',$selector);
   this.opts.isChceked=this.eles.$checkbox.is(':checked');
   this.eles.$checkbox.click(function(event)
   {  
        var _isCheck=jQuery(this).is(':checked');
        me.setValue(_isCheck);
        event.stopPropagation();
    });
   this.setValue(this.opts.isChceked);

      
};
xCheckbox.prototype.getValue=function(){
  return  this.eles.$checkbox.is(':checked');
}
xCheckbox.prototype.setValue=function(value){
  this.eles.$label.removeClass('checked');
  if(value==true){
  	 this.eles.$label.addClass('checked');
  }

 this.eles.$checkbox.prop('checked',value);
 this.onSelect(value);
}
xCheckbox.prototype.onSelect=function(item){
 var onSelect = this.opts.onSelect;
   if(typeof this.opts.onSelect =='function'){
     this.opts.onSelect.call(this,me.getValue());
   }
   else if (onSelect) {
     eval(onSelect + '.call(this,this.getValue())');
   }
}


if(typeof window.xUi == 'undefined' )
{
   window.xUi={};
} 

window.xUi.checkbox=(function(){
       var controls=[];
       var members={
             get: function(selector)
      {
      if (typeof selector === "number") {
        return controls[selector];
      } else if (typeof selector === 'string') {
        selector = jQuery(selector);
      } else {
        for (var i = 0; i < controls.length; i++) {
          var item = controls[i];
          if (item.opts.selector &&
            jQuery(item.opts.selector)[0] == jQuery(selector)[0]) {
            return item;
          }
        }
      }
      return null;
     },
     render:function(selector, opts) {

       if (!selector) {
         selector = '.checkbox';
       }
       if (!opts) {
         opts = {};
       }
       
       var me=this;
       jQuery(selector).each(function(item) 
       {
        var $selector = jQuery(this);
        var newOpts={};
        for (var item in opts){
           newOpts.item=opts[item];
        }
         newOpts.onSelect=$selector.attr('onSelect');
         newOpts.selector = $selector;
         var control = new xCheckbox(newOpts);
         controls.push(control);
         control.render(newOpts);
       })
             }
       }

       return members;

})()

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
		var parentCombo = xUi.combo.get($parentNode);
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
		var subCombo = xUi.combo.get($subNode);
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
if(typeof window.xUi == 'undefined' )
{
   window.xUi={};
} 

window.xUi.combo = (function() {

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

		}
	}

	return members;
})()

var _getSelector = function(selector) {

  if (typeof selector === 'string') {
    return jQuery(selector);
  }
  return selector;
}

function xDate(opts) {
  this.opts = opts || {};
  this.eles = {}
};
xDate.prototype.weeks = ["一", "二", "三", "四", "五", "六", "日"]
xDate.prototype.dates = ["年", "月", "日"]
xDate.prototype.render = function(opts) {

  this.opts = opts || {};
  var me = this;
  var $selector = _getSelector(opts.selector);
  this.eles.$selector = $selector;
  this.eles.$date = jQuery('<div class="body"></div>');
  this.eles.$text = jQuery('input:first', $selector);
  this.eles.$text.attr('readonly','readonly')
  if (this.opts.value) {
    this.setValue(this.opts.value);
  }
  this.opts.value = this.opts.value || this.getValue();

  this.eles.$date.click(function(event) {
    event.stopPropagation();
  });
  this.eles.$selector.append(this.eles.$date);
  $selector.click(function(event) {

    var isShow = jQuery(this).attr('isShow');
    if (isShow == 'Y') {

      me.hide();
    } else {
      me.show();
    }
    event.stopPropagation();
  })

};
xDate.prototype.show = function() {
  this.eles.$date.show();
  this.renderHeader();
  this.renderContent(this.getValue());
  this.renderFooter();
  this.eles.$selector.attr('isShow', 'Y');
}
xDate.prototype.hide = function() {
  this.eles.$date.empty();
  this.eles.$date.hide();
  this.eles.$selector.attr('isShow', 'N');
}
xDate.prototype.getCurrentDateText = function(value) {
  var date = !value ? new Date() : (typeof value === 'string' ? new Date(value) : value);


  this.opts.currentDate = date;

  var $title = jQuery('<div class="title "></div>');
  var $year = jQuery('<span class=" pt"></span>');
  $year.html(this.getYear(date) + this.dates[0]);
  var $month = jQuery('<span class=" pt"></span>');
  $month.html((this.getMonth(date) + 1) + this.dates[1]);
  var $day = jQuery('<span class="day pt"></span>')
  $day.html(this.getDay(date) + this.dates[2]);
  $title.append($year).append($month).append($day);
  var me = this;
  $year.click(function() {
    me.renderYearContent();
  });

  $month.click(function() {
     me.renderMonthContent();
  })
  $day.click(function()
  {    
      var date=new Date();
      me.opts.currentDate=date;
      me.renderContent(me.opts.currentDate);
      
   })
  return $title;
}
xDate.prototype.renderHeader = function() {

  var me = this;
  var $header = jQuery('<div class="header" ></div>');
  var $left = jQuery('<span class="left pt"></span>');
  var $headerContent = jQuery('<span class="content"></span>');
  this.eles.$headerContent = $headerContent;

  this.opts.currentDate = new Date(this.getValue());
  
  var $right = jQuery('<span class="right pt"></span>');
  $left.click(function() {
    if (me.opts.status == 'month') {
      me.divMonth(1);
    } 
    else if (me.opts.status == 'year') {
       me.divYear(); 
    }
  });
  $right.click(function() {
    if (me.opts.status == 'month') {
      me.addMonth(1);
    }  else if (me.opts.status == 'year') {
        me.addYear();
    }
  });
  $headerContent
  $header.append($left);
  $header.append($headerContent);
  $header.append($right);
  this.eles.$date.append($header)
};
xDate.prototype.setTitle = function() {
  this.eles.$headerContent.empty();
  this.eles.$headerContent.html(this.getCurrentDateText(this.opts.currentDate));
}
xDate.prototype.addYear=function(){

 var div=25;
 var year=this.getYear(this.opts.currentDate);
 year+=div;
 this.opts.currentDate.setFullYear(year);
 this.renderYearContent();
}
xDate.prototype.divYear=function(){
 var div=25;
 var year=this.getYear(this.opts.currentDate);
 year-=div;
 this.opts.currentDate.setFullYear(year);
 this.renderYearContent();
}
xDate.prototype.addMonth = function(value) {
  var year = this.getYear(this.opts.currentDate);
  var month = this.getMonth(this.opts.currentDate);
  var day = this.getDay(this.opts.currentDate);
  if (month == 11) {
    year += 1;
    month = 0;
  } else {
    month += (value || 1);
  }
  var date = new Date(year, (month), 1);
  this.opts.currentDate = date;
  this.renderContent(this.opts.currentDate)
  this.setTitle();
}
xDate.prototype.divMonth = function(value) {
  var year = this.getYear(this.opts.currentDate);
  var month = this.getMonth(this.opts.currentDate);
  var day = this.getDay(this.opts.currentDate);
  if (month == 0) {
    year -= 1;
    month = 11;
  } else {
    month -= (value || 1);
  }
  var date = new Date(year, (month), 1);
  this.opts.currentDate = date;
  this.renderContent(this.opts.currentDate);
  this.setTitle();
}

xDate.prototype.removeAllEles=function(){
 if (this.eles.$content) {
    this.eles.$content.remove();
  };
  if (this.eles.$monthContent) {
    this.eles.$monthContent.remove();
  }
  if (this.eles.$yearContent) {
    this.eles.$yearContent.remove();
  }
}
xDate.prototype.renderYearContent = function()
 {
  this.removeAllEles();
  this.opts.status = 'year';
  var me = this;
  var $yearContent = this.eles.$yearContent;
  if ($yearContent) {
    $yearContent.remove();
  }
  $yearContent = jQuery('<div class="yearContent"></div>');
  var $ul = jQuery('<ul></ul>');
  var currentDate = this.opts.currentDate;

  var year = this.getYear(currentDate);
  for (var i = year - 12; i < year + 13; i++) {
    var li = jQuery('<li></li>');
    li.html(i);
    $ul.append(li);
    if (i == year) {
      li.addClass('active');
    }
    (function(li, i) {
      li.click(function() 
      {
        me.opts.currentDate.setFullYear(i);
        if (me.eles.$monthContent) {
          me.eles.$monthContent.show();
        }
        $yearContent.remove();
        me.renderContent(me.opts.currentDate);
      })
    })(li, i)
  }
  $yearContent.append($ul);
  $yearContent.show();
  this.eles.$yearContent = $yearContent;
  this.eles.$date.append($yearContent);
  if (this.eles.$content) {
    this.eles.$content.hide();
  };
  if (this.eles.$monthContent) {
    this.eles.$monthContent.hide();
  }
  me.setTitle();
}
xDate.prototype.renderMonthContent = function() {
  this.removeAllEles();
   var me = this;
  var $monthContent = this.eles.$monthContent;
  if ($monthContent) {
    $monthContent.remove();
  }
  $monthContent = jQuery('<div class="monthContent"></div>');
  var $ul = jQuery('<ul></ul>');
  var currentDate = this.opts.currentDate;

  var month = this.getMonth(currentDate);
  for (var i = 0; i < 12; i++) {
    var li = jQuery('<li></li>');
    li.html(i+1);
    $ul.append(li);
    if (i == month) {
      li.addClass('active');
    }
    (function(li, i) {
      li.click(function() 
      {
        me.opts.currentDate.setMonth(i);
        $monthContent.remove();
        me.renderContent(me.opts.currentDate);
      })
    })(li, i)
  }
  $monthContent.append($ul);
  $monthContent.show();
  this.eles.$monthContent = $monthContent;
  this.eles.$date.append($monthContent);
  if (this.eles.$content) {
    this.eles.$content.hide();
  };
  if (this.eles.$yearContent) {
    this.eles.$yearContent.hide();
  }
  //me.setTitle();
}
xDate.prototype.renderContent = function(value) {
  this.removeAllEles();
  this.opts.status = 'month';
  var me = this;
  if (this.eles.$content) {
    this.eles.$content.empty();
  }
  var $content = jQuery('<div class="content"></div>');
  this.eles.$content = $content;
  var $ul = jQuery('<ul></ul>');
  var value = (typeof value === 'string' &&  value) ? new Date(value) : (value || new Date());
  this.opts.currentDate=value;
  var week = this.getWeek(value);
  var year = this.getYear(value);
  var month = this.getMonth(value);
  var currentDay = this.getDay(value);
  var dayArray = this.getDayArray(year, month);
  for (var i = 0; i < this.weeks.length; i++) {
    var $li = jQuery('<li></li>');
    $li.html(this.weeks[i]);
    $ul.append($li);
  }
  for (var i = 0; i < dayArray.length; i++) {
    var $li = jQuery('<li></li>');
    var item = dayArray[i];
    var cValue = item.value;
    var li = $li;
    $li.html(item.day);
    $ul.append($li);
    $li.removeClass('currentDay');
    if (item.isCurrentMonth && currentDay == item.day) {
      $li.addClass('currentDay');
    } else if (!item.isCurrentMonth) {
      $li.addClass('isNotCurrentMonth')
    }

    (function(cValue, li) {
      li.click(function(event) {
        me.setValue(cValue);
        me.hide();
        me.opts.currentDate = value;
      })

    })(cValue, li)

  }

  $content.append($ul);
  this.eles.$date.append($content);
  this.setTitle();
};
xDate.prototype.renderFooter = function() 
{

}

xDate.prototype.formatDate = function(value) {

  return this.getYear(value) + "-" + (this.getMonth(value) + 1) + "-" + this.getDay(value);
}
xDate.prototype.renderYear = function() {

};
xDate.prototype.getDayArray = function(year, month) {
  var date = new Date(year, month, 1);
  var week = this.getWeek(date);
  var preMaxDay = this.getMaxDays(month==0 ? (year-1) : year, (month==0 ? 11 : month - 1));
  var days = []
  for (var i = preMaxDay+1+ (week == 0 ? (-6) : (1 - week)); i < (preMaxDay+1); i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      value: (month ==0 ?(year-1) :year) + '-' + ( month ==0 ? 12: month) + '-' + i
    });
  }
  var thisMax = this.getMaxDays(year, month);
  for (var i = 1; i <= thisMax; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      value: year + '-' + (month + 1) + '-' + i
    });
  }

  for (var i = 1; i < 32; i++) {
    if (days.length % 7 == 0) {
      break;
    }
    days.push({
      day: i,
      isCurrentMonth: false,
      value: ((month + 2) ==13 ?( year+1 ) :year) + '-' + ((month + 2)==13 ? 1 :(month + 2)) + '-' + i
    });
  }

  return days;

}
xDate.prototype.renderMonth = function() {

}
xDate.prototype.renderDay = function() {

}
xDate.prototype.setValue = function(value) {

  return this.eles.$text.val(value);
  this.opts.value = value;
}
xDate.prototype.getValue = function() {

  return this.eles.$text.val();
}
xDate.prototype.getMaxDays = function(year, month)
{
  return new Date(year, (month+1) , 0).getDate()
}

xDate.prototype.getWeek = function(date) {

  return date.getDay();
}

xDate.prototype.getMonth = function(date) {
  return date.getMonth();
}
xDate.prototype.getYear = function(date) {
  return date.getFullYear();
}
xDate.prototype.getDay = function(date) {
  return date.getDate();
}

if(typeof window.xUi == 'undefined' )
{
   window.xUi={};
} 

window.xUi.date=(function(){
       var controls=[];
       var members={
             get: function(selector)
      {
      if (typeof selector === "number") {
        return controls[selector];
      } else if (typeof selector === 'string') {
        selector = jQuery(selector);
      } else {
        for (var i = 0; i < controls.length; i++) {
          var item = controls[i];
          if (item.opts.selector &&
            jQuery(item.opts.selector)[0] == jQuery(selector)[0]) {
            return item;
          }
        }
      }
      return null;
     },
     render:function(selector, opts) {

       if (!selector) {
         selector = '.date';
       }
       if (!opts) {
         opts = {};
       }
       
       var me=this;
       jQuery(selector).each(function(item) 
       {
        var $selector = jQuery(this);
        var newOpts={};
        for (var item in opts){
           newOpts.item=opts[item];
        }
         newOpts.onSelect=$selector.attr('onSelect');
         newOpts.selector = $selector;
         var control = new xDate(newOpts);
         controls.push(control);
         control.render(newOpts);
       })
             }
       }

       return members;

})()


var xForm = (function(window) {

  var members = {
    date:null,
    select:null,
    combo:null,
    autocomplete:null,
    checkbox:null,
    radio:null
    ,
    init:function(){
          this.initUI('date');
          this.initUI('select');
          this.initUI('combo');
          this.initUI('autocomplete');
          this.initUI('checkbox');
          this.initUI('radio');
          this.initUI('month');
          this.initUI('year');
    },
    initUI:function(type){
       this[type] = (typeof xUi !='undefined' &&  typeof xUi[type] != 'undefined')  ?  xUi[type] : {render:function(){}};

       if(this[type].render){
         this[type].render();
       }
    },
    initControl:function(){
        
    },
    render: function() {
      this.init();
      this.initControl();
    }
  }


  return members;

})(window)


jQuery(function() 
{
  xForm.render();
})
var _getSelector = function(selector) {

  if (typeof selector === 'string') {
    return jQuery(selector);
  }
  return selector;
}

function xMonth(opts) {
  this.opts = opts || {};
  this.eles = {}
};
xMonth.prototype.dates = ["年", "月", "日"]
xMonth.prototype.render = function(opts) {

  this.opts = opts || {};
  var me = this;
  var $selector = _getSelector(opts.selector);
  this.eles.$selector = $selector;
  this.eles.$date = jQuery('<div class="body"></div>');
  
  var $texts=jQuery('input',$selector);
  var $year ,$month ;
  if($texts.size()>1){
         $texts =jQuery('<input type="text" />');
         $year = jQuery('[dateType=year]',$selector) ||  jQuery($texts)[0];
         $month = jQuery('[dateType=month]',$selector)||  jQuery($texts)[1];
         $year.attr('type','hidden');
         $month.attr('type','hidden');
  }else{
      $year = jQuery('<input type="hidden" />');
      $month = jQuery('<input type="hidden" />');
  }
  this.eles.$text = jQuery('input:first', $selector);

  this.eles.$text.attr('readonly','readonly')
  if (this.opts.value) {
    this.setValue(this.opts.value);
  }
  this.opts.value = this.opts.value || this.getValue();

  this.eles.$date.click(function(event) {
    event.stopPropagation();
  });
  this.eles.$selector.append(this.eles.$date);
  $selector.click(function(event) {

    var isShow = jQuery(this).attr('isShow');
    if (isShow == 'Y') {

      me.hide();
    } else {
      me.show();
    }
    event.stopPropagation();
  })

};
xMonth.prototype.show = function() {
  this.eles.$date.show();

  if(!this.opts.isOnly){ this.renderHeader();}
  this.renderContent(this.getValue());
  this.renderFooter();
  this.eles.$selector.attr('isShow', 'Y');
}
xMonth.prototype.hide = function() {
  this.eles.$date.empty();
  this.eles.$date.hide();
  this.eles.$selector.attr('isShow', 'N');
}
xMonth.prototype.getCurrentDateText = function(value) {
  var date = !value ? new Date() : (typeof value === 'string' ? new Date(value) : value);


  this.opts.currentDate = date;
  var $title = jQuery('<div class="title "></div>');
  var $year = jQuery('<span class=" pt"></span>');
  $year.html(this.getYear(date) + this.dates[0]);
  var $month = jQuery('<span class=" pt"></span>');
  $month.html((this.getMonth(date) + 1) + this.dates[1]);
  var me = this;
  $year.click(function() {
     me.renderYearContent();
  });

  $month.click(function() 
  {
     me.renderMonthContent();
  })
 $title.append($year);
 $title.append($month);
  return $title;
}
xMonth.prototype.renderHeader = function() {

  var me = this;
  var $header = jQuery('<div class="header" ></div>');
  var $left = jQuery('<span class="left pt"></span>');
  var $headerContent = jQuery('<span class="content"></span>');
  this.eles.$headerContent = $headerContent;

  this.opts.currentDate = new Date(this.getValue());
  
  var $right = jQuery('<span class="right pt"></span>');
  $left.click(function() {
    if (me.opts.status == 'month') {
      me.divMonth(1);
    } 
    else if (me.opts.status == 'year') {
       me.divYear(); 
    }
  });
  $right.click(function() {
    if (me.opts.status == 'month') {
      me.addMonth(1);
    }  else if (me.opts.status == 'year') {
        me.addYear();
    }
  });
  $headerContent
  $header.append($left);
  $header.append($headerContent);
  $header.append($right);
  this.eles.$date.append($header)
};
xMonth.prototype.setTitle = function() {
  if(this.opts.isOnly){
      return ;
  }
  this.eles.$headerContent.empty();
  this.eles.$headerContent.html(this.getCurrentDateText(this.opts.currentDate));
}
xMonth.prototype.addYear=function(){

 var div=25;
 var year=this.getYear(this.opts.currentDate);
 year+=div;
 this.opts.currentDate.setFullYear(year);
 this.renderYearContent();
}
xMonth.prototype.divYear=function(){
 var div=25;
 var year=this.getYear(this.opts.currentDate);
 year-=div;
 this.opts.currentDate.setFullYear(year);
 this.renderYearContent();
}


xMonth.prototype.removeAllEles=function(){

  if (this.eles.$monthContent) {
    this.eles.$monthContent.remove();
  }
  if (this.eles.$yearContent) {
    this.eles.$yearContent.remove();
  }
}
xMonth.prototype.renderYearContent = function()
 {
  this.removeAllEles();
  this.opts.status = 'year';
  var me = this;
  var $yearContent = this.eles.$yearContent;
  if ($yearContent) {
    $yearContent.remove();
  }
  $yearContent = jQuery('<div class="yearContent"></div>');
  var $ul = jQuery('<ul></ul>');
  var currentDate = this.opts.currentDate;

  var year = this.getYear(currentDate);
  for (var i = year - 12; i < year + 13; i++) {
    var li = jQuery('<li></li>');
    li.html(i);
    $ul.append(li);
    if (i == year) {
      li.addClass('active');
    }
    (function(li, i) {
      li.click(function() 
      {
        me.opts.currentDate.setFullYear(i);
        if (me.eles.$monthContent) {
          me.eles.$monthContent.show();
        }
        $yearContent.remove();
        me.renderContent(me.opts.currentDate);
      })
    })(li, i)
  }
  $yearContent.append($ul);
  $yearContent.show();
  this.eles.$yearContent = $yearContent;
  this.eles.$date.append($yearContent);
  if (this.eles.$content) {
    this.eles.$content.hide();
  };
  if (this.eles.$monthContent) {
    this.eles.$monthContent.hide();
  }
  me.setTitle();
}
xMonth.prototype.renderMonthContent = function() {
  this.removeAllEles();
   var me = this;
  var $monthContent = this.eles.$monthContent;
  if ($monthContent) {
    $monthContent.remove();
  }
  $monthContent = jQuery('<div class="monthContent"></div>');
  var $ul = jQuery('<ul></ul>');
  var currentDate = this.opts.currentDate;

  var month = this.getMonth(currentDate);
  for (var i = 0; i < 12; i++) {
    var li = jQuery('<li></li>');
    li.html(i+1);
    $ul.append(li);
    if (i == month) {
      li.addClass('active');
    }
    (function(li, i) {
      li.click(function() 
      {
        me.opts.currentDate.setMonth(i);
        me.setTitle();
        li.siblings().removeClass('active');
        li.addClass('active');
        var _value = me.opts.isOnly ? me.getMonth(me.opts.currentDate)+1 :me.formatDate(me.opts.currentDate);
        me.setValue(_value);
        me.hide();
      })
    })(li, i)
  }
  $monthContent.append($ul);
  $monthContent.show();
  this.eles.$monthContent = $monthContent;
  this.eles.$date.append($monthContent);
  if (this.eles.$content) {
    this.eles.$content.hide();
  };
  if (this.eles.$yearContent) {
    this.eles.$yearContent.hide();
  }
  //me.setTitle();
}
xMonth.prototype.renderContent = function(value) {
  this.removeAllEles();
  this.opts.status = 'year';
  var me = this;


   var value = (typeof value === 'string' &&  value) ? new Date(value) : (value || new Date());
   this.opts.currentDate=value;
    this.renderMonthContent();
  this.setTitle();
};
xMonth.prototype.renderFooter = function() 
{

}

xMonth.prototype.formatDate = function(value) {

  return this.getYear(value) + "-" + (this.getMonth(value) + 1) ;
}


xMonth.prototype.setValue = function(value) {

  return this.eles.$text.val(value);
  this.opts.value = value;
}
xMonth.prototype.getValue = function() {

  return this.eles.$text.val();
}



xMonth.prototype.getMonth = function(date) {
  return date.getMonth();
}
xMonth.prototype.getYear = function(date) {
  return date.getFullYear();
}


if(typeof window.xUi == 'undefined' )
{
   window.xUi={};
} 

window.xUi.month=(function(){
       var controls=[];
       var members={
             get: function(selector)
      {
      if (typeof selector === "number") {
        return controls[selector];
      } else if (typeof selector === 'string') {
        selector = jQuery(selector);
      } else {
        for (var i = 0; i < controls.length; i++) {
          var item = controls[i];
          if (item.opts.selector &&
            jQuery(item.opts.selector)[0] == jQuery(selector)[0]) {
            return item;
          }
        }
      }
      return null;
     },
     render:function(selector, opts) {

       if (!selector) {
         selector = '.month';
       }
       if (!opts) {
         opts = {};
       }
       
       var me=this;
       jQuery(selector).each(function(item) 
       {
        var $selector = jQuery(this);
        var newOpts={};
        for (var item in opts){
           newOpts.item=opts[item];
        }
         newOpts.onSelect=$selector.attr('onSelect');
         newOpts.isOnly=$selector.attr('isOnly');
         newOpts.selector = $selector;
         var control = new xMonth(newOpts);
         controls.push(control);
         control.render(newOpts);
       })
             }
       }

       return members;

})()



function xPupSelect(opts) {

	this.opts={};
	if(opts){
		this.opts=opts;
	}
	// body...
}
xPupSelect.prototype.render = function(opts) 
{

	var tField=opts.tField;
	var vField=opts.vField;

	
};
xPupSelect.prototype.getValue=function(){

}
xPupSelect.prototype.setValue=function(value){


}
xPupSelect.prototype.renderItem=function(item){

}
xPupSelect.prototype.onItemClick=function(){

}
xPupSelect.prototype.loadData=function(){

}
xPupSelect.prototype.refresh=function(onFilter)
{
  
}


function xRadio(opts) {

	this.opts=opts || {};
    this.eles = {}
}
xRadio.prototype.render = function(opts) 
{

var me=this;
  this.opts=opts || this.opts;
   var $selector=opts.selector;
   this.eles.$selector=$selector;
   this.eles.$radio=jQuery('>label>input[type=radio]',$selector);
   this.eles.$label=jQuery('>label:first',$selector);
   this.opts.isChceked=this.eles.$radio.is(':checked');
   this.eles.$radio.click(function(event)
   {  
        
        me.setValue();
        event.stopPropagation();
    });
   this.setValue();

      
};
xRadio.prototype.getValue=function()
{
  return  this.eles.$radio.is(':checked');
}
xRadio.prototype.setValue=function(value)
{


  if(value){
  this.eles.$radio.each(function()
  {
      var _value=jQuery(this).val();
      jQuery(this).prop('checked',false);
      jQuery(this).parent().removeClass('checked');
     if(value==_value){
       jQuery(this).prop('checked',true);
       jQuery(this).parent().addClass('checked');
     }
  })
}else
{
  value=[];
    this.eles.$radio.each(function()
  {
      var _isChceked=jQuery(this).is(':checked');
      jQuery(this).prop('checked',false);
      jQuery(this).parent().removeClass('checked');
     if(_isChceked){
      var _value=jQuery(this).val();
       jQuery(this).prop('checked',true);
       value.push(_value)
       jQuery(this).parent().addClass('checked');
     }
  })
    value=value.join(',');
}
  if(console && console.log){
    console.log('xform radio value:'+value)
  }
 this.onSelect(value);
}
xRadio.prototype.onSelect=function(item){
 var onSelect = this.opts.onSelect;
   if(typeof this.opts.onSelect =='function'){
     this.opts.onSelect.call(this,me.getValue());
   }
   else if (onSelect) {
     eval(onSelect + '.call(this,this.getValue())');
   }
}


if(typeof window.xUi == 'undefined' )
{
   window.xUi={};
} 

window.xUi.radio=(function(){
       var controls=[];
       var members={
               get: function(selector)
      {
      if (typeof selector === "number") {
        return controls[selector];
      } else if (typeof selector === 'string') {
        selector = jQuery(selector);
      } else {
        for (var i = 0; i < controls.length; i++) {
          var item = controls[i];
          if (item.opts.selector &&
            jQuery(item.opts.selector)[0] == jQuery(selector)[0]) {
            return item;
          }
        }
      }
      return null;
     },
             render:function(selector, opts) {

       if (!selector) {
         selector = '.radio';
       }
       if (!opts) {
         opts = {};
       }
       
       var me=this;
       jQuery(selector).each(function(item) 
       {
        var $selector = jQuery(this);
        var newOpts={};
        for (var item in opts){
           newOpts.item=opts[item];
        }
         newOpts.onSelect=$selector.attr('onSelect');
         newOpts.selector = $selector;
         var control = new xRadio(newOpts);
         controls.push(control);
         control.render(newOpts);
       })
             }
       }

       return members;

})()

 function xSelect(opts) {
   this.opts = opts || {}
   this.eles = {
     $selector: null,
     $ul: null
   };
 }
 xSelect.prototype.hide = function() {
   this.onHide();
   this.eles.$ul.hide();
 }
 xSelect.prototype.show = function() {
   this.parentFilter();
   this.onShow();
  
   this.eles.$ul.show();
 }
 xSelect.prototype.render = function(opts) {

   var me = this;
   var selector = opts.selector;
   var onShow = opts.onShow || function() {};
   var onHide = opts.onHide || function() {}
   this.opts = opts;


   var $seletor = selector;
   var $ul = jQuery('>ul', $seletor);
   this.eles.$ul = $ul;
   this.eles.$selector = $seletor;
   var $li = jQuery('>li', $ul);
   var $text = jQuery('>input', $seletor);
   var rendered = $seletor.attr('rendered');
   if (rendered == 'Y') {
     return;
   }

    this.eles.$text=$text;
   var $hValue = jQuery('<input type="hidden" />');
  this.eles.$hValue=$hValue;
   var name = $text.attr('name');
   if (name) {
     $hValue.attr('name', name);
     $text.attr('name', name + 'Desc');
   }
   $seletor.append($hValue);

   $ul.css('top', $seletor.height() + 2 + 'px');
   var value = $text.val() || $seletor.attr('value');
   $seletor.attr('rendered', 'Y');
   if (value == undefined || value == '') {
     var $selectedItem = jQuery('>li[isSelected=Y]', $ul);
     if ($selectedItem.size() > 0) {
       var selectItemvalue = $selectedItem.attr('value') == 0 ? $selectedItem.text() : $selectedItem.attr('value');
       if ($selectedItem.attr('value') != selectItemvalue) {
         $selectedItem.attr('value', selectItemvalue);
       }
       value = selectItemvalue;
     }
   }

   me.setValue(value, true)
   $seletor.on('click', function(event) {

     var isVisible = $ul.is(':visible');
     if (isVisible) {
       me.hide();
     } else {
       me.show();
     }
     event.stopPropagation();
   });


   $li.on('click', function(event) {


     var value = jQuery(this).attr('value') == 0 ? jQuery(this).text() : jQuery(this).attr('value');
     var textValue = me.getValue();
     if (textValue == value) {
       return;
     }
     if (jQuery(this).attr('value') != value) {
       jQuery(this).attr('value', value);
     }
     me.setValue(value);
     me.hide();


     event.stopPropagation();
   })


 }
 xSelect.prototype.refresh = function() {

 }
 xSelect.prototype.filter = function() {

 }
 xSelect.prototype.setSubValue = function()
{
    if(this.opts.subSelect){


      this.opts.subSelect.setValue('');
    }
}
 xSelect.prototype.parentFilter = function() {
      if(this.opts.parentSelect)
      {
           var value= this.opts.parentSelect.getValue();
           jQuery('>li',this.eles.$ul).hide();
           jQuery('>li['+this.opts.pField+'='+value+']',this.eles.$ul).show();
      }
 }
 xSelect.prototype.getValue = function() {
  
    return this.eles.$hValue.val();
 }

  xSelect.prototype.getText = function() {
  
    return this.eles.$text.val();
 }
 xSelect.prototype.onShow = function() {

   var onShow = this.opts.onShow;
   if (onShow) {
     eval(onShow + '.call(this)');
   }
 }
 xSelect.prototype.onHide = function() {

   var onHide = this.opts.onHide;
   if (onHide) {
     eval(onHide + '.call(this)');
   }
 }
 xSelect.prototype.setValue = function(value) {

   var $seletor = this.eles.$selector;
   var me = this;
   var $ul = jQuery('>ul', $seletor);
   var $li = jQuery('>li', $ul);
   var $text = jQuery('>input:first', $seletor);
   var $hide = jQuery('>input[type=hidden]', $seletor)
   var text = jQuery('>li[value=' + value + ']', $ul).text();
   if (text) {
     $text.val(text);
     $hide.val(value);
   }else{
     $text.val(value);
     $hide.val(value);
   }
   this.onSelect();

   this.setSubValue();
 }

 xSelect.prototype.onSelect = function() {
   var onSelect = this.opts.onSelect;
   if(typeof this.opts.onSelect =='function'){
     this.opts.onSelect.call(this,me.getValue(),me.getText());
   }
   else if (onSelect) {
     eval(onSelect + '.call(this,this.getValue(),this.getText())');
   }
 }
 xSelect.prototype.onItemClick = function() {

    
 }

if(typeof window.xUi == 'undefined' )
{
   window.xUi={};
} 

window.xUi.select = (function(window) {

   var selects = [];
   var members = {
     get: function(selector)
      {
      if (typeof selector === "number") {
        return selects[selector];
      } else if (typeof selector === 'string') {
        selector = jQuery(selector);
      } else {
        for (var i = 0; i < selects.length; i++) {
          var item = selects[i];
          if (item.opts.selector &&
            jQuery(item.opts.selector)[0] == jQuery(selector)[0]) {
            return item;
          }
        }
      }
      return null;
     },
     getSubSelect:function(selector)
     {
        $subNode = jQuery('.select[pId=' + selector.attr('id') + ']');
        return this.get($subNode);
     },
     getParentSelect:function(selector){
        $parentNode = jQuery('.select[id=' +selector.attr('pId') + ']');
        var parentSelect= this.get($parentNode);
        if(parentSelect){
           parentSelect.opts.subSelect=this.get(selector);
        }
        return parentSelect;
     },
     render: function(selector, opts) {

       if (!selector) {
         selector = '.select';
       }
       if (!opts) {
         opts = {};
       }
       
       var me=this;
       jQuery(selector).each(function(item) 
       {
        var $selector = jQuery(this);
        var newOpts={};
         newOpts.pField=$selector.attr('pField');
         newOpts.onShow=$selector.attr('onShow');
         newOpts.onHide=$selector.attr('onHide');
         newOpts.onSelect=$selector.attr('onSelect');
         newOpts.selector = $selector;
         for (var item in opts){
           newOpts.item=opts[item];
        }
         var xselect = new xSelect(newOpts);
         selects.push(xselect);
         xselect.render(newOpts);
         newOpts.subSelect=me.getSubSelect($selector);
         newOpts.parentSelect=me.getParentSelect($selector);
         
       })
     }

   };
   return members;
 })(window);
var xFormUtils=(function(){

	var members={

		call:function(){

		},
		getSelector:function(selector){

			
		}
	}
	return members;
})()
var _getSelector = function(selector) {

  if (typeof selector === 'string') {
    return jQuery(selector);
  }
  return selector;
}

function xYear(opts) {
  this.opts = opts || {};
  this.eles = {}
};
xYear.prototype.dates = ["年", "月", "日"]
xYear.prototype.render = function(opts) {

  this.opts = opts || {};
  var me = this;
  var $selector = _getSelector(opts.selector);
  this.eles.$selector = $selector;
  this.eles.$date = jQuery('<div class="body"></div>');
  
  var $texts=jQuery('input',$selector);
  var $year ,$month ;
  if($texts.size()>1){
         $texts =jQuery('<input type="text" />');
         $year = jQuery('[dateType=year]',$selector) ||  jQuery($texts)[0];
         $month = jQuery('[dateType=month]',$selector)||  jQuery($texts)[1];
         $year.attr('type','hidden');
         $month.attr('type','hidden');
  }else{
      $year = jQuery('<input type="hidden" />');
      $month = jQuery('<input type="hidden" />');
  }
  this.eles.$text = jQuery('input:first', $selector);

  this.eles.$text.attr('readonly','readonly')
  if (this.opts.value) {
    this.setValue(this.opts.value);
  }
  this.opts.value = this.opts.value || this.getValue();

  this.eles.$date.click(function(event) {
    event.stopPropagation();
  });
  this.eles.$selector.append(this.eles.$date);
  $selector.click(function(event) {

    var isShow = jQuery(this).attr('isShow');
    if (isShow == 'Y') {

      me.hide();
    } else {
      me.show();
    }
    event.stopPropagation();
  })

};
xYear.prototype.show = function() {
  this.eles.$date.show();

  if(!this.opts.isOnly){ this.renderHeader();}
  this.renderContent(this.getValue());
  this.renderFooter();
  this.eles.$selector.attr('isShow', 'Y');
}
xYear.prototype.hide = function() {
  this.eles.$date.empty();
  this.eles.$date.hide();
  this.eles.$selector.attr('isShow', 'N');
}
xYear.prototype.getCurrentDateText = function(value) {
  var date = !value ? new Date() : (typeof value === 'string' ? new Date(value) : value);


  this.opts.currentDate = date;
  var $title = jQuery('<div class="title "></div>');
  var $year = jQuery('<span class=" pt"></span>');
  $year.html(this.getYear(date) + this.dates[0]);
  var $month = jQuery('<span class="month pt"></span>');
  $month.html((this.getMonth(date) + 1) + this.dates[1]);
  var me = this;
  $year.click(function() 
  { 
     me.opts.currentDate=new Date();
     me.renderYearContent();
  });
 $title.append($year);

  return $title;
}
xYear.prototype.renderHeader = function() {

  var me = this;
  var $header = jQuery('<div class="header" ></div>');
  var $left = jQuery('<span class="left pt"></span>');
  var $headerContent = jQuery('<span class="content"></span>');
  this.eles.$headerContent = $headerContent;

  this.opts.currentDate = new Date(this.getValue());
  
  var $right = jQuery('<span class="right pt"></span>');
  $left.click(function() {
    if (me.opts.status == 'month') {
      me.divMonth(1);
    } 
    else if (me.opts.status == 'year') {
       me.divYear(); 
    }
  });
  $right.click(function() {
    if (me.opts.status == 'month') {
      me.addMonth(1);
    }  else if (me.opts.status == 'year') {
        me.addYear();
    }
  });
  $headerContent
  $header.append($left);
  $header.append($headerContent);
  $header.append($right);
  this.eles.$date.append($header)
};
xYear.prototype.setTitle = function() {
  if(this.opts.isOnly){
      return ;
  }
  this.eles.$headerContent.empty();
  this.eles.$headerContent.html(this.getCurrentDateText(this.opts.currentDate));
}
xYear.prototype.addYear=function(){

 var div=25;
 var year=this.getYear(this.opts.currentDate);
 year+=div;
 this.opts.currentDate.setFullYear(year);
 this.renderYearContent();
}
xYear.prototype.divYear=function(){
 var div=25;
 var year=this.getYear(this.opts.currentDate);
 year-=div;
 this.opts.currentDate.setFullYear(year);
 this.renderYearContent();
}


xYear.prototype.removeAllEles=function(){

  if (this.eles.$monthContent) {
    this.eles.$monthContent.remove();
  }
  if (this.eles.$yearContent) {
    this.eles.$yearContent.remove();
  }
}
xYear.prototype.renderYearContent = function()
 {
  this.removeAllEles();
  this.opts.status = 'year';
  var me = this;
  var $yearContent = this.eles.$yearContent;
  if ($yearContent) {
    $yearContent.remove();
  }
  $yearContent = jQuery('<div class="yearContent"></div>');
  var $ul = jQuery('<ul></ul>');
  var currentDate = this.opts.currentDate;

  var year = this.getYear(currentDate);
  for (var i = year - 12; i < year + 13; i++) {
    var li = jQuery('<li></li>');
    li.html(i);
    $ul.append(li);
    if (i == year) {
      li.addClass('active');
    }
    (function(li, i) {
      li.click(function() 
      {
        me.opts.currentDate.setFullYear(i);
        me.setValue(me.getYear( me.opts.currentDate));
        me.hide();
      })
    })(li, i)
  }
  $yearContent.append($ul);
  $yearContent.show();
  this.eles.$yearContent = $yearContent;
  this.eles.$date.append($yearContent);
  if (this.eles.$content) {
    this.eles.$content.hide();
  };
  if (this.eles.$monthContent) {
    this.eles.$monthContent.hide();
  }
  me.setTitle();
}

xYear.prototype.renderContent = function(value) {
  this.removeAllEles();
  this.opts.status = 'year';
  var me = this;
  var value = (typeof value === 'string' &&  value) ? new Date(value) : (value || new Date());
  this.opts.currentDate=value;
  this.renderYearContent();
  this.setTitle();
};

xYear.prototype.formatDate = function(value) {

  return this.getYear(value) + "-" + (this.getMonth(value) + 1) ;
}


xYear.prototype.setValue = function(value) {

  return this.eles.$text.val(value);
  this.opts.value = value;
}
xYear.prototype.getValue = function() {

  return this.eles.$text.val();
}



xYear.prototype.getMonth = function(date) {
  return date.getMonth();
}
xYear.prototype.getYear = function(date) {
  return date.getFullYear();
}


if(typeof window.xUi == 'undefined' )
{
   window.xUi={};
} 

window.xUi.year=(function(){
       var controls=[];
       var members={
             get: function(selector)
      {
      if (typeof selector === "number") {
        return controls[selector];
      } else if (typeof selector === 'string') {
        selector = jQuery(selector);
      } else {
        for (var i = 0; i < controls.length; i++) {
          var item = controls[i];
          if (item.opts.selector &&
            jQuery(item.opts.selector)[0] == jQuery(selector)[0]) {
            return item;
          }
        }
      }
      return null;
     },
     render:function(selector, opts) {

       if (!selector) {
         selector = '.year';
       }
       if (!opts) {
         opts = {};
       }
       
       var me=this;
       jQuery(selector).each(function(item) 
       {
        var $selector = jQuery(this);
        var newOpts={};
        for (var item in opts){
           newOpts.item=opts[item];
        }
         newOpts.onSelect=$selector.attr('onSelect');
         newOpts.isOnly=$selector.attr('isOnly');
         newOpts.selector = $selector;
         var control = new xYear(newOpts);
         controls.push(control);
         control.render(newOpts);
       })
             }
       }

       return members;

})()

