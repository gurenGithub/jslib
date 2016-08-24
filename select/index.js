 function insertAfter(newElement, targetElement) {
     var parent = targetElement.parentNode;
     if (parent.lastChild == targetElement) {
         // 如果最后的节点是目标元素，则直接添加。因为默认是最后
         parent.appendChild(newElement);
     } else {
         parent.insertBefore(newElement, targetElement.nextSibling);
         //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
     }
 }

 //create method getElementsByClassName for document  
 if (!document.getElementsByClassName) {
     document.getElementsByClassName = function(className, element) {
         var children = (element || document).getElementsByTagName('*');
         var elements = new Array();
         for (var i = 0; i < children.length; i++) {
             var child = children[i];
             var classNames = child.className.split(' ');
             for (var j = 0; j < classNames.length; j++) {
                 if (classNames[j] == className) {
                     elements.push(child);
                     break;
                 }
             }
         }
         return elements;
     };
 }



 var xSelect=(function() {

var methods={

    render : function(select) {
     if (!select) {
         select = 'select';
     }
     var selects = select=='select' ? document.getElementsByTagName(select) : document.getElementsByClassName(select);
     for (var k = 0; k < selects.length; k++) {
         (function(k) {
             var select = selects[k];
             var newNode = document.createElement('span');
             newNode.className = "selectHolder";
             var newSpan = document.createElement('span');
             if (select.options && select.options.length > 0) {
                 var text = select.options[select.selectedIndex].text;
                 newSpan.innerHTML = text;
             }
             newSpan.style.lineHeight = select.offsetHeight + 'px';
             newSpan.style.width = select.offsetWidth + 'px';
             newSpan.style.height = select.offsetHeight + 'px';
             newNode.style.width = select.offsetWidth + 'px';
             newNode.style.height = select.offsetHeight + 'px';
             insertAfter(newNode, select);
             newNode.appendChild(select);
             newNode.appendChild(newSpan);
             xUtils.addEvent(select, 'change', function(event) {
                 var text = select.options[select.selectedIndex].text;
                 newSpan.innerHTML = text;
             })
         })(k);
     }
 }
}

return methods;
 })()



 xUtils.addEvent(window, 'load', function() {
   xSelect.render();
 })