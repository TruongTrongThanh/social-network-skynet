<template>
  <div class="register-form">
    <input v-model="form.username" class="mt-4 mb-2" type="text" placeholder="Username của bạn">
    <input v-model="form.fullname" class="mb-2" type="text" placeholder="Tên đầy đủ">
    <input v-model="form.password" class="mb-2" type="password" placeholder="Mật khẩu">
    <input v-model="form.repeatPass" class="mb-3" type="password" placeholder="Xác nhận mật khẩu">
    <button class="btn btn-success mb-5" @click="register">Đăng ký</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import * as Auth from '@/apis/authentication'
import { RegisterForm } from '../models/authentication'

@Component
export default class RegisterFormComp extends Vue {
  form: RegisterForm = {
      username: '',
      fullname: '',
      password: '',
      repeatPass: ''
  }

  async register() {
    await Auth.register(this.form)
    this.$emit('reigstered', this.form.username)
  }
}
</script>

<style scoped lang="scss">
</style>
