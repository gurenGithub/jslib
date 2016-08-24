  

  var xTab=(function(){


    var methods={


      render:function(xtab){
         if(!xtab){
         xtab='xTab';
         }
        var tabs= document.getElementsByClassName(xtab);
        
        for (var k = 0; k < tabs.length; k++) 
        {
          (function(k){ 
          var tab=tabs[k];
            var orientation=tab.getAttribute('orientation');
            if(orientation && orientation.toString().toLowerCase()=="h"){
                tab.className=tab.className.replace('xTab','xHTab');
                 var $cl=document.createElement('div');
                 $cl.className='cl';
               tab.appendChild($cl);
            }
          var $title= xUtils.getElementByClass(tab,'title');
          var $content=xUtils.getElementByClass(tab,'content');
         var _thisNodes=$content.children;
             var __titleNodes= $title.children[0].children;
              for (var i = 0; i < __titleNodes.length; i++) {
                var _title=__titleNodes[i];

                _title.className= i==0?'tab-titlehover':null;
                _title.setAttribute('index',i);
                xUtils.addEvent(_title,'click',function(e)
                {

                 
                  var index=this.getAttribute('index');
                   var allNode= this.parentNode.children;
                   for (var u = 0; u < allNode.length; u++) {               
                    var node=allNode[u];
                    node.className = node==e.target?"tab-titlehover":null;
                   }
                  this.className='tab-titlehover';
                   for (var j = 0; j < _thisNodes.length; j++) 
                   {
                    var isCurrentIndex=index==j ;
                     _thisNodes[j].style.display=isCurrentIndex?"block":"none";

                   }
                  xUtils.cancelBubble(e);
                });
              } 
              })(k);   
           }
      }
      ,
      init:function(id){

      }
    }

    return methods;
  })()

  

xUtils.addEvent(window,'load',function(){

   xTab.render()
})