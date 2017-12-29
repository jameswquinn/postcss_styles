var gulp = require('gulp'),
		rev = require('gulp-rev'),
		sourcemaps = require('gulp-sourcemaps'),
		rename = require('gulp-rename'),
		plumber = require('gulp-plumber'),
		bs = require('browser-sync'),
		postcss = require('gulp-postcss'),
		structure = require('./config/structure'),
		reporter = require('./config/reporter');

// Array to store PostCSS plugins
var processors = [
	require('lost')(),
	require('rucksack-css'),
	require('postcss-cssnext')({ browsers: ['last 2 versions', 'Firefox > 20'], warnForDuplicates: false }),
	require('precss')(),
	require('postcss-quantity-queries')(),
	require('postcss-short')(),
	require('postcss-uncss')({html: ['*/*.html'],}),
	require('postcss-csso')(),
];

gulp.task('build:styles', () => {
	gulp.src(structure.src.css)
		.pipe(plumber(reporter.onError))
		.pipe(rename({basename: "app",suffix: '.min'}))
		.pipe(sourcemaps.init())
		// Pipe the styles in through PostCSS and pass in the 'processors' array.
		.pipe(postcss(processors))
		.pipe(rev())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(structure.dest.css))
		.pipe(rev.manifest())
		.pipe(gulp.dest(structure.dest.css))
		.pipe(bs.stream())
});
