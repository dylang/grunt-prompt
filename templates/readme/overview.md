## Overview
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
