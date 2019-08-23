<template>
  <ul class="famous-group list-group list-group-flush">
    <li
      v-for="x in 5"
      :key="x"
      class="list-group-item list-group-item-action clickable px-2 pb-3"
    >
      <img src="https://www.w3schools.com/howto/img_avatar.png" class="mr-2" width="30">
      <span class="name">Hội lập trình Unity</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class FamousGroup extends Vue {}
</script>

<style scoped lang="scss">
</style>
