module.exports = {
  presets: [
    ['@vue/app',
      {
        // polyfills: [
        //   'es6.promise',
        //   'es6.symbol'
        // ]
        // useBuiltIns: 'usage'
      }
    ],
    ['@babel/preset-env',
      {
        'modules': false,
        useBuiltIns: 'usage'
      }
    ]
  ],
  plugins: [
    /* [
      'component',
      {
        'libraryName': 'element-plus',
        'styleLibraryName': 'theme-chalk'
      }
    ] */
  ]
}
