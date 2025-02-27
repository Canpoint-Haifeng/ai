const mutations = {
  SET_FULL_PATH(state, path) {
    state.fullpath = path
  },
  UPDATE_PAPERGROUPCATALOGUE(state, data) {
    state.paperGroupCatalogue = data
  },
  SET_CURR_SUBJECT(state, data) {
    state.currSubject = data
  },
  SET_USER_INFO(state, data) {
    state.userInfo = data
  },
  INCREMENT_COUNT(state) {
    state.count++
  }
}

export default mutations
