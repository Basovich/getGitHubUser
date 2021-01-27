const {src, dest} = require('gulp');
const gulp = require('gulp');
const {stream} = require('browser-sync');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include'); //https://www.npmjs.com/package/gulp-file-include
const del = require('del');
const scss = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const group_css_media = require('gulp-group-css-media-queries');
const clean_css = require('gulp-clean-css');
const rename = require("gulp-rename");
const webpack = require('webpack-stream');
const imagemin = require('gulp-imagemin');



// Папки с ресурсами
const app_folrder = require('path').basename(__dirname);
const src_folder = 'src';

// Пути к файлам
const path = {
    src: {
        html: src_folder + '/*.html',
        css: src_folder + '/scss/main.scss',
        js: src_folder + '/js/main.js',
        img: src_folder + '/img/**/*',        
        fonts: src_folder + '/fonts/**/*',        
    },
    build: {
        html: app_folrder + '/',
        css: app_folrder + '/css/',
        js: app_folrder + '/js/',
        img: app_folrder + '/img/',
        fonts: app_folrder + '/fonts/',       
    },
    watch: {
        html: src_folder + '/**/*.html',
        css: src_folder + '/scss/**/*.scss',
        js: src_folder + '/js/**/*.js',
        img: src_folder + '/img/**/*',       
        fonts: src_folder + '/fonts/**/*',       
    },
    clean: './' + app_folrder + '/'
}

// Меняем при разном режиме разработки
const isDev = true;

//Конфиг для webpack
const webConfig = {
    // entry: {
    //     app: path.src.js    
    // },
    output: {
        filename: './' + 'main.min.js',
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env'
                    ]
                }
            }
        }]
    },
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'eval-source-map' : 'none'
}

// Все таски
const browserSyncInit = () => {
    browserSync.init({
        server: {
            baseDir: path.clean
        },
        notify: false,
        // tunnel: true,
        // tunnel: "basovich" //Demonstration page: http://basovich.localtunnel.me
    });
}

const html = () => {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream())
}

const fonts = () => {
    return src(path.src.fonts)       
        .pipe(dest(path.build.fonts))
        .pipe(browserSync.stream())
}

const css = () => {
    return src(path.src.css)
        .pipe(sourcemaps.init())
        .pipe(
            scss({
                outputStyle: 'expanded'
            }).on('error', scss.logError)
        )
        .pipe(autoprefixer({
            grid: true,
            overrideBrowserslist: [
                "last 10 versions",
                "ie 9-11"
            ],
            cascade: false
        }))
        .pipe(group_css_media())
        .pipe(clean_css())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream())
}

const js = () => {
    return src(path.src.js)
        .pipe(webpack(webConfig))
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream())
}

const images = () => {
    return src(path.src.img)
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 3,
            svgoPlugins: [{
                removeViewBox: false
            }]
        }))
        .pipe(dest(path.build.img))
        .pipe(browserSync.stream())
}

const clean = () => {
    return del(path.clean);
}

const watchFile = () => {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.fonts], fonts);
}

const build = gulp.series(clean, gulp.parallel(html, fonts, css, js, images));
const watch = gulp.parallel(build, watchFile, browserSyncInit);

exports.html = html;
exports.fonts = fonts;
exports.css = css;
exports.js = js;
exports.images = images;
exports.watchFile = watchFile;
exports.build = build;
exports.watch = watch;
exports.default = watch;
