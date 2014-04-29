module.exports = function(grunt) {
    var nodemonIgnoredFiles = [
        'README.md',
        'Gruntfile.js',
        '/assets/',
        '/src/',
        '/.git/',
        '/node_modules/',
        '/.sass-cache/'
    ];
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: { },
            bootstrap: {
                src: [
                    'assets/js/bootstrap/transition.js',
                    'assets/js/bootstrap/alert.js',
                    'assets/js/bootstrap/button.js',
                    'assets/js/bootstrap/carousel.js',
                    'assets/js/bootstrap/collapse.js',
                    'assets/js/bootstrap/dropdown.js',
                    'assets/js/bootstrap/modal.js',
                    'assets/js/bootstrap/tooltip.js',
                    'assets/js/bootstrap/popover.js',
                    'assets/js/bootstrap/scrollspy.js',
                    'assets/js/bootstrap/tab.js',
                    'assets/js/bootstrap/affix.js'
                ],
                dest: 'public/js/bootstrap.js'
            },
            app:{
                src: [
                    'assets/js/app/queue.js',
                    'assets/js/app/app-start.js',
                    'assets/js/app/model.js',
                    'assets/js/app/view.js',
                    'assets/js/app/app-end.js'
                ],
                dest: 'public/js/app-core.js'
            },
            editor:{
                src: [
                    'assets/js/app/queue.js',
                    'assets/js/app/editor-start.js',
                    'assets/js/app/model.js',
                    'assets/js/app/editor-view.js',
                    'assets/js/app/app-end.js'
                ],
                dest: 'public/js/app-editor.js'
            }
        },
        sass: {
            bootstrap: {
                options: { style: 'compressed' },
                src: 'assets/scss/bootstrap.scss',
                dest: 'public/css/bootstrap.css'
            },
            app: {
                options: { style: 'compressed' },
                src: 'assets/scss/app.scss',
                dest: 'public/css/app.css'
            },
            mobile: {
                options: { style: 'compressed' },
                src: 'assets/scss/mobile.scss',
                dest: 'public/css/mobile.css'
            },
            page: {
                options: { style: 'compressed' },
                src: 'assets/scss/page.scss',
                dest: 'public/css/page.css'
            }
        },
        includes: {
                files: {
                    src: ['views/mobile/page.html'],
                    dest: 'views/page.ejs',
                    flatten: true,
                    cwd: '.'
                }
        },
        templates: {
            all: {
                src: ['template/*.html'],
                dest: 'public/js/templates.js'
            }
        },
        watch: {
            include_page:{
                files: ['views/mobile/*.html'],
                tasks: ['includes']                
            },
            scripts_bootstrap: {
                files: ['assets/js/bootstrap/**/*.js'],
                tasks: ['concat:bootstrap']
            },
            scripts_app: {
                files: ['assets/js/app/*.js'],
                tasks: ['concat:app']
            },
            scripts_editor: {
                files: ['assets/js/app/editor*.js'],
                tasks: ['concat:editor']
            },
            stylesheets_all: {
                files: ['assets/scss/_*.scss'],
                tasks: ['sass']
            },
            stylesheets_bootstrap: {
                files: ['assets/scss/bootstrap/*.scss'],
                tasks: ['sass:bootstrap']
            },
            stylesheets_page: {
                files: ['assets/scss/page.scss'],
                tasks: ['sass:page']
            },
            stylesheets_mobile: {
                files: ['assets/scss/mobile/*.scss', 'assets/scss/mobile.scss'],
                tasks: ['sass:mobile']
            },
            stylesheets_app: {
                files: ['assets/scss/mobile/app.scss'],
                tasks: ['sass:app']
            },
            templates: {
                files: ['template/*.html'],
                tasks: ['templates']
            }
        },
        nodemon: {
            dev: {
                options: {
                    file: 'app.js',
                    args: ['development'],
                    watchedExtensions: [
                        'js',
                        // This might cause an issue starting the server
                        // See: https://github.com/appleYaks/grunt-express-workflow/issues/2
                        // 'coffee'
                    ],
                    // nodemon watches the current directory recursively by default
                    // watchedFolders: ['.'],
                    debug: true,
                    delayTime: 1,
                    ignoredFiles: nodemonIgnoredFiles,
                }
            },
        },
        concurrent: {
            dist: {
                tasks: ['concat', 'sass', 'includes', 'templates'],
                options: { logConcurrentOutput: true }
            },
            server: {
                tasks: ['watch','nodemon:dev'],
                options: { logConcurrentOutput: true }
            }
        }
    });

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    
    // Configurable port number
    var port = grunt.option('port');
    if (port) grunt.config('connect.server.options.port', port);
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('server', 'concurrent:server');
    grunt.registerTask('dist', 'concurrent:dist');

};
