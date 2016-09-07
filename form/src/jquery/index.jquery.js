var xForm = (function(window) {

  var members = {

    select:function(){
       if( typeof select !='undefined'){
        return select;
       }
       return {render:function(){}}
    },
    combo:function(){
       if( typeof combo !='undefined'){
          return combo;
       }
       return {render:function(){}}
    },
    autocomplete:function(){
       if( typeof autocomplete !='undefined'){
          return autocomplete;
       }
       return {render:function(){}}
    },
    render: function() {

      this.select().render();
      this.combo().render();
      this.autocomplete().render();
    }
  }


  return members;

})(window)


jQuery(function() 
{
  xForm.render();
})