export const userTheme = {
  // yp 2022/10/26 查询默认主题
  USERTHEME_GETDEFAULTTHEME: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/userTheme/getDefaultTheme',
  },
  USERTHEME_GETUSERTHEME: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/userTheme/getUserTheme',
  },
  USERTHEME_GETTHEMECONFIGLIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/userTheme/getThemeConfigList',
  },
  USERTHEME_SAVEUSERTHEME: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/userTheme/saveUserTheme',
  },
}
