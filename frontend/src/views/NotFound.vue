<template>
  <SimpleLayout>
    <div class="alert alert-primary mt-3 mx-auto w-25 px-3 py-2 text-center">Trang không tồn tại, vui lòng kiểm tra lại!</div>
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
export default class NotFound extends Vue {}
</script>

<style scoped lang="scss">
</style>
