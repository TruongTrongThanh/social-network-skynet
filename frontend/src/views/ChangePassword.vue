<template>
  <SimpleLayout>
    <div class="change-email mt-3 mx-auto w-25 px-3 py-2 rounded">
      <div class="form-group clearfix">
        <label for="password">Mật khẩu</label>
        <input v-model="password" type="text" class="form-control mb-2" id="password" placeholder="Nhập mật khẩu mới">
      </div>
      <div class="form-group clearfix">
        <label for="repeat">Nhập lại mật khẩu</label>
        <input v-model="repeatPass" type="text" class="form-control mb-2" id="repeat" placeholder="Nhập lại mật khẩu">
      </div>
      <button class="btn btn-success float-right">Thay đổi mật khẩu</button>
    </div>
  </SimpleLayout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SimpleLayout from '@/layouts/SimpleLayout.vue'

@Component({
  components: {
    SimpleLayout
  }
})
export default class ChangePassword extends Vue {
  password: string = ''
  repeatPass: string = ''
}
</script>

<style scoped lang="scss">
.change-email {
  background-color: white;
}
</style>
