/*
 * grunt-prompt
 * https://github.com/dylang/grunt-prompt
 *
 * Copyright (c) 2013 Dylan Greene
 * Licensed under the MIT license.
 */

'use strict';

var semver = require('semver');
var currentVersion = require('./package.json').version;

module.exports = function (grunt) {


    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-cli');

    grunt.loadTasks('tasks');

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: []
            },
            task: [
                'Gruntfile.js',
                'tasks/**/*.js'
            ]
        },

        // Configuration to be run (and then tested).
        prompt: {
            examples: {
                options: {
                    questions: [
                        {
                            config: 'echo.list',
                            type: 'list',
                            message: 'Choose an item from a list, returns the value',
                            choices: [
                                { name: 'White'.white },
                                { name: 'Grey'.grey },
                                { name: 'Blue'.blue },
                                { name: 'Cyan'.cyan },
                                { name: 'Green'.green },
                                { name: 'Magenta'.magenta },
                                { name: 'Red'.red },
                                { name: 'Yellow'.yellow },
                                { name: 'Rainbow'.rainbow }
                            ],
                            filter: String.toLowerCase
                        },
                        {
                            config: 'echo.checkbox',
                            type: 'checkbox',
                            message: 'Choose multiple items, returns an array of values',
                            choices: [
                                { name: 'Bold'.bold },
                                { name: 'Italic'.italic },
                                { name: 'Underline'.underline },
                                { name: 'Inverse'.inverse, value: 'inverse' },
                                { name: 'Zebra'.zebra, value: 'zebra' }
                            ],
                            filter: function(value) {
                                return grunt.util._(value).map(String.toLowerCase);
                            },
                            validate: function(value) {
                                var inverseAndZebra = grunt.util._(['inverse', 'zebra']).all(function(val){
                                    return grunt.util._(value).contains(val);
                                });
                                if (inverseAndZebra) {
                                    return 'You can choose Inverse or Zebra but not both';
                                }
                                return true;
                            }
                        },
                        {
                            config: 'echo.confirm',
                            type: 'confirm',
                            message: 'Choose yes or no, returns a boolean'
                        },
                        {
                            config: 'echo.input',
                            type: 'input',
                            message: 'Text input',
                            validate: function(value) {
                                if (value === '') {
                                    return 'A value is required.';
                                }
                                return true;
                            }
                        },
                        {
                            config: 'echo.password',
                            type: 'password',
                            message: 'Password input',
                            validate: function(value) {
                                if (value.length < 5) {
                                    return 'Password should be at least 5 characters.';
                                }
                                return true;
                            }
                        }
                    ]
                }
            },

            mochacli: {
                options: {
                    questions: [
                        {
                            config: 'mochacli.options.reporter',
                            type: 'list',
                            message: 'Which Mocha reporter would you like to use?',
                            default: 'spec',
                            choices: ['dot', 'spec', 'nyan', 'TAP', 'landing', 'list',
                                'progress', 'json', 'JSONconv', 'HTMLconv', 'min', 'doc']
                        }
                    ]
                }
            },

            bump: {
                options: {
                    questions: [
                        {
                            config: 'bump.increment',
                            type: 'list',
                            message: 'Bump version from ' + '<%= pkg.version %>'.cyan + ' to:',
                            choices: [
                                {
                                    value: 'build',
                                    name: 'Build:  '.yellow + (currentVersion + '-?').yellow +
                                        ' Unstable, betas, and release candidates.'
                                },
                                {
                                    value: 'patch',
                                    name: 'Patch:  '.yellow + semver.inc(currentVersion, 'patch').yellow +
                                        '   Backwards-compatible bug fixes.'
                                },
                                {
                                    value: 'minor',
                                    name: 'Minor:  '.yellow + semver.inc(currentVersion, 'minor').yellow +
                                        '   Add functionality in a backwards-compatible manner.'
                                },
                                {
                                    value: 'major',
                                    name: 'Major:  '.yellow + semver.inc(currentVersion, 'major').yellow +
                                        '   Incompatible API changes.'
                                },
                                {
                                    value: 'custom',
                                    name: 'Custom: ?.?.?'.yellow +
                                        '   Specify version...'
                                }
                            ]
                        },
                        {
                            config: 'bump.version',
                            type: 'input',
                            message: 'What specific version would you like',
                            when: function (answers) {
                                return answers['bump.increment'] === 'custom';
                            },
                            validate: function (value) {
                                var valid = semver.valid(value) && true;
                                return valid || 'Must be a valid semver, such as 1.2.3-rc1. See ' + 'http://semver.org/'.blue.underline + ' for more details.';
                            }
                        },
                        {
                            config: 'bump.files',
                            type: 'checkbox',
                            message: 'What should get the new version:',
                            choices: [
                                {
                                    value: 'package',
                                    name: 'package.json' + (!grunt.file.isFile('package.json') ? ' file not found, will create one'.grey : ''),
                                    checked: grunt.file.isFile('package.json')
                                },
                                {
                                    value: 'bower',
                                    name: 'bower.json' + (!grunt.file.isFile('bower.json') ? ' file not found, will create one'.grey : ''),
                                    checked: grunt.file.isFile('bower.json')
                                },
                                {
                                    value: 'git',
                                    name: 'git tag',
                                    checked: grunt.file.isDir('.git')
                                }
                            ]
                        }
                    ]
                }
            }
        },

        mochacli: {
            src: 'test/**/*.test.js',
            options: {
                timeout: 10000,
                ui: 'bdd',
                reporter: 'spec',
                require: [
                    'chai'
                ]
            }
        }
    });

    // Fake Grunt Bump task
    grunt.registerTask('bump', '', function () {
        if (grunt.config('bump.increment') === 'custom') {
            grunt.log.ok('Bumping version to ' + grunt.config('bump.version').yellow + ':');
        } else {
            grunt.log.ok('Bumping up ' + grunt.config('bump.increment').yellow + ' version number.');
        }

        if (grunt.util._(grunt.config('bump.files')).contains('package')) {
            grunt.log.ok('Updating ' + 'package.json'.yellow + '.');
        }

        if (grunt.util._(grunt.config('bump.files')).contains('bower')) {
            if (!grunt.file.isFile('bower.json')) {
                grunt.log.ok('Creating ' + 'bower.json'.yellow + '.');
            }
            grunt.log.ok('Updating ' + 'bower.json'.yellow + '.');
        }

        if (grunt.util._(grunt.config('bump.files')).contains('git')) {
            grunt.log.ok('Updating ' + 'git tag'.yellow + '.');
        }
    });

    grunt.registerTask('bump',
        [
            //'jshint',
            'prompt:bump',
            'bump'
        ]);

    grunt.registerTask('test',
        [
            'jshint',
            'prompt:mochacli',
            'mochacli'
        ]);

    grunt.registerTask('default',
        [
            'jshint',
            'prompt:examples'
        ]);
};