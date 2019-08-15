<template>
  <div class="forget-form">
    <input class="mt-4 mb-3" type="text" placeholder="Email của bạn">
    <button class="btn btn-success mb-5">Reset mật khẩu</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class ForgetForm extends Vue {}
</script>

<style scoped lang="scss">
</style>
