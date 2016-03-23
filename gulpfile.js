var gulp=require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	autoprefixer = require('gulp-autoprefixer'),
	cssmin = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	htmlmin = require('gulp-htmlmin');

var less = require('gulp-less'),
    livereload = require('gulp-livereload');

gulp.task('testConcat', function () {
    gulp.src('src/js/*.js')
        .pipe(concat('all.js'))//合并后的文件名
        .pipe(gulp.dest('dist/js'));
});

gulp.task('jsmin', function () {
    gulp.src(['app_ys/js/*.js'])
        .pipe(uglify({
            mangle: false,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'none' //保留所有注释
        }))
        .pipe(gulp.dest('app_ys/js'));
});

gulp.task('testAutoFx', function () {
    gulp.src('app_ys/css/*.css')
        .pipe(autoprefixer({
            browsers: [ "chrome 30", "Firefox < 20","ios_saf 8", "safari 8",'Android >= 2.3'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(gulp.dest('app_ys/css'));
});
// [ "chrome 30", "Firefox < 20","ios_saf 8", "safari 8",'Android >= 2.3','ie 6-8','Opera <= 20']
// [ "chrome 30", "Firefox < 20","ios_saf 8", "safari 8",'Android >= 2.3']

gulp.task('testCssmin', function () {
    gulp.src('app_ys/css/*.css')
        .pipe(cssmin({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: '!',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: false//类型：Boolean 默认：false [是否保留换行]
        }))
        .pipe(gulp.dest('app_ys/css'));
});

gulp.task('testImagemin', function () {
    gulp.src('app_ys/img/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            use: [pngquant()]
        }))
        .pipe(gulp.dest('app_ys/img'));
});

gulp.task('testHtmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: false,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('app_ys/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('app_ys'));
});

gulp.task('default',['jsmin','testAutoFx','testCssmin','testImagemin','testHtmlmin'])

gulp.task('less', function() {
    gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css'))
        .pipe(livereload());
});
 
//特别注意：若编译less的时候，同时执行其他操作，有可能引起页面刷新，而不是将样式植入页面
//例如下面任务同时生成sourcemap：
//var sourcemaps = require('gulp-sourcemaps');
//gulp.task('less', function () {
//    gulp.src(['src/less/*.less'])
//        .pipe(sourcemaps.init())
//        .pipe(less())
//        .pipe(sourcemaps.write('./'))
//        .pipe(gulp.dest('src/css'))
//        .pipe(livereload());
//});
 
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/less/**/*.less', ['less']);
});