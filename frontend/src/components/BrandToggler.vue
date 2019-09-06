<template>
  <div class="brand-toggler navbar-brand">
    <span
      class="navbar-toggler-icon clickable mr-3"
      @click="sidebarToggle"
    />
    <router-link
      to="/"
      class="link-unstyled clickable"
    >
      <img
        :src="require('@/assets/logo.png')"
        width="35"
        height="35"
        class="d-inline-block align-top ml-1"
        alt="Skynet logo"
      >
      Skynet
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'

@Component
export default class BrandToggler extends Vue {
  @Mutation sidebarToggle: any
}
</script>

<style scoped lang="scss">
</style>
