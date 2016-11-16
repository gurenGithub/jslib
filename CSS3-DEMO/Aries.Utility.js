//AR.Global 定义
window.AR = (function ($Core) {
    //自定义的健值对数组
    $Core.Dictionary = function () {
        this.length = 0;
        this.set = function (key, value) {
            if (key != undefined) {
                if (this[key] == undefined) {
                    this.length++;
                }
                this[key] = value;
            }
        };
        this.remove = function (key) {
            if (key) {
                if (this[key] != undefined) {
                    this.length--;
                }
                delete this[key];
            }

        }
    };
    $Core.Global = {
        DG: {
            //datagrid集合，根据ID取出DataGrid对象，将Json当数组用。
            Items: new $Core.Dictionary(),
            //当前操作的datagrid对象
            operating: null,
            //当前页面DataGrid操作，值为Update，Add
            action: null
        },
        route: { root: 'ajax.html' },
        comboxData: [],
        //存档Config_KeyValue的数据。
        Config: {},
        /*
        *页面全局变量
        *ui(虚拟应用程序的路径)，actionkeys（页面对应的权限集）,mid（当前菜单ID）
        */
        Variable: {},
        //存档用户信息
        _User: undefined,
        /*
       *获取当前登陆用户的信息
       */
        GetUser: function (callBack) {
            var topWin = window;
            if (!this._User) {
                this._User = (function (win) {//递归到index.html页取值。
                    var ar = win.AR;
                    if (ar.Global._User || win == win.top) {
                        topWin = win;
                        return ar.Global._User;
                    }
                    return arguments.callee(win.parent.window);
                })(topWin);
            }
            if (!this._User)//从远程获取。
            {
                AR.Utility.Ajax.get("GetUserInfo", null, null, true, null, function (data) {
                    AR.Global._User = data;
                    callBack && callBack(data);
                });
            }
            else {
                return this._User;
            }
        }
    };
    return $Core;
})(window.AR || {});

//AR.Utility 定义
(function ($, $Core) {
    $Core.Utility = {

        //深度克隆对象
        cloneObject: function (obj) {
            var objClone;
            if (obj.constructor == Object) {
                objClone = new obj.constructor();
            } else {
                objClone = new obj.constructor(obj.valueOf());
            }
            for (var key in obj) {
                if (objClone[key] != obj[key]) {
                    if (typeof (obj[key]) == "object") {
                        objClone[key] = clone(obj[key]);
                    } else {
                        objClone[key] = obj[key];
                    }
                }
            }
            objClone.toString = obj.toString;
            objClone.valueOf = obj.valueOf;
            return objClone;
        },
        //克隆数组
        //hasObjcet,数组是否存在对象
        cloneArray: function (array, hasObject) {
            var newArray = [];
            if (array) {
                if (hasObject == true) {
                    for (var i = 0, len = array.length; i < len; i++) {
                        if (typeof (array[i]) == "object") {
                            newArray.push(this.cloneObject(array[i]));
                        } else {
                            newArray.push(array[i]);
                        }
                    }
                } else {
                    newArray = null;
                }
            }
            return newArray;
        },

        /**
         *将普通数组转成树形数组，根据数组内对象的id跟parent属性过滤
         *@nodes {array} nodes
         *@return {array} 树形数组
        */
        //获取下拉树形递归,nodes参数是一个对象数组，根据对象的id跟parent属性过滤
        getTree: function (nodes) {
            return function (pid) {
                pid || (pid=''); //undefined,null,都转''处理
                var cn = new Array();
                for (var i = 0; i < nodes.length; i++)
                {
                    var n = nodes[i];
                    n.parent || (n.parent='')
                    if (n.parent == pid)
                    {
                        n.id = n.value;
                        n.children = arguments.callee(n.id);
                        cn.push(n);
                    }
                }
                return cn;
            }(undefined);
        },

        /**
            *模拟.NET的Request对象
            *@param {string} key
            */
        queryString: function (key) {
            var svalue = location.search.match(new RegExp("[\?\&]" + key + "=([^\&]*)(\&?)", "i"));
            return svalue ? svalue[1] : svalue;
        },
        /**
            *模拟.NET的String.Format函数，调用方式String.Format("a={0}",'a')
            *@param {string} str 需要格式的字符串
            *@param {params} arguments
            */
        stringFormat: function (str, args) {
            var len = arguments.length;
            var ostr = arguments[0].toString();
            for (var i = 0; i + 1 < len; i++) {
                ostr = ostr.replace(new RegExp("\\{" + i + "\\}", "gim"), arguments[i + 1]);
            }
            return ostr;
        },

        //生成随机guid数
        guid: function () {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },
        /**
        *@param {int|double} s:传入的float数字 
        *@param{int} n:希望返回小数点几位
        */
        fmoney: function (s, n) {
            n = n > 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
            t = "";
            for (i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            return t.split("").reverse().join("") + "." + r;
        },

        loadJs: function (url, callback) {
            var done = false;
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.language = 'javascript';
            script.src = url;
            script.onload = script.onreadystatechange = function () {
                if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete')) {
                    done = true;
                    script.onload = script.onreadystatechange = null;
                    if (callback) {
                        callback.call(script);
                    }
                }
            }
            document.getElementsByTagName("head")[0].appendChild(script);
        },
        loadCss: function (url, callback) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.media = 'screen';
            link.href = url;
            document.getElementsByTagName('head')[0].appendChild(link);
            if (callback) {
                callback.call(link);
            }
        },
        Cookie: {
            get: function (name) {
                var c = document.cookie;
                var start = c.indexOf(name);
                if (start > -1) {
                    start = start + name.length + 1;
                    var end = c.indexOf(';', start);
                    if (end > start) {
                        return c.substr(start, end - start);
                    }
                    return c.substr(start, c.length - start);
                }

            },
            set: function (key, value, expiredays) {
                var exdate = new Date();
                exdate.setDate(exdate.getDate() + expiredays);
                document.cookie = key + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
            },
            remove: function (name) {
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cval = this.get(name);
                if (cval != null) { document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString(); }
            }
        },
        download: function (method, data, url) {
            var url = url || $Core.Global.route, frame_id = "f_id", frame_name = "f_name";
            data || (data = {}), $form = $("<form>");
            $("#" + frame_id).remove();

            var topWin = window, mid = $Core.Global.Variable.mid;
            if (!mid) {
                mid = (function (win) {
                    var ar = win.AR;
                    if (ar.Global.Variable.mid || win == win.top) {
                        topWin = win;
                        return ar.Global.Variable.mid;
                    }
                    return arguments.callee(win.parent.window);
                })(topWin);
            }

            $ifrme = $("<iframe>").attr("id", frame_id).attr("name", frame_name).css({ display: 'none' });
            $form.attr("action", url).attr("target", frame_name)
                .append($("<input>").attr("name", "sys_method").val(method));
            if (mid && mid != '' && topWin != window) {
                $form.append($("<input>").attr("name", "sys_mid").val(mid));
            }
            if (data) { for (var i in data) { $form.append($("<input>").attr("name", i).val(data[i])); } };
            $("body").append($ifrme).append($form);
            $form[0].submit();
            $ifrme.on('load', function () {
                var doc = this.contentDocument || this.contentWindow.document;
                var result = JSON.parse(doc.body.innerHTML);
                $Core.Utility.Window.showMsg(result.msg);
                $form.remove();
            });
        },
        getPageWindow: function () {
            var win = (function (win) {
                var ar = win.AR;
                if (ar.Global.Variable.mid || win == win.top) {
                    return win;
                }
                return arguments.callee(win.parent.window);
            })(window);
            return win;
        },
        //生成表单下拉框。
        createInputHtml: function ($container, dataArray, dg, fromSearch) {
            var line;
            var objName, cssName;
            for (var i = 0, len = dataArray.length; i < len; i++) {
                if (i % 3 == 0) {
                    line = $("<div class=\"line\">");
                    $container.append(line);
                }
                var div_item = $("<div class=\"short\">");
                var label = $("<label>").html(dataArray[i].title + "：");
                div_item.append(label);
                var input = $("<input type=\"text\"/>");
                var input2;//日期时的第二个框
                //如果是下拉框模式执行以下代码
                var configKey;
                if ((typeof (dataArray[i].formatter) == "string" && dataArray[i].formatter.indexOf('#') != -1)) {
                    if (/C_+/.test(dataArray[i].formatter)) {
                        objName = dataArray[i].formatter.split('#')[1];
                    } else {
                        configKey = dataArray[i].formatter.split('#')[1];
                    }
                }

                if (configKey || (objName && objName != '' && objName.indexOf('$') == -1))//绑定下拉
                {
                    input.attr("onchange", "$Core.Common._Internal.onQuery");//("+dg.id+")
                    input.attr("name", dataArray[i].field);
                    if (configKey) {
                        input.attr("configkey", configKey)
                        configKey = undefined;
                    }
                    else {
                        if (objName.indexOf('#') > -1) {
                            objName = objName.split('#')[1];
                        }
                        var arrayObjname = [];
                        if (objName.indexOf('=>')) {
                            arrayObjname = objName.split('=>');
                            objName = arrayObjname[0];
                            input.attr("parent", arrayObjname[1]);
                        }
                        input.attr("objname", objName);
                    }
                    if (dataArray[i].rules && dataArray[i].rules.indexOf('#') != -1) {
                        //onlytext 标记只显示text 不显示 value 针对查询区域使用
                        input.attr('multiple', 'true').attr('pattern', 'IN');
                    }
                    if (dataArray[i].rules && dataArray[i].rules.indexOf("$2") != -1) {
                        this._setInputAttr(input, dataArray[i].rules, "$2:");
                    }

                }
                else if (dataArray[i].datatype)//非绑定下拉
                {
                    var dtype = dataArray[i].datatype.split(',');
                    switch (dtype[0]) {
                        case "date":
                        case "datetime":
                            cssName = "easyui-datebox";
                            input.attr("name", dataArray[i].field).addClass(cssName).attr("date", true).width(150).attr("validType", "datebox");
                            if (fromSearch && dataArray[i].rules && dataArray[i].rules.indexOf('$1') != -1) {
                                input.width(95);
                                this._setInputAttr(input, dataArray[i].rules, "$1:", label);
                                if (input.attr("clone") != "false") {
                                    input2 = input.clone(true);
                                    div_item.append(input2).append($("<span>").html("&nbsp;至&nbsp;"));
                                }
                            }
                            break;
                        case "int32":
                        case "int64":
                        case "int16":
                        case "byte":
                        case "double":
                        case "single":
                        case "decimal":
                            cssName = "easyui-numberbox";
                            if (dtype[2]) {
                                switch (dtype[0]) {
                                    case "single": case "double": case "decimal":
                                        input.attr("precision", dtype[2]); break;
                                }
                            }
                            input.attr("name", dataArray[i].field).addClass(cssName);
                            if (fromSearch && dataArray[i].rules && dataArray[i].rules.indexOf('$1') != -1) {
                                input.width(68);
                                this._setInputAttr(input, dataArray[i].rules, "$1:", label);
                                if (input.attr("clone") != "false") {
                                    input2 = input.clone(true);
                                    div_item.append(input2).append($("<span>").html("&nbsp;-&nbsp;").css({ "display": "block", "float": "left" }));
                                }
                            }
                            break;
                        default:
                            if (dtype[0] == "string") { cssName = ""; }
                            input.attr("name", dataArray[i].field).addClass(cssName);
                            if (fromSearch && dataArray[i].rules && dataArray[i].rules.indexOf('$1') != -1) {
                                this._setInputAttr(input, dataArray[i].rules, "$1:", label);
                            }
                            break;
                    }
                    if (dtype[1]) {
                        var size = parseInt(dtype[1]);
                        var scale = dtype[2];
                        if (scale && scale != 0) //带符点数
                        {
                            size = size + parseInt(scale) + 1; //重置长度,+1是加上.的占位符
                        }
                        input.addClass("easyui-validatebox");
                        if (!input.attr("validType")) {
                            input.attr("validType", "length[1," + size + "]");
                        }
                        if (input2) {
                            input2.addClass("easyui-validatebox");
                            if (!input2.attr("validType")) {
                                input2.attr("validType", "length[1," + size + "]");
                            }
                        }
                    }

                }

                if (dg && dg.Search) {
                    if (input2) {
                        dg.Search.Items.set(dataArray[i].field, [input, input2]);
                    }
                    else {
                        dg.Search.Items.set(dataArray[i].field, input);
                    }
                }
                div_item.append(input);
                line.append(div_item);
                objName = undefined; cssName = undefined; input = undefined; input2 = undefined;
            }
        },
        _setInputAttr: function ($input, rules, splitFlag, $label) {
            var _rules = rules.split(splitFlag)[1];
            if (_rules) {
                _rules = eval("(" + _rules + ")");
                for (var name in _rules) {
                    var value = _rules[name];
                    switch (name) {
                        case "width":
                            $input.width(value);
                            break;
                        case "heigth":
                            $input.heigth(value);
                            break;
                        case "title":
                            if ($label) { $label.html(value + "："); }
                            break;
                        default:
                            $input.attr(name, value);
                            break;
                    }
                }
            }
        }

    };
    //Window对象域
    (function () {
        $Core.Utility.Window = {
            refresh: false,
            /*打开一个窗口,
            * update 默认false既添加，如更新传递true,调用此函数会触发更新AR.Global.DG.action的值
            *，opts重写窗口属性，具体用法查看easyui window API
            */
            open: open,
            //窗口的关闭事件
            close: close,
            showMsg: showMsg,
            confirm: confirm,
            openLoading: showLoading,
            closeLoading: closeLoading,
            dialog: dialog,
            closeDialog: closeDialog
        }
        function showLoading(message) {
            if ($("body")[0]) {
                var msg = message || "正在处理，请稍等......";
                var paddingtop = parseInt(document.documentElement.clientHeight / 2);
                var opacity = "opacity:.5;"
                var nv = navigator.userAgent.toLowerCase();
                if (/msie/.test(nv)) {
                    if (parseInt(/msie (\d+)/.exec(nv)[1]) < 10) {
                        opacity = "filter: alpha(opacity = 50);";
                    }
                }
                var loadingHtml = "<div id=\"LoadingDiv\" style='text-align:center; border:solid 2px #D4F0FC; font-weight: bold; float: left; width: 100%;  height:100%;line-height: 100%;  position: absolute;  top: 1px; left: 1px; z-index: 1000;" + opacity + "\" style=\"text-align: center; background-color:gray;  font-size: 14px; color: Red; padding-top:" + paddingtop + "px;'><div><img alt=\"\" src=\"/Style/Images/mask_loading.gif\" /></div><div>" + msg + "<span style='cursor:pointer' onclick=\"AR.Window.closeLoading();\">关闭</span></div></div>";

                if ($("#LoadingDiv")[0]) {
                    $("#LoadingDiv").show();
                }
                else {
                    $(document.body).append(loadingHtml);
                    $("#LoadingDiv").show();
                }
            }
        }
        //关闭遮罩层
        function closeLoading() {
            if ($("#LoadingDiv")[0]) {
                $("#LoadingDiv").remove();
                $("#LoadingDiv").hide();
            }
        }
        /**
        *打开一个新页面
        *@param{string} url 连接
        *@param{string} title 打开后的窗口标题
        *@param{bool}   update 是否更新标记，默认false
        *param{object}  opts easyui window属性覆盖
        */
        function open(url, title, update, opts) {
            if (update != undefined && typeof (update) != "boolean") {
                throw new TypeError("第三个参数传入的类型必须是布尔类型！");
            }
            if (update) {
                AR.Global.DG.action = "Update";
            } else {
                AR.Global.DG.action = "Add";
            }
            var iframe;
            iframe = $('<iframe src="' + url + '" frameborder="0" style="border:0;width:100%;height:98%;"></iframe>');
            $("#AddWindow")[0] && $("#AddWindow").remove();
            var div = $("<div id='AddWindow' ></div>");
            var default_options = {
                title: title,
                border: false,
                fit: true,
                resizable: true,
                content: iframe,
                maximizable: false,
                minimizable: false,
                collapsible: false,
                modal: true,
                cache: false
            }
            div.window($.extend(default_options, opts));
        }
        function close() {
            if (this.refresh == true) {
                parent.location.reload();
            }
            window.parent.$("#AddWindow").window('close');
        }
        function confirm(msg, title, asyncFun) {
            $.messager.confirm(title || "温馨提示", msg, function (r) {
                if (r) {
                    if (typeof (asyncFun) == "function") {
                        asyncFun();
                    }
                }
            });
        }
        //注释看Easyui相关API
        function showMsg(msg, title, showType, timeout) {
            $.messager.show({
                title: title || "温馨提示",
                msg: msg,
                timeout: timeout || 1500,
                showType: showType || 'slide'
            });
        };
        function dialog(title, html, options) {
            var _container = $("#_div_dialog");
            _container[0] || (_container = $('<div>').attr('id', '_div_dialog'));
            opts = $.extend({
                title: title,
                width: 800,
                height: 450,
                modal: true,
                content: html
            }, options);
            _container.dialog(opts)
        };
        function closeDialog() {
            var _container = $("#_div_dialog");
            _container.dialog('destroy');
        }
    })();
    //Ajax对象域
    (function () {
        /***/
        $Core.Utility.Ajax = {
            Settings: {
                url: $Core.Global.route.root,
                method: 'GetList',
                data: {},
                dataType: 'json',
                async: true,
                callback: null
            },
            get: function (method, objName, data, async, url, callback, isShowProgress) {
                return ajax.call(this, method, objName, data, async, 'GET', url, callback, isShowProgress);
            },
            post: function (method, objName, data, async, url, callback, isShowProgress) {
                return ajax.call(this, method, objName, data, async, 'POST', url, callback, isShowProgress);
            }
        }
        function ajax(method, objName, data, async, type, url, callback, isShowProgress) {
            var that = this, json = {}, opts = new Object(), mid = $Core.Global.Variable.mid;
            var str = '{0}?sys_method={1}';
            if (objName) {
                var items = objName.split(',');
                if (objName.indexOf(',') == -1 || !items[1]) {
                    str = '{0}?sys_method={1}&sys_objName=' + objName;
                }
                else {
                    str = '{0}?sys_method={1}&sys_objName=' + items[0] + '&sys_tableName=' + items[1];
                }
            }
            url = $Core.Utility.stringFormat(str, url || that.Settings.url, method);
            var topWin = window;
            if (!mid) {
                mid = (function (win) {
                    var ar = win.AR;
                    if (ar.Global.Variable.mid || win == win.top) {
                        topWin = win;
                        return ar.Global.Variable.mid;
                    }
                    return arguments.callee(win.parent.window);
                })(topWin);
            }
            opts.data = data || that.Settings.data;
            if (mid && mid != '' && topWin != window) {
                if (!(data instanceof Array)) {
                    opts.data.sys_mid = mid;
                } else {
                    var item = { name: 'sys_mid', value: mid }
                    opts.data.unshift(item);
                }
            }
            opts.callback = callback || that.Settings.callback;
            $.ajax({
                type: type,
                async: (async == false && (!callback)) ? false : that.Settings.async,
                url: url || that.Settings.url,
                data: opts.data,
                dataType: that.Settings.dataType || "json",
                success: function (d) {
                    if (opts.callback && typeof (opts.callback) != "function") {
                        throw TypeError("the callback parameter not is a function");
                    }
                    if (d.success == false && /登陆/.test(d.msg)) {
                        $Core.Utility.Window.showMsg(d.msg);
                        json = null;
                    } else {
                        if (opts.callback) {
                            opts.callback(d);
                        }
                        opts.callback = undefined;
                        json = d;
                    }
                },
                error: function (d) {
                    try {
                        d = eval("(" + d.responseText + ")");
                        this.success(d);
                    }
                    catch (e) {
                        console.log("服务器返回数据出错");
                        //throw new Error("服务器返回数据出错");
                    }
                },
                beforeSend: function () {
                    if (isShowProgress) {
                        $Core.Utility.Window.openLoading();
                    }
                },
                complete: function () {
                    if (isShowProgress) {
                        $Core.Utility.Window.closeLoading();
                    }
                }
            });
            return json;
        }
    })();
})(jQuery, AR);


//AR.BtnBase 基类的定义
(function ($Core) {
    $Core.ExecuteEvent = ExecuteEvent;
    function ExecuteEvent() {
        this.onExecute = function () { }
        //此方法只有返回false时，才会停止执行onExecute跟onAfterExecute事件
        this.onBeforeExecute = function () { }
        this.onAfterExecute = function () { }
    }
    $Core.BtnBase = BtnBase;
    function BtnBase(flag) {
        ExecuteEvent.call(this)
        if (flag) {
            this.$target = $("#" + flag) || $('[flag = ' + flag + ']');
        }
        else { this.$target = null; }
        this.isHidden = false;
    }
    /**
    *该文件依赖与AR.Core.Utility.js文件
    */
    $Core.Utility.Ajax.post("GetInitConfig,GetKeyValueConfig", null, null, null, null, function (result) {
        $Core.Global.Variable = result.GetInitConfig;
        $Core.Global.Variable.isLoadCompleted = true;
        $Core.Global.Config = result.GetKeyValueConfig;
    });

})(AR);


//Jquery 扩展定义
(function ($) {

    //转换input变成lable形式
    $.fn.toView = function () {
        $(this).find(":input[type!='button'][type!='rest']").each(function () {
            var $jqueryItem = jQuery(this);
            if ($jqueryItem.css("display") == "none" || $jqueryItem.attr("type") == "hidden") {
            } else {
                var width = $jqueryItem.width();
                var value = $jqueryItem.val();
                var $span = jQuery("<span class='viewTitle' title=" + value + " style='display:inline-block; overflow: hidden;text-overflow: ellipsis;white-space: nowrap;padding-left:3px;'>" + value + "</span>");
                $span.css({ height: $jqueryItem.height(), width: width });
                $jqueryItem.wrap($span);
            }
            $jqueryItem.remove();

        });
        var viewClass = "view";
        $(".combo,.datebox").each(function () {
            var className = jQuery(this).attr("class");
            $(this).removeClass(className);
            $(this).addClass(viewClass);
            $(".viewTitle", $(this)).siblings().remove();
        })
    }
    /**
    *@return {bool}
    */
    $.isNullOrEmpty = function (obj) {
        if (obj && obj.trim() != "") {
            return false;
        } else {
            return true;
        }
    }
})(jQuery);


// Javascript对象属性扩展定义
(function () {
    Array.prototype.remove = function (v) {
        if (this instanceof Array) {
            var index = this.indexOf(v);  //IE9+
            if (index > -1) {
                this.splice(index, 1);  //利用splice()函数删除指定元素，splice() 方法用于插入、删除或替换数组的元素
            }
        }
    };
    Array.prototype.contains = function (v) {
        if (this instanceof Array) {
            if (this.indexOf) {
                return this.indexOf(v) != -1;
            } else {
                var result = false;
                each: for (var i = 0; i < array.length; i++) {
                    if (array[i].toString() == value.toString()) {
                        result = true;
                        break each;
                    }
                }
                return result;
            }
        }
    };
    // 对Date的扩展，将 Date 转化为指定格式的String   
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
    // 例子：   
    // (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
    // (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
    Date.prototype.format = function (fmt) { //author: meizz   
        var o = {
            "M+": this.getMonth() + 1,                 //月份   
            "d+": this.getDate(),                    //日   
            "h+": this.getHours(),                   //小时   
            "m+": this.getMinutes(),                 //分   
            "s+": this.getSeconds(),                 //秒   
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
            "S": this.getMilliseconds()             //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

})();