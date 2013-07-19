/*
 * grunt-prompt
 * https://github.com/dylang/grunt-prompt
 *
 * Copyright (c) 2013 Dylan Greene
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    grunt.registerMultiTask('prompt', 'Interactive command line user prompts.', function () {

        var inquirer = require('inquirer'),
            options = this.options(),
            _ = grunt.util._;

        var questions = options.questions;

        if (questions) {

            questions = questions.map(function(question){
                question.name = question.config || question.name;
                return question;
            });


            var done = this.async();

            inquirer.prompt( questions, function( answers ) {
                _(answers).forEach(function(answer, name){
                    grunt.config(name, answer);
                });
                done();
            });
        }
    });
};
