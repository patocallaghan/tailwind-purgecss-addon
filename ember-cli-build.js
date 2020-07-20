'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const isProduction = EmberAddon.env() === 'production';

const purgeCSS = {
  module: require('@fullhuman/postcss-purgecss'),
  options: {
    content: [
      './app/index.html',
      './app/templates/**/*.hbs',
      './app/components/**/*.hbs',
      './addon/templates/**/*.hbs',
      './addon/components/**/*.hbs',
      './tests/dummy/**/*.hbs'
    ],
    // This is the function used to extract class names from your templates
    defaultExtractor: content => {
      // Capture as liberally as possible, including things like `h-(screen-1.5)`
      const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []

      // Capture classes within other delimiters like .block(class="w-1/2") in Pug
      const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []

      return broadMatches.concat(innerMatches)
    }
  }
}

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    postcssOptions: {
      compile: {
        extension: 'scss',
        enabled: true,
        parser: require('postcss-scss'),
        plugins: [
          {
            module: require('@csstools/postcss-sass'),
            options: {
              includePaths: [
                'node_modules',
              ],
            },
          },
          require('tailwindcss')('./tests/dummy/config/tailwind.config.js'),
          ...[purgeCSS],
        ]
      }
    }
  });
  return app.toTree();
};
