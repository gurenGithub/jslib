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