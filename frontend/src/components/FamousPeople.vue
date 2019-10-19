<template>
  <ul class="famous-people list-group list-group-flush">
    <li
      v-for="u in users"
      :key="u.id"
      class="list-group-item list-group-item-action d-flex align-items-start clickable px-2 pb-3"
    >
      <img :src="u.avatar || require('@/assets/empty-avatar.png')" class="mr-2 rounded-circle" width="30">
      <div>
        <div class="name">{{ u.fullname }}</div>
        <div class="role">{{ u.position }}</div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getTopUsers } from '@/apis/user'
import User from '@/models/user'

@Component
export default class FamousPeople extends Vue {
  users: User[] = []
  async created() {
    this.users = await getTopUsers()
  }
}
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
