var xModal=(function(argument) {
	

	 function closeClick(source,modal){
	 	if(!source || !modal){
	 		return;
	 	}
	 	xUtils.addEvent(source,'click',function(e){
							if(modal!=null){
								modal.style.display='none';
								xUtils.cancelBubble(e);
							}
						})
	 }
	var methods={
        show:function(selectorId){


        	var $modal= document.getElementById(selectorId);
        	$modal.style.display='block';
        },
        hide:function(selectorId){
            var $modal= document.getElementById(selectorId);
        	$modal.style.display='none';
        },
        toggle:function(selectorId)
        {

        	var $modal= document.getElementById(selectorId);
        	if($modal){

        		var display = $modal.style.display;
                $modal.style.display =display != 'none' ? 'none':'block';
        	}
        },
		render:function(){

			var xmodals= document.getElementsByClassName('xModal');

			for (var i = 0; i < xmodals.length; i++) {
				
				

				(function(i)
				{
					var $modal=xmodals[i];
					var $close=xUtils.getElementByClass($modal,'close');
					var $bg=xUtils.getElementByClass($modal,'bg');
					var $content=xUtils.getElementByClass($modal,'content');
					if(!$close){
						$close=xUtils.getElementByClass($content,'close');
					}
					var $title=xUtils.getElementByClass($content,'title');
                        closeClick($title,$modal);
                        closeClick($bg,$modal);
                        closeClick($close,$modal);
				
				})(i)
			}
		}
	}
	return methods;
})()




  

xUtils.addEvent(window,'load',function(){

   xModal.render()
})