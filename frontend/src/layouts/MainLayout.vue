<template>
  <div class="main-layout">
    <router-view :key="$route.fullPath" class="top-offset"/>

    <!-- feed mini-window -->
    <feed-wrapper
      v-if="clickedFeed"
      class="mini-window-content container"
      :data="clickedFeed"
    />
    <div v-show="clickedFeed" class="blackscreen" @click="setClickedFeed(null)"></div>

    <!-- share mini-window -->
    <feed-input
      v-if="clickedShareFeed"
      :shared-feed="clickedShareFeed"
      class="mini-window-content on-top"
    />
    <div v-show="clickedShareFeed" class="blackscreen on-top" @click="setClickedShareFeed(null)"></div>

    <navbar v-if="authUser" :auth-user="authUser"/>
    <div
      v-if="sidebarDisplay"
      class="blackout fixed-top w-100 h-100"
      @click="sidebarToggle"
    />
    <sidebar v-if="sidebarDisplay"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import { Route, RawLocation } from 'vue-router'
import { getUser } from '@/apis/authentication'
import User from '@/models/user'
import { NextFunction } from '@/models/vue-api'
import { Group } from '@/models/group'
import { getGroupsFromUserID } from '@/apis/group'
import { Feed } from '@/models/feed'
import { getFeedDetail } from '@/apis/feed'
import FeedInput from '@/components/FeedInput.vue'
import FeedWrapper from '@/components/FeedWrapper.vue'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate'
])

@Component({
  components: {
    Navbar,
    Sidebar,
    FeedInput,
    FeedWrapper
  }
})
export default class MainLayout extends Vue {
  @State readonly sidebarDisplay!: boolean
  @State readonly authUser!: User | null
  @State readonly clickedFeed!: Feed | null
  @State readonly clickedShareFeed!: Feed | null

  @Mutation sidebarToggle!: () => void
  @Mutation setAuthUser!: (user: User) => void
  @Mutation setFollowingGroups!: (list: Group[]) => void
  @Mutation setClickedFeed!: (val: Feed) => void
  @Mutation setClickedShareFeed!: (val: Feed) => void

  dataInit(u: User, gl: Group[]) {
    this.setAuthUser(u)
    this.setFollowingGroups(gl)
  }

  mounted() {
    document.body.style.backgroundColor = '#eaeaea'
  }

  async beforeRouteEnter(to: Route, from: Route, next: NextFunction) {
    try {
      const authUser = await getUser()
      const groupList = await getGroupsFromUserID()
      next((vm: any) => vm.dataInit(authUser, groupList))
    } catch (err) {
      console.log(err)
      next('/entry')
    }
  }
}
</script>

<style scoped lang="scss">
$feed-width: 800px;

.top-offset {
  margin-top: $topOffset;
}

.blackout {
  background-color: black;
  opacity: .5;
}

.mini-window-content {
  position: fixed;
  top: $topOffset + 10px;
  left: 50%;
  width: $feed-width;
  max-height: 600px;
  margin-left: - ($feed-width / 2);
  background-color: white;
  overflow: auto;
  z-index: 1023;

  &.on-top {
    z-index: 1024;
  }
}

.blackscreen {
  background-color: #00000045;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1022;

  &.on-top {
    z-index: 1023;
  }
}
</style>
