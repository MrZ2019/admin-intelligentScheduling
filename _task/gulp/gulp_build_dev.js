/**
 * Created by Administrator on 2017/5/4.
 */
var async = require('async');
var path = require('path');
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var util = require('gulp-util');
var open = require('gulp-open')
var changed = require('gulp-changed');
var webpackConfigDev = require('../webpack/webpack.config.dev');
var config = require('rc')('xsiliworkflow');

var outputDir = "build";

module.exports = function (gulp) {
  gulp.task('_start', function () {
    async.parallel([
      function (cb) {
        gulp.src("./src/assets/**/*")
          .pipe(gulp.dest(`./${outputDir}/dev/assets/`))

        gulp.src("./src/**/*.swf")
          .pipe(gulp.dest(`./${outputDir}/dev/`));

        gulp.src("./src/**/*.html", { base: './src/html' })
          .pipe(changed(`./${outputDir}/dev/**/*.html`, { base: './src/html' }, {hasChanged: changed.compareSha1Digest}))
          .pipe(gulp.dest(`./${outputDir}/dev/`));
        cb()
      },
      function(cb){
        gulp.watch("./src/**/*.html", function () {
          util.log("some html file changed")
          gulp.src("./src/**/*.html", { base: './src/html' })
          //.pipe(changed(`./${outputDir}/dev/**/*.html`,{hasChanged: changed.compareSha1Digest}))
            .pipe(gulp.dest(`./${outputDir}/dev/`));
        });
        cb();
      }
    ], function (err) {
      if (err) {
        util.colors.red(err.message);
      } else {
        var webpackconfig = Object(webpackConfigDev);
        webpackconfig.devtool = 'eval';
        new webpackDevServer(webpack(webpackconfig), {
          contentBase: path.join(__dirname, '../../../'),
          publicPath: `http://localhost:${config.port}/`,
          historyApiFallback: true,
          hot: true,
          stats: {
            colors: true
          },
          proxy: {
            '/dev/': {
              // target: 'https://sit.xsili.net/test/api/java-intelligentScheduling/',
              target: 'http://183.237.46.90:8082',
              pathRewrite: {
                '^/dev/': ''
              },
              changeOrigin: true
            },
          },
        }).listen(config.port, 'localhost', function (err) {
          if (err) throw new util.PluginError('webpack-dev-server', err);

          // 当前项目的文件夹路径
          const projectPath = path.join(__dirname, '../../').split('\\');
          // 当前项目的文件夹名字
          const projectPahtName = projectPath[projectPath.length - 2]

          gulp.src(__filename)
            .pipe(open({
              // uri: `http://localhost:${config.port}/${config.projectName}/${outputDir}/dev/${config.entryFile}`
              uri: `http://localhost:${config.port}/${projectPahtName}/${outputDir}/dev/${config.entryFile}`
            }))
        });
      }
    })
  })
}
