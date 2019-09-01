<template>
  <div class="main-layout container-fluid">
    <router-view class="top-offset"/>
    <navbar/>
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

@Component({
  components: {
    Navbar,
    Sidebar
  }
})
export default class MainLayout extends Vue {
  @State sidebarDisplay!: boolean
  @Mutation sidebarToggle: any

  mounted() {
    document.body.style.backgroundColor = '#eaeaea'
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
