var gulp = require('gulp'),
		rev = require('gulp-rev'),
		sourcemaps = require('gulp-sourcemaps'),
		rename = require('gulp-rename'),
		plumber = require('gulp-plumber'),
		sass = require('gulp-sass'),
		bs = require('browser-sync'),
		postcss = require('gulp-postcss'),
		structure = require('./config/structure'),
		reporter = require('./config/reporter');

// Array to store PostCSS plugins
var postcssOptions = [
	require('postcss-url')({url: "inline"}),
	require('postcss-type-scale')(),
	require('lost')(),
	require('postcss-grid-kiss')({ browsers: ['last 2 versions', 'Firefox > 20'], fallback: false, optimize: true }),
	require('rucksack-css'),
	require('postcss-cssnext')({ browsers: ['last 2 versions', 'Firefox > 20'], warnForDuplicates: false }),
	require('precss')(),
	require('postcss-quantity-queries')(),
	require('postcss-short')(),
	//require('cssgrace'),
	//require('postcss-uncss')({html: ['*.html'],}),
	//require('postcss-csso')(),
];

gulp.task('styles', () => {
	gulp.src(structure.src.css)
		.pipe(plumber(reporter.onError))
		.pipe(sourcemaps.init())
		.pipe(postcss(postcssOptions))
		.pipe(rename({basename: "postcss",suffix: '.min'}))
		.pipe(rev())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(structure.dest.css))
		.pipe(rev.manifest())
		.pipe(gulp.dest(structure.dest.css))
		.pipe(bs.stream())
});

// Array to store PostCSS plugins
var scssOptions = [
	require('autoprefixer')({ browsers: ['last 2 versions', 'Firefox > 20']}),
	//require('postcss-uncss')({html: ['*.html'],}),
	require('postcss-csso')(),
];

gulp.task('sass',  () => {
  gulp.src(structure.src.scss)
		.pipe(plumber(reporter.onError))
		.pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
		.pipe(postcss(scssOptions))
		.pipe(rename({basename: "sass",suffix: '.min'}))
		.pipe(rev())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(structure.dest.css))
		.pipe(rev.manifest())
		.pipe(gulp.dest(structure.dest.scss))
		.pipe(bs.stream())

});
