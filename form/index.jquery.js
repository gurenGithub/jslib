var xForm = (function(window) {

  var members = {

    select: select,
    render: function() {

      if (this.select) {
        this.select.render();
      }
      if(combo){
        combo.render();
      }
    }
  }


  return members;

})(window)


jQuery(function() {

  xForm.render();
})