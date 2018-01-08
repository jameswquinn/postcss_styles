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
    {
        filter: 'img/*.jpg',
        url: "inline"
    },
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
    require('postcss-cssnext')({
        browsers: ['last 2 versions', 'Firefox > 20'],
        warnForDuplicates: true
    }),
    require('postcss-uncss')({
        html: ['*.html'],
    }),
    require('postcss-csso')({
        preset: 'default'
    }),
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
    require('autoprefixer')({
        browsers: ['last 2 versions', 'Firefox > 20']
    }),
    //require('postcss-uncss')({html: ['*.html'],}),
    require('postcss-csso')({
        preset: 'default'
    }),
];

gulp.task('sass', () => {
    gulp.src(structure.src.scss)
        .pipe($.plumber(reporter.onError))
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', sass.logError))
        .pipe(postcss(scssOptions))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(structure.dest.css))
        .pipe(bs.stream())

});

/**
 * Task: build:scripts:core
 *
 * Concatenates and uglifies global JS files and outputs result to the
 * appropriate location.
 */


gulp.task('build:scripts:core', ['build:scripts:vendor'], () =>
	gulp.src(['node_modules/axios/dist/axios.js',
  'node_modules/moonjs/dist/moon.js',
  'node_modules/moon-router/dist/moon-router.js',
  'node_modules/monx/dist/monx.js',
  'node_modules/lazysizes/lazysizes.js',
])
		.pipe($.sourcemaps.init({largeFile: true}))
		.pipe($.concat({path: 'js/core.js', cwd: ''}))
    .pipe($.uglify())
		.pipe($.rev())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
);

gulp.task('build:scripts:vendor', () =>
	gulp.src(['node_modules/axios/dist/axios.js',
  'node_modules/lazysizes/plugins/bgset/ls.bgset.js',
  'node_modules/lazysizes/plugins/video-embed/ls.video-embed.js',
  'node_modules/covervid/covervid.js',
  'node_modules/macy/dist/macy.js',
  'node_modules/siema/dist/siema.min.js',
  'node_modules/instafeed/lib/instafeed.js',
  'node_modules/dynamics.js/lib/dynamics.js'
])
		.pipe($.sourcemaps.init({largeFile: true}))
		.pipe($.concat({path: 'js/vendor.js', cwd: ''}))
    .pipe($.uglify())
		.pipe($.rev())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
);

/**
 * Task: build:images
 *
 * Optimizes and copies image files.
 *
 * Using gulp-responsive
 *
 /**
<picture>
<source sizes="(max-width: 2048px) 100vw, 2048px"
srcset="
image1-100px.webp 100w,
image1-240px.webp 240w,
image1-320px.webp 320w,
image1-500px.webp 500w,
image1-640px.webp 640w,
image1-800px.webp 800w,
image1-1600px.webp 1600w,
image1-2048px.webp 2048w" type="image/webp">
<img
sizes="(max-width: 2048px) 100vw, 2048px"
srcset="
image1-100px.jpg 100w,
image1-240px.jpg 240w,
image1-320px.jpg 320w,
image1-500px.jpg 500w,
image1-640px.jpg 640w,
image1-800px.jpg 800w,
image1-1600px.jpg 1600w,
image1-2048px.jpg 2048w"
src="image1-640px.jpg"
alt="" type="image/jpeg">
</picture>
 */

 gulp.task('build:images', () => {
	 gulp.src('src/*.{png,jpg}')
	.pipe($.responsive({'logo.png': [
			{
				width: 200,
				height: 200,
				negate: true,
				blur: 1,
				quantity: 80,
				rename: {
					//dirname: "main/text/ciao",
					//basename: "aloha",
					prefix: "bonjour-",
					suffix: '_200px',
					extname: '.jpg',
				},
				format: 'jpeg',
			},{
				width: 200 * 2,
				height: 200 * 2,
				rename: 'logo@2x.png'
			}
		]
}))
	.pipe(gulp.dest('dist'));
});

// Generate & Inline Critical-path CSS
gulp.task('critical', (cb) => {
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
            // Viewport width
            width: 1300,

            // Viewport height
            height: 900
        }],

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
        ignore: ['font-face', /some-regexp/],

        // overwrite default options
        ignoreOptions: {}
    });
});
