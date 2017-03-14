var _ = require('lodash');
var fs = require('fs');
var del = require('del');
var path = require('path');
var childProcess = require('child_process');
var gutil = require('gulp-util');
var ejs = require('gulp-ejs');
var gulpif = require('gulp-if');
var util = require('./lib/util');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin2');
var lazyImageCSS = require('gulp-lazyimagecss');  // 自动为图片样式添加 宽/高/background-size 属性
var minifyCSS = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var ejshelper = require('tmt-ejs-helper');
var postcss = require('gulp-postcss');  // CSS 预处理
var postcssPxtorem = require('postcss-pxtorem'); // 转换 px 为 rem
var postcssAutoprefixer = require('autoprefixer');
var posthtml = require('gulp-posthtml');
var posthtmlPx2rem = require('posthtml-px2rem');
var RevAll = require('gulp-rev-all');   // reversion
var revDel = require('gulp-rev-delete-original');
var sass = require('gulp-sass');


module.exports = function (gulp, config) {
    var paths = {
        src: {
            dir: './resources/'+ config.dir,
            img: './resources/'+ config.dir +'/img/**/*.{JPG,jpg,png,gif}',
            slice: './resources/'+ config.dir +'/slice/**/*.png',
            js: './resources/'+ config.dir +'/js/**/*.js',
            media: './resources/'+ config.dir +'/media/**/*',
            sass: './resources/'+ config.dir +'/css/**/*.scss',
            _sass: '!./resources/'+ config.dir +'/css/**/_*.scss',
            html: ['./resources/'+ config.dir +'/html/**/*.html', '!./resources/'+ config.dir +'/html/_*/**.html'],
            htmlAll: './resources/'+ config.dir +'/html/**/*',
            php: './resources/'+ config.dir +'/**/*.php'
        },
        tmp: {
            dir: './tmp',
            css: './tmp/css',
            img: './tmp/img',
            html: './tmp/html',
            sprite: './tmp/sprite'
        },
        dist: {
            dir: './public/'+ config.dir,
            css: './public/'+ config.dir +'/css',
            img: './public/'+ config.dir +'/img',
            html: './public/'+ config.dir +'/html',
            sprite: './public/'+ config.dir +'/sprite'
        }
    };
    var webp = require('./common/webp')(config);

    var lazyDir = config.lazyDir || ['../slice'];

    var postcssOption = [];
    if (config.supportREM) {
        postcssOption = [
            postcssAutoprefixer({browsers: ['last 5 versions']}),
            postcssPxtorem({
                root_value: '20', // 基准值 html{ font-zise: 20px; }
                prop_white_list: [], // 对所有 px 值生效
                minPixelValue: 2 // 忽略 1px 值
            })
        ]
    } else {
        postcssOption = [
            postcssAutoprefixer({browsers: ['last 5 versions']})
        ]
    }

    // 清除 dist 目录
    function delDist() {
        return del([paths.dist.dir]);
    }

    // 清除 tmp 目录
    function delTmp() {
        return del([paths.tmp.dir]);
    }

    //编译 sass
    function compileSass() {
        return gulp.src([paths.src.sass, paths.src._sass])
            .pipe(sass())
            .on('error', sass.logError)
            .pipe(lazyImageCSS({imagePath: lazyDir}))
            .pipe(gulpif('*.png', gulp.dest(paths.tmp.sprite), gulp.dest(paths.tmp.css)));
    }

    //自动补全
    function compileAutoprefixer() {
        return gulp.src('./tmp/css/**/*.css')
            .pipe(postcss(postcssOption))
            .pipe(gulp.dest('./tmp/css/'));
    }

    //CSS 压缩
    function miniCSS() {
        return gulp.src('./tmp/css/**/*.css')
            .pipe(minifyCSS({
                safe: true,
                reduceTransforms: false,
                advanced: false,
                compatibility: 'ie7',
                keepSpecialComments: 0
            }))
            .pipe(gulp.dest('./tmp/css/'));
    }

    //图片压缩
    function imageminImg() {
        return gulp.src(paths.src.img)
            .pipe(imagemin({
                use: [pngquant()]
            }))
            .pipe(gulp.dest(paths.tmp.img));
    }

    //复制媒体文件
    function copyMedia() {
        return gulp.src(paths.src.media, {base: paths.src.dir}).pipe(gulp.dest(paths.dist.dir));
    }

    //JS 压缩
    function uglifyJs() {
        return gulp.src(paths.src.js, {base: paths.src.dir})
            .pipe(uglify())
            .pipe(gulp.dest(paths.tmp.dir));
    }

    //html 编译
    function compileHtml() {
        return gulp.src(paths.src.html)
            .pipe(ejs(ejshelper()))
            .pipe(gulpif(
                config.supportREM,
                posthtml(
                    posthtmlPx2rem({
                        rootValue: 20,
                        minPixelValue: 2
                    })
                ))
            )
            .pipe(usemin({  //JS 合并压缩
                jsmin: uglify()
            }))
            .pipe(gulp.dest(paths.tmp.html));
    }
    function copyToCdn(){
        return gulp.src('./tmp/**/*', {base: paths.tmp.dir})
            .pipe(gulp.dest(config['cdnDir']))
            .on('end', function () {
                delTmp();
            })
    }

    function requireJsBuild(cb){
        var error = false;
        // 异步执行任务
        // 创建子进程
        var r = childProcess.spawn('node', ['r.js', '-o', 'build.js']);
        // 进程关闭 错误码
        r.on('close', function(code) {
            if (code === 0) {
                gutil.log('r.js complete :', arguments);
            } else {
                gutil.log('r.js fail');
            }
            cb();
        });
        // 标准输出流
        r.stdout.on('data', function(data) {
            gutil.log(' '+data);
        });
        // 标准错误流
        r.stderr.on('data', function(data) {
            gutil.log('r.js error: ' + data)
        });
    }

    //加载插件
    function loadPlugin(cb) {
        util.loadPlugin('build_dist');
        cb();
    }

    //注册 build_dist 任务
    gulp.task('build_all', gulp.series(
        delDist,
        requireJsBuild,
        compileSass,
        compileAutoprefixer,
        miniCSS,
        gulp.parallel(
            imageminImg,
            copyMedia
        ),
        compileHtml,
        loadPlugin
    ));

    gulp.task('build_css', gulp.series(
        compileSass,
        compileAutoprefixer,
        miniCSS
    ));

    gulp.task('build_js', gulp.series(
        requireJsBuild
    ));
};

