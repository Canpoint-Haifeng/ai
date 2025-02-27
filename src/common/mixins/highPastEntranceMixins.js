const highPastEntranceMixins = {
  methods: {
    getHighPastYear() {
      let url = {
        urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/zonePaperType/years',
      }
      return this.apiGet(url, {}).then(
        res => {
          if (this.checkoutRes(res)) {
            res.data.forEach(item => {
              item.code = item.year
              item.name = item.year
            })
            // list = list.sort((a, b) => b.code - a.code)
            return res.data
          } else {
            return []
          }
        },
        () => {
          return []
        },
      )
    },
    async getCollegePastExam(year) {
      let paperTypeList = await this.zonePaperTypeListHttp(year)
      let paperDict = await this.zonePaperlistHttp(year, '13')
      for (let item of paperTypeList) {
        if (paperDict[item.id]) {
          item.children = paperDict[item.id]
        }
      }
      console.log(paperTypeList)
      return paperTypeList
    },
    // 获取学段学科数据
    async getSubjectList(stage) {
      let list = await this.$store
        .dispatch('getConfigData', { vm: this, type: 2, strParams: {} })
        .then(
          res => {
            return res || []
          },
          () => {
            return []
          },
        )
      for (let item of list) {
        if (item.code == stage) {
          return item.children
        }
      }
      return []
    },
    zonePaperTypeListHttp(year) {
      let url = {
        urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/zonePaperType/list',
      }
      return this.apiGet(url, { year: year }).then(
        res => {
          if (this.checkoutRes(res)) {
            res.data.forEach(item => {
              item.code = item.year
              item.name = item.year
            })
            return res.data
          } else {
            return []
          }
        },
        () => {
          return []
        },
      )
    },
    zonePaperlistHttp(year, stage) {
      let url = {
        urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/zonePaper/list',
      }
      return this.apiGet(url, {
        year: year,
        stage: stage,
        groupFlag: true,
      }).then(
        res => {
          if (this.checkoutRes(res)) {
            return res.data
          } else {
            return []
          }
        },
        () => {
          return []
        },
      )
    },
    getCollegeEntrancExam(subjectCode, year) {
      let url = {
        urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/zonePaper/list',
      }
      let stage = String(subjectCode).substring(0, 2)
      return this.apiGet(url, {
        year: year,
        stage: stage,
        subject: subjectCode,
        groupFlag: false,
      }).then(
        res => {
          if (this.checkoutRes(res)) {
            let list = []
            res.data.forEach(item => {
              item.examTypeName = item.paperTypeName
              item.name = item.paperName
              if (item.type == 1) {
                list.push(item)
              }
            })
            return list
          } else {
            return []
          }
        },
        () => {
          return []
        },
      )
    },
  },
}

export default highPastEntranceMixins
