const gulp = require('gulp');
const	less = require('gulp-less');
// const stylus = require('gulp-stylus');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const gulppug = require('gulp-pug');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const browsersync = require('browser-sync').create();
// const imagemin = require('gulp-imagemin');
const del = require('del');
const buildFolder = './app'

const paths = {
	pug: {
		src: "src/*.pug",
		dest: "dist/"
	},
	html: {
		src: 'src/*.html',
		dest: 'dist/'
	},
	styles: {
		src: [
			'src/styles/**/*.sass',
			'src/styles/**/*.suss',
			'src/styles/**/*.styl', 
			'src/styles/**/*.less'
		],
		dest: 'dist/css/'
	},
	scripts: {
		src: 'src/scripts/**/*.js',
		dest: 'dist/js/'
	},
	images: {
		src: 'src/img/**',
		dest: 'dist/img/'
	}
}

function clean() {
	return del(['dist'])
}

function pug() {
	return gulp.src(paths.pug.src)
	.pipe(gulppug())
	.pipe(gulp.dest(paths.pug.dest))
	.pipe(browsersync.stream())
}

function html() {
	return gulp.src(paths.html.src)
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest(paths.html.dest))
	.pipe(browsersync.stream())
}

function styles() {
	return gulp.src(paths.styles.src)
	.pipe(sourcemaps.init())
	// .pipe(less())
	// .pipe(stylus())
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({
		cascade: false
	}))
	.pipe(cleanCss({
		level: 2
	}))
	.pipe(rename({
		basename: 'style',
		suffix: '.min'
	}))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(paths.styles.dest))
	.pipe(browsersync.stream())
}

function scripts() {
	return gulp.src(paths.scripts.src)
	.pipe(sourcemaps.init())
	.pipe(babel({
		presets: ['@babel/env']
	}))
	.pipe(uglify())
	.pipe(concat('main.min.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(paths.scripts.dest))
	.pipe(browsersync.stream())
}

function img() {
	return gulp.src(paths.images.src)
	
	.pipe(gulp.dest(paths.images.dest))

}



function watch() {
	browsersync.init({
		server: {
			baseDir: "./dist/"
		},
		port: 3000,
		notify: false
	})
	gulp.watch(paths.html.dest).on('change', browsersync.reload)
	gulp.watch(paths.html.src, html)
	gulp.watch(paths.styles.src, styles)
	gulp.watch(paths.scripts.src, scripts)
	gulp.watch(paths.images.src, img)
}

const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch)

exports.clean = clean;
exports.img = img;
exports.html = html;
exports.pug = pug;
exports.styles = styles;
exports.scripts = scripts;
// exports.browserSync = browserSync;
exports.watch = watch;
exports.build = build;
exports.default = build;