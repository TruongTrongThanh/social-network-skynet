import Vue from 'vue'
import Vuex from 'vuex'
import User from '@/models/user'

Vue.use(Vuex)

export interface RootState {
  sidebarDisplay: boolean
  authUser: User | null
}

export default new Vuex.Store<RootState>({
  state: {
    sidebarDisplay: false,
    authUser: null
  },
  mutations: {
    sidebarToggle(state) {
      state.sidebarDisplay = !state.sidebarDisplay
    },
    setAuthUser(state, val: User) {
      state.authUser = val
    }
  }
})
