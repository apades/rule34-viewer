module.exports = function (api) {
  api.cache(false)
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@r': '.',
          },
        },
      ],
      [
        'transform-inline-environment-variables',
        {
          include: ['NSFW', 'LOCALIP'],
        },
      ],
      'react-native-paper/babel',
    ],
  }
}
