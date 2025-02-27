const actions = {
  // Set fullpath
  setFullpath({ commit }, path) {
    commit('SET_FULL_PATH', path)
  },
  
  // Update paper group catalogue
  updataPaperGroupCatalogue({ commit }, data) {
    commit('UPDATE_PAPERGROUPCATALOGUE', data)
  },
  
  // Set current subject
  setCurrSubject({ commit }, data) {
    commit('SET_CURR_SUBJECT', data)
  },
  
  // Set user info
  setUserInfo({ commit }, data) {
    commit('SET_USER_INFO', data)
  },
  
  // Increment count
  incrementCount({ commit }) {
    commit('INCREMENT_COUNT')
  }
}

export default actions
