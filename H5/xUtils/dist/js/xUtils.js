if (typeof window.xUtils == 'undefined') {
    window.xUtils = {};
}

window.xUtils.ajax = (function() {


    var members = {
        defaultEmptyOpts: function(opts) {

            if (opts) {
                opts.beforeSend = function() {
                    utils.dialog.empty();
                }
                opts.complete = function() {
                    utils.dialog.closeEmpty();
                }
            }
            return opts;
        },
        defaultSaveOpts: function(opts) {


            var message = opts.message || '数据保存中...';
            if (opts) {
                opts.beforeSend = function() {
                    utils.dialog.wait(message);
                }
                opts.complete = function() {
                    utils.dialog.closeWait();
                }
            }
            return opts;
        },
        defaultListOpts: function(opts) {

            if (opts) {
                opts.beforeSend = function() {
                    utils.dialog.loadding();
                }
                opts.complete = function() {
                    utils.dialog.closeLoadding();
                }
            }
        },
        post: function(url, data, onCustomeOpts) {
            var opts = {
                url: url,
                type: 'post',
                data: data,
                dataType: 'json',
                timeout: 20e3,
                success: function(data) {

                    if (onCustomeOpts && onCustomeOpts.onSuccess) {
                        onCustomeOpts.onSuccess(data);
                    }
                },
                error: function(e) {


                    var message = e.responseText;
                    if (onCustomeOpts && onCustomeOpts.onError) {
                        onCustomeOpts.onError(message);
                    }
                },
                beforeSend: function() {
                    if (onCustomeOpts && onCustomeOpts.onBefore) {
                        onCustomeOpts.onBefore();
                    }
                },
                complete: function() {
                    if (onCustomeOpts && onCustomeOpts.onComplete) {
                        onCustomeOpts.onComplete();
                    }
                }
            };

            for (var key in onCustomeOpts) {
                opts[key] = onCustomeOpts[key];
            }
            $.ajax(opts);
        },
        save: function(url, data, opts) {

            if (!opts) {
                opts = {};
                opts.onSuccess = onSuccess;
            }
            if (!opts.onBefore) {

                opts.onBefore = function() {

                    if (xUtils && xUtils.dialog) {
                        xUtils.dialog.wait(opts.message || '请等待。。。');

                    }
                };

            }
            if (!opts.onComplete) {
                opts.onComplete = function() {
                    if (xUtils && xUtils.dialog) {
                        xUtils.dialog.closeWait();
                    }
                };
            }
            if (!opts.onError) {

                opts.onError = function(e) {
                    if (xUtils && xUtils.dialog) {
                        xUtils.dialog.alert();
                    }
                };
            }

            this.post(url, data, opts);
        },
        saveObj: function(url, data, opts) {

            if (!opts) {
                opts = {};
            }
            opts.type = 'post';
            opts.data = JSON.stringify(data);
            opts.dataType = "json";
            opts.contentType = 'application/json';
            this.save(url, data, opts);
        },
        list: function(url, data, opts) {
            if (!opts) {
                opts = {};
                opts.onSuccess = onSuccess;
            }
            if (!opts.onBefore) {

                opts.onBefore = function() {

                    if (xUtils && xUtils.dialog) {
                        xUtils.dialog.loadding();

                    }
                };

            }
            if (!opts.onComplete) {
                opts.onComplete = function() {
                    if (xUtils && xUtils.dialog) {
                        xUtils.dialog.closeLoadding();
                    }
                };
            }
            if (!opts.onError) {

                opts.onError = function(e) {
                    if (xUtils && xUtils.dialog) {
                        xUtils.dialog.alert();
                    }
                };
            }

            this.post(url, data, opts);
        }
    };
    return members;
})();
if (typeof window.xUtils == 'undefined') {
    window.xUtils = {};
}

window.xUtils.dialog = (function() {


    var members = {
        open: function(text, title, action) {

            var $dialog = $('<div class="cm-dialog" xdialog="xdialog"></div>');
            var $content = $('<div class="cm-dialog-content"></div>');
            var $title = $('<div class="cm-dialog-title"></div>');
            var $text = $('<div class="cm-dialog-text"></div>');
            var $action = $('<div class="cm-dialog-action"></div>');
            $title.html(title);
            $text.html(text);
            $action.html(action);
            if (title) {
                $content.append($title);
            }
            if (text) {
                $content.append($text);
            }
            $content.append($action);
            $dialog.append($content);
            $(document.body).append($dialog);
            $dialog.show();

            return $dialog;
        },
        alert: function(content, okFunc, title) {
            var $action = $('<span>确认</span>');
            var $dislog = this.open(content, title, $action);
            $action.click(function() {
                if (okFunc) {
                    okFunc.call(this);
                }
                $dislog.remove();
            });
        },
        confirm: function(content, okFunc, unOk, title) {
            var $actionOk = $('<span class="cm-dialog-action-ok">确认</span>');
            var $actionUnOk = $('<span class="cm-dialog-action-unok">取消</span>');
            var $action = $('<span></span>');
            $action.append($actionOk);
            $action.append($actionUnOk);
            var $dislog = this.open(content, title, $action);
            $actionOk.click(function() {
                if (okFunc) {
                    okFunc.call(this);
                }
                $dislog.remove();
            });
            $actionUnOk.click(function() {
                if (unOk) {
                    unOk.call(this);
                }
                $dislog.remove();
            });
        },
        close: function(selector) {

            if (!selector) {
                selector = 'cm-dialog';
            }
            $(selector).remove();
        },
        loadding: function() {


            var $dialog = $(' <div class="cm-dialog-loadding"  xdialog="xdialog"></div>');
            var $content = $('   <div class="cm-dialog-loadding-content"> </div>');

            $dialog.append($content);
            $(document.body).append($dialog);
        },
        closeLoadding: function() {
            this.close('.cm-dialog-loadding');
        },

        toast:function(content,timeout,onClose){

            this.tips(content,timeout,onClose);
        },
        tips: function(content, timeout, onClose) {
            var $dialog = $('<div class="cm-dialog-tips"  xdialog="xdialog"></div>');
            var $content = $('<div class="cm-dialog-tips-content"></div>');

            var $text = $('<span></span>');
            $text.html(content);
            $content.append($text);
            $dialog.append($content);
            $(document.body).append($dialog);


            setTimeout(function() {


                $dialog.remove();
                if (onClose) {
                    onClose();
                }
            }, timeout || 2000);

            return $dialog;
        },
        message: function(content) {
            var $dialog = $(' <div class="cm-dialog-message"  xdialog="xdialog"></div>');
            var $content = $('   <div class="cm-dialog-message-content"> </div>');
            var $text = $('<span></span>');
            $text.html(content);
            $content.append($text);
            $dialog.append($content);
            $(document.body).append($dialog);
            $dialog.click(function() {

                $(this).remove();
            });
        },
        closeMessage: function(selector) {
            this.close('.cm-dialog-message');
        },
        wait: function(content) {
            var $dialog = $(' <div class="cm-dialog-wait"  xdialog="xdialog"></div>');
            var $content = $('   <div class="cm-dialog-wait-content"> </div>');
            var $text = $('<span></span>');
            $text.html(content);
            $content.append($text);
            $dialog.append($content);
            $(document.body).append($dialog);
        },
        closeWait: function() {
            this.close('.cm-dialog-wait');
        },
        empty: function() {
            var $dialog = $(' <div class="cm-dialog-empty"  xdialog="xdialog"></div>');
            $(document.body).append($dialog);
        },
        closeEmpty: function() {
            this.close('.cm-dialog-empty');
        },
        closeAll:function(){
            $('[xdialog]').remove();
        }
    };
    return members;
})();

if (typeof window.xUtils == 'undefined') {
    window.xUtils = {};
}

window.xUtils.form = (function () {
    var members = {
        getForm: function (formTarget) {
            var $form = null;
            if (formTarget) {
                $form = formTarget;
            } else {
                $form = $('form:eq(0)');
            }
            return $form;
        },
        isValid: function (formTarget) {

            var $form = this.getForm(formTarget);
            var r = xUtils.valid.tests($form.find('[data-valid]'));
            if (r.isPassed == false) {
                return false;
            }
            return true;
        },
        init: function (formTarget,onBefore, onSuccess,onFails)
        {

            var $form = this.getForm(formTarget);
             if(xUtils.valid && xUtils.valid.blurValid){
                xUtils.valid.blurValid($form);
            }
            var me = this;
            $form.on('submit', function (event) {
                event.preventDefault();

                me.submit(formTarget, onBefore, onSuccess, onFails);
            });
        },
        submit: function (formTarget, onBefore, onSuccess, onFails)
        {
            var me = this;
            var $form = me.getForm(formTarget);
            if ((!me.isValid($form)) || (onBefore && onBefore() == false)) {
                return false;
            }
            var url = $form.attr('action');
            me.ajaxSubmit(url, me.getData($form), onSuccess, onFails);
        },
        ajaxSubmit: function (url,data,onSuccess,onFail,onError) {
            $.ajax({
                url: url,
                data: data,
                type: 'post',
                error: function (result)
                {

                    if (onError) {
                        onError(result, result.Msg);
                    }
                },
                success: function (result)
                {
                  onSuccess && onSuccess(result);
                }
            });
        },
        getData: function (formTarget) {
            var $form = this.getForm(formTarget);
            var datas = $form.serializeArray();
            return datas;
        }
    };
    return members;
})();

if (typeof $ !== 'undefined') {
    $.fn.ajaxForm= function (opts) {
            xUtils.form.init($(this), opts.onBefore, opts.onSuccess, opts.onFail);
        }
   
    $.fn.ajaxFormSubmit=function (opts) {
            xUtils.form.submit($(this), opts.onBefore, opts.onSuccess, opts.onFail);
    }
    
}
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
if (typeof $ !== 'undefined') {
	document.addEventListener('touchmove', function(e) {
		e.preventDefault();
	}, false);
	$.fn.scrollList = function(opts) {
		var $me = $(this);
		var $wrapper = $('<div class="scrollListWrapper" ></div>');
		var $scroller = $('<div class="scroller"></div>');
		var $Uploadding = $('<div class="scrollerLoadding"><span><span class="scrollerLoadding-circle"></span><span class="scrollerLoadding-text">数据加载中</span></span></div>');

		var $downloadding = $('<div class="scrollerLoadding"><span><span class="scrollerLoadding-circle"></span><span class="scrollerLoadding-text">数据加载中</span></span></div>');
		var $selector = $(this);
		$selector.wrap($wrapper).wrap($scroller);
		$Uploadding.css({
			top: 0
		});
		$downloadding.css({
			bottom: 0
		});
		$wrapper.append($Uploadding);
		$wrapper.append($downloadding);
		$Uploadding.hide();
		$downloadding.hide();
		var $UploaddingCircle = $('.scrollerLoadding-circle', $Uploadding);
		$UploaddingCircle.hide();
		var $UploaddingText = $('.scrollerLoadding-text', $Uploadding);
		var $downloaddingCircle = $('.scrollerLoadding-circle', $downloadding);
		$downloaddingCircle.hide();
		var $downloaddingText = $('.scrollerLoadding-text', $downloadding);
		var methods = {
			end: function() {
				$Uploadding.hide();
				$downloadding.hide();
				iscroll.refresh();

			}
		}
		if (typeof opts === 'string') {
			var method = methods[opts];
			if (method) {
				method.call(this)
				return;
			}
		}

		if (!opts) {
			opts = {};
		}


		var autoSize = opts.autoSize || true;
		if (autoSize && !opts.height) {
			opts.height = $wrapper.parent().height();
			$wrapper.height(opts.height);
		}
		if (!opts.onUp) {
			opts.onUp = function() {
				setTimeout(function() {
					$Uploadding.hide();
				}, 2000);
			};
		}
		if (!opts.onDown) {
			opts.onDown = function() {
				setTimeout(function() {
					$downloadding.hide();
				}, 2000);
			};
		}
		opts.probeType = 1;
		opts.mouseWheel = true;


		var iscroll = listScroll = new IScroll($wrapper[0], opts);
		var events = ['scrollEnd', 'beforeScrollStart', 'scrollStart', 'scrollCancel', 'refresh']
		iscroll.on('scrollStart', function(e, e1) {
			opts.status = "start";
			var y = this.startY;
			var maxY = this.maxScrollY;
			console.log('scrollStart:' + y);
			opts.upRefresh = false;
			opts.downRefresh = false;
			$Uploadding.hide();
			$downloadding.hide();
		});

		iscroll.on('scroll', function(e, e1) {
			var y = this.startY;
			var maxY = this.maxScrollY;
			var loaddingText;
			if (y > 0 && !opts.upRefresh) {
				$Uploadding.show();
				loaddingText = "下拉刷新...";
				$UploaddingCircle.hide();
				$UploaddingText.html(loaddingText);
			}
			if (y > 50 && !opts.upRefresh) {
				console.log('数据刷新中');
				opts.upRefresh = true;
				$UploaddingCircle.show();
				loaddingText = "数据刷新中...";
				$UploaddingText.html(loaddingText);
			} else if (maxY > y) {
				$downloadding.show();
				if (!opts.downRefresh) {
					loaddingText = "上拉刷新...";
					$downloaddingCircle.hide();
					$downloaddingText.html(loaddingText);
				}

				if (maxY - 50 > y) {
					console.log('数据刷新中');
					opts.downRefresh = true;
					$downloaddingCircle.show();
					loaddingText = "数据刷新中...";
					$downloaddingText.html(loaddingText);
				}
				console.log('下来刷新');
			}

			console.log('scroll :' + y);
		});
		iscroll.on('beforeScrollStart', function(e, e1) {
			console.log('beforeScrollStart');
		});
		iscroll.on('scrollEnd', function(e, e1) {
			console.log('scrollEnd');
			opts.status = "end";
			if (!opts.upRefresh) {
				$Uploadding.hide();
			} else {
				opts.onUp.call(this, methods);
			}
			if (!opts.downRefresh) {
				$downloadding.hide();
			} else {
				opts.onDown.call(this, methods);
			}
			opts.upRefresh = false;
			opts.Uploadding = false;
		});
		iscroll.on('scrollCancel', function(e, e1) {
			console.log('scrollCancel');
			opts.status = "cancel";
			opts.upRefresh = false;
			opts.Uploadding = false;
		});
		iscroll.on('refresh', function(e, e1) {
			console.log('refresh');
		});

		return iscroll;

	}

	var scrollerEvents = (function() {

		var methods = {
			initEvent: function(opts, element) {
				var events = ['scrollEnd', 'beforeScrollStart', 'scrollStart', 'scrollCancel', 'refresh']
				var _events = ['onScrollEnd', 'onBeforeScrollStart', 'onScrollStart', 'onScrollCancel', 'onRefresh'];
				$.each(_events, function(index, item) {
					if (typeof opts[item] === 'function') {
						element.on(events[index], opts[item]);
					}
				});
			}
		};
		return methods;
	})();
	$.fn.scrollItems = function(opts) {
		var iscroll;
		var $me = $(this);
		var $wrapper = $('<div class="scrollItemsWrapper" ></div>');
		var $scroller = $('<div class="scroller"></div>');
		$me.wrap($wrapper).wrap($scroller);
		if (!opts) {
			opts = {};
		}
		var org = {
			scrollX: true,
			scrollY: false,
			mouseWheel: true
		};
		for (var item in org) {
			opts[item] = org[item];
		}
		var totalWidth = 0;
		$me.children().each(function() {
			totalWidth += $(this).width();
		});
		var widthOpts = {
			width: totalWidth
		};
		$me.css(widthOpts);
		$scroller.css(widthOpts);
		iscroll = new IScroll($wrapper[0], opts);
		scrollerEvents.initEvent(opts, iscroll);
		return iscroll;
	}
	$.fn.scrollPage = function(opts) {

		var iscroll;
		var $me = $(this);
		var $wrapper = $('<div class="scrollerPagerWrapper" ></div>');
		var $scroller = $('<div class="scroller"></div>');
		$me.wrap($wrapper).wrap($scroller);
		if (!opts) {
			opts = {};
		}
		var newOpts = {
			scrollX: true,
			scrollY: false,
			mouseWheel: true,
			snap: true,
			momentum: false
		}
		$scroller.css({
			width: ($me.children().size() * 100) + '%'
		})
		for (var item in newOpts) {
			opts[item] = newOpts[item];
		}
		iscroll = new IScroll($wrapper[0], opts);
		scrollerEvents.initEvent(opts, iscroll);
		return iscroll;
	}

	$.fn.slider = function(opts) {
		var iscroll;
		var $me = $(this);
		var $wrapper = $('<div class="scrollerSliderWrapper"></div>');
		var $scroller = $('<div class="scroller"></div>');
		$me.wrap($wrapper).wrap($scroller);
		$wrapper.parent().css({
			position: 'relative'
		});
		if (!opts) {
			opts = {};
		}

		if (opts.class) {
			$wrapper.addClass(opts.class);
		}
		var newOpts = {
			scrollX: true,
			scrollY: false,
			mouseWheel: true,
			snap: true,
			momentum: false,
			pager: true
		};
		$scroller.css({
			width: ($me.children().size() * 100) + '%'
		});
		$.extend(opts, newOpts);
		iscroll = new IScroll($wrapper[0], opts);
		scrollerEvents.initEvent(opts, iscroll);
		if (opts.pager) {
			var $pager = $('<div class="pager"></div>');
			var $pagerUl = $('<ul></ul>');
			var pagerCount = $me.children().size();
			var activePagerClass = 'activePager';
			for (var i = 0; i < pagerCount; i++) {
				var $li = $('<li></li>');
				$li.data('pagerIndex', i);
				$li.tap(function() {
					var pagerIndex = $(this).data('pagerIndex');
					iscroll.goToPage(pagerIndex, 0);
					$pagerUl.find('li').removeClass(activePagerClass);
					$(this).addClass(activePagerClass);
				});
				$pagerUl.append($li);
			}

			$pagerUl.find('li').first().addClass(activePagerClass);
			$pager.append($pagerUl);
			$wrapper.append($pager);


			iscroll.on('scrollEnd', function() 
			{
				var currentPage = this.currentPage;
				var currentPageX = currentPage.pageX;
				$pagerUl.find('li').removeClass(activePagerClass);
				$pagerUl.find('li').eq(currentPageX).addClass(activePagerClass);
			});
		}
		return $scroller;
	}
};
if (typeof $ !== 'undefined') {
	document.addEventListener('touchmove', function(e) {
		e.preventDefault();
	}, false);
	$.fn.tmpl = function(tmplId,data,appendFunc) {

          var $me=$(this);
          var html = template(tmplId, data);
          if(!appendFunc){
          	      $me.append(html);
          }else{
          	appendFunc.call(this,html);
          }
       
	};
};