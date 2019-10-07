<template>
  <router-link
    :to="{ name: type === 'user' ? 'user-details' : 'group-details', params: { id: entity.id } }"
    tag="li"
    class="search-entity list-group-item d-flex justify-content-between align-items-center clickable raise-color"
  >
    <div class="left d-flex">
      <img :src="entity.avatar || require('@/assets/empty-avatar.png')" class="rounded avatar">
      <div class="info ml-2">
        <div v-if="type === 'user'" class="name">{{ entity.fullname }}</div>
        <div v-else class="name">{{ entity.name }}</div>
        <div v-if="type === 'user'" class="position text-muted font-italic">{{ entity.position }}</div>
        <div v-else>
          <span v-for="tag in entity.tags" :key="tag" class="badge badge-pill badge-success mr-2">{{ tag }}</span>
        </div>
      </div>
    </div>
    <div class="right">
      <UserSVG v-if="type === 'user'" class="entity-type"/>
      <img v-else :src="require('@/assets/icons/group-btn-icon.png')" class="entity-type">
    </div>
  </router-link>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SearchEntity } from '@/models/search'
import { Group } from '@/models/group'
import User from '@/models/user'
import UserSVG from '@/assets/user.svg'

@Component({
  components: {
    UserSVG
  }
})
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

  .avatar {
    width: 50px;
    height: 50px;
    object-fit: cover;
  }

  .tag {
    font-size: 13px;
    padding-top: 2px;
    padding-bottom: 2px;
    background-color: #72bc73;
    color: white;
  }

  .entity-type {
    width: 40px;
    height: 40px;
    object-fit: cover;
  }
}
</style>
