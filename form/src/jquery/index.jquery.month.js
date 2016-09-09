var _getSelector = function(selector) {

  if (typeof selector === 'string') {
    return jQuery(selector);
  }
  return selector;
}

function xMonth(opts) {
  this.opts = opts || {};
  this.eles = {}
};
xMonth.prototype.dates = ["年", "月", "日"]
xMonth.prototype.render = function(opts) {

  this.opts = opts || {};
  var me = this;
  var $selector = _getSelector(opts.selector);
  this.eles.$selector = $selector;
  this.eles.$date = jQuery('<div class="body"></div>');
  
  var $texts=jQuery('input',$selector);
  var $year ,$month ;
  if($texts.size()>1){
         $texts =jQuery('<input type="text" />');
         $year = jQuery('[dateType=year]',$selector) ||  jQuery($texts)[0];
         $month = jQuery('[dateType=month]',$selector)||  jQuery($texts)[1];
         $year.attr('type','hidden');
         $month.attr('type','hidden');
  }else{
      $year = jQuery('<input type="hidden" />');
      $month = jQuery('<input type="hidden" />');
  }
  this.eles.$text = jQuery('input:first', $selector);

  this.eles.$text.attr('readonly','readonly')
  if (this.opts.value) {
    this.setValue(this.opts.value);
  }
  this.opts.value = this.opts.value || this.getValue();

  this.eles.$date.click(function(event) {
    event.stopPropagation();
  });
  this.eles.$selector.append(this.eles.$date);
  $selector.click(function(event) {

    var isShow = jQuery(this).attr('isShow');
    if (isShow == 'Y') {

      me.hide();
    } else {
      me.show();
    }
    event.stopPropagation();
  })

};
xMonth.prototype.show = function() {
  this.eles.$date.show();

  if(!this.opts.isOnly){ this.renderHeader();}
  this.renderContent(this.getValue());
  this.renderFooter();
  this.eles.$selector.attr('isShow', 'Y');
}
xMonth.prototype.hide = function() {
  this.eles.$date.empty();
  this.eles.$date.hide();
  this.eles.$selector.attr('isShow', 'N');
}
xMonth.prototype.getCurrentDateText = function(value) {
  var date = !value ? new Date() : (typeof value === 'string' ? new Date(value) : value);


  this.opts.currentDate = date;
  var $title = jQuery('<div class="title "></div>');
  var $year = jQuery('<span class=" pt"></span>');
  $year.html(this.getYear(date) + this.dates[0]);
  var $month = jQuery('<span class=" pt"></span>');
  $month.html((this.getMonth(date) + 1) + this.dates[1]);
  var me = this;
  $year.click(function() {
     me.renderYearContent();
  });

  $month.click(function() 
  {
     me.renderMonthContent();
  })
 $title.append($year);
 $title.append($month);
  return $title;
}
xMonth.prototype.renderHeader = function() {

  var me = this;
  var $header = jQuery('<div class="header" ></div>');
  var $left = jQuery('<span class="left pt"></span>');
  var $headerContent = jQuery('<span class="content"></span>');
  this.eles.$headerContent = $headerContent;

  this.opts.currentDate = new Date(this.getValue());
  
  var $right = jQuery('<span class="right pt"></span>');
  $left.click(function() {
    if (me.opts.status == 'month') {
      me.divMonth(1);
    } 
    else if (me.opts.status == 'year') {
       me.divYear(); 
    }
  });
  $right.click(function() {
    if (me.opts.status == 'month') {
      me.addMonth(1);
    }  else if (me.opts.status == 'year') {
        me.addYear();
    }
  });
  $headerContent
  $header.append($left);
  $header.append($headerContent);
  $header.append($right);
  this.eles.$date.append($header)
};
xMonth.prototype.setTitle = function() {
  if(this.opts.isOnly){
      return ;
  }
  this.eles.$headerContent.empty();
  this.eles.$headerContent.html(this.getCurrentDateText(this.opts.currentDate));
}
xMonth.prototype.addYear=function(){

 var div=25;
 var year=this.getYear(this.opts.currentDate);
 year+=div;
 this.opts.currentDate.setFullYear(year);
 this.renderYearContent();
}
xMonth.prototype.divYear=function(){
 var div=25;
 var year=this.getYear(this.opts.currentDate);
 year-=div;
 this.opts.currentDate.setFullYear(year);
 this.renderYearContent();
}


xMonth.prototype.removeAllEles=function(){

  if (this.eles.$monthContent) {
    this.eles.$monthContent.remove();
  }
  if (this.eles.$yearContent) {
    this.eles.$yearContent.remove();
  }
}
xMonth.prototype.renderYearContent = function()
 {
  this.removeAllEles();
  this.opts.status = 'year';
  var me = this;
  var $yearContent = this.eles.$yearContent;
  if ($yearContent) {
    $yearContent.remove();
  }
  $yearContent = jQuery('<div class="yearContent"></div>');
  var $ul = jQuery('<ul></ul>');
  var currentDate = this.opts.currentDate;

  var year = this.getYear(currentDate);
  for (var i = year - 12; i < year + 13; i++) {
    var li = jQuery('<li></li>');
    li.html(i);
    $ul.append(li);
    if (i == year) {
      li.addClass('active');
    }
    (function(li, i) {
      li.click(function() 
      {
        me.opts.currentDate.setFullYear(i);
        if (me.eles.$monthContent) {
          me.eles.$monthContent.show();
        }
        $yearContent.remove();
        me.renderContent(me.opts.currentDate);
      })
    })(li, i)
  }
  $yearContent.append($ul);
  $yearContent.show();
  this.eles.$yearContent = $yearContent;
  this.eles.$date.append($yearContent);
  if (this.eles.$content) {
    this.eles.$content.hide();
  };
  if (this.eles.$monthContent) {
    this.eles.$monthContent.hide();
  }
  me.setTitle();
}
xMonth.prototype.renderMonthContent = function() {
  this.removeAllEles();
   var me = this;
  var $monthContent = this.eles.$monthContent;
  if ($monthContent) {
    $monthContent.remove();
  }
  $monthContent = jQuery('<div class="monthContent"></div>');
  var $ul = jQuery('<ul></ul>');
  var currentDate = this.opts.currentDate;

  var month = this.getMonth(currentDate);
  for (var i = 0; i < 12; i++) {
    var li = jQuery('<li></li>');
    li.html(i+1);
    $ul.append(li);
    if (i == month) {
      li.addClass('active');
    }
    (function(li, i) {
      li.click(function() 
      {
        me.opts.currentDate.setMonth(i);
        me.setTitle();
        li.siblings().removeClass('active');
        li.addClass('active');
        var _value = me.opts.isOnly ? me.getMonth(me.opts.currentDate)+1 :me.formatDate(me.opts.currentDate);
        me.setValue(_value);
        me.hide();
      })
    })(li, i)
  }
  $monthContent.append($ul);
  $monthContent.show();
  this.eles.$monthContent = $monthContent;
  this.eles.$date.append($monthContent);
  if (this.eles.$content) {
    this.eles.$content.hide();
  };
  if (this.eles.$yearContent) {
    this.eles.$yearContent.hide();
  }
  //me.setTitle();
}
xMonth.prototype.renderContent = function(value) {
  this.removeAllEles();
  this.opts.status = 'year';
  var me = this;


   var value = (typeof value === 'string' &&  value) ? new Date(value) : (value || new Date());
   this.opts.currentDate=value;
    this.renderMonthContent();
  this.setTitle();
};
xMonth.prototype.renderFooter = function() 
{

}

xMonth.prototype.formatDate = function(value) {

  return this.getYear(value) + "-" + (this.getMonth(value) + 1) ;
}


xMonth.prototype.setValue = function(value) {

  return this.eles.$text.val(value);
  this.opts.value = value;
}
xMonth.prototype.getValue = function() {

  return this.eles.$text.val();
}



xMonth.prototype.getMonth = function(date) {
  return date.getMonth();
}
xMonth.prototype.getYear = function(date) {
  return date.getFullYear();
}


if(typeof window.xUi == 'undefined' )
{
   window.xUi={};
} 

window.xUi.month=(function(){
       var controls=[];
       var members={
             get: function(selector)
      {
      if (typeof selector === "number") {
        return controls[selector];
      } else if (typeof selector === 'string') {
        selector = jQuery(selector);
      } else {
        for (var i = 0; i < controls.length; i++) {
          var item = controls[i];
          if (item.opts.selector &&
            jQuery(item.opts.selector)[0] == jQuery(selector)[0]) {
            return item;
          }
        }
      }
      return null;
     },
     render:function(selector, opts) {

       if (!selector) {
         selector = '.month';
       }
       if (!opts) {
         opts = {};
       }
       
       var me=this;
       jQuery(selector).each(function(item) 
       {
        var $selector = jQuery(this);
        var newOpts={};
        for (var item in opts){
           newOpts.item=opts[item];
        }
         newOpts.onSelect=$selector.attr('onSelect');
         newOpts.isOnly=$selector.attr('isOnly');
         newOpts.selector = $selector;
         var control = new xMonth(newOpts);
         controls.push(control);
         control.render(newOpts);
       })
             }
       }

       return members;

})()

