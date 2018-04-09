const path = require('path');

module.exports = {
  entry: './Blt.js',
  output: {
      path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};