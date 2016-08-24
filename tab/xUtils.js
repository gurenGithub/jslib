//create method getElementsByClassName for document  
    if(!document.getElementsByClassName){  
        document.getElementsByClassName = function(className, element){  
            var children = (element || document).getElementsByTagName('*');  
            var elements = new Array();  
            for (var i=0; i<children.length; i++){  
                var child = children[i];  
                var classNames = child.className.split(' ');  
                for (var j=0; j<classNames.length; j++){  
                    if (classNames[j] == className){   
                        elements.push(child);  
                        break;  
                    }  
                }  
            }   
            return elements;  
        };  
    }

var xUtils=(function(){ 
   	var methods={ 

      getWidth:function(id,cssWidth){
    var $$=null;
    if(typeof id=="string"){
      $$=$(id);
    }
    else{
      $$=id;
    }
    var width= parseFloat($$.css(cssWidth))

    return isNaN(width)?0:width;
  },
   		addEvent:function(dom,type,fn){

        if (typeof document.addEventListener != "undefined") { 
        dom.addEventListener(type, fn,false);
        }
   		 else 
   		 	{
        	dom.attachEvent('on'+type,function(){
                        fn.call(dom,arguments);
                }); 
   		 	} 
   		 	}
              ,cancelBubble:function(event){

               var e = window.event || event; 

if ( e.stopPropagation ){ //如果提供了事件对象，则这是一个非IE浏览器 
e.stopPropagation(); 
}else{ 
//兼容IE的方式来取消事件冒泡 
window.event.cancelBubble = true; 
} 
              }
            ,
   		 	getElementByClass:function(dom,className){


                var nodes= dom.children;
   		 		for (var i = 0; i < nodes.length; i++) {
   		 			
   		 			var node=nodes[i];
   		 			if(node.className.indexOf(className)>-1){
   		 				return node;
   		 			}
   		 		}
   		 	} 
   		 } 
   		 return methods; 
   		})()