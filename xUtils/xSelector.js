



function xSelector(selector,context){
     
     if(context){
     	 this.selectors= context.querySelectAll(selector);
     }else if(typeof selector =='function' && selector.get){
                return selector.get(0);
     }
      this.selectors= document.querySelectAll(selector);
};
xSelector.prototype.get=function(index){
        if(this.selectors&& this.selectors.length){return new xSelector(this.selectors[0]) }
}
xSelector.prototype.getValue = function() {
	
};
xSelector.prototype.setValue = function() {
	
};
xSelector.prototype.getHtml = function() {
	
};
xSelector.prototype.setHtml=function(html){

}
xSelector.prototype.getHtml=function(){

}
xSelector.prototype.on=function(eventType,func){

}
xSelector.prototype.die=function(type, handle){



 
};


window.$$=function(selector,context)
{
  	return xSelector(selector,context);
}