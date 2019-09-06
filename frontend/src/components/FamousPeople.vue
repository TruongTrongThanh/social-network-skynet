<template>
  <ul class="famous-people list-group list-group-flush">
    <li
      v-for="x in 5"
      :key="x"
      class="list-group-item list-group-item-action clickable px-2 pb-3"
    >
      <img src="https://www.w3schools.com/howto/img_avatar.png" class="mr-2" width="30">
      <span class="name">Bill Gates</span>
      <span class="role float-right">C# Developer</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class FamousPeople extends Vue {}
</script>

<style scoped lang="scss">
  .list-group-item {
    color: #7c7c7c;

    .role {
      line-height: 1.6rem;
      font-size: 0.8rem;
    }
  }
</style>
