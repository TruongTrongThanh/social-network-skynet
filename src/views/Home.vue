<template>
  <main-layout>
    <div class="home">
      <div class="row justify-content-center">
        <div class="feed col-md-6 mr-5">this is feed</div>
        <div class="other col-md-3">this is notif, action,...</div>
      </div>
    </div>
  </main-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MainLayout from '@/layouts/MainLayout.vue'

@Component({
  components: {
    MainLayout
  }
})
export default class Home extends Vue {}
</script>

<style scoped lang="scss">
.home {
  margin-top: 80px;

  .feed {
    background-color: red;
  }
  .other {
    background-color: green;
  }
}
</style>
