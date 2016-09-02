
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
            		 		var $header=xUtils.getElementByClass($item,'header');
            		 		var $content=xUtils.getElementByClass($item,'content');
            		 		xUtils.addEvent($header,'click',function(e){
                                  var display=$content.style.display;
                                  $content.style.display =display!='none'?'none':'block';
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