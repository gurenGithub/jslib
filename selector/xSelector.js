var __xselector = (function() {

  var members = {
    regexpress: {
      formElems: /^(?:textarea|input|select)$/i
    },
    select: {

      getValue: function(selector) {
        var index = selector.selectedIndex;
        var value = selector.options[index].value;
        var text = selector.options[index].text;
        return {
          value: value,
          text: text
        };
      },
      setValue: function(selector, value) {

      }
    }
  }
  return members;
})();

function xSelector(selector, context) {
 

 if(selector && selector.nodeType){
   this.selectors=[selector];
   return;
 }
  if (context) {
    this.selectors = context.querySelectorAll(selector);
  } else if (typeof selector == 'function' && selector.get) {
    return selector.get(0);
  }
  this.selectors = document.querySelectorAll(selector);
};
xSelector.prototype.get = function(index) {

  return this.selectors[index || 0]
};
xSelector.prototype.each = function(onEach) {

  for (var i = 0; i < this.selectors.length; i++) {

    var selector = this.selectors[i];
    (function(selector) {
      onEach.call(this, selector, i);
    })(selector);
  }
};
xSelector.prototype.getValue = function() {
  
  var selector = this.get(0);
  var nodeName = selector.nodeName;
  switch (nodeName) {

    case "SELECT":
      return __xselector.select.getValue(selector).value;
    case "INPUT":
    case "TEXTAREA":
      return selector.value;
    default:
      return '';
  }
};
xSelector.prototype.setValue = function() {

};
xSelector.prototype.getText = function() {
  var selector = this.get(0);
  return selector.innerText;
};
xSelector.prototype.setText = function(text) {
  var selector = this.get(0);
  selector.innerText = text;
  return this;
};
xSelector.prototype.getHtml = function() {
  var selector = this.get(0);
  return selector.innerHTML;
};
xSelector.prototype.setHtml = function(html) {
  var selector = this.get(0);
  selector.innerHTML = html;
  return selector;
};
xSelector.prototype.on = function(type, func) {
  var elem = this.get();
  if (typeof document.addEventListener != "undefined") {
    dom.addEventListener(type, fn, false);

  } else {
    dom.attachEvent('on' + type, function() {
      fn.call(dom, arguments);

    });
  }
};
xSelector.prototype.cancelBubble = function(event) {

  var e = window.event || event;

  if (e.stopPropagation) { //如果提供了事件对象，则这是一个非IE浏览器 
    e.stopPropagation();
  } else {
    //兼容IE的方式来取消事件冒泡 
    window.event.cancelBubble = true;
  }
}
xSelector.prototype.die = function(eventType) {
  var elem = this.get();
  var func = document.removeEventListener ?
    function(elem, type, handle) {
      if (elem.removeEventListener) {
        elem.removeEventListener(type, handle, false);
      }
    } :
    function(elem, type, handle) {
      var name = "on" + type;

      if (elem.detachEvent) {

        // #8545, #7054, preventing memory leaks for custom events in IE6-8 –
        // detachEvent needed property on element, by name of that event, to properly expose it to GC
        if (typeof elem[name] === "undefined") {
          elem[name] = null;
        }

        elem.detachEvent(name, handle);
      }
    };
  func(elem, type, handle);
  return this;
};


window.$$ = function(selector, context) {
  return new xSelector(selector, context);
};