
var xAccordion=(function() {
	

	var members={

		render:function(){
            var accordions=document.getElementsByClassName('xAccordion');
            for (var i = 0; i < accordions.length; i++) {
            	(function(i){
            		var $accordion=accordions[i];

            		var $items = xUtils.getElementsByClass($accordion,'item') //.getElementsByClassName('item');

            		 for (var k = 0; k < $items.length; k++) {
            		 	
            		 	(function(k){

            		 		var $item=$items[k];

            		 		var _onShow=$item.getAttribute('onShow');
            		 		var _onHide=$item.getAttribute('onHide');
            		 		var $header=xUtils.getElementByClass($item,'header');
            		 		var $content=xUtils.getElementByClass($item,'content');
            		 		xUtils.addEvent($header,'click',function(e){
                                  var display=$content.style.display;
                                  var isHidden=display!='none';
                                  $content.style.display =isHidden ?'none':'block';
                                  if(isHidden ==true & _onHide){
                                     eval(_onHide+'(this)') 
                                  }else if(isHidden==false && _onShow){
                                      eval(_onShow+'(this)') 
                                  }
            		 			  xUtils.cancelBubble(e);
            		 		})
            		 	})(k)
            		 }
            	})(i)
            }   
		}
	};

	return members;

})()

  

xUtils.addEvent(window,'load',function(){

   xAccordion.render()
})