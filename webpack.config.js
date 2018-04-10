const path = require('path');

module.exports = {
  entry: './dist/Blt.js',
  mode: 'none',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: "blt_module",
    libraryTarget: "umd"
  },
  performance: { hints: false }
};
