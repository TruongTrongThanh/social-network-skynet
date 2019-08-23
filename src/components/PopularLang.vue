<template>
  <div class="popular-language">
    <div class="title font-weight-bold px-2 py-3">Popular Language</div>
    <ul class="list-group list-group-flush">
      <li
        v-for="x in 3"
        :key="x"
        class="list-group-item list-group-item-action clickable"
      >
        <span>C/C++</span>
        <span class="float-right">
          <span class="order mr-2 font-weight-bold">{{ x }}</span>
          <span class="arrow">&#8599;</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class PopularLang extends Vue {}
</script>

<style scoped lang="scss">
  .popular-language {
    .title {
      font-size: 1.3em;
      color: #747474;
      background-color: #e7ffe7;
    }

    .arrow {
      color: #02de02;
      font-size: 1.2rem;
    }
  }
</style>
