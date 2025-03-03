import { createStore } from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

// Plugin for state persistence
const pluginPersist = (store) => {
  // Save state on page close or refresh
  const KEY = 'VUEX:STATE'
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(KEY, JSON.stringify(store.state))
  })
  
  // Restore state on page load
  try {
    const state = JSON.parse(localStorage.getItem(KEY))
    if (state) {
      store.replaceState(state)
    }
  } catch (err) {
    console.log(err)
  }
}

// Create store
export default createStore({
  state,
  mutations,
  actions,
  getters,
  plugins: [pluginPersist]
})
