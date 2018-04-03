'use strict';

//Add plugins
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    clean = require('gulp-clean'),
    watch = require('gulp-watch'),
    rigger = require('gulp-rigger'),
    sourcemaps = require('gulp-sourcemaps'),
    wait = require('gulp-wait'),

    htmlhint = require('gulp-htmlhint'),
    htmlmin = require('gulp-htmlmin'),

    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('gulp-autoprefixer'),
    mqpacker = require('css-mqpacker'),
    csso = require('gulp-csso'),

    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyes'),

    imagemin = require('gulp-imagemin'),
    pngquant = require('gulp-pngquant'),

    reload = browserSync.reload;
	

	//Variable Path
	var path = {
		
    build: { // Way for complete(build) files
        html: 'build/',
        js_app: 'build/js/',
        js_vendor: 'build/js/vendor/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
	
	
	src: { //Way for src(dev) files
        html: 'src/*.html',
        js_app: 'src/js/app/*.js',
        js_jquery: 'src/js/vendor/jquery.min.js',
        js_vendor: ['src/js/vendor/*.js', '!src/js/vendor/jquery.min.js'],
        css: 'src/css/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
	
	
    watch: {  //Files to watch
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        css: 'src/css/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
	
	
    clean: './build'
};



//Dev-server
var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "localhost"
};


//LiveReload
gulp.task('webserver', function () {
    browserSync(config);
});


//------------------------------------------------------


//Merge HTML files
gulp.task('html:build', function () {
    gulp.src(path.src.html) //Choose files
        .pipe(rigger()) //Tunnel to rigger
        .pipe(htmlhint()) //Validate html
        .pipe(htmlmin({collapseWhitespace: true})) //Minify HTML
        .pipe(gulp.dest(path.build.html)) //Past to build folder
        .pipe(reload({stream: true})); //Restart server
});


//Merge JS files
gulp.task('js:build', function () {
    gulp.src(path.src.js_app) //Choose main.js
        .pipe(rigger()) //Tunnel to rigger
        .pipe(sourcemaps.init()) //Initializing sourcemap
        .pipe(uglify()) //Min ES6+
        .pipe(concat('app.js')) //Merge all files
        .pipe(sourcemaps.write()) //Write Maps
        .pipe(gulp.dest(path.build.js_app)); //Past to build folder

    gulp.src(path.src.js_jquery)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js_vendor)); //Past to build folder
    
    gulp.src(path.src.js_vendor)
        .pipe(rigger()) //Tunnel to rigger
        .pipe(sourcemaps.init()) //Initializing sourcemap
        .pipe(uglify()) //Min ES6+
        .pipe(concat('vendor.min.js'))
        .pipe(sourcemaps.write()) //Write Maps
        .pipe(gulp.dest(path.build.js_vendor)) //Past to build folder
        .pipe(reload({stream: true})); //Restart server
});


//Merge Style files
gulp.task('css:build', function () {
	
	var plugins = [  //Init postcss plugins
	    mqpacker //Merge same @media
	];
	
    gulp.src(path.src.css) //Choose main.scss
        .pipe(wait(500))
        .pipe(sourcemaps.init()) //Initializing sourcemap
        .pipe(sass()) //Compilation
        .pipe(autoprefixer()) //Add prefixes
        .pipe(postcss(plugins))  //Run postcss plugins
        .pipe(csso()) //Minify and optimize css
        .pipe(sourcemaps.write())  //Write Maps
        .pipe(gulp.dest(path.build.css)) //Past to build folder
        .pipe(reload({stream: true}));  //Restart server
});





//Minimalize images
gulp.task('image:build', function () {
    gulp.src(path.src.img) //Choose images
        .pipe(imagemin({ //Minimalize
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //Past to build folder
        .pipe(reload({stream: true}));  //Restart server
});


//Copy fonts without any compression
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


//--------------------------------------------------

//Watch
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


//Clean build folder
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

//--------------------------------------------------


//Build Task
gulp.task('build', [
    'html:build',
    'js:build',
    'css:build',
    'fonts:build',
    'image:build'
]);

//Final Task to start all
gulp.task('default', ['build', 'webserver', 'watch']);