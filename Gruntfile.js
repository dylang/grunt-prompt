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

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.loadTasks('tasks');

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

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
          config:  'bump.increment',
          type:    'list',
          message: 'Bump version from ' + '<%= pkg.version %>'.cyan + ' to:',
          choices: [
            {
              value: 'build',
              name:  'Build:  '.yellow + (currentVersion + '-?').yellow +
                ' Unstable, betas, and release candidates.'
            },
            {
              value: 'patch',
              name:  'Patch:  '.yellow + semver.inc(currentVersion, 'patch').yellow +
                '   Backwards-compatible bug fixes.'
            },
            {
              value: 'minor',
              name:  'Minor:  '.yellow + semver.inc(currentVersion, 'minor').yellow +
                '   Add functionality in a backwards-compatible manner.'
            },
            {
              value: 'major',
              name:  'Major:  '.yellow + semver.inc(currentVersion, 'major').yellow +
                '   Incompatible API changes.'
            },
            {
              value: 'custom',
              name:  'Custom: ?.?.?'.yellow +
                '   Specify version...'
            }
          ]
        },
        {
          config:   'bump.version',
          type:     'input',
          message:  'What specific version would you like',
          when:     function (answers) {
            return answers['bump.increment'] === 'custom';
          },
          validate: function (value) {
            var valid = semver.valid(value) && true;
            return valid || 'Must be a valid semver, such as 1.2.3-rc1. See ' + 'http://semver.org/'.blue.underline + ' for more details.';
          }
        },
        {
          config:  'bump.files',
          type:    'checkbox',
          message: 'What should get the new version:',
          choices: [
            {
              value:   'package',
              name:    'package.json' + (!grunt.file.isFile('package.json') ? ' file not found, will create one'.grey : ''),
              checked: grunt.file.isFile('package.json')
            },
            {
              value:   'bower',
              name:    'bower.json' + (!grunt.file.isFile('bower.json') ? ' file not found, will create one'.grey : ''),
              checked: grunt.file.isFile('bower.json')
            },
            {
              value:   'git',
              name:    'git tag',
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

    // Fake Grunt Bump task
    grunt.registerTask('bump', '', function(){
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

    grunt.registerTask('test',
        [
            'jshint',
            'prompt',
            'bump'//,
            //'nodeunit'
        ]);

    grunt.registerTask('default',
        [
            'jshint',
            'prompt:bump',
            'bump'
        ]);

};
