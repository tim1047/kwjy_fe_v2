import { createStore } from 'vuex'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: false,
    date: {
      curDate: new Date(),
      curYear: new Date().getFullYear(),
      curMonth: new Date().getMonth() + 1,
      prevMonth: new Date().getMonth(),
    },
    apiUrl: 'http://146.56.159.174:8000/account_book',
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },
    setYear: function (state, payload) {
      state.date.curYear = payload
    },
    setMonth: function (state, payload) {
      state.date.curMonth = payload
      if (payload == 1) {
        state.date.prevMonth = 12
      } else {
        state.date.prevMonth = payload - 1
      }
    },
  },
  actions: {},
  modules: {},
})
