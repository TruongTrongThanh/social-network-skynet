<template>
  <div class="sidebar fixed-top">
    <brand-toggler class="navbar-light ml-3 mt-2"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import BrandToggler from '@/components/BrandToggler.vue'

@Component({
  components: {
    BrandToggler
  }
})
export default class Sidebar extends Vue {}
</script>

<style scoped lang="scss">
  .sidebar {
    width: 260px;
    height: 100vh;
    background-color: white;
    position: fixed;
  }
</style>
