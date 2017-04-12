    (function($) {


        function __log(txt) {

            if (console && console.log) {

                console.log(txt);
            }

        }


        var isFinal = false;

        var speed = 1500;

        function showcase(opts) {


            this.opts = {

            };



            var me = this;
            var selector = opts.selector;
            selector.addClass('showcase');
            var $items = $('div', selector);
            this.opts.$items = $items;
            if (!opts.currentIndex) {
                opts.currentIndex = 0;


            }
            $.extend(true, this.opts, opts);
            this.setActive();
            $(document.body).on("mousewheel DOMMouseScroll", function(e) {



                var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
                    (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1)); // firefox
                if (delta > 0) {

                    // 向上滚
                    console.log("wheelup");
                    me.prev();
                } else if (delta < 0) {
                    // 向下滚
                    console.log("wheeldown");
                    me.next();
                }
                e.stopPropagation();
            });
            $items.on('touchstart', function(e) {

                __log('touchstart');

            });
            $items.on('touchmove', function(e) {
                __log('touchmove');
            });
            $items.on('touchend', function(e) {
                __log('touchend');
            });
            $.each($items, function(index) {
                $(this).css('z-index', 100 - index);

                $(this).data('index', index);
                //$(this).css('position','absolute');    
            });

            // body...
        }
        showcase.prototype = {
            setActive: function() {


                this.getActive().addClass('active');
            },
            getActive: function() {
                var $active = $(this.opts.$items[this.opts.currentIndex]);
                return $active;
            },
            removeActive: function() {
                this.getActive().removeClass('active');
            },
            next: function($me) {

                var me = this;
                if (me.opts.currentIndex == (me.opts.$items.size() - 1)) {
                    return;
                }


                if (isFinal) {
                    return;
                }
                isFinal = true;

                var $preActive = this.getActive();
                me.opts.currentIndex++;
                // var $currentActive=this.getActive();

                $preActive.animate({

                        top: '-100%'
                    },
                    speed,
                    function() {
                        isFinal = false;
                        /* stuff to do after animation is complete */
                    });



            },
            prev: function($me) {
                var me = this;
                if (me.opts.currentIndex == 0) {
                    return;
                }
                if (isFinal) {
                    return;
                }
                isFinal = true;

                me.opts.currentIndex--;
                var $preActive = this.getActive();
                $preActive.animate({

                        top: '0%'
                    },
                    speed,
                    function() {
                        isFinal = false;
                        /* stuff to do after animation is complete */
                    });
            }


        }

        $.fn.showcase = function(opts) {


            var newOpts = {
                selector: $(this)
            };

            $.extend(true, newOpts, opts);
            return new showcase(newOpts);
        }

    })(jQuery);



    $(function() {

        $('.showcase').showcase();
    });