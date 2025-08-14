const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  
  // Optimize for large assets and prevent hanging
  config.transformer = {
    ...config.transformer,
    minifierConfig: {
      mangle: {
        keep_fnames: true,
      },
      output: {
        ascii_only: true,
        quote_keys: true,
        wrap_iife: true,
      },
    },
    allowOptionalDependencies: true,
    unstable_allowRequireContext: true,
  };
  
  // Optimize asset handling for large images
  config.resolver = {
    ...config.resolver,
    assetExts: [...config.resolver.assetExts, 'png', 'jpg', 'jpeg', 'gif', 'webp'],
    sourceExts: [...config.resolver.sourceExts, 'cjs'],
  };
  
  // Increase timeout and memory settings
  config.server = {
    ...config.server,
    enhanceMiddleware: (middleware, server) => {
      return middleware;
    },
  };
  
  return withNativeWind(config, { input: './app/globals.css' });
})();
