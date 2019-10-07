import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import User from '@/models/user'
import { Group } from '@/models/group'
import { Feed } from '@/models/feed'
import { getFeedDetail } from './apis/feed'
import { ModalOptions, ModalResult } from './models/modal'

Vue.use(Vuex)

export interface RootState {
  sidebarDisplay: boolean
  authUser: User | null
  followingGroups: Group[]
  clickedFeed: Feed | null
  clickedShareFeed: Feed | null
  modalTrigger: boolean
  modalOptions: ModalOptions
}

export default new Vuex.Store<RootState>({
  state: {
    sidebarDisplay: false,
    authUser: null,
    followingGroups: [],
    clickedFeed: null,
    clickedShareFeed: null,
    modalTrigger: false,
    modalOptions: {
      title: 'Thông báo',
      type: 'primary',
      showPasswordForm: false
    }
  },

  getters: {
    memberGroups(state): Group[] {
      return state.followingGroups.filter(g => g.role === 'member')
    },
    adminGroups(state): Group[] {
      return state.followingGroups.filter(g => g.role === 'admin')
    },
    hasjoinedGroup: state => (id: number) => {
      return state.followingGroups.findIndex(g => g.id === id) !== -1
    },
    isAdminOfGroup: (state, getters) => (id: number) => {
      return getters.adminGroups.findIndex((g: Group) => g.id === id) !== -1
    },
    hasLoggedIn(state): boolean {
      return state.authUser !== null
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
    },
    addFollowingGroup(state, val: Group) {
      state.followingGroups.push({
        id: val.id,
        avatar: val.avatar,
        name: val.name,
        role: val.role || 'member',
        tags: [],
        memberList: []
      })
    },
    removeFollowingGroup(state, groupID: number) {
      const index = state.followingGroups.findIndex(g => g.id === groupID)
      state.followingGroups.splice(index, 1)
    },
    setClickedFeed(state, val: Feed) {
      state.clickedFeed = val
    },
    setClickedShareFeed(state, val: Feed) {
      state.clickedShareFeed = val
    },
    triggerModal(state, options: ModalOptions) {
      state.modalOptions = options
      state.modalTrigger = !state.modalTrigger
    }
  },

  actions: {
    async setClickedFeedByID(state, id: number) {
      state.commit('setClickedFeed', await getFeedDetail(id))
    }
  }
})
