import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sidebarDisplay: false
  },
  mutations: {
    sidebarToggle(state) {
      state.sidebarDisplay = !state.sidebarDisplay
    }
  }
})
