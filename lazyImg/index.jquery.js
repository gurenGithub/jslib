var delayImgClass = 'xLazy';
var xLazyImg = (function() {
  var methods = {
    setSelector:function(selector){

    delayImgClass=selector;
  },
    delayload: function(className) {

      var windowHeight = $(window).height();
      var bodyScrollTop = $(window).scrollTop();

      var $selector = jQuery(className == delayImgClass ? ("." + className) : className)

      $selector.each(function() {

        var $image = jQuery(this);
        var hasLoad = $image.attr('hasLoad');
        if (hasLoad == 'Y') {
          return;
        }
        var delaySrc = $image.attr('lazy-src');
        if (!delaySrc) {
          return
        }


        if (bodyScrollTop + windowHeight > $image.offset().top) {

          $image.attr('hasLoad', 'Y');
          $image.attr('src', delaySrc);
        }
      })

    },
    render: function(className) {

      var me = this;
      me.delayload(className);
      var me = this;
      $(window).on('scroll.delayload', function() {

        var $selectorId = jQuery(className == delayImgClass ? ("." + className) : className)
        if ($(window).scrollTop() + $(window).height() > $selectorId.offset().top) {
          me.delayload(className);
        }
      });

    }
  }

  return methods;
})()

jQuery(function() {

  xLazyImg.render(delayImgClass);
})