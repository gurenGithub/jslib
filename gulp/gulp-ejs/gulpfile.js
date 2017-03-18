var gulp = require('gulp');
var ejs = require('gulp-ejs');
var ejshelper = require('tmt-ejs-helper');
var through = require('through2');
var uglify = require('gulp-uglify'),
	less = require('gulp-less'),
	jshint = require('gulp-jshint'),
	cssmin = require('gulp-cssmin'),
	watch = require('gulp-watch'),
	autoprefixer = require('gulp-autoprefixer'),
	async = require('async'),
	beeper = require('beeper'),
	concat = require('gulp-concat'),
	gulpCopy = require('gulp-file-copy'),

	sass = require('gulp-sass'); //编译sass文件

var postcss = require('gulp-postcss');
var postcss1 = require('gulp-postcss');
var postcss2 = require('gulp-postcss');
var px2rem = require('postcss-px2rem');

var configOpts = {

	isDev: true,
	isMini: false,
	isRem: false,
	publicDir: 'public',
	concatPaths: ['utils', 'test'],
	getRemUnit: function() {
		if (this.isRem) {
			return 75;
		}
		return 1;
	},
	concatCssPaths: function() {
		return this.concatPaths;
	},
	remPaths: [],
	baseDir: 'resources',
	staticDir: 'static',
	viewsDir: 'views',
	getStatic: function() {

		return this.baseDir + '/' + this.staticDir;
	},
	getViews: function() {
		return this.baseDir + '/' + this.viewsDir;
	}

}

var gulpUtils = (function() {

	var members = {

		log: function(txt) {

			console.log(txt);
		},
		watch: function(dit, next) {

			//this.log('非监控:'+dit);
			if (!configOpts.isDev) {
				if (next) {
					next();
					return;
				}
			}

			this.log('监控:' + dit);
			watch(dit, function() {
				if (next) {
					next();
				}
			});
		},
		getStaticPublishPath: function(path) {

			return (configOpts.publicDir + '/' + configOpts.staticDir) + '/' + path;
		},
		getViewPublishPath: function() {
			var viewPath = (configOpts.publicDir + '/' + configOpts.viewsDir);

			this.log(viewPath);
			return viewPath;

		},
		getPath: function(path) {

			return configOpts.getStatic() + '/' + path;
		},
		getViewsPath: function(path) {
			return configOpts.getViews() ? (configOpts.getViews() + '/' + path) : path;
		},
		ejs: function(next, isWatch) {
			var me = this;


			var _viewPath = [me.getViewsPath('**/*.html'), '!' + me.getViewsPath('component/**/*.html')];

			function _ejs() {
				me.log('ejs begin')

				gulp.src(_viewPath)
					.pipe(ejs(ejshelper()))
					.pipe(gulp.dest(me.getViewPublishPath())).on('end', function() {

						if (next) {
							next();
						}
						me.log('ejs end');
					});
			}
			this.watch(_viewPath, _ejs);
		},
		concatCss: function() {

		},
		concat: function() {

			var me = this;
			this.concatJS(function() {
				//me.minifyJs();
			});
			this.concatCss();
		},
		getPublicPath: function(path) {

			return this.getStaticPublishPath(path);

		},
		minifyCss: function(next) {
			if (!configOpts.isMini) {

				if (next) {
					next();
				}
				return;


			}

			var minifyCssFile = function(fileName, next) {
				console.log("begin minifyCss");
				gulp.src('dist/css/' + fileName + '.css')
					.pipe(cssmin())
					.pipe(gulp.dest('dist/css'))
					.on('end', function() {
						console.log('done minifyCss');
						if (next) {
							next();
						}
					});
			};

		},
		minifyJs: function(next) {

			if (!configOpts.isMini) {

				if (next) {
					next();
				}
				return;


			}

			var minPath = this.getPublicPath('js/**/*.js');
			console.log("begin minifyJs :" + minPath);
			gulp.src([minPath,
					'!' + this.getPublicPath('js') + '/vendor/**/*.js'
				])
				.pipe(uglify())
				.pipe(gulp.dest(this.getPublicPath('js')))
				.on('end', function() {
					console.log('done minifyJs');
					if (next) {
						next();
					}
				});
		},

		getUnCopyJsFiles: function(next) {
			var me = this;
			var file = [];
			for (var i = 0; i < configOpts.concatPaths.length; i++) {

				var dir = configOpts.concatPaths[i];
				var path = me.getPath('js/' + dir + '/*.js');
				file.push(path);
				if (next) {
					next(path);
				}
			}

			return file;
		},
		getUnCopyCssFiles: function(next) {
			var me = this;
			var file = [];
			for (var i = 0; i < configOpts.concatCssPaths().length; i++) {

				var dir = configOpts.concatCssPaths()[i];
				var path = me.getPath('css/' + dir + '/*.css');
				file.push(path);
				if (next) {
					next(path);
				}
			}

			return file;

		},
		copyFiles: function(next) {
			this.copyJsFiles();
			this.copyCssFiles();
			this.copyImgFiles();
			this.copyVendorFiles();
		},

		copyJsFiles: function() {

			var me = this;

			var copyJsFilePath = [me.getPath('js/**/*')];
			me.getUnCopyJsFiles(function(path) {
				copyJsFilePath.push('!' + path);
			});


			var copyFiles = function(next) {
				console.log("begin copyFiles");


				me.log('copyJs begin');
				if (configOpts.isMini) {
					gulp.src(copyJsFilePath)
						.pipe(uglify())
						.pipe(gulp.dest(me.getPublicPath('js')))
						.on('end', function() {
							me.log('copyJs mini end');
						});
				} else {

					gulp.src(copyJsFilePath)
						.pipe(gulp.dest(me.getPublicPath('js')))
						.on('end', function() {
							me.log('copyJs end');

						});
				}
				return;
			};

			return me.watch(copyJsFilePath, copyFiles);
		},
		copyCssFiles: function() {
			var me = this;
			var copyCssFilePath = [me.getPath('css/**/*')];
			me.getUnCopyCssFiles(function(path) {
				copyCssFilePath.push('!' + path);

			});
			var __copyCss = function() {


				me.log('__copyCss begin');

				if (configOpts.isMini) {
					gulp.src(copyCssFilePath)
						.pipe(cssmin())
						.pipe(gulp.dest(me.getPublicPath('css')))
						.on('end', function() {
							me.log('__copyCss end');

						})
				} else {

					gulp.src(copyCssFilePath)
						//.pipe(cssmin())
						.pipe(gulp.dest(me.getPublicPath('css')))
						.on('end', function() {
							me.log('__copyCss end');

						})
				}


			}
			return me.watch(copyCssFilePath, __copyCss);
		},
		copyImgFiles: function() {

			var me = this;
			var copyImgFilePath = [me.getPath('img/**/*')];


			var __copyImg = function() {
				me.log('__copyImg begin');
				gulp.src(copyImgFilePath)
					.pipe(gulp.dest(me.getPublicPath('img')))
					.on('end', function() {
						me.log('__copyImg end');

					});
			}
			return me.watch(copyImgFilePath, __copyImg);

		},
		copyVendorFiles: function() {

			var me = this;
			var copyImgFilePath = [me.getPath('vendor/**/*')];


			var __copyImg = function() {
				me.log('__copyvendor begin');
				gulp.src(copyImgFilePath)
					.pipe(gulp.dest(me.getPublicPath('vendor')))
					.on('end', function() {
						me.log('__copyvendor end');

					});
			}
			return me.watch(copyImgFilePath, __copyImg);

		},

		concatJS: function(next) {
			this.log('concatJS' + configOpts.concatPaths.length);
			var me = this;
			for (var i = 0; i < configOpts.concatPaths.length; i++) {
				(function(dir) {
					var path = me.getPath('js/' + dir + '/*.js');
					var publicPath = me.getPublicPath('js/' + dir);

					console.log(publicPath);
					console.log(path);

					function __concatJS() {
						me.log('concatJS begin');
						var fileNath = 'index.js';


						if (configOpts.isMini) {
							gulp.src([path])
								.pipe(concat(fileNath)) //合并后的文件名
								.pipe(uglify())
								.pipe(gulp.dest(publicPath)).on('end', function() {
									me.log('concatJS end');

									if (next) {

										next();
									}
								});
						} else {

							gulp.src([path])
								.pipe(concat(fileNath)) //合并后的文件名
								//.pipe(uglify())
								.pipe(gulp.dest(publicPath)).on('end', function() {
									me.log('concatJS end');

									if (next) {

										next();
									}
								});
						}

					}

					me.watch(path, __concatJS);

				})(configOpts.concatPaths[i])

			}

		},

		getRemConfig: function() {

			var processors = configOpts.isRem ? [px2rem({
				remUnit: configOpts.getRemUnit()
			})] : [];
			return processors;
		},
		getMiniCssConfig: function() {
			var processors = configOpts.isMini ? [cssmin()] : [];
			return processors;
		},
		getMiniJsConfig: function() {
			var processors = configOpts.isMini ? [uglify()] : [];
			return processors;
		},
		less: function(next) {

			var me = this;

			var __lessPath = me.getPath('less/**/*.less');
			var __less = function() {


				gulp.src([__lessPath])
					.pipe(less())
					.pipe(autoprefixer({
						browsers: ['last 5 version'],
						cascade: false
					})).
				pipe(postcss(me.getRemConfig()))
					.pipe(gulp.dest(me.getPath('css')))
					.on('end', function() {
						if (next) {
							next();
						}
					});
			}

			me.watch(__lessPath, __less)

		},
		sass: function() {
			var me = this;

			var __sassPath = me.getPath('scss/**/*.scss');
			var __sass = function() {


				gulp.src([__sassPath])
					.pipe(sass())
					.pipe(autoprefixer({
						browsers: ['last 5 version'],
						cascade: false
					}))
					.pipe(gulp.dest(me.getPath('css')))
					.on('end', function() {
						if (next) {
							next();
						}
					});
			}

			me.watch(__sassPath, __sass)

		},

		rem: function() {
			var publicDir = this.getPublicPath('css/**/*');
		}


	}

	return members;
})();

gulp.task('rem', function() {

	return gulp.src(this.getPath('/**/*.css'))
		.pipe(postcss(processors))
		.pipe(gulp.dest('static/dest'));
});
gulp.task('dev', function() {
	gulpUtils.less();
	gulpUtils.ejs();
	gulpUtils.concat();
	gulpUtils.copyFiles();

});

gulp.task('publish', function() {

	configOpts.isMini = true;
	configOpts.isDev = false;
	gulpUtils.less();
	gulpUtils.ejs();
	gulpUtils.concat();
	gulpUtils.copyFiles();
});


gulp.task('less', function() {

	gulpUtils.less();

});
gulp.task('concat', function() {

	gulpUtils.concatJS();
});


gulp.task('copy', function() {

	gulpUtils.copyFiles();
})