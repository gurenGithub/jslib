 var scroll;
$(function(){

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
scroll = new IScroll('#wrapper', { 
	scrollX: true,
	scrollY: false, 
	mouseWheel: true
    ,snap:true,
    momentum: false
	 });

});