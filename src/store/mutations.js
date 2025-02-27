const mutations = {
  // 用户 主题切换
  UPDATE_USERTHEME(state, data) {
    state.userTheme = data || {}
  },
  // 更新用户 积分
  UPDATE_CANPOINT_POINTS(state, data) {
    state.canpointPoints = data || {}
  },
  // 更新用户信息
  UPDATE_USER_INFO(state, data) {
    state.userInfo = data
  },
  // 更新用户信息
  UPDATE_SERVICE_INFO(state, data) {
    state.serviceInfo = data
  },
  // 更新当前学段学科
  UPDATE_CURRENT_SUBJECT(state, data) {
    state.currSubject = data
  },
  UPDATE_CURRENT_BOOK(state, data) {
    state.bookCurrent = data
  },
  UPDATE_CURRENT_GRADE(state, data) {
    state.gradeCurrent = data
  },
  UPDATE_CURRENT_VOLUME(state, data) {
    state.volumeCurrent = data
  },
  // 设置章节code
  SET_CHAPTER_CODE(state, data) {
    state.chapterCode = data
  },
  // 设置试题篮数据
  SET_BASKET_DATA(state, data) {
    state.basketData = data
  },
  // 设置顶部学科切换状态
  SET_DISABLED_NAV(state, data) {
    state.currDisabledNav = data
  },
  SET_FULL_PATH(state, data) {
    state.fullpath = data
  },
  UPDATE_SCHOOL_VERIFY(state, data) {
    state.schoolVerify = data
  },
  UPDATE_PAPERGROUPCATALOGUE(state, data) {
    state.paperGroupCatalogue = data
  },
  // UPDATE_CONFIG_DATA(state, data) {
  //   if (data.setKey === 'configBookText') {
  //     state['configBookText'][data.strParams.stage + '' + data.strParams.subject + '' + data.strParams.versions +
  //         '' + data.strParams.grade + '' + data.strParams.volume
  //     ] = data.data
  //   } else if (data.setKey === 'configVolume') {
  //     state['configVolume'][data.strParams.subjectCode + '' + data.strParams.versionCode] = data.data
  //   } else {
  //     state[data.setKey] = data.data
  //   }
  // },
  UPDATE_KNOWLEDGE_DATA(state, data) {
    state['knowledgeData'] = data.data
  },
  UPDATE_KNOWLEDGE_ID(state, data) {
    if (data.data.data.length > 1) {
      state['knowledgeId'][data.strParams.code] = data.data
    } else {
      state['knowledgeId'][data.strParams.code] = null
    }
  },
  // 更新 数据字典
  UPDATE_CACHE_DICT(state, data) {
    state.cacheDict[data.key] = data.data
  },
  CLEAR_CACHE_DICT(state, data) {
    state.cacheDict = {}
  },
  UPDATE_MESSAGE_STATU(state, data) {
    state.messageReadStatu = data.isRead
    // console.log(state.messageReadStatu,'state.messageReadStatu');
  },
  UPDATE_VERSION_GRADE(state, data) {
    state.versionGrade = data
  },
}

export default mutations
