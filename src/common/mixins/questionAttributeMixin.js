import CTS from '@/common/js/constant'
import { API } from '@/api/config'
const questionAttributeMixin = {
  methods: {
    // 获取当前试题类型关联id
    getRelationCategoryId(cid, code, level = 2) {
      let parms = {
        categoryId: cid,
        code: code,
        level: level,
      }
      return this.wayGet(API.GET_CHILD_DICT, parms).then(
        res => {
          try {
            if (res.code === CTS.constant.SUCCESS_CODE) {
              return res.data[1].relationCategoryId
            } else {
              return ''
            }
          } catch (e) {
            return ''
          }
        },
        err => {
          console.log(err)
          return ''
        },
      )
    },
    apiWayGet(api, params) {
      return this.wayGet(api, params).then(
        res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            return res.data
          } else {
            return ''
          }
        },
        err => {
          console.log(err)
          return ''
        },
      )
    },
    // 获取 第一层数据
    getCategoryFirstLevel(cid) {
      let params = {
        categoryId: cid,
      }
      return this.apiWayGet(API.GET_DICT_BY_DICTID, params)
    },
    // 获取 cid 所有的元素
    getCategoryAllData(cid) {
      let params = {
        categoryId: cid,
      }
      return this.apiWayGet(API.GET_ALL_BY_CID, params)
    },
    apiGetData(apiUrl, apiId, paramObj, httpMethod = 'get', set = {}) {
      let params = {
        apiUrl: apiUrl,
        apiId: apiId,
        paramJson: JSON.stringify(paramObj),
        httpMethod: httpMethod.toLocaleLowerCase(),
      }
      // let url = {
      //   urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/apiGateway/apiGetData',
      // }
      // if (params.httpMethod === 'get') {
      //   return this.apiGet(url, params, set)
      // } else {
      //   return this.apiPost(url, params, set)
      // }
    },
    // 根据 cid 和 codes 获取 name
    getNameByCidCodes(parmsArr) {
      let apiUrl = 'cfg-dict/biz/v1/dictionaryapi/get-name-by-codes'
      let parms = {
        jsonParameter: JSON.stringify(parmsArr),
      }
      let apiId = '100100'
      return this.apiGetData(apiUrl, apiId, parms, 'post')
    },
    dict2Indexes(list, key) {
      // list.children 通过数据字典 构建起索引
      let arr = [...list]
      let dict = {}
      let sub
      while (arr.length > 0) {
        sub = arr.pop()
        if (sub.children && sub.children.length > 0) {
          arr.push(...sub.children)
        } else {
          sub.children = null
        }

        dict[sub.code] = sub
      }
      return dict
    },
  },
}

export default questionAttributeMixin
