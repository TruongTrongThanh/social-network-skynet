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

  getters: {
    memberGroups(state): Group[] {
      return state.followingGroups.filter(g => g.role === 'member')
    },
    adminGroups(state): Group[] {
      return state.followingGroups.filter(g => g.role === 'admin')
    }
  },

  mutations: {
    sidebarToggle(state) {
      state.sidebarDisplay = !state.sidebarDisplay
    },
    setSidebarDisplay(state, val: boolean) {
      state.sidebarDisplay = val
    },
    setAuthUser(state, val: User) {
      state.authUser = val
    },
    setFollowingGroups(state, val: Group[]) {
      state.followingGroups = val
    }
  }
})
