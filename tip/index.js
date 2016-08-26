var xTip=(function(argument) {
	
	var methods={

		render:function(tip){
               
                 
			  var tips = document.getElementsByClassName('xTip');

             for (var k = 0; k < tips.length; k++)
              {
              	 

              	 
                 (function(k) 
                 {
                 	var tip=tips[k]
                 	  var $tip=tip;
                      var $content=xUtils.getElementByClass($tip,'content');
                    

                    xUtils.addEvent($tip,'mouseover',function(e){
                     
                       $content.style.display='block';
                      var $left=xUtils.getElementByClass($tip,'left');
                      var $right=xUtils.getElementByClass($tip,'right');
                      var $bottom =xUtils.getElementByClass($tip,'bottom');
                      var $top=xUtils.getElementByClass($tip,'top');
                      var offsetWidth=$tip.offsetWidth;
                      var offsetHeight=$tip.offsetHeight;
                      var contentOffsetWidth=$content.offsetWidth;
                        var contentOffsetHeight=$content.offsetHeight;
                      if($left!=null){
                     
                        $content.style.left=1+offsetWidth+'px';
                        // $content.style.top=(0-offsetHeight)+'px';
                    }

                    if($right!=null){
                    	$content.style.right=(offsetWidth)+'px';
                     }
                        if($top!=null){
                        	$content.style.left=(0-contentOffsetHeight/2-10)+'px';
                    	$content.style.top=(0-(offsetHeight+contentOffsetHeight/2))+'px';
                     }

                        if($bottom!=null){
                        $content.style.left=(0-contentOffsetHeight/2-10)+'px';
                    	$content.style.top=(0+(offsetHeight))+'px';
                     }
                     	xUtils.cancelBubble(e);
                    })



                    xUtils.addEvent($tip,'mouseout',function(e){
                    	  $content.style.display='none';
                    	xUtils.cancelBubble(e);
                    })
                 })(k)
             }
		}
	};

	return methods;

})()


xUtils.addEvent(window,'load',function(){

   xTip.render()
})