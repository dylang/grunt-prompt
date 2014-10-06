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
var chalk = require('chalk');
var _ = require('lodash');

module.exports = function (grunt) {


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

        specialVariable: 'a special thing',

        specialFunction: function () {
            return 'a dynamic value [' + new Date() + ']';
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
                                { name: chalk.white('White') },
                                { name: chalk.grey('Grey') },
                                '---',
                                { name: chalk.blue('Blue'), value: 'blue' },
                                { name: chalk.cyan('Cyan') },
                                { name: chalk.green('Green') },
                                { name: chalk.magenta('Magenta') },
                                { name: chalk.red('Red') },
                                { name: chalk.yellow('Yellow') },
                            ],
                            default: 'blue',
                            filter: function(str) {
                                return chalk.stripColor(str.toLowerCase());
                            }
                        },
                        {
                            config: 'echo.checkbox',
                            type: 'checkbox',
                            message: 'Choose multiple items, returns an array of values',
                            choices: [
                                { name: chalk.bold('Bold'), value: 'bold' },
                                { name: chalk.italic('Italic') },
                                { name: chalk.underline('Underline'), value: 'underline' },
                                { name: chalk.inverse('Inverse') },
                                { name: chalk.strikethrough('Strikethrough') }
                            ],
                            default: [
                                'bold', 'underline'
                            ],
                            filter: function(value) {
                                return _(value)
                                    .map(chalk.stripColor)
                                    .map(function(str){
                                        return str.toLowerCase();
                                    })
                                    .value();
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
                    ],
                    then: function(){
                        console.log(chalk.green.bold.underline('Great job!'));
                    }
                }
            },

            test: {
                options: {
                    questions: [
                        {
                            config: 'test',
                            type: 'input',
                            message: 'Just press enter, the result should be the default.',
                            default: 1
                        }
                    ],
                    then: function(results){
                        console.log('results from this test', results);
                    }
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
                            choices: [
                                { name: 'dot' },
                                { name: 'spec' },
                                { name: 'nyan' },
                                { name: 'TAP' },
                                { name: 'landing' },
                                { name: 'list' },
                                { name: 'progress' },
                                { name: 'json' },
                                { name: 'JSONconv' },
                                { name: 'HTMLconv' },
                                { name: 'min' },
                                { name: 'doc' }
                                ]
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
            },
            dynamic: {
                options: {
                    questions: [
                        {
                            config: 'echo.dynamic',
                            type: 'input',
                            message: function () {
                                var specialVariable = grunt.config('specialVariable'),
                                    specialFunction = grunt.config('specialFunction');

                                return 'You can use ' + chalk.yellow(specialVariable) + ' and even ' + chalk.red(specialFunction()) + ' in your questions';
                            }
                        },
                    ]
                }
            },
            separator: {
                options: {
                    questions: [
                        {
                            config: 'separator',
                            type: 'list',
                            message: 'List of choices with custom Separator',
                            choices: [
                                { separator: chalk.bold.red('HEADING') },
                                'Label 1',
                                'Label 2',
                                '',
                                {name: 'Label 3'},
                                {name: 'Label 4'},
                                '---',
                                {name: 'Label 5'},
                                {name: 'Label 6'}
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

    grunt.registerTask('results', 'show results from grunt-prompt', function(subtask){
        _(grunt.config('prompt'))
            .pick(subtask || _.constant(true))
            .pluck('options')
            .pluck('questions')
            .flatten()
            .pluck('config')
            .each(function(key){
                console.log(key + ':\t', grunt.config(key));
            });
    });

    // Fake Grunt Bump task
    grunt.registerTask('bump', '', function () {
        if (grunt.config('bump.increment') === 'custom') {
            grunt.log.ok('Bumping version to ' + grunt.config('bump.version').yellow + ':');
        } else {
            grunt.log.ok('Bumping up ' + grunt.config('bump.increment').yellow + ' version number.');
        }

        if (_(grunt.config('bump.files')).contains('package')) {
            grunt.log.ok('Updating ' + 'package.json'.yellow + '.');
        }

        if (_(grunt.config('bump.files')).contains('bower')) {
            if (!grunt.file.isFile('bower.json')) {
                grunt.log.ok('Creating ' + 'bower.json'.yellow + '.');
            }
            grunt.log.ok('Updating ' + 'bower.json'.yellow + '.');
        }

        if (_(grunt.config('bump.files')).contains('git')) {
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

    grunt.registerTask('dynamic',
        [
            'prompt:dynamic',
            'results:dynamic'
        ]);

    grunt.registerTask('default',
        [
            'jshint',
            'prompt:examples',
            'results:examples'
        ]);

    require('load-grunt-tasks')(grunt);

    grunt.loadTasks('tasks');

};
