/*
 * grunt-prompt
 * https://github.com/dylang/grunt-prompt
 *
 * Copyright (c) 2013 Dylan Greene
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.loadTasks('tasks');

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Configuration to be run (and then tested).
        prompt: {
            bump: {
                options: {
                    questions: [
                        {
                            config: 'bump.increment',
                            type: 'list',
                            message: 'Bump version from ' + '1.2.3'.cyan + ' to:',
                            choices: [
                                '1.2.4-? ❘❙❚ Build: unstable, betas, and release candidates.',
                                '1.2.4   ❘❙❚ Patch: backwards-compatible bug fixes.',
                                '1.3.0   ❘❙❚ Minor: add functionality in a backwards-compatible manner.',
                                '2.0.0   ❘❙❚ Major: incompatible API changes.',
                                '?.?.?   ❘❙❚ Custom: Specify version...'
                            ],
                            filter: function(value) {
                                var matches = value.match(/([^(\s)]*):/);
                                return matches && matches[1].toLowerCase();
                            }
                        },
                        {
                            config: 'bump.version',
                            type: 'input',
                            message: 'What specific version would you like',
                            when: function (answers) {
                                return answers['bump.increment'] === 'custom';
                            },
                            validate: function (value) {
                                var valid = require('semver').valid(value) && true;
                                return valid || 'Must be a valid semver, such as 1.2.3. See http://semver.org/';
                            }
                        },
                        {
                            config: 'bump.files',
                            type: 'checkbox',
                            message: 'What should get the new version:',
                            choices: [
                                {
                                    name: 'package.json',
                                    checked: grunt.file.isFile('package.json')
                                },
                                {
                                    name: 'bower.json',
                                    checked: grunt.file.isFile('bower.json')
                                },
                                {
                                    name: 'git tag',
                                    checked: grunt.file.isDir('.git')
                                }
                            ]
                        }
                    ]
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }
    });

    grunt.registerTask('echo', '', function(){
        grunt.log.ok('bump.increment: ' + grunt.config('bump.increment') + '.');
        grunt.log.ok('bump.version: ' + grunt.config('bump.version') + '.');
        grunt.log.ok('bump.files: ' + grunt.config('bump.files') + '.');
    });

    grunt.registerTask('test',
        [
            'jshint',
            'prompt',
            'echo'//,
            //'nodeunit'
        ]);

    grunt.registerTask('default',
        [
            'jshint',
            'prompt:bump',
            'echo'
        ]);

};
