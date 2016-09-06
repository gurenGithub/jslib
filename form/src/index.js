

var xForm=(function(window){

	var members={
             
              select:{
              	render:function(selector){
                   var $selectors=null;
                   if(!selector){
                   	   $selectors= jQuery('.select');

                   }
                     $selectors.on('click',function(){
                     	var $seletor=jQuery(this);
                     	var $ul=jQuery('>ul',$seletor);
                        var $text=jQuery('>input',$seletor);
                     	var $li=jQuery('>li',$ul);
                     	  $li.on('click',function(){
                             $text.val(jQuery(this).text())
                     	})
                     	$ul.show();
                     })
              	},
              	getValue:function(){

              	},
              	setValue:function(){

              	}
              }
	};

	return members;

})(window)
