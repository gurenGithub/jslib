
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



var autocomplete = (function(window) {

   var controls = [];
   var members = {
     getAutocomple: function(selector) {
        for (var i = 0; i < selects.length; i++) {
        var item = selects[i];
        if (item.opts.selector.attr('id') &&
          selector.attr('id') &&
          item.opts.selector.attr('id') == selector.attr('id')) {
          return item;
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
function xCombo(argument) {
	this.opts = {}
	this.eles = {}
	this.selectedItems = [];
	this.isFirstTime=true;
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
		event.stopPropagation();
	});

	this.eles.$text.keyup(function(event) {

		var _text = jQuery(this).val();
		me.selectedItems=[];
		me.clearValue();
		me.renderItems(me.opts.data, function(item,text)
		{
			return me.getParentFilterExpress(item) && text.indexOf(_text) > -1;
		})
	});

	this.eles.$ul.hover(function(){},function(){me.hide()})
	

	if(this.opts.onLoadData)
	{

		this.eles.$ul.append('<li>数据加载中...</li>');
		eval(this.opts.onLoadData+'.call(this)')
	}else{
	   this.setValue(value);
	   this.renderItems(opts.data);	
	}
}

xCombo.prototype.onFilter = function(text) {
	return true;
}

xCombo.prototype.isMultiSelect=function(){


	return this.opts.isMultiSelect == 'Y';
				
}

xCombo.prototype.getData=function(){

	return [];
}
xCombo.prototype.refresh=function(data){
	 this.opts.data=data;
	 this.eles.$ul.append('<li>数据加载中...</li>');
	 this.setValue(this.getValue());
	 this.renderItems(data);
	 
}

xCombo.prototype.renderItems = function(data, onFilter) {

    if(!data || data.length==0){return;}
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
			if (onFilter && onFilter(item,text) == false) {
				return;
			}
			var $li = jQuery('<li></li>');
			if (me.opts.renderItem) {
				$li.append(me.opts.renderItem(item,text))
			}
            if(me.isMultiSelect()){
            	$li.addClass('item');
            }
			$li.html(text);
			$li.attr('value', value);
			$li.attr(me.opts.pField, parent);
			$li.click(function(event) {

                
				if(value==me.getValue()){
					return;
				}
				if (me.opts.isMultiSelect == 'Y') 
				{

					var hasActive= $li.hasClass('active');
					 if(hasActive){
					 	me.removeItem(item);
					 	$li.removeClass('active');

					 }else{
					 	me.addItem(item);
					 	  $li.addClass('active');
					 }
                   
				} else {
					me.hide();
					me.selectedItems=[];
					$li.siblings().removeClass('active');
                    $li.addClass('active');
					me.setValue(value, text);
				}
				event.stopPropagation();
			})
            if(jQuery.inArray(item,me.selectedItems)>-1){
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


     this.eles.$selector.attr('isValid',this.selectedItems.length>0?'Y':'N')
	this.eles.$ul.hide();
}
xCombo.prototype.getValue = function() {
    return this.eles.$hValue.val()
}
xCombo.prototype.addItem=function(item){
	this.selectedItems.push(item);
	this.renderValue()
}
xCombo.prototype.removeItem=function(item){


	for (var i = 0; i < this.selectedItems.length; i++) {
		 var _item=this.selectedItems[i];
		 if(_item==item){
		 	 	this.selectedItems.splice(i,1);
		 }
	}
	this.renderValue()
}
xCombo.prototype.selectedItems = [];
xCombo.prototype.setValue = function(value, text) {
	var me=this;
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
xCombo.prototype.clearValue=function(){
	this.eles.$hValue.val('');
	 this.setSubCombo();
}
xCombo.prototype.renderValue=function(){

var me=this;
	var texts=[],values=[];

	for (var i = 0; i < this.selectedItems.length; i++) {
			var item = this.selectedItems[i];
			var _value,_text;
			if (typeof item == "string") {
				_text=_value = item;
			} else {
                _text =item[me.opts.tField];
				_value = item[me.opts.vField];
			}

			texts.push(_text);
			values.push(_value);
		}

		this.eles.$text.val(texts.join(','));
		this.eles.$hValue.val(values.join(','));

       if(this.opts.onSelect){
         	this.opts.onSelect.call(this);
       }

      this.setSubCombo();
      
}

xCombo.prototype.getParentFilterExpress=function(item){
	var me=this;
   $parentNode = jQuery('.combo[id=' + this.eles.$selector.attr('pId') + ']');
        if ($parentNode && $parentNode.length > 0) {
           var parentCombo=combo.getCombo($parentNode);
          if (parentCombo) {
          	  var parentValue= parentCombo.getValue();
              var parentNodepField =this.opts.pField;
             	return  parentValue.toString().indexOf(item[parentNodepField])>-1;
             
          }
        }
        return true;
}
xCombo.prototype.FilterForParent=function(){
              var me=this;
  
             this.renderItems(this.opts.data,function(item){
             	return me.getParentFilterExpress(item);
             });
         

}
xCombo.prototype.isFirstTime=true;
xCombo.prototype.setSubCombo=function(){
   
 
 if(this.isFirstTime){
 	this.isFirstTime=false;
 	return;
 }
   var me=this;
   $subNode = jQuery('.combo[pId=' + this.eles.$selector.attr('id') + ']');
        if ($subNode && $subNode.length > 0) {
           var subCombo=combo.getCombo($subNode);
          if (subCombo) {
          	 var parentValue= this.getValue();
              var subNodepField = $subNode.attr('pField');
             subCombo.renderItems(subCombo.opts.data,function(item){
             	return item[subNodepField]==me.getValue();
             });
             subCombo.selectedItems=[];
             subCombo.setValue('');
          }
        }
}
var combo = (function() {

	var combos = [];
	var members = {
        getCombo:function(selector){
        	for (var i = 0; i < combos.length; i++) 
        	{
        		var item=combos[i];
        		if(item.opts.selector.attr('id')&& 
        		 selector.attr('id') && 
        		 item.opts.selector.attr('id')==selector.attr('id')){
        			return item;
        		}
        	}
         return null;
        },
		render: function(selector) {
			if (!selector) {
				$selectors = jQuery('.combo');
			}
        var me=this;
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
					opts.value = $seletor.attr('value')|| jQuery('>input:first',$seletor).val();
					opts.isMultiSelect = $seletor.attr('isMultiSelect');
					var xcombox = new xCombo();

					opts.onSelect = function() 
					{
						var me=this;
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
var xForm = (function(window) {

  var members = {

    select:function(){
       if( typeof select !='undefined'){
        return select;
       }
       return {render:function(){}}
    },
    combo:function(){
       if( typeof combo !='undefined'){
          return combo;
       }
       return {render:function(){}}
    },
    autocomplete:function(){
       if( typeof autocomplete !='undefined'){
          return autocomplete;
       }
       return {render:function(){}}
    },
    render: function() {

      this.select().render();
      this.combo().render();
      this.autocomplete().render();
    }
  }


  return members;

})(window)


jQuery(function() 
{
  xForm.render();
})

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


 var select = (function(window) {

   var selects = [];
   var members = {
     getSelect: function(selector) {
        for (var i = 0; i < selects.length; i++) {
        var item = selects[i];
        if (item.opts.selector.attr('id') &&
          selector.attr('id') &&
          item.opts.selector.attr('id') == selector.attr('id')) {
          return item;
        }
      }
      return null;
     },
     getSubSelect:function(selector)
     {
        $subNode = jQuery('.select[pId=' + selector.attr('id') + ']');
        return this.getSelect($subNode);
     },
     getParentSelect:function(selector){
        $parentNode = jQuery('.select[id=' +selector.attr('pId') + ']');
        var parentSelect= this.getSelect($parentNode);
        if(parentSelect){
           parentSelect.opts.subSelect=this.getSelect(selector);
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
        for (var item in opts){
           newOpts.item=opts[item];
        }
         newOpts.pField=$selector.attr('pField');
         newOpts.onShow=$selector.attr('onShow');
         newOpts.onHide=$selector.attr('onHide');
         newOpts.onSelect=$selector.attr('onSelect');
         newOpts.selector = $selector;
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