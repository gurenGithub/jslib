
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