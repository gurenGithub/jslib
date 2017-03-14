(function($) {
    function Barrager(dom, opts) {



        var $container;

        if (opts.isH5) {

            var $canvas = $('<canvas style="width:100%;position: absolute;z-index:20;left:0;top:0;max-height:80%;" class="barrager-container"></canvas>');
            var __container = $('.barrager-container', dom);
            if (__container.size() == 0) {
                dom.append($canvas);
                $container = $canvas;
                dom.css('position', 'relative');
                this.canvas = $canvas[0];
                __container=$canvas;
            } else {
                this.canvas = __container[0];
            }
            this.$container = __container;
        } else {


            var __container = $('.barrager-container', dom);
            if (__container.size() == 0) {
                $container = $('<div style="width:100%;position: absolute;z-index:20;left:0;top:0;max-height:80%;" class="barrager-container"></div>');
                dom.append($container);
                this.$container = $container;
            } else {
                this.$container = __container;
            }

        }


        //this.canvas = dom.get(0);

        if (!opts) {
            opts = {};
            opts.isH5 = true;
        }
        this.ctx = null;
        this.font = null;
        this.opts = opts;
        this.font = "16px 黑体";


        if (opts && opts.isH5 == true) {
            this.ctx = this.canvas.getContext("2d");

            this.ctx.font = this.font;
        }

        this.msgs = [];
        this.width = this.$container.width() || 1280;
        this.height = this.$container.height() || 720;
        if (opts) {

            this.height = opts.height || 200;
            this.$container.height(this.height);
        }

        if (this.canvas) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }

    

        this.speed = 30;

        this.colorArr = ["Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue"];
        this.interval = "";


        var me = this;
        $(window).on('resize.jQueryBarrager', function() {


            if (me) {
                me.height = me.$container.height();
                me.width = me.$container.width();
               // me.removeTimer();

                 if(me.opts.isH5){
                    me.canvas.height=me.height;
                    me.canvas.width=me.width;
                 }
                me.clear();
                me.draw(true);
            }
        });
        this.drawHtml = function(isone) {

            if (this.interval != "") return;
            var _this = this;
            var me = this;
            var _width = _this.width;
            var _height = _this.height;


            this.interval = setInterval(function() {
                //var _this = this;
                // _this.ctx.clearRect(0, 0, _this.width, _this.height);
                // _this.ctx.save();
                for (var i = 0; i < _this.msgs.length; i++) {

                    var _message = _this.msgs[i];


                    if (!_message || _message.isOld) {
                        continue;
                    }

                    if (!_message.$message) {

                        var $message = $('<span style="position:absolute;display: inline-block;padding:20px 5px;white-space:nowrap; "><span>');
                        //$message.html(_)
                        $message.css({left:'-9999px'})
                        _message.$message = $message;

                        me.$container.append(_message.$message);

                    }

                    if(isone){
                    _this.msgs[i].L = _this.width;

                    }
                    if (!(_this.msgs[i] == null || _this.msgs[i] == "" || typeof(_this.msgs[i]) == "undefined") ) {
                        if (_this.msgs[i].L == null || typeof(_this.msgs[i].L) == "undefined"
                            
                            
                            ) {
                            _this.msgs[i].L = _this.width;
                            _this.msgs[i].T = parseInt(Math.random() * (_this.height )+ 20);
                            _this.msgs[i].S = parseInt(Math.random() * (10 - 4) + 4);
                            _this.msgs[i].C = _this.colorArr[Math.floor(Math.random() * _this.colorArr.length)];
                        } else {
                            if (_this.msgs[i].L < -600) {
                                _this.msgs[i].$message.remove();
                                _this.msgs[i] = null;
                                // _message.isOld=true;

                            } else {
                                _this.msgs[i].L = parseInt(_this.msgs[i].L - _this.msgs[i].S);
                                var _text = _this.msgs[i].msg;
                                var _left = _this.msgs[i].L;
                                var _top = _this.msgs[i].T;

                                _this.msgs[i].$message.css({
                                    top: _top,
                                    left: _left + 400,
                                    color: _this.msgs[i].C
                                }).html(_text);
                                //  _this.ctx.fillText(_this.msgs[i].msg,_this.msgs[i].L,_this.msgs[i].T);
                                //  _this.ctx.restore();
                            }
                        }
                    }

                isone=false;
                    if (_this.isStop) {
                        _this.removeTimer();
                    }
                }
            }, this.speed);
        };
        this.drawH5 = function(isone) {
            if (this.interval != "") return;
            var _this = this;

            this.interval = setInterval(function() {


                _this.ctx.clearRect(0, 0, _this.width, _this.height);
                _this.ctx.save();
                for (var i = 0; i < _this.msgs.length; i++) {

                    if (_this.msgs[i] == null || _this.msgs[i].isOld) {
                        continue;
                    }

                    if(isone){

                        _this.msgs[i].L = _this.width;
                    }
                    if (!(_this.msgs[i] == null || _this.msgs[i] == "" || typeof(_this.msgs[i]) == "undefined")) {
                        if (_this.msgs[i].L == null || typeof(_this.msgs[i].L) == "undefined") {
                            _this.msgs[i].L = _this.width;
                            _this.msgs[i].T = parseInt(Math.random() * (_this.height )+ 20);

                            if(_this.msgs[i].T+20>=_this.height){
                                _this.msgs[i].T=_this.height-20;
                            }
                            _this.msgs[i].S = parseInt(Math.random() * (10 - 4) + 4);
                            _this.msgs[i].C = _this.colorArr[Math.floor(Math.random() * _this.colorArr.length)];
                        } else {
                            if (_this.msgs[i].L < -600) {
                                //_this.msgs[i] = null;
                                _this.msgs[i].isOld=true;
                            } else {
                                _this.msgs[i].L = parseInt(_this.msgs[i].L - _this.msgs[i].S);
                                _this.ctx.fillStyle = _this.msgs[i].C;
                                _this.ctx.font = _this.font;

                                _this.ctx.font = _this.font;
                                _this.ctx.fillText(_this.msgs[i].msg, _this.msgs[i].L + 400, _this.msgs[i].T);
                                _this.ctx.restore();
                            }
                        }
                    }
                }

                isone=false;
               if (_this.isStop) {
                        _this.removeTimer();
                    }
            }, this.speed);

        };

        this.draw = function(isone) {

            if (this.opts.isH5) {
                this.drawH5(isone);
            } else {
                this.drawHtml(isone);
            }
        }
        this.putMsg = function(datas) {
            for (var j = 0; j < datas.length; j++) {
                // for (var i = 0; i < this.msgs.length; i++) {


                this.msgs.push(datas[j]);
                // }
            }
            this.draw();
        };
        this.clear = function() {

            if (!this.opts.isH5) {
                this.$container.empty();
            } else {
                this.ctx.clearRect(0, 0, this.width, this.height);
                this.ctx.save();
            }
            this.removeTimer();

            for (var i = 0; i < this.msgs.length; i++) {
                this.msgs[i] = null;
            }
        };
        this.pause = function() {

            this.isStop = true;
            clearInterval(this.interval);

        };
        this.resume = function() {
            this.isStop = false;
            clearInterval(this.interval);
            this.draw();

        }
        this.removeTimer = function() {

            clearInterval(this.interval);
            this.interval = "";
        };
        this.start = function() {
            this.isStop = false;
            this.removeTimer();
            this.clear();
            this.draw();
        };
        this.end = function() {
            this.isStop = true;
            this.clear();
        }



    }

    $.fn.barrager = function(para, opts) {
        if (opts && opts.isReload) {

            $(this).data('barrager_api', null);
        }
        if (typeof(para) == "string") {
            try {
                var api = $(this).data('barrager_api');
                api[para].apply(api);
            } catch (e) {}
        } else if (typeof para == 'object' || !para) {
            $this = $(this);
            if ($this.data('barrager_api') != null && $this.data('barrager_api') != '') {
                var api = $this.data('barrager_api');
                api.putMsg(para);
            } else {
                var api = new Barrager($this, opts);
                $this.data('barrager_api', api);
                api.putMsg(para);
            }
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.barrager');
        }
        return this;
    }
})(jQuery);