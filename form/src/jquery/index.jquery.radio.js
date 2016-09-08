
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



var radio=(function(){
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
