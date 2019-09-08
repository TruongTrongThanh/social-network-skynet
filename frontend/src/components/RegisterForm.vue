<template>
  <div class="register-form">
    <input v-model="email" class="mt-4 mb-2" type="text" placeholder="Email của bạn">
    <input v-model="fullname" class="mb-2" type="text" placeholder="Tên đầy đủ">
    <input v-model="password" class="mb-2" type="password" placeholder="Mật khẩu">
    <input v-model="repeatPass" class="mb-3" type="password" placeholder="Xác nhận mật khẩu">
    <button class="btn btn-success mb-5" @click="register">Đăng ký</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import * as Auth from '@/apis/authentication'

@Component
export default class RegisterForm extends Vue {
  email: string = ''
  fullname: string = ''
  password: string = ''
  repeatPass: string = ''

  async register() {
    try {
      await Auth.register(this.email, this.fullname, this.password)
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
