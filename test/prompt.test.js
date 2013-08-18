'use strict';

var expect = require('chai').expect;

describe('grunt-prompt', function(){

    describe('silly stuff', function(){

        it('loads', function(){
            var prompt = require('../tasks/prompt');
            expect(prompt).to.exist;
        });
    });
});