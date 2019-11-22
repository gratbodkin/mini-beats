const rewireProvidePlugin = require('react-app-rewire-provide-plugin')

module.exports = (config, env) => {
  config.module.rules.push(
    {
        test: /\.(html)$/,
        loader: 'html-loader'
    });
    config.module.rules.push(
    {
        test: /\.(glsl|frag|vert)$/,
        use: [
          require.resolve('raw-loader'),
          require.resolve('glslify-loader'),
        ]
    });
    return config;
}