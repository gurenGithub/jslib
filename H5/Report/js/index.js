 var scroll, listScroll;

 $(function() {

 	document.addEventListener('touchmove', function(e) {
 		e.preventDefault();
 	}, false);
 	/*scroll = new IScroll('#wrapper', { 
 		scrollX: true,
 		scrollY: false, 
 		mouseWheel: true
 	    ,snap:true,
 	    momentum: false
 		 }); */

 	/*
 	listScroll=new IScroll('#listWrapper', { 
 		
 		mouseWheel: true
 		 });
 	*/


var index=0;
 	var opts = {
 		onUp: function(me) {

 			
 			for (var i = 0; i < 10; i++) {
$('<li>' + ((++index)) + '</li>').insertBefore($('#listScroll li').first());
 			//	.insertBefore();

 			}
 			me.end();
 		},
 		onDown: function(me) {


 			for (var i = 0; i < 10; i++) {

 				$('#listScroll').append('<li>' + (i+ (++index)) + '</li>');

 			}
 			me.end();
 		}

 	};
 	$('#listScroll').scrollList(opts);
 });