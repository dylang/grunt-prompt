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

{%= screenshot('grunt-prompt setting up Mocha', 'https://f.cloud.github.com/assets/51505/983227/aabe4b6e-084a-11e3-94cd-514371c24059.gif') %}

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