# grunt-prompt [![Build Status](https://travis-ci.org/dylang/grunt-prompt.png?branch=master)](https://travis-ci.org/dylang/grunt-prompt)

> Add interactive UI to your Gruntfile such as lists, checkboxes, text input with filtering, and password fields, all on the command line.

![grunt-prompt-example](https://f.cloud.github.com/assets/51505/867636/e727abfc-f717-11e2-997e-6b97e24593c3.gif)

`Grunt-prompt`'s UI is powered by the amazing [Inquirer](https://github.com/SBoudrias/Inquirer.js), a project created by Simon Boudrias.

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
          {
            config: 'config.name', // arbitray name or config for any other grunt task
            type: '<question type>', // list, checkbox, confirm, input, password
            message: 'Question to ask the user',
            default: 'value', // default value if nothing is entered
            choices: 'Array|Function(answers)',
            validate: Function(value), // return true if valid, error message if invalid
            filter:  Function(value), // modify the answer
            when: Function(answers) // only ask this question when this function returns true
          }
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

Here's an example of each type:

![grunt-prompt-example](https://f.cloud.github.com/assets/51505/867636/e727abfc-f717-11e2-997e-6b97e24593c3.gif)

The documentation for **Inquiry** has [more details about type](https://github.com/SBoudrias/Inquirer.js#prompts-type) as well as additional typess.

#### message

Type: `String` _required_

Question to ask the user.

Hint: keep it short, users hate to read.

#### default

Type: `String`/`Array`/`Boolean` depending on `question type` _optional_

Default value used when the user just bangs Enter.

#### choices

For `question types 'list' and 'checkbox'`: Type: `array of hashes`

 * `name` The label that is displayed in the UI.
 * `value` _optional_ Value returned. When not used the name is used instead.
 * `checked` _optional_ Choosed the option by default. _Only for checkbox._

```
choices: [
  { name: 'jshint', checked: true },
  { name: 'jslint' },
  { name: 'eslint' },
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

## How to use the results in your Gruntfile

You can also modify how tasks will work by changing options for other tasks.
You do not need to write code to do this, it's all in the `config` var.

Here we will let the user choose what Mocha reporter to use.

```js
config:
  prompt: {
    mochacli: {
      options: {
        questions: [
          {
            config: 'mochacli.options.reporter'
            type: 'list'
            message: 'Which Mocha reporter would you like to use?',
            default: 'spec'
            choices: ['dot', 'spec', 'nyan', 'TAP', 'landing', 'list',
              'progress', 'json', 'JSONconv', 'HTMLconv', 'min', 'doc']
          }
        ]
      }
    }
  }

```

and create a shortcut:

```
grunt.registerTask('test',
  [
    'prompt:mochacli',
    'mochacli'
  ]);

```

And run it:

```
$ grunt test
```

![prompt-mocha](https://f.cloud.github.com/assets/51505/983227/aabe4b6e-084a-11e3-94cd-514371c24059.gif)


## How can values be accessed from my own code?

This `config` value is accessible to all other `grunt` tasks via `grunt.config('<config name>')`.

If you had this:

```js
config: 'validation'
```

Then later on in your custom task can access it like this:

```js
var validation = grunt.config('validation');
```

### Usage Examples

![grunt-prompt-example-bump](https://f.cloud.github.com/assets/51505/867601/b3200cb6-f710-11e2-89da-675c831c218a.gif)

This is an example of how `grunt-prompt` for something like [grunt-bump](https://github.com/vojtajina/grunt-bump) which makes it easy to
update your project's version in the `package.json`, `bower.json`, and `git tag`.

```js
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
            return valid || 'Must be a valid semver, such as 1.2.3-rc1. See ' +
              'http://semver.org/'.blue.underline + ' for more details.';
          }
        },
        {
          config:  'bump.files',
          type:    'checkbox',
          message: 'What should get the new version:',
          choices: [
            {
              value:   'package',
              name:    'package.json' +
                (!grunt.file.isFile('package.json') ? ' file not found, will create one'.grey : ''),
              checked: grunt.file.isFile('package.json')
            },
            {
              value:   'bower',
              name:    'bower.json' +
                (!grunt.file.isFile('bower.json') ? ' file not found, will create one'.grey : ''),
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
}
```

## Release History
* **0.1.1** - 27 July 2013 - Some documentation cleanup, better screenshots, new example code in the gruntfile, reomved unused tests.
* **0.1.0** - 18 July 2013 - First version, after an exhausting but fun day with the family at Hershey Park.