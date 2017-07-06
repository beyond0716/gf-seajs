var gulp = require('gulp');
var pump = require('pump');
var del = require('del');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// 引入组件
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var base64 = require('gulp-base64');
var gulpSequence = require('gulp-sequence');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var htmlmin = require('gulp-htmlmin');

var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var buffer = require('vinyl-buffer');
var csso = require('gulp-csso');
var merge = require('merge-stream');
var spritesmith = require('gulp.spritesmith');

// 删除文件
gulp.task('clean', function () {
  return del(['./src/css', './dist', '../views/dist'], {force: true});
});

// font hash
gulp.task('revFont', function () {
  return gulp.src(['src/font/**'])
      .pipe(rev())
      .pipe(gulp.dest('dist/font'))
      .pipe(rev.manifest({
        merge: true
      }))
      .pipe(gulp.dest('dist/rev/font'));
});

// 压缩img
gulp.task('imagemin', function () {
  return gulp.src('src/img/**')
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
      }))
      .pipe(gulp.dest('dist/imgmin'));
});

// img hash
gulp.task('revImg', ['imagemin'], function () {
  return gulp.src(['dist/imgmin/**'])
      .pipe(rev())
      .pipe(gulp.dest('dist/img'))
      .pipe(rev.manifest({
        merge: true
      }))
      .pipe(gulp.dest('dist/rev/img'));
});

// 编译Sass
gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest('./src/css'))
      .pipe(reload({stream: true}));
});


// base64
gulp.task('base64', ['sass'], function () {
  return gulp.src('src/css/**/*.css')
      .pipe(base64({
        baseDir: '',
        extensions: ['svg', 'png', /\.jpg#datauri$/i],
        exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
        maxImageSize: 8 * 1024, // bytes
        debug: true
      }))
      .pipe(gulp.dest('dist/cssmin'));
});

// 压缩css
gulp.task('clean-css', ['base64'], function () {
  return gulp.src('dist/cssmin/**/*.css')
      .pipe(cleanCSS({
        compatibility: 'ie8'
      }))
      .pipe(gulp.dest('dist/cssmin'));
});

// 替换css中img,font名称
gulp.task("css-revreplace", ['clean-css'], function () {
  var manifest = gulp.src(["dist/rev/img/rev-manifest.json", "dist/rev/font/rev-manifest.json"]);
  return gulp.src("dist/cssmin/**/*.css")
      .pipe(revReplace({manifest: manifest}))
      .pipe(gulp.dest('dist/cssmin'));
});

// css hash
gulp.task('revCss', ['css-revreplace'], function () {
  return gulp.src(['dist/cssmin/**/*.css'])
      .pipe(rev())
      .pipe(gulp.dest('dist/css'))
      .pipe(rev.manifest({
        merge: true
      }))
      .pipe(gulp.dest('dist/rev/css'));
});

// 压缩js
gulp.task('uglify', function (cb) {
  pump([
        gulp.src(['src/js/*.js', 'src/js/pages/**.js', 'src/js/utils/**.js'], {base: 'src/js'}),
        uglify({mangle: {except: ['require', '$']}}),
        gulp.dest('dist/jsmin')
      ],
      cb);
});

// js hash
gulp.task('revJs', ['uglify'], function () {
  return gulp.src(['dist/jsmin/**/*.js'])
      .pipe(rev())
      .pipe(gulp.dest('dist/jshash'))
      .pipe(rev.manifest({
        merge: true
      }))
      .pipe(gulp.dest('dist/rev/js'));
});

// 替换sea.config.js中对应的js名称
gulp.task("js-revreplace", ['revJs'], function () {
  var manifest = gulp.src(["dist/rev/js/rev-manifest.json"]);
  return gulp.src("dist/jsmin/sea.config.js")
      .pipe(revReplace({manifest: manifest}))
      .pipe(gulp.dest('dist/jsmin'));
});

// js hash again
gulp.task('revJs2', ['js-revreplace'], function () {
  return gulp.src(['dist/jsmin/**/*.js'])
      .pipe(rev())
      .pipe(gulp.dest('dist/js'))
      .pipe(rev.manifest({
        merge: true
      }))
      .pipe(gulp.dest('dist/rev/js'));
});

// 替换ejs模板中的css,js文件名称,并压缩模板文件
gulp.task("view-revreplace", function () {
  var manifest = gulp.src(["dist/rev/css/rev-manifest.json", "dist/rev/js/rev-manifest.json", "dist/rev/img/rev-manifest.json"]);
  return gulp.src("../views/src/**/*.html")
      .pipe(revReplace({manifest: manifest}))
      .pipe(htmlmin({
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyCSS: true,
        minifyJS: true
      }))
      .pipe(gulp.dest('../views/dist'));
});

// 复制文件
gulp.task('copy', function () {
  return gulp.src(['src/html/**', 'src/js/lib/**'], {base: 'src'})
      .pipe(gulp.dest('dist'));
});

// 删除中转文件夹
gulp.task('del', function () {
  return del(['dist/cssmin', 'dist/jsmin', 'dist/jshash', 'dist/imgmin', 'dist/rev']);
});

// 检查脚本
gulp.task('jshint', function () {
  return gulp.src(['./src/js/*.js', './src/js/pages/**.js', './src/js/utils/**.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

// 生成CSS精灵图
gulp.task('sprite', function () {
  var spriteData = gulp.src('./img/sprite/*.+(jpeg|jpg|png)').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
    cssTemplate:'scss.handlebars',
    padding: 1
  }));
  var imgStream = spriteData.img
      .pipe(buffer())
      .pipe(gulp.dest('./img'));
  var cssStream = spriteData.css
      .pipe(gulp.dest('./sass'));
  return merge(imgStream, cssStream);
});

/*监听自动刷新*/
gulp.task('watch', function () {
  browserSync.init({
    open: false,
    notify: false,
    ghostMode: false,
    port: 80,
    server: {
      baseDir: "./",
      directory: true
    }
  });
  gulp.watch('./src/sass/**/*.scss', ['sass']);
  gulp.watch("./src/html/**/*.html").on('change', reload);
  gulp.watch("./src/js/**").on('change', reload);
  gulp.watch("./src/img/**").on('change', reload);
  gulp.watch("./src/font/**").on('change', reload);
});

// 默认任务
gulp.task('default', gulpSequence('clean', ['revFont', 'revImg'], ['revCss', 'revJs2', 'copy'], 'view-revreplace', 'del'));
gulp.task('dev', gulpSequence('sass', 'watch'));
