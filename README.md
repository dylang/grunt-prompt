<!---

This file was automatically generated.

Use `grunt readme` to regenerate.

--->
## grunt-prompt [![NPM version](https://badge.fury.io/js/grunt-prompt.png)](http://badge.fury.io/js/grunt-prompt)  [![Build Status](https://travis-ci.org/dylang/grunt-prompt.png)](https://travis-ci.org/dylang/grunt-prompt) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

> Interactive prompt for your Grunt config using console checkboxes, text input with filtering, password fields.

[![grunt-prompt](https://nodei.co/npm/grunt-prompt.png?downloads=true "grunt-prompt")](https://nodei.co/npm/grunt-prompt)


| ![grunt-prompt in action](https://f.cloud.github.com/assets/51505/867636/e727abfc-f717-11e2-997e-6b97e24593c3.gif "grunt-prompt in action") |
|:-------------:|
| grunt-prompt in action |



### Getting Started

This plugin recommends Grunt `0.4.1` or newer.

### Installing

```bash
npm install grunt-prompt --save-dev
```

Once that's done, add this line to your project's `Gruntfile.js`:

```js
grunt.loadNpmTasks('grunt-prompt');
```



`Grunt-prompt`'s UI is powered by the amazing [Inquirer](https://github.com/SBoudrias/Inquirer.js), a project created by Simon Boudrias.

| ![grunt-prompt in action](https://f.cloud.github.com/assets/51505/867636/e727abfc-f717-11e2-997e-6b97e24593c3.gif "grunt-prompt in action") |
|:-------------:|
| grunt-prompt in action |


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
            message: 'String|function()', // Question to ask the user, function needs to return a string,
            default: 'value', // default value if nothing is entered
            choices: 'Array|function(answers)',
            validate: function(value), // return true if valid, error message if invalid
            filter:  function(value), // modify the answer
            when: function(answers) // only ask this question when this function returns true
          }
        ]
      }
    },
  },
})
```



#### Options

##### config

Type: `String` _required_

This is used for three things:

 * It will set or overwrite the config of other Grunt tasks: `config: 'jshint.allFiles.reporter'`
 * The key in the resulting `answers` object: `if (answers['jshint.allFiles.reporter'] === 'custom') {...`
 * It can be an abitrary value read using `grunt.config`: `grunt.config('jshint.allFiles.reporter')`

##### type

Type: `String` _required_

Type of question to ask:

 * `list`: use arrow keys to pick one choice. Returns a string.
 * `checkbox`: use arrow keys and space bar to pick multiple items. Returns an array.
 * `confirm`: Yes/no. Returns a boolean.
 * `input`: Free text input. Returns a string.
 * `password`: Masked input. Returns a string.

Here's an example of each type:

| ![grunt-prompt example](https://f.cloud.github.com/assets/51505/867636/e727abfc-f717-11e2-997e-6b97e24593c3.gif "grunt-prompt example") |
|:-------------:|
| grunt-prompt example |

The documentation for [Inquiry](https://github.com/SBoudrias/Inquirer.js) has [more details about type](https://github.com/SBoudrias/Inquirer.js#prompts-type) as well as additional typess.

##### message

Type: `String|function()` _required_

Question to ask the user. If it's a function, it needs to return a string.

Hint: keep it short, users hate to read.

##### default

Type: `String`/`Array`/`Boolean`/'function' _optional_

Default value used when the user just hits Enter. *If a `value` field is not provided, the filter value must match the `name` exactly.*

##### choices

For `question types 'list' and 'checkbox'`: Type: `array of hashes`

 * `name` The label that is displayed in the UI.
 * `value` _optional_ Value returned. When not used the name is used instead.
 * `checked` _optional_ Choose the option by default. _Only for checkbox._

```
choices: [
  { name: 'jshint', checked: true },
  { name: 'jslint' },
  { name: 'eslint' },
  '---', // puts in a non-selectable separator
  { name: 'I like to live dangerously', value: 'none' }
]
```

##### validate

Type: `function(value)` _optional_

Return `true` if it is valid (true `true`, not a truthy value).
Return `string` message if it is not valid.

##### filter

Type: `function(value)` _optional_

Use a modified version of the input for the answer. Useful for stripping extra characters, converting strings to integers.

##### when

Type: `function(answers)` _optional_

Choose when this question is asked. Perfect for asking questions based on the results of previous questions.

##### then

Type: `function(results)` _optional_

Runs after all questions have been asked.



### How to use the results in your Gruntfile

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

| ![grunt-prompt setting up Mocha](https://f.cloud.github.com/assets/51505/983227/aabe4b6e-084a-11e3-94cd-514371c24059.gif "grunt-prompt setting up Mocha") |
|:-------------:|
| grunt-prompt setting up Mocha |

### How can values be accessed from my own code?

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

| ![grunt-prompt with grunt-bump](https://f.cloud.github.com/assets/51505/2119082/78171246-9142-11e3-970a-f64f2002ad4e.png "grunt-prompt with grunt-bump") |
|:-------------:|
| grunt-prompt with grunt-bump |

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





### Release History
* **1.1.0** - 4 Mar 2014 - Messages can be functions instead of strings for dynamic questions.
* **1.0.0** - 4 Feb 2014 - Dropping support for Node 0.8.
* **0.2.2** - 4 Feb 2014 - Updated readme to make it auto-generated.
* **0.2.1** - 4 Feb 2014 - Fix bug when using a function to provide choices.
* **0.2.0** - 26 Jan 2014 - Added `then` option which runs after questions. Improved docs.
* **0.1.1** - 27 July 2013 - Some documentation cleanup, better screenshots, new example code in the gruntfile, reomved unused tests.
* **0.1.0** - 18 July 2013 - First version, after an exhausting but fun day with the family at Hershey Park.




### About the Author

Hello fellow developer! My name is [Dylan Greene](https://github.com/dylang). When
not overwhelmed with my two kids I enjoy contributing to the open source community.
I'm a tech lead at [Opower](http://opower.com). I lead a team using Grunt and Angular to build software that
successfully helps people like us use less power.
Not too long ago I co-created [Doodle or Die](http://doodleordie.com), a hilarious web game with millions of
doodles that won us Node Knockout for the "most fun" category.
I'm [dylang](https://twitter.com/dylang) on Twitter and other places.

Some of my other Node projects:

| Name | Description | Github Stars | Npm Installs |
|---|---|--:|--:|
| [`grunt-notify`](https://github.com/dylang/grunt-notify) | Automatic desktop notifications for Grunt errors and warnings using Growl for OS X or Windows, Mountain Lion and Mavericks Notification Center, and Notify-Send. | 619 | 52,208 |
| [`rss`](https://github.com/dylang/node-rss) | RSS feed generator. A really simple API to add RSS feeds to any project. | 177 | 98,802 |
| [`shortid`](https://github.com/dylang/shortid) | Amazingly short non-sequential url-friendly unique id generator. | 129 | 22,984 |
| [`xml`](https://github.com/dylang/node-xml) | Fast and simple xml generator. Supports attributes, CDATA, etc. Includes tests and examples. | 35 | 180,625 |
| [`anthology`](https://github.com/dylang/anthology) | Module information and stats for any @npmjs user | _New!_ | _TBD_ |
| [`grunt-attention`](https://github.com/dylang/grunt-attention) | Display attention-grabbing messages in the terminal | _New!_ | 336 |
| [`observatory`](https://github.com/dylang/observatory) | Beautiful UI for showing tasks running on the command line. | _New!_ | 81 |
| [`changelog`](https://github.com/dylang/changelog) | Command line tool (and Node module) that generates a changelog in color output, markdown, or json for modules in npmjs.org's registry as well as any public github.com repo. | 51 | 2,081 |
| [`logging`](https://github.com/dylang/logging) | Super sexy color console logging with cluster support. | 21 | 8,793 |
| [`grunt-cat`](https://github.com/dylang/grunt-cat) | Echo a file to the terminal. Works with text, figlets, ascii art, and full-color ansi. | _New!_ | 396 |

_This list was generated using [anthology](https://github.com/dylang/anthology)._


### License
Copyright (c) 2014 Dylan Greene, contributors.

Released under the [MIT license](https://tldrlegal.com/license/mit-license).

Screenshots are [CC BY-SA](http://creativecommons.org/licenses/by-sa/4.0/) (Attribution-ShareAlike).

***
_Generated using [grunt-readme](https://github.com/assemble/grunt-readme) with [grunt-templates-dylang](https://github.com/dylang/grunt-templates-dylang) on Tuesday, March 4, 2014._ [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/dylang/grunt-prompt/trend.png)](https://bitdeli.com/free "Bitdeli Badge") [![Google Analytics](https://ga-beacon.appspot.com/UA-4820261-3/dylang/grunt-prompt)](https://github.com/igrigorik/ga-beacon)


<!---

This file was automatically generated.

Use `grunt readme` to regenerate.

--->