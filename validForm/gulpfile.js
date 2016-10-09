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

gulp.task('concatBuild', function () {
    

     var miniPath='xValidFrom.jquery.min';
     gulp.src('src/js/*.js')
        .pipe(concat(miniPath+'.js'))//合并后的文件名
        .pipe(gulp.dest('dist/js')).on('end',function(){
              minifyJsFile(miniPath);
        });

        gulp.src('src/css/*.css')
        .pipe(concat(miniPath+'.css'))//合并后的文件名
        .pipe(gulp.dest('dist/css')).on('end',function()
        {
            minifyCssFile(miniPath); 
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






gulp.task('jshint', function(){
	Hintjs();
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

var minifyJsFile = function(fileName,next){
	console.log("begin minifyJs");
	gulp.src('dist/js/'+fileName+'.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
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
var minifyCssFile = function(fileName,next){
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
