var imageUpload = (function(argument) {


	var members = {

		addEvent: function(dom, type, fn) {

			if (typeof document.addEventListener != "undefined") {
				dom.addEventListener(type, fn, false);

			} else {
				dom.attachEvent('on' + type, function() {
					fn.call(dom, arguments);

				});
			}
		},

		insertBefore: function(newElement, targetElement) {
			var parent = targetElement.parentNode;
			parent.insertBefore(newElement, targetElement);
		},
		insertAfter: function(newElement, targetElement) {
			var parent = targetElement.parentNode;
			if (parent.lastChild == targetElement) {
				// 如果最后的节点是目标元素，则直接添加。因为默认是最后
				parent.appendChild(newElement);
			} else {
				parent.insertBefore(newElement, targetElement.nextSibling);
				//如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
			}
		},
		upload: function(url, data, li, file, opts) {
			var fd = new FormData();
			fd.append("file", data);
			fd.append("name", file.value);
			var xhr = new XMLHttpRequest();
			var $progress = document.createElement('div');
			$progress.className = 'img-item-process';
			li.appendChild($progress);
			xhr.upload.addEventListener("progress", function(evt) {

				if (evt.lengthComputable) {
					var percentComplete = Math.round(evt.loaded * 100 / evt.total);
					$progress.style.height = percentComplete + '%';
					if (percentComplete == 100) {
						$progress.style.display = "none";
						opts && opts.onCompleted && opts.onCompleted(evt);
					}
				}

				opts && opts.onProcess && opts.onProcess(evt);
			}, false);
			xhr.addEventListener("load", function(evt) {
				opts && opts.onLoad && opts.onLoad(evt);
			}, false);
			xhr.addEventListener("error", function(evt) {

				opts && opts.onError && opts.onError(evt);
			}, false);
			xhr.addEventListener("abort", function(evt) {

				opts && opts.onAbort && opts.onAbort(evt);
			}, false);
			xhr.open("POST", url);
			xhr.send(fd);
		},
		init: function(opts) {

             if(!opts){
             	opts={};
             }
			var selector = opts.selector || '.imgs';
			var auto = true;
			var max = 9;
			var url = null;
			var me = this;
			var width = opts.width || 320;
			var height = opts.height || 320;
			var maxHeight=opts.maxHeight ||  800;
			var maxWidth = opts.maxWidth || 800;
			var autoSize= opts.autoSize  || false;
			if(opts &&opts.width){
				autoSize=false;
			}
			var $imgs = document.querySelectorAll(selector);
			for (var i = 0; i < $imgs.length; i++) {

				(function(i) {
					var $imgList = $imgs[i];

					var $imgPlus = document.querySelectorAll('.img-plus', $imgList)[0];
					var $btnUpload = document.querySelectorAll('.img-plus input[type=file]', $imgPlus)[0];
					me.addEvent($btnUpload, 'change', function(ev) {
						var img = new Image();

						var f = ev.target.files[0];
						if (f.type.match('image.*')) {
							var r = new FileReader();
							r.onload = function(e) {
								img.setAttribute('src', e.target.result);
							};
							r.readAsDataURL(f);
						}
						img.onload = function() 
						{
							var nw = img.naturalWidth, nh = img.naturalHeight;
							var _width=autoSize? nw : width;
							var _height= autoSize ?nh :height;

							var cv = document.createElement('div');
							cv.innerHTML = "<canvas></canvas>";
							var mpCanvas = cv.children[0];
                            var mpImg = new MegaPixImage(img);
                            mpImg.render(mpCanvas, { maxWidth:maxWidth, maxHeight:maxHeight,width:_width,height:_height,quality:0.8},function(){
                            var da = mpCanvas.toDataURL();
							var $li = document.createElement('li');
							$li.className = 'img-item';
							$li.appendChild(img);
							me.insertBefore($li, $imgPlus);
							if (console && console.log) {
								console.log(da);
							}
							if (document.querySelectorAll('.img-item', $imgList).length > max) {
								$imgPlus.style.display = "none";
							}
							if (opts.url) {
								me.upload(opts.url, da, $li, $btnUpload, opts);
							}
                            }); 
							
						}

						function esc(da) {
							da = da.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');
							return encodeURIComponent(da);
						}
					});


				})(i)
			}
		}

	};
	return members;
})();





/**
 * Mega pixel image rendering library for iOS6 Safari
 *
 * Fixes iOS6 Safari's image file rendering issue for large size image (over mega-pixel),
 * which causes unexpected subsampling when drawing it in canvas.
 * By using this library, you can safely render the image with proper stretching.
 *
 * Copyright (c) 2012 Shinichi Tomita <shinichi.tomita@gmail.com>
 * Released under the MIT license
 */
(function() {

  /**
   * Detect subsampling in loaded image.
   * In iOS, larger images than 2M pixels may be subsampled in rendering.
   */
  function detectSubsampling(img) {
    var iw = img.naturalWidth, ih = img.naturalHeight;
    if (iw * ih > 1024 * 1024) { // subsampling may happen over megapixel image
      var canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, -iw + 1, 0);
      // subsampled image becomes half smaller in rendering size.
      // check alpha channel value to confirm image is covering edge pixel or not.
      // if alpha value is 0 image is not covering, hence subsampled.
      return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
    } else {
      return false;
    }
  }

  /**
   * Detecting vertical squash in loaded image.
   * Fixes a bug which squash image vertically while drawing into canvas for some images.
   */
  function detectVerticalSquash(img, iw, ih) {
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = ih;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, 1, ih).data;
    // search image edge pixel position in case it is squashed vertically.
    var sy = 0;
    var ey = ih;
    var py = ih;
    while (py > sy) {
      var alpha = data[(py - 1) * 4 + 3];
      if (alpha === 0) {
        ey = py;
      } else {
        sy = py;
      }
      py = (ey + sy) >> 1;
    }
    var ratio = (py / ih);
    return (ratio===0)?1:ratio;
  }

  /**
   * Rendering image element (with resizing) and get its data URL
   */
  function renderImageToDataURL(img, options, doSquash) {
    var canvas = document.createElement('canvas');
    renderImageToCanvas(img, canvas, options, doSquash);
    return canvas.toDataURL("image/jpeg", options.quality || 0.8);
  }

  /**
   * Rendering image element (with resizing) into the canvas element
   */
  function renderImageToCanvas(img, canvas, options, doSquash) {
    var iw = img.naturalWidth, ih = img.naturalHeight;
    if (!(iw+ih)) return;
    var width = options.width, height = options.height;
    var ctx = canvas.getContext('2d');
    ctx.save();
    transformCoordinate(canvas, ctx, width, height, options.orientation);
    var subsampled = detectSubsampling(img);
    if (subsampled) {
      iw /= 2;
      ih /= 2;
    }
    var d = 1024; // size of tiling canvas
    var tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = tmpCanvas.height = d;
    var tmpCtx = tmpCanvas.getContext('2d');
    var vertSquashRatio = doSquash ? detectVerticalSquash(img, iw, ih) : 1;
    var dw = Math.ceil(d * width / iw);
    var dh = Math.ceil(d * height / ih / vertSquashRatio);
    var sy = 0;
    var dy = 0;
    while (sy < ih) {
      var sx = 0;
      var dx = 0;
      while (sx < iw) {
        tmpCtx.clearRect(0, 0, d, d);
        tmpCtx.drawImage(img, -sx, -sy);
        ctx.drawImage(tmpCanvas, 0, 0, d, d, dx, dy, dw, dh);
        sx += d;
        dx += dw;
      }
      sy += d;
      dy += dh;
    }
    ctx.restore();
    tmpCanvas = tmpCtx = null;
  }

  /**
   * Transform canvas coordination according to specified frame size and orientation
   * Orientation value is from EXIF tag
   */
  function transformCoordinate(canvas, ctx, width, height, orientation) {
    switch (orientation) {
      case 5:
      case 6:
      case 7:
      case 8:
        canvas.width = height;
        canvas.height = width;
        break;
      default:
        canvas.width = width;
        canvas.height = height;
    }
    switch (orientation) {
      case 2:
        // horizontal flip
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        break;
      case 3:
        // 180 rotate left
        ctx.translate(width, height);
        ctx.rotate(Math.PI);
        break;
      case 4:
        // vertical flip
        ctx.translate(0, height);
        ctx.scale(1, -1);
        break;
      case 5:
        // vertical flip + 90 rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.scale(1, -1);
        break;
      case 6:
        // 90 rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.translate(0, -height);
        break;
      case 7:
        // horizontal flip + 90 rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.translate(width, -height);
        ctx.scale(-1, 1);
        break;
      case 8:
        // 90 rotate left
        ctx.rotate(-0.5 * Math.PI);
        ctx.translate(-width, 0);
        break;
      default:
        break;
    }
  }

  var URL = window.URL && window.URL.createObjectURL ? window.URL :
            window.webkitURL && window.webkitURL.createObjectURL ? window.webkitURL :
            null;

  /**
   * MegaPixImage class
   */
  function MegaPixImage(srcImage) {
    if (window.Blob && srcImage instanceof Blob) {
      if (!URL) { throw Error("No createObjectURL function found to create blob url"); }
      var img = new Image();
      img.src = URL.createObjectURL(srcImage);
      this.blob = srcImage;
      srcImage = img;
    }
    if (!srcImage.naturalWidth && !srcImage.naturalHeight) {
      var _this = this;
      srcImage.onload = srcImage.onerror = function() {
        var listeners = _this.imageLoadListeners;
        if (listeners) {
          _this.imageLoadListeners = null;
          for (var i=0, len=listeners.length; i<len; i++) {
            listeners[i]();
          }
        }
      };
      this.imageLoadListeners = [];
    }
    this.srcImage = srcImage;
  }
MegaPixImage.prototype.renderImageToDataURL=function(img, options, doSquash){
  return renderImageToDataURL(img, options, doSquash);
}
  /**
   * Rendering megapix image into specified target element
   */
  MegaPixImage.prototype.render = function(target, options, callback) {
    if (this.imageLoadListeners) {
      var _this = this;
      this.imageLoadListeners.push(function() { _this.render(target, options, callback); });
      return;
    }
    options = options || {};
    var imgWidth = this.srcImage.naturalWidth, imgHeight = this.srcImage.naturalHeight,
        width = options.width, height = options.height,
        maxWidth = options.maxWidth, maxHeight = options.maxHeight,
        doSquash = !this.blob || this.blob.type === 'image/jpeg';
    if (width && !height) {
      height = (imgHeight * width / imgWidth) << 0;
    } else if (height && !width) {
      width = (imgWidth * height / imgHeight) << 0;
    } else {
      width = imgWidth;
      height = imgHeight;
    }
    if (maxWidth && width > maxWidth) {
      width = maxWidth;
      height = (imgHeight * width / imgWidth) << 0;
    }
    if (maxHeight && height > maxHeight) {
      height = maxHeight;
      width = (imgWidth * height / imgHeight) << 0;
    }
    var opt = { width : width, height : height };
    for (var k in options) opt[k] = options[k];

    var tagName = target.tagName.toLowerCase();
    if (tagName === 'img') {
      target.src = renderImageToDataURL(this.srcImage, opt, doSquash);
    } else if (tagName === 'canvas') {
      renderImageToCanvas(this.srcImage, target, opt, doSquash);
    }
    if (typeof this.onrender === 'function') {
      this.onrender(target);
    }
    if (callback) {
      callback();
    }
    if (this.blob) {
      this.blob = null;
      URL.revokeObjectURL(this.srcImage.src);
    }
  };

  /**
   * Export class to global
   */
  if (typeof define === 'function' && define.amd) {
    define([], function() { return MegaPixImage; }); // for AMD loader
  } else if (typeof exports === 'object') {
    module.exports = MegaPixImage; // for CommonJS
  } else {
    this.MegaPixImage = MegaPixImage;
  }

})();
