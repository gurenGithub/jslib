

function xNavDropdown() {
	// body...
}

xNavDropdown.prototype.render=function(selector){

if(!selector){
           selector='xNavDropdown';
         }
        var selectors= document.getElementsByClassName(selector);
        for (var k = 0; k < selectors.length; k++) 
        {
            (function(k){ 
               var _selector=selectors[k];
                var _ul= _selector.children[0];

                var _lis=_ul.children;

                   for (var j = 0; j < _lis.length; j++) {
                      (function(j){
                   	      var _li=_lis[j];

                   	      var __a=_li.children[0];
                   	      var __ul=_li.children[1];
                          _li.style.height=__a.offsetHeight+'px';
                   	      xUtils.addEvent(_li,"mouseover",function(){
                   	      	__ul.style.display='block';
                   	      	__a.className=	__a.className.replace('xNavDropdown-item-hover','')+" xNavDropdown-item-hover";
                   	      });
                   	      xUtils.addEvent(_li,"mouseout",function(){
                   	      	__ul.style.display='none';
                   	      	__a.className=	__a.className.replace('xNavDropdown-item-hover','')
                   	      });
                      })(j)
                   }
                   


            })(k);   
           }
}



xUtils.addEvent(window,'load',function(){
  var _xNavDropdown=new xNavDropdown();
      _xNavDropdown.render();
})