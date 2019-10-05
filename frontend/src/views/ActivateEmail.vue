<template>
  <SimpleLayout>
    <div v-if="isSuccess !== null" class="activate-email mt-3 mx-auto w-25 px-3 py-2 rounded text-center">
      <div v-if="isSuccess" class="alert alert-success">Bạn đã kích hoạt email thành công!</div>
      <div v-else class="alert alert-danger">URL không hợp lệ hoặc email của bạn đã được kích hoạt.</div>
    </div>
  </SimpleLayout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { activateEmail } from '../apis/user'
import SimpleLayout from '@/layouts/SimpleLayout.vue'
import { AxiosError } from 'axios'

@Component({
  components: {
    SimpleLayout
  }
})
export default class ActivateEmail extends Vue {
  isSuccess: boolean | null = null
  async created() {
    try {
      await activateEmail(this.$route.query.token as string)
      this.isSuccess = true
    } catch (err) {
      const axiosError: AxiosError<any> = err
      if (axiosError.response && axiosError.response.status === 400) {
        this.isSuccess = false
      } else throw err
    }
  }
}
</script>

<style scoped lang="scss">
</style>
