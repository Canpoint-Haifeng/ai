// Getters for the Vuex store
export default {
  isAuthenticated: state => !!state.token,
  currentUser: state => state.user,
  currentSubject: state => state.currentSubject,
  currentGrade: state => state.currentGrade,
  isLoading: state => state.loading
}
