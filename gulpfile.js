var gulp = require('gulp'),
		$ = require('gulp-load-plugins')(),
		bs = require('browser-sync'),
		critical = require('critical'),
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
	require('postcss-url')(urlOptions),
	require('postcss-inline-svg'),
	require('postcss-svgo'),
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
		.pipe($.plumber(reporter.onError))
		.pipe($.sourcemaps.init())
		.pipe($.postcss(postcssOptions))
		.pipe($.sourcemaps.write('.'))
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
		.pipe($.plumber(reporter.onError))
		.pipe($.sourcemaps.init())
    .pipe($.sass().on('error', sass.logError))
		.pipe(postcss(scssOptions))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(structure.dest.css))
		.pipe(bs.stream())

});

// Generate & Inline Critical-path CSS
gulp.task('critical',  (cb) => {
    critical.generate({
			// Inline the generated critical-path CSS
			    // - true generates HTML
			    // - false generates CSS
			    inline: true,

			    // Your base directory
			    //base: 'dist/',

			    // HTML source
			    //html: '<html>...</html>',

			    // HTML source file
			    src: 'index.html',

			    // Your CSS Files (optional)
			    //css: ['dist/styles/main.css'],



					dimensions: [{
						// Viewport width
				    width: 320,

				    // Viewport height
				    height: 480
					    }, {
								width: 1300,

						    // Viewport height
						    height: 900
					    }],
			    // Viewport width


			    // Target for final HTML output.
			    // use some CSS file when the inline option is not set
			    dest: 'index-critical.html',

			    // Minify critical-path CSS when inlining
			    minify: true,

			    // Extract inlined styles from referenced stylesheets
			    //extract: true,

			    // Complete Timeout for Operation
			    timeout: 30000,

			    // Prefix for asset directory
			    //pathPrefix: '/MySubfolderDocrot',

			    // ignore CSS rules
			    ignore: ['font-face',/some-regexp/],

			    // overwrite default options
			    ignoreOptions: {}
    });
});
