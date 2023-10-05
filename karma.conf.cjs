module.exports = function(config) {
  config.set({
    browsers: ['ChromeHeadless'],
    frameworks: [
      'jasmine',
      'webpack'
    ],
    files: [
      { pattern: './src/__tests.ts' },
    ],
    mime: {
      'text/x-typescript': ['ts'],
    },
    plugins : [
      'karma-webpack',
      'karma-coverage',
      'karma-jasmine',
      'karma-chrome-launcher',
    ],
    preprocessors: {
      './src/**/*.ts': ['webpack'],
    },
    webpack: {
      mode: 'development',
      resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
          "crypto": require.resolve("crypto-browserify"),
        }
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: 'ts-loader',
          },
        ],
      },
    },
    reporters: ['dots', 'coverage'],
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
  });
};
