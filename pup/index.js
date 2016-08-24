var xPup = (function() {



	var methods = {
        render:function(){

    var pups = document.getElementsByClassName("xPup");

	  for (var i = pups.length - 1; i >= 0; i--) {

		(function(i) {
			var _pup = pups[i];
			var sourceId = _pup.getAttribute('targetId');
			var opts = _pup.getAttribute('opts') || {};

			var event=_pup.getAttribute('event');
			var orientation=_pup.getAttribute('orientation');
            if(event){
                opts.event=event;
             }
             if(orientation){
            opts.orientation=orientation;
            }
			xPup.init(sourceId, _pup, opts);

		})(i)
	}
        },
		show:function(tartgetId, pupId, opts){
            this.init(tartgetId, pupId, opts,true);
		},
		init: function(tartgetId, pupId, opts,isUnDelayShow) {


                (function(tartgetId, pupId, opts,isUnDelayShow){


           var $pup = typeof pupId == 'string' ? document.getElementById(pupId) : pupId;
               if(!tartgetId){
                  	return;
               }

               if(!opts){opts={}}

			
			var $source = typeof tartgetId == 'string' ? document.getElementById(tartgetId) : tartgetId;
            

            var $title=xUtils.getElementByClass($pup,'title');
				var $btnClose = xUtils.getElementByClass($title, 'close');
				if ($btnClose) {

					var _hasClickField = 'hasClick';
					var hasClick = $btnClose.getAttribute(_hasClickField) == 'Y';
					if (!hasClick) {

						$btnClose.innerHTML = 'x';
						$btnClose.setAttribute(_hasClickField, 'Y');
						xUtils.addEvent($btnClose, 'click', function(e) {
							$pup.style.display = 'none';
							xUtils.cancelBubble(e);
						})
					}
				}
            var eventType=opts.event || 'click';



			var showPup = function() {

				if ($pup.style.display == 'block') {
					$pup.style.display = "none";
					return;
				}
				$pup.style.display = 'block';
				var offset = xUtils.getOffset($source);
				var left = offset.left;
				var top = offset.top;
				var height = $source.offsetHeight;
				var sourceWidth = $source.offsetWidth;
				var width = $pup.offsetWidth;

				var orientation = opts.orientation || 'left';

				var _left = orientation == 'right' ? (left - width + sourceWidth) : left;

				if (orientation == "right") {

					$pup.className = $pup.className.replace(' xRightPup', '').replace('xPup', '') + ' xRightPup';
				}

				$pup.style.left = _left + 'px';
				$pup.style.top = top + height + 10 + 'px';
			}

			if (isUnDelayShow == true) {
				showPup();
			} else {
				xUtils.addEvent($source, eventType, function(e) {


					showPup();
				});
				xUtils.addEvent($pup, eventType, function(e) {
					xUtils.cancelBubble(e);
				})

			}
			})(tartgetId, pupId, opts,isUnDelayShow)
		}
	}
	return methods;
})()


xUtils.addEvent(window, 'load', function() {


    xPup.render();
	
})