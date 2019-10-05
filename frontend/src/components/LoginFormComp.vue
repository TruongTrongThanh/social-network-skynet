<template>
  <div class="login-form">
    <input v-model="form.username" class="mt-4 mb-2" type="text" placeholder="Username của bạn">
    <input v-model="form.password" class="mb-3" type="password" placeholder="Mật khẩu">
    <transition name="shake">
    <div v-show="isWrong" class="alert alert-danger mx-4">Tài khoản hoặc mật khẩu bị sai.</div>
    </transition>
    <button class="btn btn-success mb-4" @click="login">Đăng nhập</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import * as Auth from '@/apis/authentication'
import { LoginForm } from '@/models/authentication'
import { AxiosError } from 'axios'

@Component
export default class LoginFormComp extends Vue {
  @Prop({ type: String, default: '' }) autoFillUsername!: string

  form: LoginForm = {
    username: this.autoFillUsername,
    password: '',
    rememberMe: false
  }
  isWrong: boolean = false

  async login() {
    try {
      this.isWrong = false
      await Auth.login(this.form)
      this.$router.push('/')
    } catch (err) {
      const axiosError: AxiosError<any> = err
      if (axiosError.response && axiosError.response.status === 401) {
        this.isWrong = true
      } else throw err
    }
  }
}
</script>

<style scoped lang="scss">
.login-form {
  .shake-enter-active {
    animation: shake .82s cubic-bezier(.36,.07,.19,.97) both;
  }

  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }
    
    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }
}
</style>
