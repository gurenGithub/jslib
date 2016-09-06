var gulp     	 = require('gulp'),
	uglify       = require('gulp-uglify'),
	less         = require('gulp-less'),
	jshint       = require('gulp-jshint'),
	cssmin       = require('gulp-cssmin'),
	watch        = require('gulp-watch')
	autoprefixer = require('gulp-autoprefixer'),
	async        = require('async'),
	beeper       = require('beeper');
    concat = require('gulp-concat');
    gulpCopy = require('gulp-file-copy');
gulp.task('build', function() {

	Hintjs(function(){
		copyFiles(function(){
			buildLess2Src(function(){
				minifyCss(function(){
					minifyJs(function(){
						console.log('finished build');
					});
				});
			});
		});	
	});
	
});

gulp.task('buildjQuery', function () {
    gulp.src('src/jquery/*.js')
        .pipe(concat('xfrom.jquery.js'))//合并后的文件名
        .pipe(gulp.dest('dist')).on('end',function(){   
        });

     gulp.src('src/jquery/*.js')
        .pipe(concat('xfrom.jquery.min.js'))//合并后的文件名
        .pipe(gulp.dest('dist')).on('end',function(){
              minifyjQueryJs();
        });

        gulp.src('src/css/*.css')
        .pipe(concat('xfrom.jquery.css'))//合并后的文件名
        .pipe(gulp.dest('dist/css')).on('end',function(){   
        });

        gulp.src('src/css/*.css')
        .pipe(concat('xfrom.jquery.min.css'))//合并后的文件名
        .pipe(gulp.dest('dist/css')).on('end',function()
        {
            minifyxFormCss('xfrom.jquery.min')   
        });
});

gulp.task('buildJs', function () {
    gulp.src('src/jquery/*.js')
        .pipe(concat('xfrom.jquery.js'))//合并后的文件名
        .pipe(gulp.dest('dist')).on('end',function(){   
        });

     gulp.src('src/jquery/*.js')
        .pipe(concat('xfrom.jquery.min.js'))//合并后的文件名
        .pipe(gulp.dest('dist')).on('end',function(){


              minifyjQueryJs();
        });
});

gulp.task('less', function(){
	gulp.watch(['src/less/**/*.less', 'src/js/**/*.css', 'src/less/**/*.css'], function(){
		var d = new Date;
		console.log('Compiled at ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
		gulp.src(['src/less/**/*.less', '!src/less/tools/*'])
			.pipe(less())
			.pipe(autoprefixer({
	            browsers: ['last 2 versions'],
	            cascade: false
	        }))
			.pipe(gulp.dest('src/css'));	
	});
});




gulp.task('appLess', function(){
	gulp.src('src/App/less/**/*.less')
        .pipe(watch('src/App/less/**/*.less'))
		.pipe(less())
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
		.pipe(gulp.dest('src/App/css'));
});

gulp.task('jshint', function(){
	Hintjs();
});

gulp.task('appBuild', function(cb){
	async.series([
		function (next) {
			// copy files
			gulp.src(['src/App/**/*', '!src/**/*.less', '!src/**/*.css', '!src/**/*.js'])
				.pipe(gulp.dest('App'))
				.on('end', next);
		},
		function (next) {
			// app src less 2 app src css
			gulp.src('src/App/less/**/*.less')
				.pipe(less())
				.pipe(autoprefixer({
		            browsers: ['last 2 versions'],
		            cascade: false
		        }))
				.pipe(gulp.dest('src/App/css'))
				.on('end', next);
		},
		function (next) {
			// minify css
			console.log("begin minifyCss");
			gulp.src('src/App/css/**/*.css')
				.pipe(cssmin())
				.pipe(gulp.dest('App/css'))
				.on('end', function(){
					console.log('done minifyCss');
					next();
		    	});
		},
		function (next) {
			// hint js
			gulp.src(['src/App/**/*.js', '!src/**/*.min.js', '!src/**/*-min.js'])
				.pipe(jshint('.jshintrc'))
		    	.on('end', function(){
		    		console.log('done hintjs');
		    		next();
		    	})
		    	.pipe(jshint.reporter('jshint-stylish'))
		    	.pipe(jshint.reporter('fail'));
		},
		function (next) {
			// minify js
			gulp.src(['src/App/js/**/*.js'])
				.pipe(uglify())
				.pipe(gulp.dest('App/js'))
				.on('end', function(){
					console.log('done minifyJs');
					next();
		    	});
		}
	], cb);

	
});

gulp.task('copyFiles', function(){
	copyFiles();
});

var copyFiles = function(next){
	console.log("begin copyFiles");
	gulp.src(['src/css/**/*', '!src/css/**/*.css'])
		.pipe(gulp.dest('css'))
		.on('end', function(){
			gulp.src(['src/js/**/*'])
				.pipe(gulp.dest('js'))
				.on('end', function(){
					gulp.src(['src/img/**/*'])
						.pipe(gulp.dest('img'))
						.on('end', function(){
							console.log('done copyFiles');
							if(next) {
								next();
							}
						});
				});
		});

		return;
	gulp.src(['src/**/*', '!src/less/**/*', '!src/App/**/*'])
		.pip(gulp.dest('./'))
		.on('end', function(){
			if(next) {
				next();
			}
		});

	return;
};

var Hintjs = function(next){
	console.log("begin hintjs");
	gulp.src(['src/js/**/*.js', '!src/js/vendor/**/*.js', '!src/**/*.min.js', '!src/**/*-min.js', '!src/js/slick/*'])
		.pipe(jshint('.jshintrc'))
    	.on('end', function(){
    		console.log('done hintjs');
    		if(next) {
    			next();
    		}
    	})
    	.pipe(jshint.reporter('jshint-stylish'))
    	.pipe(jshint.reporter('fail'));
};

var minifyjQueryJs = function(next){
	console.log("begin minifyJs");
	gulp.src('dist/xfrom.jquery.min.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist'))
		.on('end', function(){
			console.log('done minifyJs');
    		if(next) {
    			next();
    		}
    	});
};

var minifyJs = function(next){
	console.log("begin minifyJs");
	gulp.src(['src/js/**/*.js', '!src/js/vendor/**/*.js', '!src/**/*.min.js', '!src/**/*-min.js', '!src/js/slick/*'])
		.pipe(uglify())
		.pipe(gulp.dest('js'))
		.on('end', function(){
			console.log('done minifyJs');
    		if(next) {
    			next();
    		}
    	});
};
var minifyxFormCss = function(fileName,next){
	console.log("begin minifyCss");
	gulp.src('dist/css/'+fileName+'.css')
		.pipe(cssmin())
		.pipe(gulp.dest('dist/css'))
		.on('end', function(){
			console.log('done minifyCss');
    		if(next) {
    			next();
    		}
    	});
};
var minifyCss = function(next){
	console.log("begin minifyCss");
	gulp.src('src/css/*.css')
		.pipe(cssmin())
		.pipe(gulp.dest('css'))
		.on('end', function(){
			console.log('done minifyCss');
    		if(next) {
    			next();
    		}
    	});
};

var buildLess2Src = function(next){
	console.log("begin buildLess2Src");
	gulp.src('src/less/**/*.less')
		.pipe(less())
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
		.pipe(gulp.dest('src/css'))
		.on('end', function(){
			console.log('done buildLess2Src');
    		if(next) {
    			next();
    		}
    	});
};