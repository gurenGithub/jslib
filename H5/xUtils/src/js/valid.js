if (typeof window.xUtils === 'undefined') {
    window.xUtils = {};
}

if (typeof window.xUtils.errorMessages === 'undefined') {
    window.xUtils.errorMessages = {
        noChinese: 'Chinese character is not allowed.',
        required: '该字段为必填字段',
        email: '无效Email格式',
        minLength: '允许最小字符长度: {{1}} ',
        maxLength: '允许最大字符长度: {{1}} ',
        invalid: '无效数据格式'
    }
}

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.form = factory();
    }
}(this, function() {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    var reg = {
            email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
            chinese: /^[\u0391-\uFFE5]+$/,
            zipcode: /^[1-9]\d{5}$/,
            mobile: /^1[3-9][0-9]{9}$/,
            phone: /^([\+][0-9]{1,3}([ \.\-])?)?([\(][0-9]{1,6}[\)])?([0-9 \.\-]{1,32})(([A-Za-z \:]{1,11})?[0-9]{1,4}?)$/,
            phoneCn: /^(0[1-9][0-9]{1,2}-?[2-9][0-9]{4,})|([4|8]00[0-9]{7})$/,
            numbers: /^[0-9]*$/,
            numbers_dot: /^[0-9\.]*$/,
            abc: /^[A-Za-z]+$/,
            numbers_abc_underline: /^\w+$/,
            url: /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
            username: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            price: /^\d+(\.\d+)?$/,
            chinaIdLoose: /^(\d{18}|\d{15}|\d{17}[xX])$/,
            chinaZip: /^\d{6}$/,
            ipv4: /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
            url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
        },
        msg = window.xUtils.errorMessages,
        types = ['email', 'url'];

    var inArray = function(array, v) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === v) {
                return true;
            }
        }
        return false;
    };

    var test = function($el, func) {
        var result = {
            isPassed: true,
            type: ''
        };

        if (!!!$el.data('valid')) {
            return result;
        }

        var options = $el.data('valid').split(' ');

        $.each(options, function(k, v) {
            var r;
            if (v.indexOf('_') > -1) {
                var args = v.split('_'),
                    functionName = 'is' + capitalizeFirstLetter(args[0]),
                    type = capitalizeFirstLetter(args[0]);

                args[0] = $el;

                if (form[functionName]) {
                    r = form[functionName].apply(undefined, args);
                    if (r.isPassed) {
                        return true;
                    } else {
                        result = r;
                        return false;
                    }
                } else {
                    r = isRegex($el, v);
                    if (r.isPassed == false) {
                        result = r;
                        return false;
                    }
                }

            }
            if (form['is' + capitalizeFirstLetter(v)] !== undefined) {
                r = form['is' + capitalizeFirstLetter(v)]($el);
                if (r.isPassed == false) {
                    result = r;
                    return false;
                }
            } else {
                r = isRegex($el, v);
                if (r.isPassed == false) {
                    result = r;
                    return false;
                }
            }
        });

        // if(result.isDeferred && typeof result.func == 'function' ) {
        //  result.deferred.always(function(abc){
        //      result.func(abc);
        //  });
        // }

        return result;
    };

    var tests = function($els) {
        var result = {
            isPassed: true,
            list: []
        };

        $.each($els, function(k, v) {
            var r = test($(v));

            if (!r.isPassed) {
                result.isPassed = false;
                result.list.push({
                    type: r.type,
                    $el: $(v)
                });
            }

        });

        return result;
    };

    var isRequired = function($el) {
        var flag = true;
        if ($el.is('[type=radio]')) {
            if ($el.closest('form').find('[name=' + $el.attr('name') + ']:checked').length) {
                return {
                    isPassed: flag,
                    type: 'required'
                };
            } else {
                flag = false;
            }
        }
        if (flag && $el.is('[type=checkbox]') && !$el.is(':checked')) {
            flag = false;
        }
        if (flag && $el.val() === null || !$el.val().length || ($el.prop('tagName') == 'SELECT' && $el.val() == -1)) {
            flag = false;
        }
        if (flag && $el.data('default') && $el.val() === $el.data('default')) {
            flag = false;
        }
        if ($.trim($el.val()).length == 0) {
            flag = false;
        }

        return {
            isPassed: flag,
            type: 'required',
            msg: msg['required']
        };
    };

    var isNoChinese = function($el) {
        return {
            isPassed: /^[^\u4e00-\u9fa5]{0,}$/.test($el.val()),
            type: 'noChinese',
            msg: msg['noChinese']
        };
    };

    var isRegex = function($el, regex) {
        if ($el.val().length == 0) {
            return {
                isPassed: true,
                type: ''
            };
        }
        var regexText = regex,
            regex = reg.hasOwnProperty(regexText) ? reg[regexText] : regex;
        if (regex.test($el.val())) {
            return {
                isPassed: true,
                type: regexText,
                msg: msg[regexText]
            };
        }
        return {
            isPassed: false,
            type: regexText,
            msg: msg[regexText]
        };
    };

    var isEqual = function($el) {
        return {
            isPassed: $el.val() === $('[name=' + arguments[1] + ']').val(),
            type: 'equal',
            msg: '* fields do not match'
        };
    };

    var isMinLength = function($el, length) {
        return {
            isPassed: $el.val().length === 0 || $el.val().length >= parseInt(length),
            type: 'minLength',
            msg: msg['minLength'].replace('{{1}}', length)
        };
    };

    var isMaxLength = function($el, length) {
        return {
            isPassed: $el.val().length <= parseInt(length),
            type: 'maxLength',
            msg: msg['maxLength'].replace('{{1}}', length)
        };
    };

    var isLessThan = function() {

    };

    var isMoreThan = function() {

    };

    var isAjax = function($el) {

    };

    var isFunc = function($el) {
        var func = $el.attr('func');
        if (!func) {
            return {
                isPassed: true,
                type: 'func'
            };
        }

        var data = eval(func + '.call($el,$el.val())');
        return {
            isPassed: data.result,
            type: 'func',
            msg: data.msg
        };
    }

    var form = {
        test: test,
        tests: tests,
        isEqual: isEqual,
        isRegex: isRegex,
        isRequired: isRequired,
        isMinLength: isMinLength,
        isMaxLength: isMaxLength,
        isNoChinese: isNoChinese,
        isFunc: isFunc,
        msg: msg
    };

    return form;
}));



var index = 1;
$.fn.errorMessage = function(options) {


    function hide() {

        var errorMessageid = $(this).attr('errorMessageid');
        $('.tooltipster-error[errorMessageid=' + errorMessageid + ']').remove();
    }

    if (typeof options === 'string') {

        eval(options + '.call(this)');
        return;

    }
    var animation = 'tooltipster-' + options.animation,
        animationSpeed = '-webkit-transition-duration: ' + options.speed + 'ms; -webkit-animation-duration: ' + options.speed + 'ms; -moz-transition-duration: ' + options.speed + 'ms; -moz-animation-duration: ' + options.speed + 'ms; -o-transition-duration: ' + options.speed + 'ms; -o-animation-duration: ' + options.speed + 'ms; -ms-transition-duration: ' + options.speed + 'ms; -ms-animation-duration: ' + options.speed + 'ms; transition-duration: ' + options.speed + 'ms; animation-duration: ' + options.speed + 'ms;',
        minWidth = options.minWidth ? 'min-width:' + Math.round(options.minWidth) + 'px;' : '',
        maxWidth = options.maxWidth ? 'max-width:' + Math.round(options.maxWidth) + 'px;' : '',
        pointerEvents = options.interactive ? 'pointer-events: auto;' : '';

    var tooltip = $('<div class="tooltipster-base ' + options.theme + '" style="' + minWidth + ' ' + maxWidth + ' ' + pointerEvents + ' ' + animationSpeed + '"><div class="tooltipster-content"></div><div class="tooltipster-arrow tooltipster-arrow-top-right tooltipster-error-arrow" ><span><span></span></span></div></div>');
    $('.tooltipster-content', tooltip).html(options.content);
    $(this).parent().append(tooltip);
    var offset = $(this).offset();

    var left=$(this).width()-tooltip.width()+offset.left-2;
    tooltip.css({
        left:left ,
        top: offset.top - tooltip.height() - 10
    });

    var errorMessageid = 'errorMessageid-' + (index++);
    tooltip.attr('errorMessageid', errorMessageid);

    $(this).attr('errorMessageid', errorMessageid);
    (function(tooltip){

        setTimeout(function(){
          
           tooltip.remove();
        },3000);
    })(tooltip);
}


$.fn.h5ErrorMessage = function (options) {
    function hide() {

        var errorMessageid = $(this).attr('errorMessageid');
        $('.tooltipster-error[errorMessageid=' + errorMessageid + ']').remove();
    }

    if (typeof options === 'string') {

        eval(options + '.call(this)');
        return;

    }

    if (xUtils && xUtils.dialog) {
        var tooltip=   xUtils.dialog.tips(options.content);
    var errorMessageid = 'errorMessageid-' + (index++);
    tooltip.attr('errorMessageid', errorMessageid);

    $(this).attr('errorMessageid', errorMessageid);
    (function (tooltip) {

        setTimeout(function () {

            tooltip.remove();
        }, 3000);
    })(tooltip);
    }
}

window.xUtils.valid = (function() {
    var tooltips = (function() {
        var show = function($el, o) {
            //if ($el.data('tooltipster-ns') !== undefined) {
            //    $el.tooltipster('destroy');
            //}
            if (xUtils.valid.model == "one") {
                $el.h5ErrorMessage(o);
            } else {
                $el.errorMessage(o);
            }
        };

        var error = function($el, msg, isScroll) {

            var showTooltips = function() {
                show($el, {
                    position: 'top-right',
                    theme: 'tooltipster-error',
                    maxWidth: 300,
                    contentAsHTML: true,
                    content: msg || window.xUtils.errorMessages.invalid,
                    hideOnClick: true,
                    trigger: 'custom',
                    autoClose: true,
                    timer: 5000,
                    positionTracker: xUtils.valid.positionTracker,
                    interactive: true,
                    debug: false,
                    functionAfter: function() {

                    }
                });
            };
            showTooltips();
        };

        var hide = function($el) {

            $el.errorMessage('hide');
        };

        return {
            show: show,
            hide: hide,
            error: error
        };
    })();

    var test = function($el, isScroll) {
        var r = form.test($el);
        if (r.isPassed == false && r.isDeferred !== true) {

            var $showEl;
            var inputType = $el.attr('type');
            var errorMessage = $el.attr('errorMessage') || r.msg;
            if (inputType == "hidden") {
                $showEl = $el.attr('validTarget') ? $($el.attr('validTarget')) : $el.parent();
            } else {
                $showEl = $el;
            }
            if (!isScroll) {
                tooltips.error($showEl, errorMessage);
            } else {
                to($showEl, function() {
                    tooltips.error($showEl, errorMessage);
                });
            }
        }
        return r;
    };

    var tests = function($els, o) {
        var result = {
            isPassed: true,
            list: []
        };

        if (o === undefined) {
            o = {};
        }

        var showOneMessage = typeof o.showOneMessage === 'undefined' ? this.showOneMessage : o.showOneMessage,
            autoPositionUpdate = typeof o.autoPositionUpdate === 'undefined' ? this.autoPositionUpdate : o.autoPositionUpdate;
        var isPass = true;

        $.each($els, function(k, v) {
            var r = test($(v));
            isPass = r.isPassed;
            if (window.xUtils.valid.model == "one" && isPass == false)
            {
                return;
            }
            if (!r.isPassed) {
                result.isPassed = false;
                result.list.push({
                    type: r.type,
                    $el: $(v),
                    msg: r.msg
                });
                if (showOneMessage) {
                    return false;
                }
            }
        });

        if (autoPositionUpdate && result.list.length > 0) {
            var $el = result.list[0].$el;
            tooltips.hide($el);
            to($el, function() {
                if (o.autoFocus) {
                    $el.trigger('focus');
                }
                tooltips.error($el, result.list[0].msg);
            });
        }
        return result;
    };

    var to = function($el, func) {
        $('html, body').animate({
            scrollTop: $el.offset().top - $(window).height() / 2
        }, function() {
            if (func) {
                func($el);
            }
        });
    };

    var blurValid = function($form) {
        $form.on('focus', '[data-valid]', function() {
            tooltips.hide($(this));
        }).on('blur', '[data-valid]', function() {
            test($(this));
        });
    };

    var submitValid = function($form, o) {
        blurValid($form);
        $form.on('submit', function(e) {
            var r = xUtils.valid.tests($form.find('[data-valid]'), o);
            if (r.isPassed === false) {
                e.preventDefault();
            }
        });
    };


    return {
        test: test,
        tests: tests,
        blurValid: blurValid,
        tooltips: tooltips,
        submitValid: submitValid,
        to: to,
        model:'one'
    };
})();



if (typeof $ !== 'undefined') {
    $.fn.isValid = function() {
        var $form = $(this);
        var r = xUtils.valid.tests($form.find('[data-valid]'));
        if (r.isPassed == false) {
            return false;
        }
        return true;

    }

    $.fn.validForm = function() {
        var $form = $(this);
        if (xUtils.valid && xUtils.valid.blurValid) {
            xUtils.valid.blurValid($form);

        }
    }


}