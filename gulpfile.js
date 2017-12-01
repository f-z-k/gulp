var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del')
// var concat = require('gulp-concat');                            //- 多个文件合并为一个；
// var minifyCss = require('gulp-minify-css');                     //- 压缩CSS为一行；
var rev = require('gulp-rev');                                  //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');               //- 路径替换
gulp.task('revCss', function() {                                //- 创建一个名为 concat 的 task
    return gulp.src('./targetFile/ceshi.css')    //- 需要处理的css文件，放到一个字符串数组里
        // .pipe(concat('wap.min.css'))                            //- 合并后的文件名
        // .pipe(minifyCss())                                      //- 压缩处理成一行
        .pipe(rev())                                            //- 文件名加MD5后缀
        .pipe(gulp.dest('./dist'))                              //- 输出文件本地
        .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev/css'));                              //- 将 rev-manifest.json 保存到 rev 目录内
});
gulp.task('revHtml', function() {
    return gulp.src(['./rev/css/*.json', './targetFile/*.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                                   //- 执行文件内css名的替换
        .pipe(gulp.dest('./dist/'));                     //- 替换后的文件输出的目录
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
        ['revHtml'],
        done
    );
});

// gulp.task('default', ['revHtml', 'revCss']);
gulp.task('default', ['md5']);
