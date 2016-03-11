

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        dirs: {
            grunt: '.grunt',
            sassCache: '.sass-cache',
            temp: '.tmp',
            dist: 'dist',
            app: 'src',
            fonts: '<%= dirs.app %>/fonts',
            images: '<%= dirs.app %>/images',
            js: '<%= dirs.app %>/js',
            styles: '<%= dirs.app %>/styles'
        },
        watch: {
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: ['<%= dirs.app %>/**/*.html',
                    '<%= dirs.fonts %>/**/*.*',
                    '<%= dirs.temp %>/**/*.css',
                    '<%= dirs.js %>/**/*.js',
                    '<%= dirs.images %>/**/*.*'
                ]
            },
            css: {
                files: ['<%= dirs.styles %>/**/*.scss'],
                tasks: ['preprocss']
            }
        },
        connect: {
            options: {
                port: 8080,
                livereload: 35729,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= dirs.temp %>',
                        '<%= dirs.app %>'
                    ]
                }
            }
        },
        sass: {
            dev: {
                options: {
                    style: 'expanded',
                    lineNumber: true
                },
                files: {
                    '<%= dirs.temp %>/app.css': '<%= dirs.styles %>/app.scss'
                }
            },
            build: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= dirs.dist %>/app.css': '<%= dirs.styles %>/app.scss'
                }
            }
        },
        autoprefixer: {
            dev: {
                options: ['last 2 versions', 'ie 8', 'ie 9'],
                '<%= dirs.temp %>/app.css': ['<%= dirs.temp %>/app.css']
            },
            build: {
                options: ['last 2 versions', 'ie 8', 'ie 9'],
                '<%= dirs.dist %>/app.css': ['<%= dirs.dist %>/app.css']
            }
        },
        scsslint: {
            allFiles: [
                '<%= dirs.app %>/**/*.scss'
            ],
            options: {
                config: '.scss-lint.yml',
                colorizeOutput: true
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: {
                src: ['<%= dirs.js %>/**/*.js']
            }
        },
        clean: {
            sassCache: '<%= dirs.sassCache %>',
            grunt: '<%= dirs.grunt %>',
            temp: '<%= dirs.temp %>',
            server: '<%= dirs.dist %>'
        },
        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.images %>',
                    src: '**/*',
                    dest: '<%= dirs.dist %>/images'
                }]
            },
            html: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.app %>/',
                    src: '**/*.html',
                    dest: '<%= dirs.dist %>'
                }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.js %>',
                    src: '**/*.js',
                    dest: '<%= dirs.dist %>/js'
                }]
            }
        },
        'gh-pages': {
            options: {
                base: 'dist'
            },
            src: ['**']
        }
    });

    grunt.registerTask('default', 'serve');

    grunt.registerTask('preprocss', [
        'sass:dev',
        'autoprefixer:dev'
    ]);

    grunt.registerTask('lint', [
        'scsslint',
        'jshint'
    ]);

    grunt.registerTask('serve', [
        'clean',
        'preprocss',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'lint',
        'sass:build',
        'autoprefixer:build',
        'copy'
    ]);

    grunt.registerTask('deploy', [
        'build',
        'gh-pages'
    ]);
};
