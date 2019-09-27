<template>
  <div class="group-members py-2">
    <h5 class="font-weight-bold">Quản trị viên</h5>
    <ul class="list-group">
      <li
        v-for="user in admins"
        :key="user.id"
        class="list-group-item d-flex align-items-center"
      >
        <img :src="user.avatar || require('@/assets/empty-avatar.png')" class="avatar rounded-circle">
        <div class="ml-2">{{ user.fullname }}</div>
      </li>
    </ul>
    <h5 class="font-weight-bold mt-3">Thành viên</h5>
    <ul class="list-group">
      <li
        v-for="user in members"
        :key="user.id"
        class="list-group-item d-flex align-items-center"
      >
        <img :src="user.avatar || require('@/assets/empty-avatar.png')" class="avatar rounded-circle">
        <div class="ml-2">{{ user.fullname }}</div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import User from '@/models/user'

@Component
export default class GroupMembers extends Vue {
  @Prop({ type: Array, default: [] }) readonly data!: User[]

  get admins(): User[] {
    return this.data.filter(u => u.role === 'admin')
  }
  get members(): User[] {
    return this.data.filter(u => u.role === 'member')
  }
}
</script>

<style scoped lang="scss">
.group-members {
  .avatar {
    width: 35px;
  }
}
</style>
