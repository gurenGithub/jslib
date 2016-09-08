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
    checkbox:function(){
       if( typeof checkbox !='undefined'){
          return checkbox;
       }
       return {render:function(){}}
    },
    radio:function(){
       if( typeof radio !='undefined'){
          return radio;
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
      this.checkbox().render();
      this.radio().render();
    }
  }


  return members;

})(window)


jQuery(function() 
{
  xForm.render();
})