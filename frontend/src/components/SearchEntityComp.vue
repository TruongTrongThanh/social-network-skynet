<template>
  <li class="search-entity list-group-item d-flex justify-content-between align-items-center">
    <div class="left d-flex">
      <img :src="entity.avatar || require('@/assets/empty-avatar.png')" class="rounded" width="50">
      <div class="info ml-2">
        <div v-if="type === 'user'" class="name">{{ entity.fullname }}</div>
        <div v-else class="name">{{ entity.name }}</div>
        <div v-if="type === 'user'" class="position text-muted font-italic">{{ entity.position }}</div>
        <div v-else>
          <span v-for="tag in entity.tags" :key="tag" class="tag mr-2 px-2 rounded">{{ tag }}</span>
        </div>
      </div>
    </div>
    <div class="right">
      <img v-if="type === 'user'" :src="require('@/assets/empty-avatar.png')" width="40">
      <img v-else :src="require('@/assets/icons/group-btn-icon.png')" width="40">
    </div>
  </li>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SearchEntity } from '@/models/search'
import { Group } from '@/models/group'
import User from '@/models/user'

@Component
export default class SearchEntityComp extends Vue {
  @Prop({ type: Object, required: true }) readonly data!: SearchEntity

  entity: User | Group = this.data.data
  type: string = this.data.type
}
</script>

<style scoped lang="scss">
.search-entity {
  .position {
    font-size: 14px;
  }

  .tag {
    font-size: 13px;
    padding-top: 2px;
    padding-bottom: 2px;
    background-color: #72bc73;
    color: white;
  }
}
</style>
