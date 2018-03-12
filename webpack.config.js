const path = require('path');

module.exports = {
  entry: './src/src.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'src/dist')
  }
};
