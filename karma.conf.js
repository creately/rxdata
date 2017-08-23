module.exports = function(config) {
  config.set({
    browsers: ['ChromeHeadless'],
    frameworks: [
      'jasmine',
    ],
    files: [
      { pattern: 'src/__tests.ts' },
    ],
    mime: {
      'text/x-typescript': ['ts'],
    },
    plugins : [
      'karma-webpack',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-coverage-istanbul-reporter',
    ],
    preprocessors: {
      'src/**/*.ts': ['webpack'],
    },
    webpack: {
      resolve: {
        extensions: ['.ts', '.js']
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: 'ts-loader',
          },
          {
            test: /\.ts$/,
            loader: 'istanbul-instrumenter-loader',
            exclude: /node_modules|\.spec\.ts$|\.mock\.ts$|__tests\.ts$/,
            enforce: 'post',
          }
        ],
      },
    },
    reporters: ['dots', 'coverage-istanbul'],
    coverageIstanbulReporter: {
      dir: 'coverage/',
      reports: [ 'text-summary', 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
  });
};
