const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Очищает папку dist перед каждым билдом
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Шаблон вашего HTML
      filename: 'index.html',           // Имя файла на выходе в dist
    }),
  ],
  devServer: {
    static: './dist',
    open: true, // Автоматически открывает браузер
    port: 3000,
  },
  mode: 'development',
};