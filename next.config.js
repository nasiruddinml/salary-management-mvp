/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs')
// Providing support for less as next don't support less out of the box
const withAntdLess = require('next-plugin-antd-less');
// Converting less variable to JS for injecting
const lessToJS = require('less-vars-to-js')
// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './styles/antd-custom.less'), 'utf8')
)

module.exports = withAntdLess({
  env: {
    baseUrl: "http://localhost:3000",
    apiUrl: "https://mocki.io/v1",
  },
  reactStrictMode: true,
  lessLoaderOptions: {
    lessOptions: {
      javascriptEnabled: true,
      math: 'always',
      modifyVars: themeVariables, // make your antd custom effective
    }
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const ANTD_STYLE_REGX = /antd\/.*?\/style.*?/;
      const exts = [...config.externals];
      config.externals = [
        (ctx, cb) => {
          if (ctx.request.match(ANTD_STYLE_REGX)) return cb();

          // next's params are different when webpack5 enable
          if (typeof exts[0] === 'function') return exts[0](ctx, cb);
          else return cb();
        },
        ...(typeof exts[0] === 'function' ? [] : exts),
      ]

      config.module.rules.unshift({
        test: ANTD_STYLE_REGX,
        use: 'null-loader',
      })
    }
    config.output.crossOriginLoading = "anonymous";
    return config;
  },
});
