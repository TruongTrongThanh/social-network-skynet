<template>
  <div class="login-form">
    <input v-model="form.username" class="mt-4 mb-2" type="text" placeholder="Username của bạn">
    <input v-model="form.password" class="mb-3" type="password" placeholder="Mật khẩu">
    <button class="btn btn-success mb-5" @click="login">Đăng nhập</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import * as Auth from '@/apis/authentication'
import { LoginForm } from '@/models/authentication'

@Component
export default class LoginFormComp extends Vue {
  @Prop({ type: String, default: '' }) autoFillUsername!: string

  form: LoginForm = {
    username: this.autoFillUsername,
    password: '',
    rememberMe: false
  }

  async login() {
    await Auth.login(this.form)
    this.$router.push('/')
  }
}
</script>

<style scoped lang="scss">
</style>
