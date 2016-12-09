if (typeof $ !== 'undefined') {
	document.addEventListener('touchmove', function(e) {
		e.preventDefault();
	}, false);
	$.fn.tmpl = function(tmplId,data,appendFunc) {

          var $me=$(this);
          var html = template(tmplId, data);
          if(!appendFunc){
          	      $me.append(html);
          }else{
          	appendFunc.call(this,html);
          }
       
	};
};