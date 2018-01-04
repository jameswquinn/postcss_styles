var gulp = require('gulp'),
		sourcemaps = require('gulp-sourcemaps'),
		plumber = require('gulp-plumber'),
		sass = require('gulp-sass'),
		prettier = require("@bdchauvette/gulp-prettier"),
		bs = require('browser-sync'),
		critical = require('critical'),
		postcss = require('gulp-postcss'),
		structure = require('./config/structure'),
		reporter = require('./config/reporter');

var urlOptions = [
    //{ filter: '**/assets/copy/*.png', url: 'copy', assetsPath: 'img', useHash: true },
    //{ filter: '**/assets/inline/*.svg', url: 'inline' },
    //{ filter: '**/assets/**/*.gif', url: 'rebase' },
		{filter: 'img/*.jpg', url: "inline"},
    // using custom function to build url
    //{ filter: 'cdn/**/*', url: (asset) => `https://cdn.url/${asset.url}` }
];

// Array to store PostCSS plugins
var postcssOptions = [
	//require('lost')(),
	//require('rucksack-css')({autoprefixer: false}),
	//require('postcss-url')(urlOptions),
	//require('postcss-inline-svg'),
	//require('postcss-svgo'),
	//require('postcss-assets')({cachebuster: true}),
	//require('postcss-type-scale')(),
	//require('postcss-quantity-queries')(),
	//require('postcss-short')(),
	//require('postcss-sorting'),
	//require('postcss-grid-kiss')({ browsers: ['last 2 versions', 'Firefox > 20'], fallback: false, optimize: true }),
	require('precss')(),
	require('postcss-cssnext')({ browsers: ['last 2 versions', 'Firefox > 20'], warnForDuplicates: true }),
	require('postcss-uncss')({html: ['*.html'],}),
	require('postcss-csso')({preset: 'default'}),
];

gulp.task('styles', () => {
	gulp.src(structure.src.css)
		.pipe(plumber(reporter.onError))
		.pipe(sourcemaps.init())
		.pipe(postcss(postcssOptions))
		.pipe(prettier({singleQuote: true, trailingComma: "all"})) // Normal prettier options, e.g.:
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(structure.dest.css))
		.pipe(bs.stream())
});

// Array to store PostCSS plugins
var scssOptions = [
	require('autoprefixer')({ browsers: ['last 2 versions', 'Firefox > 20']}),
	//require('postcss-uncss')({html: ['*.html'],}),
	require('postcss-csso')({preset: 'default'}),
];

gulp.task('sass',  () => {
  gulp.src(structure.src.scss)
		.pipe(plumber(reporter.onError))
		.pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
		.pipe(postcss(scssOptions))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(structure.dest.css))
		.pipe(bs.stream())

});


// Generate & Inline Critical-path CSS
gulp.task('critical',  (cb) => {
    critical.generate({
        inline: true,
        src: 'index.html',
        dest: 'index-critical.html',
        width: 320,
        height: 480,
        minify: true
    });
});
