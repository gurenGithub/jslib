var xForm = (function(window) {

  var members = {

    select:function(){
       if( typeof select !='undefined'){
         return this.select=select;
       }
       return this.select={render:function(){}}
    },
    combo:function(){
       if( typeof combo !='undefined'){
          return this.combo=combo;
       }
       return this.combo={render:function(){}}
    },
    checkbox:function(){
       if( typeof checkbox !='undefined'){
          return this.checkbox=checkbox;
       }
       return this.checkbox={render:function(){}}
    },
    radio:function(){
       if( typeof radio !='undefined'){
          return this.radio=radio;
       }
       return this.radio={render:function(){}}
    },
    autocomplete:function(){
       if( typeof autocomplete !='undefined'){
          return this.autocomplete=autocomplete;
       }
       return this.autocomplete={render:function(){}}
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