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