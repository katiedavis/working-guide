const {NODE_ENV} = process.env;
const {NODE_ENV} = process.env;

module.exports = {
  mode: NODE_ENV === 'production' ? NODE_ENV : 'development',

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
};
