// 我的 资源
export const paperMyResource = {
  // 我的下载 试卷下载
  RESOURCE_MY_DOWNLOAD: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/personal/myDownload',
  },
  // 试卷下载
  RESOURCE_PAPER_DOWNLOAD: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/personal/paperDownload',
  },
  // 我的资源 我的题库
  RESOURCE_PAPER_SELFQUES: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/v2/paper/selfQues/list',
  },
  // 我的资源 我的题库 删除试题
  RESOURCE_DELETE_SELFQUES: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/v2/paper/selfQues/delete',
  },
  RESOURCE_RE_PARSE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/school/paper/reParse',
  },
  RESOURCE_PAPER_UPLOADINFO: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/v2/paper/uploadInfo',
  },
  RESOURCE_DELETE_DOWNLOAD: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/personal/deleteDownloadRecord',
  },
  RESOURCE_PAPERSTATUS_ONLINE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/papers/paperStatus',
  },
  RESOURCE_EDIT_CANADAPTED: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/selfQues/edit/canAdapted',
  },
  RESOURCE_UNIVERSITYENTRANCE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/universityEntrance/encode',
  },
  RESOURCE_UNIVERSITYENTRANCE_QUESTIONANALYSIS: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/universityEntrance/questionAnalysis',
  },
  // 下载分析
  RESOURCE_UNIVERSITYENTRANCE_DOWNLOADQUESTIONANALYSIS: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/universityEntrance/downloadQuestionAnalysis',
  },
  // yp 2022/8/30 分页查询我的分享试卷
  RESOURCE_SHAREPAPER_GETSHAREPAPERPAGE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/sharePaper/getSharePaperPage',
  },
}
