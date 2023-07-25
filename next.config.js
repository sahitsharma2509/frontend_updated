const withTM = require('next-transpile-modules')(['react-syntax-highlighter', '@omtanke/react-use-event-outside']);

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en-US', 'fr'],
    defaultLocale: 'en-US',
  }
}

module.exports = withTM(nextConfig);

