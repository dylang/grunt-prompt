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
            _ = require('lodash');

        var questions = options.questions;

        function addSeparator(choices) {
            if (!choices || _.isFunction(choices)) {
                return choices;
            }

            return choices.map(function(choice){
                if (choice === '---' || !choice || (choice && choice.separator)) {
                    return new inquirer.Separator(choice && choice.separator);
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
                _.forEach(answers, function(answer, configName){
                    grunt.config(configName, answer);
                });
                var delegateAsync = false;
                if (_.isFunction(options.then)) {
                    delegateAsync = options.then(answers, done);
                }
                if (!delegateAsync) {
                    done();
                }
            });
        }
    });
};
