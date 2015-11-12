### Options

#### config

Type: `String` _required_

This is used for three things:

 * It will set or overwrite the config of other Grunt tasks: `config: 'jshint.allFiles.reporter'`
 * The key in the resulting `answers` object: `if (answers['jshint.allFiles.reporter'] === 'custom') {...`
 * It can be an arbitrary value read using `grunt.config`: `grunt.config('jshint.allFiles.reporter')`

#### type

Type: `String` _required_

Type of question to ask:

 * `list`: use arrow keys to pick one choice. Returns a string.
 * `checkbox`: use arrow keys and space bar to pick multiple items. Returns an array.
 * `confirm`: Yes/no. Returns a boolean.
 * `input`: Free text input. Returns a string.
 * `password`: Masked input. Returns a string.

Here's an example of each type:

{%= screenshot('grunt-prompt example', 'https://f.cloud.github.com/assets/51505/867636/e727abfc-f717-11e2-997e-6b97e24593c3.gif') %}

The documentation for [Inquiry](https://github.com/SBoudrias/Inquirer.js) has [more details about type](https://github.com/SBoudrias/Inquirer.js#prompts-type) as well as additional typess.

#### message

Type: `String|function(answers):String` _required_

The question to ask the user. If it's a function, it needs to return a string. The first parameter of this function will be an array containing all previously supplied answers. This allows you to customize the message based on the results of previous questions.

Hint: keep it short, users hate to read.

#### default

Type: `String`/`Array`/`Boolean`/'function' _optional_

Default value used when the user just hits Enter. *If a `value` field is not provided, the filter value must match the `name` exactly.*

#### choices

For `question types 'list' and 'checkbox'`: Type: `array of hashes`

 * `name` The label that is displayed in the UI.
 * `value` _optional_ Value returned. When not used the name is used instead.
 * `checked` _optional_ Choose the option by default. _Only for checkbox._

```
choices: [
  { name: 'jshint', checked: true },
  { name: 'jslint' },
  { name: 'eslint' },
  '---', // puts in a non-selectable separator. Can be a string or '---' for default.
  { name: 'I like to live dangerously', value: 'none' }
]
```

#### validate

Type: `function(value)` _optional_

Return `true` if it is valid (true `true`, not a truthy value).
Return `string` message if it is not valid.

#### filter

Type: `function(value)` _optional_

Use a modified version of the input for the answer. Useful for stripping extra characters, converting strings to integers.

#### when

Type: `function(answers)` _optional_

Choose when this question is asked. Perfect for asking questions based on the results of previous questions.

##### then

Type: `function(results, done):Boolean` _optional_

Runs after all questions have been asked.

The ```done``` parameter is optional, and can be used for async operations in your handler.

When you return ```true``` from this function, the grunt-prompt code will not complete the async, so you are able to do your own async operations and call ```done()``` yourself. 

```
config:
  prompt: {
    demo: {
      options: {
        questions: [
          ..
        ],
        then: function(results, done) {
          someAsyncFunction(function () {
            done();
          });
          return true;
        }
      }
    }
  }

```
