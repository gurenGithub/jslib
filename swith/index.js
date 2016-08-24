 var xSwith = (function() {


     var methods = {

         render: function() {
             var swiths = document.getElementsByClassName('xSwith');

             for (var k = 0; k < swiths.length; k++) {
                 (function(k) {
                     var _swith = swiths[k];
                     var orientation = _swith.getAttribute('orientation') || 'top';

                     var _normal = xUtils.getElementByClass(_swith, 'normal'); // _swith.getElementsByClassName('normal')[0];
                     var _swithItem = xUtils.getElementByClass(_normal, 'swithitem'); //_swith.getElementsByClassName('swithitem')[0];
                     var _hover = xUtils.getElementByClass(_swith, 'hover'); //_swith.getElementsByClassName('hover')[0];

                     var isMoving = false;
                     xUtils.addEvent(_swithItem, 'mouseover', function(e) {

                         if (isMoving) {
                             return;
                         }
                         if (console) {
                             console.log("xSwith:mouseover")
                         }
                         isMoving = true;
                         var top = 0;
                         var hander = setInterval(function() {
                             top += 50

                             var _p = (top / 10);
                             if (_p > 1000) {
                                 _p = 1000;
                             }
                             _normal.style[orientation] = ("-" + _p + "%");
                             if (top >= 1000) {
                                 clearInterval(hander);
                                 top = 0;
                                 isMoving = false;
                             }
                         }, 10)

                     })
                     xUtils.addEvent(_hover, 'mouseout', function(e) {

                         if (isMoving) {
                             return;
                         }

                         if (console) {
                             console.log("xSwith:mouseout")
                         }


                         isMoving = true;
                         var top = 0;
                         var hander = setInterval(function() {
                             top += 50

                             var _p = (top / 10);
                             if (_p > 1000) {
                                 _p = 1000;
                             }
                             _normal.style[orientation] = ("-" + (100 - (_p)) + "%");
                             if (top >= 1000) {
                                 clearInterval(hander);
                                 top = 0;
                                 isMoving = false;
                             }
                         }, 10)
                     })

                 })(k)
             }
         }
     };

     return methods;
 })();
 


 xUtils.addEvent(window, 'load', function() {
     xSwith.render();
 })