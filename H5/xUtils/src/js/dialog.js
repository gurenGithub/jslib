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
        }
    };
    return members;
})();