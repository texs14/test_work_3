module.exports = {
    plugins: [
        require('autoprefixer'),
        require('cssnano')({preset: 'default'}),
        require('postcss-preset-env')({browsers: 'last 4 versions'})
    ]
}