<template>
  <div class="entry container">
    <h1 class="title font-weight-bold mt-5">Chào mừng bạn đến mạng xã hội SKYNET</h1>
    <h2 class="sub-text font-weight-light">Mạng xã hội dành cho lập trình viên</h2>
    <EntryForm/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import EntryForm from '@/components/EntryForm.vue'

@Component({
  components: {
    EntryForm
  }
})
export default class Entry extends Vue {}
</script>

<style scoped lang="scss">
  .entry {
    text-align: center;
    color: white;

    .sub-text {
      color: #b3b3b3;
    }
  }
</style>
