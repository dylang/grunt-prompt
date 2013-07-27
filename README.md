# grunt-prompt

> Ask questions during your Grunt workflow. Use user input for later tasks


#### Choose from a list:
![List](https://f.cloud.github.com/assets/51505/823607/6549de22-f017-11e2-8a70-04bf663d5876.png)

#### Text input with validation and filtering:
![Input](https://f.cloud.github.com/assets/51505/823612/aa893c08-f017-11e2-97bb-f5eef6c1e845.png)

#### Select more than one:
![Choices](https://f.cloud.github.com/assets/51505/823611/92c06a10-f017-11e2-82cf-24b1b8e5601d.png)


## Getting Started
This plugin requires Grunt `~0.4.1`

```shell
npm install grunt-prompt --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-prompt');
```

## grunt-prompt

### Overview
In your project's Gruntfile, add a section named `prompt` to the data object passed into `grunt.initConfig()`.

`grunt-prompt` is a multi-task. This means you can create multiple prompts.

```js
grunt.initConfig({
  prompt: {
    target: {
      options: {
        questions: [
            config: 'config.name', // arbitray name or config for any other grunt task
            type: '<question type>', // list, checkbox, confirm, input, password
            message: 'Question to ask the user',
            default: 'value', // default value if nothing is entered
            choices: 'Array|Function(answers)',
            validate: Function(value), // return true if valid, error message if invalid
            filter:  Function(value), // modify the answer
            when: Function(answers) // only ask this question when this function returns true
        ]
      }
    },
  },
})
```

### Options

#### config

Type: `String` _required_

This is used for three things:

 * It will set or overwrite the config of other Grunt tasks: `config: 'jshint.allFiles.reporter'`
 * The key in the resulting `answers` object: `if (answers['jshint.allFiles.reporter'] === 'custom') {...`
 * It can be an abitrary value read using `grunt.config`: `grunt.config('jshint.allFiles.reporter')`

#### type

Type: `String` _required_

Type of question to ask:

 * `list`: use arrow keys to pick one choice. Returns a string.
 * `checkbox`: use arrow keys and space bar to pick multiple items. Returns an array.
 * `confirm`: Yes/no. Returns a boolean.
 * `input`: Free text input. Returns a string.
 * `password`: Masked input. Returns a string.

The documentation for Inquiry has [more details about type](https://github.com/SBoudrias/Inquirer.js#prompts-type) as well as additional typess.

#### message

Type: `String` _required_

Question to ask the user.

Hint: keep it short, users hate to read.

#### default

Type: `String`/`Array`/`Boolean` depending on `question type` _optional_

Default value used when the user just bangs Enter.

#### choices

For `question type 'list'`: Type: `array of strings`

```
choices: ['jshint', 'jslint', 'eslint', 'I like to live dangerously.']
```

For `question type 'checkbox'`: Type: `array of hashes`

Include `checked: true` to select it by default.

```
choices: [
    {name: 'jshint', checked: true},
    {name: 'jslint'},
    {name: 'eslint'}
    ]
```

#### validate

Type: `function(value)` _optional_

Return `true` if it is valid (true `true`, not a truthy value).
Return `string` message if it is not valid.

#### filter

Type: `function(value)` _optional_

Use a modified version of the input for the answer. Useful for stripping extra characters, converting strings to integers, etc.

#### when

Type: `function(answers)` _optional_

Choose when this question is asked. Perfect for asking questions based on the results of previous questions.


### Usage Examples



This is an example of how `grunt-prompt` for something like [grunt-bump](https://github.com/vojtajina/grunt-bump) which makes it easy to
update your project's version in the `package.json`, `bower.json`, and `git tag`.

```js
prompt: {
  prompt: {
    bump: {
      options: {
        questions: [
          {
            config:  'bump.increment',
            type:    'list',
            // normally these versions wouldn't be hardcoded
            message: 'Bump version from ' + '1.2.3'.cyan + ' to:',
            choices: [
              '1.2.4-? ❘❙❚ Build: unstable, betas, and release candidates.',
              '1.2.4   ❘❙❚ Patch: backwards-compatible bug fixes.',
              '1.3.0   ❘❙❚ Minor: add functionality in a backwards-compatible manner.',
              '2.0.0   ❘❙❚ Major: incompatible API changes.',
              '?.?.?   ❘❙❚ Custom: Specify version...'
            ],
            filter:  function (value) {
              var matches = value.match(/([^(\s)]*):/);
              return matches && matches[1].toLowerCase();
            }
          },
          {
            config:   'bump.version',
            type:     'input',
            message:  'What specific version would you like',
            when:     function (answers) {
              return answers['bump.increment'] === 'custom';
            },
            validate: function (value) {
              var valid = require('semver').valid(value) && true;
              return valid || 'Must be a valid semver, such as 1.2.3. See http://semver.org/';
            }
          },
          {
            config:  'bump.files',
            type:    'checkbox',
            message: 'What should get the new version:',
            choices: [
              {
                name:    'package.json',
                checked: grunt.file.isFile('package.json')
              },
              {
                name:    'bower.json',
                checked: grunt.file.isFile('bower.json')
              },
              {
                name:    'git tag',
                checked: grunt.file.isDir('.git')
              }
            ]
          }
        ]
      }
    }
  }
}```
```

## Release History

* **0.1.0** - 18 July 2013 - First version, after an exhausting but fun day with the family at Hershey Park.