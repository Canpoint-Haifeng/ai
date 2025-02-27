import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

// Create persisted state plugin
const pluginPersist = createPersistedState({
  storage: window.localStorage,
  key: 'lesson-planning-vue-store'
})

// Create store
export default createStore({
  state: {
    fullpath: '',
    currSubject: {},
    userInfo: {},
    count: 0,
    paperGroupCatalogue: []
  },
  mutations,
  actions,
  getters,
  plugins: [pluginPersist]
})
