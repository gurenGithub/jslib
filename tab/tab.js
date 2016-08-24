  function tab(){

    	 }
    	 tab.prototype.render=function(tab){


      if(!tab){
	       tab='tab';
         }
        var tabs= document.getElementsByClassName(tab);

        for (var k = 0; k < tabs.length; k++) 
        {
        	(function(k){ 
        	var tab=tabs[k];
        	var $title= xUtils.getElementByClass(tab,'tab-title');
        	var $content=xUtils.getElementByClass(tab,'tab-content');
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
                   	 _thisNodes[j].style.display=index==j ?"block":"none";
                   }
                  xUtils.cancelBubble(e);
              	});
              } 
              })(k);   
           }
    	 }