



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



 var elem = this.get();
 var func= document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8 –
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};
	func(elem,type,handle);
	return this;
};


window.$$=function(selector,context)
{
  	return xSelector(selector,context);
}