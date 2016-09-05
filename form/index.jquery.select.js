var select = (function(window) {

  var members = {

      render: function(selector, opts) {
        var me = this;
        var onShow = opts ? opts.onShow : function() {};
        var onHide = opts ? opts.onHide : null
        var onSelect = opts ? opts.onSelect : null
        var $selectors = null;
        if (!selector) {
          $selectors = jQuery('.select');
        }

        for (var i = 0; i < $selectors.length; i++) {

          var seletor = $selectors[i];

          (function(seletor) {
            var $seletor = jQuery(seletor);
            var $ul = jQuery('>ul', $seletor);
            var $li = jQuery('>li', $ul);
            var $text = jQuery('>input', $seletor);
            var rendered = $seletor.attr('rendered');
            if (rendered == 'Y') {
              return;
            }
            var $hValue = jQuery('<input type="hidden" />');

            var name = $text.attr('name');
            if (name) { 
              $hValue.attr('name', name);
              $text.attr('name', name + 'Desc');
            }
            $seletor.append($hValue);

            $ul.css('top', $seletor.height() + 2 + 'px');
            var value = $text.val();
            $seletor.attr('rendered', 'Y');
            if (value == undefined || value == '') {
              var $selectedItem = jQuery('>li[isSelected=Y]', $ul);
              if ($selectedItem.size() > 0) {
                var selectItemvalue = $selectedItem.attr('value') == 0 ? $selectedItem.text() : $selectedItem.attr('value');
                if ($selectedItem.attr('value') != selectItemvalue) {
                  $selectedItem.attr('value', selectItemvalue);
                }
                value = selectItemvalue;
              }
            }


            me.setValue($seletor, value)
            $seletor.on('click', function(event) {

              var isVisible = $ul.is(':visible');
              if (isVisible) {
                $ul.hide()
              } else {
                $ul.show();
              }
              event.stopPropagation();
            });


            $li.on('click', function(event) {


              var value = jQuery(this).attr('value') == 0 ? jQuery(this).text() : jQuery(this).attr('value');
              var textValue = me.getValue($seletor);
              if (textValue == value) {
                return;
              }
              if (jQuery(this).attr('value') != value) {
                jQuery(this).attr('value', value);
              }
              me.setValue($seletor, value);
              $ul.hide();


              event.stopPropagation();
            })

          })(seletor)
        }

      },
      getValue: function($seletor) {
        return jQuery('>input[type=hidden]', $seletor).val();
      },
      getText: function($seletor) {
        return jQuery('>input:first', $seletor).val();
      },
      setValue: function($seletor, value) {
        var me = this;
        var $ul = jQuery('>ul', $seletor);
        var $li = jQuery('>li', $ul);
        var $text = jQuery('>input:first', $seletor);
        var $hide = jQuery('>input[type=hidden]', $seletor)
        var text = jQuery('>li[value=' + value + ']', $ul).text();
        if (text != undefined) {
          $text.val(text);
          $hide.val(value);
        }

        var onSelect = $seletor.attr('onSelect');
        if (onSelect) {
          eval(onSelect + '.call($seletor,me.getValue($seletor),me.getText($seletor))');
        }

        $subNode = jQuery('*[pId=' + $seletor.attr('id') + ']');
        if ($subNode && $subNode.length > 0) {

          var subNodepField = $subNode.attr('pField');
          if (subNodepField) {
            this.refresh($subNode, function() {
              return subNodepField + '=' + value;
            })
          }
        }
      },
      refresh: function($seletor, onfilter) {

        this.setValue($seletor, '');
        if (onfilter) {
          var filterExpress = onfilter.call($seletor);
          jQuery('>ul>li', $seletor).hide();
          jQuery('>ul>li[' + filterExpress + ']', $seletor).show();

        }
      },
    
  };
  return members;
})(window);