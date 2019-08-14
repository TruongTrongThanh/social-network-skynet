<template>
  <div class="entry container">
    <h1 class="title mt-5">Chào mừng bạn đến mạng xã hội SKYNET</h1>
    <h2 class="sub-text">Mạng xã hội dành cho lập trình viên</h2>
    <loginForm/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import LoginForm from '@/components/LoginForm.vue'

@Component({
  components: {
    LoginForm
  }
})
export default class Entry extends Vue {}
</script>

<style scoped lang="scss">
  .entry {
    text-align: center;
    color: white;

    .title {
      font-weight: bold;
    }

    .sub-text {
      color: #8f8f8f;
    }
  }
</style>
