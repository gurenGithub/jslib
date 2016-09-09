
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