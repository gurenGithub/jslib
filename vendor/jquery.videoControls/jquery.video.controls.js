function __log(title) {

    if (console && console.log) {

        console.log(title);
    }
}
var videoUtils = (function() {



    var members = {

        fullScreen: function(element) {
            //此方法不可以在異步任務中執行，否則火狐無法全屏
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.oRequestFullscreen) {
                element.oRequestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullScreen();
            } else {

                var docHtml = document.documentElement;
                var docBody = document.body;
                var videobox = $('.jPlayer')[0];
                var cssText = 'width:100%;height:100%;overflow:hidden;';
                docHtml.style.cssText = cssText;
                docBody.style.cssText = cssText;
                videobox.style.cssText = cssText + ';' + 'margin:0px;padding:0px;';
                document.IsFullScreen = true;

            }

        },
        exitFullScreen: function() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.oRequestFullscreen) {
                document.oCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else {
                var docHtml = document.documentElement;
                var docBody = document.body;
                var videobox = $('.jPlayer')[0];
                docHtml.style.cssText = "";
                docBody.style.cssText = "";
                videobox.style.cssText = "";
                document.IsFullScreen = false;
            }
        }
    };

    return members;
})();

(function($) {


    //Time format converter - 00:00
    var timeFormat = function(seconds) {

        var h = Math.floor(seconds / 60 / 60) < 10 ? "0" + Math.floor(seconds / 60 / 60) : Math.floor(seconds / 60 / 60);
        var m = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60) : Math.floor(seconds / 60);
        var s = Math.floor(seconds - (m * 60)) < 10 ? "0" + Math.floor(seconds - (m * 60)) : Math.floor(seconds - (m * 60));
        return h + ":" + m + ":" + s;
    };

    //H5模式render
    function h5Controls(newOpts) {

        this.opts = {

            selector: newOpts.selector,
            $laoding: null,
            $progress: null,
            $play: null,
            $pause: null,
            $fullscreen: null,
            $sound: null,
            $container: null,
            isLive: newOpts.isLive


        };


        $.extend(true, this.opts, newOpts);
    };
    h5Controls.prototype = {

        addEvent: function(name, fn) {
            this.getVideo().unbind(name);
            //this.getContainer().delegate('video', name, fn);
            this.getVideo().on(name, fn);

        },
        getContainer: function() {

            return this.opts.selector;
        },
        getVideo: function() {

            return $('video', this.opts.selector);
        },
        getVideoElement: function() {

            return this.getVideo()[0];
        },
        startBuffer: function() {


            try {
                var me = this;
                var video = me.getVideoElement();
                var currentBuffer = video.buffered.end(0);
                var maxduration = video.duration;
                var perc = 100 * currentBuffer / maxduration;
                me.opts.$bufferBar.css('width', perc + '%');

                if (currentBuffer < maxduration) {
                    setTimeout(function() { me.startBuffer(); }, 500);
                }
            } catch (ex) {

            }
        },
        updatebar: function(x) {

            var me = this;
            var progress = me.opts.$progress;

            //calculate drag position
            //and update video currenttime
            //as well as progress bar

            var video = this.getVideoElement();
            var maxduration = video.duration;
            var position = x - progress.offset().left;
            var percentage = 100 * position / progress.width();
            if (percentage > 100) {
                percentage = 100;
            }
            if (percentage < 0) {
                percentage = 0;
            }
            me.opts.$timeBar.css('width', percentage + '%');
            me.opts.$progressCursor.css('left', percentage + '%');
            video.currentTime = maxduration * percentage / 100;
        },

        updateVolume: function(x, vol) {

            var me = this;
            var volume = me.opts.$volume;
            var percentage;
            //if only volume have specificed
            //then direct update volume

            if (vol == 0) {
                percentage = 0;
            } else if (vol) {
                percentage = vol * 100;
            } else {
                var position = x - volume.offset().top;
                percentage = (100 - 100 * position / volume.height());


            }

            if (percentage > 100) {
                percentage = 100;
            }
            if (percentage < 0) {
                percentage = 0;
            }

            //update volume bar and video volume


            var totalHeight = $('.mejs-volume-total', me.opts.$controls).height();
            var _top = (100 - percentage);

            if (_top <= 0) {
                _top += 8;
            }
            if (_top >= 100) {
                _top -= 8;
            }


            me.opts.$volumeBar.css('top', _top + '%');
            me.opts.$volumeCurrent.css('height', (percentage) + 'px');

            me.opts.$volumeCurrent.css('top', (_top + 8) + 'px');

            var video = me.getVideoElement();
            video.volume = percentage / 100;


            var _volume = video.volume;
            var $sound = me.opts.$sound;
            //change sound icon based on volume
            if (_volume == 0) {
                $sound.removeClass('mejs-mute').addClass('mejs-unmute');
                //$(this).removeClass('mejs-unmute').addClass('mejs-mute');
            } else {
                $sound.removeClass('mejs-unmute').addClass('mejs-mute');
            }

        },
        bindEvents: function() {

            var me = this;
            this.addEvent('loadedmetadata.videoControls', function() {
                setTimeout(function() { me.startBuffer(); }, 150);
                me.opts.$current.text(timeFormat(0));
                me.opts.$duration.text(timeFormat(me.getVideo()[0].duration));
                me.updateVolume(0, 0.7);
            });
            this.addEvent('canplay.videoControls', function() {
                me.opts.$loading.fadeOut(100);

            });
            this.addEvent('play.videoControls', function() {

                me.opts.$bigPlayer.fadeOut(100);
                me.opts.$play.addClass('playing');
                me.opts.$loading.fadeOut(100);

            });
            this.addEvent('pause.videoControls', function() {

                me.opts.$bigPlayer.fadeIn(100);
                me.opts.$play.removeClass('playing');
                me.getVideoElement().pause();

            });

            var completeloaded = false;
            this.addEvent('canplaythrough.videoControls', function() {
                completeloaded = true;

            });
            this.addEvent('ended.videoControls', function() {
                me.getVideoElement().pause();
                me.opts.$play.removeClass('playing');
                me.opts.$bigPlayer.show();

            });
            this.addEvent('seeking.videoControls', function() {


                if (!completeloaded) {
                    me.opts.$loading.fadeIn(200);
                }
            });
            this.addEvent('seeked.videoControls', function() {

               if (!completeloaded) {
                    me.opts.$loading.fadeOut(200);
                }
            });
            this.addEvent('waiting.videoControls', function() {
                me.opts.$loading.fadeIn(200);

            });

            //display current video play time
            this.addEvent('timeupdate.videoControls', function() {

                var video = me.getVideoElement();
                var currentPos = video.currentTime;
                var maxduration = video.duration;
                var perc = 100 * currentPos / maxduration;
                me.opts.$timeBar.css('width', perc + '%');
                me.opts.$current.text(timeFormat(currentPos));

                me.opts.$progressCursor.css('left', perc + '%');

                me.opts.$duration.text(timeFormat(me.getVideo()[0].duration));
            });
        },

        play: function() {

            var me = this;

            if (me.opts.$play) {
                me.opts.$play.addClass('playing');
                me.opts.$bigPlayer.hide();
            }
        },
        remove: function() {
            var me = this;

            if (me.opts && me.opts.selector) {
                $('.video-control-player', me.opts.selector).remove();
                $('.video-control-bigplay', me.opts.selector).remove();
                $('.video-control-loading', me.opts.selector).remove();
            }
        },
        renderControls: function() {
            var me = this;

            me.getContainer().css('background', '#000');
            me.getContainer().css('overflow', 'hidden');
            me.getVideo().removeAttr('controls');

            $('.video-control-player', me.opts.selector).remove();
            $('.video-control-bigplay', me.opts.selector).remove();
            $('.video-control-loading', me.opts.selector).remove();

            this.opts.$controls = $([
                '<div class="video-control-player">',
                '<div class="video-control-controlbar">',
                '	<div class="video-control-play-btn video-control-btn" title="Play/Pause video"><button type="button" aria-controls="mep_0" title="Play" aria-label="Play"></button></div>',
                '	<div class="video-control-time-display video-control-btn" >',
                '	<span class="current-time">00:00:00</span>',
                '       <div class="video-control-progress">',
                '		  <span class="video-control-progress-loaded"></span>',
                '	      <span class="video-control-progress-played"></span>',
                '	</div>',
                ' <span class="duration">00:00:00</span> ',
                '	</div>',
                '	<div class="video-control-fullscreen-btn video-control-btn" title="Switch to full screen"><button type="button" aria-controls="mep_0" title="Fullscreen" aria-label="Fullscreen"></button></div>',
                '	<div class="video-control-volume video-control-btn mejs-mute" title="Mute/Unmute sound">',
                '<button type="button" aria-controls="mep_0" title="Mute" aria-label="Mute"></button>',
                '		<a  class="mejs-volume-slider" aria-label="volumeSlider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="48" aria-valuetext="48%" role="slider" tabindex="0" style="display: none;">',
                '<div class="mejs-volume-total"></div>',
                '<div class="mejs-volume-current" style="height: 48px; top: 10px;"></div>',
                '<div class="mejs-volume-handle" style="top: 57px;"></div>',
                '</a>',

                '</div>',
                '</div>',
                '</div>'
            ].join(' '));

            this.opts.$bigPlayer = $('<div class="video-control-bigplay"></div>');
            this.opts.$loading = $('<div class="video-control-loading"></div>');
            this.opts.$progress = $('.video-control-progress', this.opts.$controls);
            this.opts.$play = $('.video-control-play-btn', this.opts.$controls);
            this.opts.$current = $('.current-time', this.opts.$controls);
            this.opts.$duration = $('.duration', this.opts.$controls);
            this.opts.$timeBar = $('.video-control-progress-played', this.opts.$controls);
            this.opts.$volume = $('.mejs-volume-total', this.opts.$controls);
            this.opts.$stop = $('.btnStop', this.opts.$controls);
            this.opts.$volumeBar = $('.mejs-volume-handle', this.opts.$controls);
            this.opts.$volumeCurrent = $('.mejs-volume-current', this.opts.$controls);
            this.opts.$sound = $('.video-control-volume', this.opts.$controls);
            this.opts.$fullscreen = $('.video-control-fullscreen-btn', this.opts.$controls);
            this.opts.$progressCursor = $('.video-control-progress-cursor', this.opts.$controls);
            this.opts.$bufferBar = $('.video-control-progress-loaded', this.opts.$controls);
            var $container = this.getContainer();
            $container.append(this.opts.$controls);
            $container.append(this.opts.$loading);
            $container.append(this.opts.$bigPlayer);
            $container.css('position', 'relative');

            me.getVideo().click(function(event) {
                //playpause();

                if (isLive()) {

                    return;
                }
                me.getVideoElement().pause();
                event.stopPropagation();
                return false;
            });

            this.opts.$sound.hover(function() {

                    $('.mejs-volume-slider', $(this)).show();
                },
                function() {

                    $('.mejs-volume-slider', $(this)).hide();
                })


            var isHover = false;
            setTimeout(function() {

                if (isHover) {
                    return;
                }
                if (me && me.opts && me.opts.$controls) {
                    me.opts.$controls.show().stop().animate({
                        'bottom': -70
                    }, 5000);
                }
            });

            $container.hover(function() {

                    isHover = true;
                    me.opts.$controls.show().stop().animate({
                        'bottom': 0
                    }, 500);
                    //me.opts.$controls.fadeIn();
                },
                function() {

                    //setTimeout(function(){
                    me.opts.$controls.show().stop().animate({
                        'bottom': -70
                    }, 3000);
                    // },3000);


                    //me.opts.$controls.fadeOut(5000);
                });


            var playpause = function() {


                if (isLive()) {
                    return;
                }
                var $btnPlay = me.opts.$play;
                var video = me.getVideoElement();
                if (video.paused || video.ended) {
                    $btnPlay.addClass('playing');
                    video.play();
                    me.opts.$bigPlayer.hide();
                } else {
                    $btnPlay.removeClass('playing');
                    video.pause();
                    me.opts.$bigPlayer.show();


                }
            };


            function isLive() {

                return me.opts.isLive;
            }

            this.opts.$bigPlayer.click(function(event) {

                if (isLive()) {
                    return;
                }
                /* Act on the event */
                playpause();
                event.stopPropagation();
                return false;
            });
            $('button', this.opts.$play).click(function(event) {

                playpause();
                event.stopPropagation();
                return false;
            });



            this.opts.$stop.on('click', function() {
                me.opts.$play.removeClass('paused');
                me.updatebar(me.opts.$progress.offset().left);
                me.getVideoElement().pause();
            });

            var timeDrag = false; /* check for drag event */
            this.opts.$progress.on('mousedown', function(event) {
                timeDrag = true;
                me.updatebar(event.pageX);
                event.stopPropagation();
                return false;
            });
            $(document).on('mouseup', function(event) {
                if (timeDrag) {
                    timeDrag = false;
                    me.updatebar(event.pageX);
                }
                event.stopPropagation();
                return false;
            });
            $(document).on('mousemove', function(event) {
                if (timeDrag) {
                    me.updatebar(event.pageX);
                }
                event.stopPropagation();
                return false;
            });


            var volumeDrag = false;

            var $volume = me.opts.$volume;
            $('.mejs-volume-slider', $container).on('mousedown', function(event) {
                volumeDrag = true;


                me.getVideoElement().muted = false;
                me.opts.$sound.removeClass('muted');
                me.updateVolume(event.pageY);
                event.stopPropagation();
                return false;
            });
            $(document).on('mouseup', function(event) {
                if (volumeDrag) {
                    volumeDrag = false;
                    me.updateVolume(event.pageY);
                    event.stopPropagation();
                    return false;
                }
            });
            $(document).on('mousemove', function(event) {
                if (volumeDrag) {
                    me.updateVolume(event.pageY);
                }
                event.stopPropagation();
                return false;
            });


            //sound button clicked
            $('button', me.opts.$sound).click(function(event) {

                var video = me.getVideoElement();
                video.muted = !video.muted;
                //$(this).toggleClass('mejs-unmute');
                if (video.muted) {

                    $(this).removeClass('mejs-mute').addClass('mejs-unmute');
                    //me.opts.$volumeBar.css('top', video.volume * 100 + '%');
                    me.updateVolume(0, 0.0);
                } else {
                    me.updateVolume(0, 1);
                    $(this).removeClass('mejs-unmute').addClass('mejs-mute');
                    //me.opts.$volumeBar.css('top', 0);
                }
                event.stopPropagation();
                return false;
            });


            var isFullScreen = false;


            this.opts.$fullscreen.click(function(event) {

                if (isFullScreen) {
                    videoUtils.exitFullScreen();
                    me.getContainer().css("cssText", "height: inherit;");
                    isFullScreen = false;
                    return;
                }
                videoUtils.fullScreen(me.opts.selector[0]);
                isFullScreen = true;
                event.stopPropagation();



                var __screenHeight = window.screen.height;
                var __screenWidth = window.screen.width;

                var $div = $('.jPlayer,video', me.getContainer());

                var __styles = { height: __screenHeight, width: __screenWidth };
                // $div.css(__styles);
                // me.getContainer().css('height',__screenHeight+'px');

                me.getContainer().css("cssText", "height: 100% !important;");
                $div.css("cssText", "height: 100% !important;");
                //me.getContainer().addClass('video-control-fullscreen');
                me.getContainer().css('background', '#000');
                __log("fullscreen: " + $('.jPlayer').width() + ":" + $('.jPlayer').height());
                return false;
            });

        },
        render: function() {
            var me = this;

            this.renderControls();
            me.bindEvents();

            if (this.opts.autoplay) {
                this.play();
            }
        }

    };

    //兼容低版本浏览器render
    function domControls() {


    };
    domControls.prototype = {

        bindEvents: function() {


        }

    };


    var _h5Controls = null;
    $.fn.videoControls = function(opts, args) {

        if (typeof opts === 'string') {


            if (!_h5Controls) {
                return;
            }
            _h5Controls[opts](args);
            return;
        }
        var $me = $(this);
        if (!opts) {
            opts = {};
        }
        opts.selector = $me;
        _h5Controls = new h5Controls(opts);
        _h5Controls.render();
        //domtype == video render h5


    };

})(jQuery);
