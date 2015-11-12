## grunt-prompt  [![Build Status](http://img.shields.io/travis/dylang/grunt-prompt.svg)](https://travis-ci.org/dylang/grunt-prompt) [![grunt-prompt](http://img.shields.io/npm/dm/grunt-prompt.svg)](https://www.npmjs.org/package/grunt-prompt)

> Interactive prompt for your Grunt config using console checkboxes, text input with filtering, password fields.



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
            config: 'config.name', // arbitrary name or config for any other grunt task
            type: '<question type>', // list, checkbox, confirm, input, password
            message: 'String|function(answers)', // Question to ask the user, function needs to return a string,
            default: 'value', // default value if nothing is entered
            choices: 'Array|function(answers)',
            validate: function(value), // return true if valid, error message if invalid. works only with type:input 
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
 * It can be an arbitrary value read using `grunt.config`: `grunt.config('jshint.allFiles.reporter')`

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

Type: `String|function(answers):String` _required_

The question to ask the user. If it's a function, it needs to return a string. The first parameter of this function will be an array containing all previously supplied answers. This allows you to customize the message based on the results of previous questions.

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
  '---', // puts in a non-selectable separator. Can be a string or '---' for default.
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

###### then

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
          message: 'Bump version from ' + '<%= pkg.version %>' + ' to:',
          choices: [
            {
              value: 'build',
              name:  'Build:  '+ (currentVersion + '-?') + ' Unstable, betas, and release candidates.'
            },
            {
              value: 'patch',
              name:  'Patch:  ' + semver.inc(currentVersion, 'patch') + ' Backwards-compatible bug fixes.'
            },
            {
              value: 'minor',
              name:  'Minor:  ' + semver.inc(currentVersion, 'minor') + ' Add functionality in a backwards-compatible manner.'
            },
            {
              value: 'major',
              name:  'Major:  ' + semver.inc(currentVersion, 'major') + ' Incompatible API changes.'
            },
            {
              value: 'custom',
              name:  'Custom: ?.?.? Specify version...'
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
            var valid = semver.valid(value);
            return !!valid || 'Must be a valid semver, such as 1.2.3-rc1. See http://semver.org/ for more details.';
          }
        },
        {
          config:  'bump.files',
          type:    'checkbox',
          message: 'What should get the new version:',
          choices: [
            {
              value:   'package',
              name:    'package.json' + (!grunt.file.isFile('package.json') ? ' not found, will create one' : ''),
              checked: grunt.file.isFile('package.json')
            },
            {
              value:   'bower',
              name:    'bower.json' + (!grunt.file.isFile('bower.json') ? ' not found, will create one' : ''),
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
* **1.3.0** - 26 Oct 2014 - Add {{done}} callback for {{then}}.
* **1.2.1** - 4 Oct 2014 - Separator can be '' or { separator: 'any string' }. Fixed it so choices can be strings again.
* **1.2.0** - 4 Oct 2014 - Separator in choices can be a falsey value or string
* **1.1.0** - 4 Mar 2014 - Messages can be functions instead of strings for dynamic questions.
* **1.0.0** - 4 Feb 2014 - Dropping support for Node 0.8.
* **0.2.2** - 4 Feb 2014 - Updated readme to make it auto-generated.
* **0.2.1** - 4 Feb 2014 - Fix bug when using a function to provide choices.
* **0.2.0** - 26 Jan 2014 - Added `then` option which runs after questions. Improved docs.
* **0.1.1** - 27 July 2013 - Some documentation cleanup, better screenshots, new example code in the gruntfile, reomved unused tests.
* **0.1.0** - 18 July 2013 - First version, after an exhausting but fun day with the family at Hershey Park.




### About the Author

Hi! Thanks for checking out this project! My name is **Dylan Greene**. When not overwhelmed with my two young kids I enjoy contributing
to the open source community. I'm also a tech lead at [Opower](http://opower.com). [![@dylang](https://img.shields.io/badge/github-dylang-green.svg)](https://github.com/dylang) [![@dylang](https://img.shields.io/badge/twitter-dylang-blue.svg)](https://twitter.com/dylang)

Here's some of my other Node projects:

| Name | Description | npm&nbsp;Downloads |
|---|---|---|
| [`grunt‑notify`](https://github.com/dylang/grunt-notify) | Automatic desktop notifications for Grunt errors and warnings using Growl for OS X or Windows, Mountain Lion and Mavericks Notification Center, and Notify-Send. | [![grunt-notify](https://img.shields.io/npm/dm/grunt-notify.svg?style=flat-square)](https://www.npmjs.org/package/grunt-notify) |
| [`npm‑check`](https://github.com/dylang/npm-check) | Check for outdated, incorrect, and unused dependencies. | [![npm-check](https://img.shields.io/npm/dm/npm-check.svg?style=flat-square)](https://www.npmjs.org/package/npm-check) |
| [`shortid`](https://github.com/dylang/shortid) | Amazingly short non-sequential url-friendly unique id generator. | [![shortid](https://img.shields.io/npm/dm/shortid.svg?style=flat-square)](https://www.npmjs.org/package/shortid) |
| [`rss`](https://github.com/dylang/node-rss) | RSS feed generator. Add RSS feeds to any project. Supports enclosures and GeoRSS. | [![rss](https://img.shields.io/npm/dm/rss.svg?style=flat-square)](https://www.npmjs.org/package/rss) |
| [`xml`](https://github.com/dylang/node-xml) | Fast and simple xml generator. Supports attributes, CDATA, etc. Includes tests and examples. | [![xml](https://img.shields.io/npm/dm/xml.svg?style=flat-square)](https://www.npmjs.org/package/xml) |
| [`changelog`](https://github.com/dylang/changelog) | Command line tool (and Node module) that generates a changelog in color output, markdown, or json for modules in npmjs.org's registry as well as any public github.com repo. | [![changelog](https://img.shields.io/npm/dm/changelog.svg?style=flat-square)](https://www.npmjs.org/package/changelog) |
| [`grunt‑attention`](https://github.com/dylang/grunt-attention) | Display attention-grabbing messages in the terminal | [![grunt-attention](https://img.shields.io/npm/dm/grunt-attention.svg?style=flat-square)](https://www.npmjs.org/package/grunt-attention) |
| [`observatory`](https://github.com/dylang/observatory) | Beautiful UI for showing tasks running on the command line. | [![observatory](https://img.shields.io/npm/dm/observatory.svg?style=flat-square)](https://www.npmjs.org/package/observatory) |
| [`anthology`](https://github.com/dylang/anthology) | Module information and stats for any @npmjs user | [![anthology](https://img.shields.io/npm/dm/anthology.svg?style=flat-square)](https://www.npmjs.org/package/anthology) |
| [`grunt‑cat`](https://github.com/dylang/grunt-cat) | Echo a file to the terminal. Works with text, figlets, ascii art, and full-color ansi. | [![grunt-cat](https://img.shields.io/npm/dm/grunt-cat.svg?style=flat-square)](https://www.npmjs.org/package/grunt-cat) |

_This list was generated using [anthology](https://github.com/dylang/anthology)._


### License
Copyright (c) 2015 Dylan Greene, contributors.

Released under the [MIT license](https://tldrlegal.com/license/mit-license).

Screenshots are [CC BY-SA](http://creativecommons.org/licenses/by-sa/4.0/) (Attribution-ShareAlike).

***
_Generated using [grunt-readme](https://github.com/assemble/grunt-readme) with [grunt-templates-dylang](https://github.com/dylang/grunt-templates-dylang) on Wednesday, November 11, 2015._
_To make changes to this document look in `/templates/readme/`

