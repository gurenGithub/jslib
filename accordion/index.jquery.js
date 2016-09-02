
var xAccordion=(function() {
	

	var members={

		render:function(){
            var accordions=document.getElementsByClassName('xAccordion');
                  jQuery('.xAccordion').each(function(){

                       var $me=jQuery(this);
                      var $items = jQuery('.item',$me);
                       $items.each(function(){
                            var $item=jQuery(this);
                            var $header = jQuery('.header',$item);
                            $header.on('click',function(){
                            var $content= jQuery('.content',$item);
                            if($content.is(':visible')){
                                $content.fadeOut(500);
                            }else{
                                $content.fadeIn(500);
                            }

                            })
                           
                       })
                  })
          
		}
	};

	return members;

})()

  
jQuery(function(){

    xAccordion.render();
})