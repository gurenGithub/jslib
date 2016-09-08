
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



var checkbox=(function(){
       var controls=[];
       var members={
             getCheckbox:function(selector){

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
