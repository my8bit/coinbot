module.exports = function(grunt) {
    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration for concatinating files goes here.
            dist: {
                src: [
                    'public/javascripts/**/*.js', // All JS in the libs folder
                ],
                dest: 'build/production.js',
            },
            options: {
                /*                sourceMap: true,
                sourceMapName: 'build/production-map.js'
*/
            }
        },
        uglify: {
            build: {
                src: 'build/production.js',
                dest: 'build/production.min.js'
            }
        },
        clean: {
            coverage: {
                src: ['coverage/']
            }
        },
        copy: {
            coverage: {
                src: ['test/**'],
                dest: 'coverage/'
            }
        },
        blanket: {
            coverage: {
                src: ['public/javascripts/'],
                dest: 'coverage/src/'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: 'coverage/blanket'
                },
                src: ['test/**/*.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    // use the quiet flag to suppress the mocha console output
                    quiet: true,
                    // specify a destination file to capture the mocha
                    // output (the quiet option does not suppress this)
                    captureFile: 'coverage.html'
                },
                src: ['test/**/*.js']
            }
        },
        todo: {
            options: {
                marks: [{
                    pattern: 'BURP',
                    color: 'pink'
                }, {
                    name: 'TODO',
                    pattern: /TODO/,
                    color: 'yellow'
                }, {
                    name: 'Fix',
                    pattern: /Fix/,
                    color: 'red'
                }],
                file: 'TODO.md',
                githubBoxes: true,
                colophon: true,
                usePackage: true
            },
            src: [
                'test/*'
            ]
        },
        jshint: {
            options: {
                jshintrc: true,
                reporter: require('jshint-html-reporter'),
                reporterOutput: 'jshint-report.html'
            },
            all: ['test/*.js']
        }
    });
    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-blanket');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-todo');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify', 'clean', 'blanket', 'copy', 'mochaTest', 'todo', 'jshint']);

};