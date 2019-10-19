<template>
  <ul class="famous-group list-group list-group-flush">
    <li
      v-for="g in groups"
      :key="g.id"
      class="list-group-item list-group-item-action clickable px-2 pb-3"
    >
      <img :src="g.avatar || require('@/assets/icons/group-btn-icon.png')" class="mr-2" width="30">
      <span class="name">{{ g.name }}</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getTopGroups } from '@/apis/group'
import { Group } from '@/models/group'

@Component
export default class FamousGroup extends Vue {
  groups: Group[] = []

  async created() {
    this.groups = await getTopGroups()
  }
}
</script>

<style scoped lang="scss">
</style>
