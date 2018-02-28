var gulp = require('gulp');
var replace = require('gulp-replace'); // 字符串替换
var babel = require("gulp-babel");
var cleanCSS = require('gulp-clean-css');         // css 压缩
var uglify = require('gulp-uglify');              // js压缩
var runSequence = require('run-sequence');
var del = require('del')
var rev = require('gulp-rev');                                  //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');               //- 路径替换
var configPath = require('./gulp.config.js');
console.log(configPath)
function build () {
    gulp.task('collectorImg', function() {
        return gulp.src(['./rev/img/*.json', './targetFile/static/css/*'])   //- 读取 rev-manifest.json 文件以及需要进行img名替换的文件
        .pipe(revCollector())                                   //- 执行文件内img名的替换
        .pipe(gulp.dest('./dist/static/css'))
    });
    gulp.task('revCss', ['collectorImg'], function() {                                //- 创建一个名为 concat 的 task
        return gulp.src('./dist/static/css/*.css')    //- 需要处理的css文件，放到一个字符串数组里
            .pipe(replace('/static/img', configPath.cdnUrlImg))
            .pipe(cleanCSS())                                       // css 压缩
            .pipe(rev())                                            //- 文件名加MD5后缀
            .pipe(gulp.dest('./dist/static/css'))                              //- 输出文件本地
            .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
            .pipe(gulp.dest('./rev/css'));                             //- 将 rev-manifest.json 保存到 rev 目录内
    });
    gulp.task('revJs', function() {                                //- 创建一个名为 concat 的 task
        return gulp.src('./targetFile/static/js/*.js')    //- 需要处理的js文件，放到一个字符串数组里
            // .pipe(babel())                          // 转换es5
            .pipe(rev())                                            //- 文件名加MD5后缀
            .pipe(uglify())                                         // js 压缩
            .pipe(gulp.dest('./dist/static/js'))                              //- 输出文件本地
            .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
            .pipe(gulp.dest('./rev/js'));                             //- 将 rev-manifest.json 保存到 rev 目录内
    });
    gulp.task('revImg', function() {
        return gulp.src('./targetFile/static/img/**')
            .pipe(rev())
            .pipe(gulp.dest('./dist/static/img'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('./rev/img'));
    })
    gulp.task('revHtml', function() {
        return gulp.src(['./rev/*/*.json',  configPath.targetHtm])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
            .pipe(replace('/static/img', configPath.cdnUrlImg))
            .pipe(replace('/static/css', configPath.cdnUrlCss))
            .pipe(replace('/static/js', configPath.cdnUrlJs))
            .pipe(replace('/static/plugin', configPath.cdnUrlPlugin))
            .pipe(revCollector())                                   //- 执行文件内css名的替换
            .pipe(gulp.dest('./dist/htm/'))                     //- 替换后的文件输出的目录
    });
    gulp.task('clean', function(cb) {
        return del(['./dist/*'], cb)
    });
    // md5版本控制
    gulp.task('md5', function (done) {
        condition = false;
        runSequence(
            ['clean'],
            ['revImg'],
            ['revCss'],
            ['revJs'],
            ['revHtml'],
            done
        );
    });
    // gulp.task('default', ['revHtml', 'revCss']);
    gulp.task('build', ['md5']);
}
module.exports = build
