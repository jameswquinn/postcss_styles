var gulp = require('gulp'),
		sourcemaps = require('gulp-sourcemaps'),
		plumber = require('gulp-plumber'),
		sass = require('gulp-sass'),
		prettier = require("@bdchauvette/gulp-prettier"),
		bs = require('browser-sync'),
		postcss = require('gulp-postcss'),
		structure = require('./config/structure'),
		reporter = require('./config/reporter');

var urlOptions = [
    //{ filter: '**/assets/copy/*.png', url: 'copy', assetsPath: 'img', useHash: true },
    //{ filter: '**/assets/inline/*.svg', url: 'inline' },
    //{ filter: '**/assets/**/*.gif', url: 'rebase' },
		{url: "inline"},
    // using custom function to build url
    //{ filter: 'cdn/**/*', url: (asset) => `https://cdn.url/${asset.url}` }
];

var bemOptions = [
	{
	    defaultNamespace: undefined, // default namespace to use, none by default
	    style: 'suit', // suit or bem, suit by default,
	    separators: {descendent: '__'}, // overwrite any default separator for chosen style
	    shortcuts: {utility: 'util'} //override at-rule name
	}
]

// Array to store PostCSS plugins
var postcssOptions = [
	require('postcss-bem')(bemOptions),
	require('postcss-url')(urlOptions),
	require('postcss-type-scale')(),
	require('lost')(),
	require('postcss-grid-kiss')({ browsers: ['last 2 versions', 'Firefox > 20'], fallback: false, optimize: true }),
	require('rucksack-css'),
	require('postcss-cssnext')({ browsers: ['last 2 versions', 'Firefox > 20'], warnForDuplicates: false }),
	require('precss')(),
	require('postcss-quantity-queries')(),
	require('postcss-short')(),
	//require('postcss-uncss')({html: ['*.html'],}),
	//require('postcss-csso')(),
];

gulp.task('styles', () => {
	gulp.src(structure.src.css)
		.pipe(plumber(reporter.onError))
		.pipe(sourcemaps.init())
		.pipe(postcss(postcssOptions))
		.pipe(prettier())
		.pipe(sourcemaps.write('.'))
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
		.pipe(prettier())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(structure.dest.css))
		.pipe(bs.stream())

});
