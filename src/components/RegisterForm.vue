<template>
  <div class="register-form">
    <input class="mt-4 mb-2" type="text" placeholder="Email của bạn">
    <input class="mb-2" type="password" placeholder="Mật khẩu">
    <input class="mb-3" type="password" placeholder="Xác nhận mật khẩu">
    <button class="btn btn-success mb-5">Đăng ký</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class RegisterForm extends Vue {}
</script>

<style scoped lang="scss">
</style>
