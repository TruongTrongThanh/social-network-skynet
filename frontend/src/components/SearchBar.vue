<template>
  <div class="search-bar">
    <form @submit.prevent="() => false" class="form-inline">
      <input class="search-input form-control form-control-sm mr-2" type="search" placeholder="Search" aria-label="Search">
      <button type="button" class="btn btn-sm btn-outline-success my-2">Search</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class SearchBar extends Vue {}
</script>

<style scoped lang="scss">
.search-input {
  width: 430px;
}
</style>
