var gulp = require('gulp');
var connect = require('gulp-connect'); // 服务
var runSequence = require('run-sequence');
var del = require('del')
var rev = require('gulp-rev');                                  //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');               //- 路径替换
function dev () {
    gulp.task('revCss', function() {                                //- 创建一个名为 concat 的 task
        return gulp.src('./targetFile/ceshi.css')    //- 需要处理的css文件，放到一个字符串数组里
            .pipe(rev())                                            //- 文件名加MD5后缀
            .pipe(gulp.dest('./dist'))                              //- 输出文件本地
            .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
            .pipe(gulp.dest('./rev/css'));                             //- 将 rev-manifest.json 保存到 rev 目录内
    });
    gulp.task('revJs', function() {                                //- 创建一个名为 concat 的 task
        return gulp.src('./targetFile/ceshi.js')    //- 需要处理的js文件，放到一个字符串数组里
            .pipe(rev())                                            //- 文件名加MD5后缀
            .pipe(gulp.dest('./dist'))                              //- 输出文件本地
            .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
            .pipe(gulp.dest('./rev/js'));                             //- 将 rev-manifest.json 保存到 rev 目录内
    });
    gulp.task('revHtml', function() {
        return gulp.src(['./rev/*/*.json', './targetFile/*.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
            .pipe(revCollector())                                   //- 执行文件内css名的替换
            .pipe(gulp.dest('./dist/'))                     //- 替换后的文件输出的目录
            .pipe(connect.reload());
    });
    gulp.task('clean', function(cb) {
        return del(['./dist/*'], cb)
    });
    // md5版本控制
    gulp.task('md5', function (done) {
        condition = false;
        runSequence(
            ['clean'],
            ['revCss'],
            ['revJs'],
            ['revHtml'],
            done
        );
    });
    gulp.task('reloadHtml', function (done) {
      condition = false;
        runSequence(
            ['clean'],
            ['revCss'],
            ['revJs'],
            ['revHtml'],
            done
        );
    });
    gulp.task('watch', function () {
      gulp.watch(['./targetFile/*.css'], ['reloadHtml']);
      gulp.watch(['./targetFile/*.js'], ['reloadHtml']);
      gulp.watch(['./targetFile/*.html'], ['reloadHtml']);
    });
    //启动服务
    gulp.task('connect', function() {
      connect.server({
        root: 'dist',
        port: 8888,
        livereload: true
      });
    });
    // gulp.task('default', ['revHtml', 'revCss']);
    gulp.task('dev', ['md5', 'connect', 'watch']);
}
module.exports = dev
