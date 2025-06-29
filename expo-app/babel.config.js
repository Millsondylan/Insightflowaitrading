module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
          alias: {
            '@': './',
            '@components': './components',
            '@contexts': './contexts',
            '@hooks': './hooks',
            '@store': './store',
            '@lib': './lib',
            '@api': './api',
            '@assets': './assets',
          },
        },
      ],
      'expo-router/babel',
    ],
  };
}; 