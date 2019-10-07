<template>
  <SimpleLayout>
    <div v-if="!isSuccess" class="reset-password mt-3 mx-auto w-25 px-3 py-2 rounded clearfix">
      <div class="form-group">
        <label for="password">Mật khẩu mới</label>
        <input v-model="password" type="password" class="form-control mb-2" id="password" placeholder="Nhập mật khẩu mới">
      </div>
      <div class="form-group">
        <label for="repeat">Nhập lại mật khẩu</label>
        <input v-model="repeatPass" type="password" class="form-control mb-2" id="repeat" placeholder="Nhập lại mật khẩu">
      </div>
      <div v-show="hasBothInput && isDifferentPass" class="alert alert-danger alert-sm">Mật khẩu nhập lại không trùng!</div>
      <button
        :disabled="!hasBothInput || (hasBothInput && isDifferentPass)"
        class="btn btn-success float-right mt-2 mb-3"
        @click="resetPass"
      >
        Thay đổi mật khẩu
      </button>
    </div>
    <div v-else class="alert alert-success mt-3 mx-auto w-25 px-3 py-2 text-center">Thay đổi mật khẩu thành công!</div>
  </SimpleLayout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SimpleLayout from '@/layouts/SimpleLayout.vue'
import { resetPassword } from '../apis/user'

@Component({
  components: {
    SimpleLayout
  }
})
export default class ResetPassword extends Vue {
  password: string = ''
  repeatPass: string = ''
  isSuccess: boolean = false

  get isDifferentPass(): boolean {
    return this.password !== this.repeatPass
  }

  get hasBothInput(): boolean {
    return this.password.length > 0 && this.repeatPass.length > 0
  }

  async resetPass() {
    await resetPassword(this.password, this.$route.query.token as string)
    this.isSuccess = true
  }
}
</script>

<style scoped lang="scss">
.reset-password {
  background-color: white;
}
</style>
