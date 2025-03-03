import { API } from '@/api/config'
import { combinParams, cpflattenFinal, isLogin } from '@/common/js/util.js'
import CTS from '@/common/js/constant'
const actions = {
  // Set fullpath
  setFullpath({ commit }, path) {
    commit('SET_FULL_PATH', path)
  },
  updataPaperGroupCatalogue({ commit }, data) {
    commit('UPDATE_PAPERGROUPCATALOGUE', data)
  },
  updateSchoolVerify({ commit }, data) {
    commit('UPDATE_SCHOOL_VERIFY', data)
  },
  updateUserInfo({ commit }, data) {
    commit('UPDATE_USER_INFO', data)
  },
  updateServiceInfo({ commit }, data) {
    commit('UPDATE_SERVICE_INFO', data)
  },
  updateCurrentSubject({ commit }, data) {
    commit('UPDATE_CURRENT_SUBJECT', data)
  },
  updateCurrentBook({ commit }, data) {
    commit('UPDATE_CURRENT_BOOK', data)
  },
  updateCurrentGrade({ commit }, data) {
    commit('UPDATE_CURRENT_GRADE', data)
  },
  updateCurrentVolume({ commit }, data) {
    commit('UPDATE_CURRENT_VOLUME', data)
  },
  updateChapterCode({ commit }, data) {
    commit('SET_CHAPTER_CODE', data)
  },
  getConfigData({ commit, state }, { vm, type, strParams, setKey, userGuid }) {
    let cacheKey = 'config' + type + '|' + combinParams(strParams)
    // console.log(cacheKey)
    if (state.cacheDict[cacheKey]) {
      return state.cacheDict[cacheKey]
    } else {
      // 远程 获取数据
      userGuid = userGuid || ''
      return vm.getInvokeData(type, strParams, userGuid).then(res => {
        if (res.data.code === CTS.constant.SUCCESS_CODE) {
          commit('UPDATE_CACHE_DICT', {
            data: res.data.data,
            key: cacheKey,
          })
          return res.data.data
        } else {
          return null
        }
      })
    }
  },
  // 根据 数据分类id 获取数据 字典的对象，并且建立数据字典的索引
  getDictByCid({ state }, { vm, cid }) {
    if (state.dict[cid]) {
      return state.dict[cid]
    } else {
      return vm.apiCategoryId(cid).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          state.dict[cid] = res.data
          // 处理 添加 索引列表 data[cid]={code =>{},code =>{}}
          state.dictIndex[cid] = vm.dict2Indexes(res.data)
          return res.data
        } else {
          return null
        }
      })
    }
  },
  getKnowledgeId({ commit, state }, { vm, strParams }) {
    // if (state['knowledgeId'] && state['knowledgeId'][strParams.code]) {
    //   return state['knowledgeId'][strParams.code]
    // } else {
    //   return vm.wayGet(API.GET_CHILD_DICT, strParams).then(res => {
    //     if (res.code === CTS.constant.SUCCESS_CODE) {
    //       commit('UPDATE_KNOWLEDGE_ID', {
    //         data: res,
    //         strParams: strParams,
    //       })
    //       return res
    //     } else {
    //       commit('UPDATE_KNOWLEDGE_ID', {
    //         data: null,
    //         strParams: strParams,
    //       })
    //       return null
    //     }
    //   })
    // }
  },
  getKnowledgeData({ commit, state }, { vm, strParams }) {
    if (state['knowledgeData']) {
      return state['knowledgeData']
    } else {
      return vm.wayGet(API.GET_DICT_BY_DICTID, strParams).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          commit('UPDATE_KNOWLEDGE_DATA', {
            data: res,
            strParams: strParams,
          })
          return res
        } else {
          commit('UPDATE_KNOWLEDGE_DATA', {
            data: null,
            strParams: strParams,
          })
          return null
        }
      })
    }
  },
  //  刷新 用户 积分
  getCanpointPoints({ commit, state }, { vm }) {
    return vm.apiGet(API.USER_PERSONALPOINTS).then(
      res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          commit('UPDATE_CANPOINT_POINTS', res.data)
          return res.data
        } else {
          return null
        }
      },
      () => {
        return null
      },
    )
  },

  async getAllBookTypes({ dispatch, state }, { vm, subjectCode }) {
    await dispatch('getDictByCid', {
      vm,
      cid: CTS.cfgDict.CID_DIGITAL_BOOK_TYPES,
    })
    if (state.dictIndex[CTS.cfgDict.CID_DIGITAL_BOOK_TYPES]) {
      let dict = state.dictIndex[CTS.cfgDict.CID_DIGITAL_BOOK_TYPES]
      if (dict[subjectCode]) {
        return dict[subjectCode].children
      } else {
        return []
      }
    } else {
      return []
    }
  },

  // 根据 数据分类id 和 数据字典code 获取数据 字典的对象
  getDictValByCode({ dispatch, state }, { vm, cid, code }) {
    if (state.dict[cid]) {
      return state.dictIndex[cid][code]
    } else {
      return dispatch('getDictByCid', { vm, cid }).then(res => {
        if (res) {
          return state.dictIndex[cid][code]
        } else {
          return null
        }
      })
    }
  },
  // 通过分类id 获取 分类的名称等信息
  getCategoryByCid({ state }, { vm, cid }) {
    if (state.categoryIndex[cid]) {
      return state.categoryIndex[cid]
    } else {
      return vm.apiCategoryById(cid).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          for (let sub of res.data) {
            state.categoryIndex[sub.categoryId] = sub
          }
        }
        return state.categoryIndex[cid]
      })
    }
  },
  // 根据学科学段 获取题型
  async quesAttrByStageSubject({ dispatch, state }, { vm, cid, relationId }) {
    let categoryDict = null
    if (state.categoryIndex[cid]) {
      categoryDict = state.categoryIndex[cid][relationId]
    } else {
      categoryDict = await dispatch('getDictValByCode', {
        vm: vm,
        cid: cid,
        code: relationId,
      })
    }
    if (categoryDict) {
      let mainId = ''
      if (
        categoryDict &&
        categoryDict.children &&
        categoryDict.children[0] &&
        categoryDict.children[0].relationCategoryId
      ) {
        mainId = categoryDict.children[0].relationCategoryId
      }

      if (mainId) {
        let questionTypes = await dispatch('getDictByCid', {
          vm: vm,
          cid: mainId,
        })
        if (questionTypes) {
          //  如果是 cid = 100188 显示末节点
          if (cid == 100188) {
            questionTypes = cpflattenFinal(questionTypes)
          }
          return {
            mainId: mainId,
            list: questionTypes,
          }
        } else {
          return null
        }
      } else {
        return null
      }
    } else {
      return null
    }
  },
  // 获取 全部学段 学科 vip
  async manageAllVip({ state }, { vm }) {
    //  paper-generator/sys/user/vipService
    if (isLogin()) {
      vm.apiGet(API.GET_ALL_VIPSERVICE).then(res => {
        if (vm.checkoutRes(res)) {
          console.log(res)
          let dict = {}
          for (let item of res.data) {
            dict[item.stageSubject] = item
          }
          state.allVipDict = dict
        } else {
          state.allVipDict = {}
        }
      })
    } else {
      state.allVipDict = {}
    }
  },

  //获取个人中心的消息状态
  getMessageStatu({ state, commit }, { vm }) {
    //   this.apiGet(API.PAGE_ISRECEIVE_NEWMSG, {}).then(res => {
    //     if (res.code === CTS.constant.SUCCESS_CODE) {
    //       console.log(res.data, 'data--isNewMessage')
    //       this.isRead = res.data.isRead
    //     }
    //   })
    return vm.apiGet(API.PAGE_ISRECEIVE_NEWMSG, {}).then(res => {
      if (res.code === CTS.constant.SUCCESS_CODE) {
        // console.log(res.data.isRead,"action 获取消息状态");
        if (res.data.isRead + '') {
          commit('UPDATE_MESSAGE_STATU', res.data)
        } else {
          commit('UPDATE_MESSAGE_STATU', '')
        }
        return res.data.isRead
      }
    })
  },
  getVersionGrade({ state, commit }, { vm, reload }) {
    if(state.versionGrade&&state.versionGrade.length && !reload) return  state.versionGrade
    return vm.apiGet({urlPath: '/lesson-app/config/getInvokeInfo'}, {stage: state.currSubject.periodCode, subject: state.currSubject.subjectCode}).then(res => {
      let list = []
      if (res.code === CTS.constant.SUCCESS_CODE) {
        list = res.data
      } else {
        list = []
      }
      commit('UPDATE_VERSION_GRADE', list)
      return list
    })
  },
}

export default actions
