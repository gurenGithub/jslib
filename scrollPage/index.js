

var xScrollPage=(function(){


	var methods={

		render:function(selectorId,onfun){
           

            if(typeof jQuery !='undefined'){
             $(window).on('scroll.newsScroll', function() {
               
               var $selectorId=jQuery(selectorId)
                if ($(window).scrollTop() + $(window).height() > $selectorId.offset().top) {
                    onfun()
                }
            });
            }else{
           xUtils.addEvent(window,'scroll',function()
           {

               var windowHeight=window.innerHeight;
               var bodyScrollTop=document.body.scrollTop
              
               var selectors=xUtils.getSelector(selectorId);
               if(!selectors){
               	return ;
               }
               var offset=xUtils.getOffset(selectors);
                if ((bodyScrollTop + windowHeight) > offset.top) {
                       onfun();
                }
           })
          }

		}
	};
	return methods;
})()



 