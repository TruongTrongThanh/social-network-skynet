<template>
  <div class="main-layout container-fluid">
    <router-view class="top-offset"/>
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
import { Route } from 'vue-router'
import { getUser } from '@/apis/authentication'
import User from '@/models/user'

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
  @Mutation sidebarToggle: any

  authUser: User | null = null

  setAuthUser(val: User) {
    this.authUser = val
  }

  mounted() {
    document.body.style.backgroundColor = '#eaeaea'
  }

  async beforeRouteEnter(to: Route, from: Route, next: any) {
    try {
      const authUser = await getUser()
      next((vm: any) => vm.setAuthUser(authUser))
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
