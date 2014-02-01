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
            options = this.options();

        var questions = options.questions;

        function addSeparator(choices) {
            if (!choices) {
                return choices;
            }

            return choices.map(function(choice){
                if (choice === '---') {
                    return new inquirer.Separator();
                }
                return choice;
            });
        }


        if (questions) {
            var done = this.async();

            questions = questions.map(function(question){
                // config just made more sense than name, but we accept both
                question.name = question.config || question.name;
                question.choices = addSeparator(question.choices);
                return question;
            });

            inquirer.prompt( questions, function( answers ) {
                for (var configName in answers) {
                    var answer = answers[configName];
                    grunt.config(configName, answer);
                }
                if (typeof options.then === 'function') {
                    options.then(answers);
                }
                done();
            });
        }
    });
};
