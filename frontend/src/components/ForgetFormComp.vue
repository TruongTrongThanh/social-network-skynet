<template>
  <div class="forget-form">
    <input v-model="email" class="mt-4 mb-3" type="text" placeholder="Email của bạn">
    <button class="btn btn-success mb-5" @click="sendResetRequest">Reset mật khẩu</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { sendResetMail } from '@/apis/user'
import { Mutation } from 'vuex-class'
import { ModalOptions } from '@/models/modal'

@Component
export default class ForgetFormComp extends Vue {
  @Mutation readonly triggerModal!: (opts: ModalOptions) => void

  email: string = ''

  async sendResetRequest() {
    await sendResetMail(this.email)
    this.triggerModal({
      title: 'Email đã được gửi',
      content: 'Vui lòng kiểm tra hộp thư email để hoàn thành thiết lập lại mật khẩu.',
      type: 'primary',
      removeOkButton: true
    })
  }
}
</script>

<style scoped lang="scss">
</style>
