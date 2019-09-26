<template>
  <div class="main-layout">
    <router-view :key="$route.fullPath" class="top-offset"/>
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

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate'
])

@Component({
  components: {
    Navbar,
    Sidebar
  }
})
export default class MainLayout extends Vue {
  @State sidebarDisplay!: boolean
  @State authUser!: User | null

  @Mutation sidebarToggle!: () => void
  @Mutation setAuthUser!: (user: User) => void
  @Mutation setFollowingGroups!: (list: Group[]) => void

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
  .top-offset {
    margin-top: $topOffset;
  }

  .blackout {
    background-color: black;
    opacity: .5;
  }
</style>
