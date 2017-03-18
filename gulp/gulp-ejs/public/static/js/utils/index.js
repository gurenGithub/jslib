if(typeof xUtils ==='undefined'){

	var xUtils={};
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
            return opts;
        },
        get:function(url,data,onCustomeOpts){

            if(!onCustomeOpts){
                onCustomeOpts={};
            }
            onCustomeOpts.type='GET';
            this.post(url, data, onCustomeOpts);
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