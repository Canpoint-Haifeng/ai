export const plazaAPI = {
  // 分页查询活动话题（交流广场）
  PLAZA_ACTIVITYTALK_GETACTIVITYTALKPAGEPASSTOKEN: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/activityTalk/getActivityTalkPagePassToken',
  },
  // 分页查询活动话题（交流广场）
  PLAZA_ACTIVITYTALK_GETACTIVITYTALKPAGE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/activityTalk/getActivityTalkPage',
  },
  //  分页查询活动话题评论-用户未登录
  PLAZA_ACTIVITYTALK_GETTALKCOMMENTPAGEPASSTOKEN: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/activityTalk/getTalkCommentPagePassToken',
  },
  //  分页查询活动话题评论
  PLAZA_ACTIVITYTALK_GETTALKCOMMENTPAGE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/activityTalk/getTalkCommentPage',
  },
  //  取消收藏活动话题
  PLAZA_ACTIVITYTALK_CANCELCOLLECTACTIVITYTALK: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/activityTalk/cancelCollectActivityTalk',
  },
  //  取消收藏活动话题评论
  PLAZA_ACTIVITYTALK_CANCELCOLLECTTALKCOMMENT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/activityTalk/cancelCollectTalkComment',
  },
  //  取消点赞活动话题评论
  PLAZA_ACTIVITYTALK_CANCELLIKETALKCOMMENT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/activityTalk/cancelLikeTalkComment',
  },
  //  收藏活动话题
  PLAZA_ACTIVITYTALK_TOCOLLECTACTIVITYTALK: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/activityTalk/toCollectActivityTalk',
  },
  //  收藏活动话题评论
  PLAZA_ACTIVITYTALK_TOCOLLECTTALKCOMMENT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/activityTalk/toCollectTalkComment',
  },
  //  新增活动话题评论
  PLAZA_ACTIVITYTALK_ADDTALKCOMMENT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/activityTalk/addTalkComment',
  },
  //  新增用户话题
  PLAZA_ACTIVITYTALK_ADDACTIVITYTALK: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/activityTalk/addActivityTalk',
  },
  //  查询前台使用标签
  PLAZA_ACTIVITYTALK_GETFRONTENDLABELS: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/activityTalk/getFrontEndLabels',
  },
  // 查询所有标签
  PLAZA_ACTIVITYTALK_GETALLLABELS: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/activityTalk/getAllLabels',
  },
  //  查询活动话题展示
  PLAZA_ACTIVITYTALK_GETACTIVITYTALKSHOW: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/activityTalk/getActivityTalkShow',
  },
  // 查询活动话题详情-用户未登录
  PLAZA_ACTIVITYTALK_GETACTIVITYTALKDETAILPASSTOKEN: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/activityTalk/getActivityTalkDetailPassToken',
  },
  //  查询活动话题详情
  PLAZA_ACTIVITYTALK_GETACTIVITYTALKDETAIL: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/activityTalk/getActivityTalkDetail',
  },
  //  点赞活动话题评论
  PLAZA_ACTIVITYTALK_TOLIKETALKCOMMENT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/activityTalk/toLikeTalkComment',
  },
  //  编辑用户话题
  PLAZA_ACTIVITYTALK_EDITACTIVITYTALK: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/activityTalk/editActivityTalk',
  },
  //  好题评论列表
  PLAZA_GREATQUESTIONCOMMENT_QUERYCOMMENTLIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/greatQuestionComment/queryCommentList',
  },
  //  好题 评论
  PLAZA_GREATQUESTIONCOMMENT_TOCOMMENT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/greatQuestionComment/toComment',
  },
  // 新增今日好题
  PLAZA_GREATQUESTIONRECOMMEND_ADDGREATQUESTION: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/greatQuestionRecommend/addGreatQuestion',
  },
  PLAZA_MYACTIVITYTALK_EDITTALKNEWSTATUS: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/myActivityTalk/editTalkNewStatus',
  },
  PLAZA_GREATQUESTIONRECOMMEND_CANCLENEWSTATE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/greatQuestionRecommend/cancleNewState',
  },
}
