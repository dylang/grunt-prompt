'use strict';

var expect = require('chai').expect;

describe('grunt-prompt', function(){

    describe('silly stuff', function(){

        it('loads', function(){
            var prompt = require('../tasks/prompt');
            console.log('--- The best way to test this is to just run `grunt` or `grunt prompt results`. ----')
            expect(prompt).to.exist;
        });
    });
});