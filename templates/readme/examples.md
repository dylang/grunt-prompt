## Usage Examples

{%= screenshot('grunt-prompt with grunt-bump', 'https://f.cloud.github.com/assets/51505/2119082/78171246-9142-11e3-970a-f64f2002ad4e.png') %}

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