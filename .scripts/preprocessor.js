const tsc = require('typescript');
const config = require('../tsconfig.json');

function process (src, path) {
  if (path.endsWith('.ts')) {
    const opts = config.compilerOptions;
    return tsc.transpile(src, opts, path, []);
  }
  return src;
}

module.exports = {
  process,
};
