import Vue from 'vue'
import Vuex from 'vuex'
import User from '@/models/user'
import { Group } from './models/group'

Vue.use(Vuex)

export interface RootState {
  sidebarDisplay: boolean
  authUser: User | null
  followingGroups: Group[]
}

export default new Vuex.Store<RootState>({
  state: {
    sidebarDisplay: false,
    authUser: null,
    followingGroups: []
  },
  mutations: {
    sidebarToggle(state) {
      state.sidebarDisplay = !state.sidebarDisplay
    },
    setAuthUser(state, val: User) {
      state.authUser = val
    },
    setFollowingGroups(state, val: Group[]) {
      state.followingGroups = val
    }
  }
})
