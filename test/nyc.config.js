
module.exports = {
    all: true,
    //extends: '@istanbuljs/nyc-config-babel',
    // include: [
    //   './index.js',
    // ],
    // exclude: [
    //   'jsdocs.js',
    //   'nyc.config.js',
    //   'rollup.config.js',
    //   'jsdoc.config.js'
    // ],
    exclude: [
        '.coverage/**/*',
        'test/**/*'
    ],
    reporter: ['text', 'html'],
    'report-dir': './.coverage'
  };
  