<template>
  <div class="login-form">
    <input v-model="email" class="mt-4 mb-2" type="text" placeholder="Email của bạn">
    <input v-model="password" class="mb-3" type="password" placeholder="Mật khẩu">
    <button class="btn btn-success mb-5" @click="login">Đăng nhập</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import * as Auth from '@/apis/authentication'

@Component
export default class LoginForm extends Vue {
  email: string = ''
  password: string = ''

  async login() {
    try {
      await Auth.login(this.email, this.password)
      this.$router.push('/')
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
