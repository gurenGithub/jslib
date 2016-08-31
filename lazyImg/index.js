

var delayImgClass='xLazy';
var xLazyImg=(function(){


	var methods={
  
  setSelector:function(selector){

    delayImgClass=selector;
  },
   delayload:function(className){

               var windowHeight=xUtils.getWinSize().height;
               var winScroll=xUtils.getWinScroll();
               var bodyScrollTop=winScroll.top;
      var images=document.getElementsByClassName(className);
      for (var i = 0; i < images.length; i++) {
        
        (function(i){
               var $image=images[i];

               var hasLoad=$image.getAttribute('hasLoad');
               if(hasLoad=='Y'){
                return ;
               }
               var delaySrc=$image.getAttribute('lazy-src');
               if(!delaySrc){
                return 
               }
               var selector=$image;
               var offset=xUtils.getOffset(selector);
                if ((bodyScrollTop + windowHeight) > offset.top) {
                  
                    $image.setAttribute('hasLoad','Y'); 
                    $image.setAttribute('src',delaySrc);
                }
        })(i)
      }
   },
  
	 render:function(className){
           var me=this;
           me.delayload(className);
           xUtils.addEvent(window,'scroll',function()
           {
              me.delayload(className);
           })
          
     }

		
	};
	return methods;
})()


if(xUtils.isAutoLoad){
xUtils.addEvent(window, 'load', function() 
 {
    xLazyImg.render(delayImgClass)
 });
}