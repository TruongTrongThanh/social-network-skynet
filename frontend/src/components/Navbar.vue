<template>
  <nav class="navbar fixed-top navbar-light bg-light shadow-sm">
    <brand-toggler/>
  </nav>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BrandToggler from '@/components/BrandToggler.vue'

@Component({
  components: {
    BrandToggler
  }
})
export default class Navbar extends Vue {}
</script>

<style scoped lang="scss">
</style>
