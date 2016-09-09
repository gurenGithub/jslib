var _getSelector = function(selector) {

  if (typeof selector === 'string') {
    return jQuery(selector);
  }
  return selector;
}

function xDate(opts) {
  this.opts = opts || {};
  this.eles = {}
};
xDate.prototype.weeks = ["一", "二", "三", "四", "五", "六", "日"]
xDate.prototype.dates = ["年", "月", "日"]
xDate.prototype.render = function(opts) {

  this.opts = opts || {};
  var me = this;
  var $selector = _getSelector(opts.selector);
  this.eles.$selector = $selector;
  this.eles.$date = jQuery('<div class="body"></div>');
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
xDate.prototype.show = function() {
  this.eles.$date.show();
  this.renderHeader();
  this.renderContent(this.getValue());
  this.renderFooter();
  this.eles.$selector.attr('isShow', 'Y');
}
xDate.prototype.hide = function() {
  this.eles.$date.empty();
  this.eles.$date.hide();
  this.eles.$selector.attr('isShow', 'N');
}
xDate.prototype.getCurrentDateText = function(value) {
  var date = !value ? new Date() : (typeof value === 'string' ? new Date(value) : value);


  this.opts.currentDate = date;

  var $title = jQuery('<div class="title "></div>');
  var $year = jQuery('<span class="year pt"></span>');
  $year.html(this.getYear(date) + this.dates[0]);
  var $month = jQuery('<span class="month pt"></span>');
  $month.html((this.getMonth(date) + 1) + this.dates[1]);
  var $day = jQuery('<span class="day pt"></span>')
  $day.html(this.getDay(date) + this.dates[2]);
  $title.append($year).append($month).append($day);
  var me = this;
  $year.click(function() {
    me.renderYearContent();
  });

  $month.click(function() {
     me.renderMonthContent();
  })
  $day.click(function()
  {    
      var date=new Date();
      me.opts.currentDate=date;
      me.renderContent(me.opts.currentDate);
      
   })
  return $title;
}
xDate.prototype.renderHeader = function() {

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
xDate.prototype.setTitle = function() {
  this.eles.$headerContent.empty();
  this.eles.$headerContent.html(this.getCurrentDateText(this.opts.currentDate));
}
xDate.prototype.addYear=function(){

 var div=25;
 var year=this.getYear(this.opts.currentDate);
 year+=div;
 this.opts.currentDate.setFullYear(year);
 this.renderYearContent();
}
xDate.prototype.divYear=function(){
 var div=25;
 var year=this.getYear(this.opts.currentDate);
 year-=div;
 this.opts.currentDate.setFullYear(year);
 this.renderYearContent();
}
xDate.prototype.addMonth = function(value) {
  var year = this.getYear(this.opts.currentDate);
  var month = this.getMonth(this.opts.currentDate);
  var day = this.getDay(this.opts.currentDate);
  if (month == 11) {
    year += 1;
    month = 0;
  } else {
    month += (value || 1);
  }
  var date = new Date(year, (month), 1);
  this.opts.currentDate = date;
  this.renderContent(this.opts.currentDate)
  this.setTitle();
}
xDate.prototype.divMonth = function(value) {
  var year = this.getYear(this.opts.currentDate);
  var month = this.getMonth(this.opts.currentDate);
  var day = this.getDay(this.opts.currentDate);
  if (month == 0) {
    year -= 1;
    month = 11;
  } else {
    month -= (value || 1);
  }
  var date = new Date(year, (month), 1);
  this.opts.currentDate = date;
  this.renderContent(this.opts.currentDate);
  this.setTitle();
}

xDate.prototype.removeAllEles=function(){
 if (this.eles.$content) {
    this.eles.$content.remove();
  };
  if (this.eles.$monthContent) {
    this.eles.$monthContent.remove();
  }
  if (this.eles.$yearContent) {
    this.eles.$yearContent.remove();
  }
}
xDate.prototype.renderYearContent = function()
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
xDate.prototype.renderMonthContent = function() {
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
        $monthContent.remove();
        me.renderContent(me.opts.currentDate);
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
xDate.prototype.renderContent = function(value) {
  this.removeAllEles();
  this.opts.status = 'month';
  var me = this;
  if (this.eles.$content) {
    this.eles.$content.empty();
  }
  var $content = jQuery('<div class="content"></div>');
  this.eles.$content = $content;
  var $ul = jQuery('<ul></ul>');
  var value = (typeof value === 'string' &&  value) ? new Date(value) : (value || new Date());
  this.opts.currentDate=value;
  var week = this.getWeek(value);
  var year = this.getYear(value);
  var month = this.getMonth(value);
  var currentDay = this.getDay(value);
  var dayArray = this.getDayArray(year, month);
  for (var i = 0; i < this.weeks.length; i++) {
    var $li = jQuery('<li></li>');
    $li.html(this.weeks[i]);
    $ul.append($li);
  }
  for (var i = 0; i < dayArray.length; i++) {
    var $li = jQuery('<li></li>');
    var item = dayArray[i];
    var cValue = item.value;
    var li = $li;
    $li.html(item.day);
    $ul.append($li);
    $li.removeClass('currentDay');
    if (item.isCurrentMonth && currentDay == item.day) {
      $li.addClass('currentDay');
    } else if (!item.isCurrentMonth) {
      $li.addClass('isNotCurrentMonth')
    }

    (function(cValue, li) {
      li.click(function(event) {
        me.setValue(cValue);
        me.hide();
        me.opts.currentDate = value;
      })

    })(cValue, li)

  }

  $content.append($ul);
  this.eles.$date.append($content);
  this.setTitle();
};
xDate.prototype.renderFooter = function() 
{

}

xDate.prototype.formatDate = function(value) {

  return this.getYear(value) + "-" + (this.getMonth(value) + 1) + "-" + this.getDay(value);
}
xDate.prototype.renderYear = function() {

};
xDate.prototype.getDayArray = function(year, month) {
  var date = new Date(year, month, 1);
  var week = this.getWeek(date);
  var preMaxDay = this.getMaxDays(month==0 ? (year-1) : year, (month==0 ? 11 : month - 1));
  var days = []
  for (var i = preMaxDay+1+ (week == 0 ? (-6) : (1 - week)); i < (preMaxDay+1); i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      value: (month ==0 ?(year-1) :year) + '-' + ( month ==0 ? 12: month) + '-' + i
    });
  }
  var thisMax = this.getMaxDays(year, month);
  for (var i = 1; i <= thisMax; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      value: year + '-' + (month + 1) + '-' + i
    });
  }

  for (var i = 1; i < 32; i++) {
    if (days.length % 7 == 0) {
      break;
    }
    days.push({
      day: i,
      isCurrentMonth: false,
      value: ((month + 2) ==13 ?( year+1 ) :year) + '-' + ((month + 2)==13 ? 1 :(month + 2)) + '-' + i
    });
  }

  return days;

}
xDate.prototype.renderMonth = function() {

}
xDate.prototype.renderDay = function() {

}
xDate.prototype.setValue = function(value) {

  return this.eles.$text.val(value);
  this.opts.value = value;
}
xDate.prototype.getValue = function() {

  return this.eles.$text.val();
}
xDate.prototype.getMaxDays = function(year, month)
{
  return new Date(year, (month+1) , 0).getDate()
}

xDate.prototype.getWeek = function(date) {

  return date.getDay();
}

xDate.prototype.getMonth = function(date) {
  return date.getMonth();
}
xDate.prototype.getYear = function(date) {
  return date.getFullYear();
}
xDate.prototype.getDay = function(date) {
  return date.getDate();
}

if(typeof window.xUi == 'undefined' )
{
   window.xUi={};
} 

window.xUi.date=(function(){
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
         selector = '.date';
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
         newOpts.selector = $selector;
         var control = new xDate(newOpts);
         controls.push(control);
         control.render(newOpts);
       })
             }
       }

       return members;

})()

