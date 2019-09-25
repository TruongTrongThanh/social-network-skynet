<template>
  <div class="sidebar fixed-top">
    <brand-toggler class="navbar-light ml-3 my-2"/>
    <bullet
      :img-src="require('@/assets/icons/group-btn-icon.png')"
      :name="'Tạo cộng đồng'"
      :route="{ name: 'group-create' }"
      class="pl-3 py-2"
    />
    <bullet
      :img-src="require('@/assets/icons/group-btn-icon.png')"
      :name="'Thông báo'"
      :route="{ name: 'group-create' }"
      class="pl-3 py-2"
    >
      <div class="notif d-flex align-items-center ml-2">
        <div class="number flex-fill text-center">2</div>
      </div>
    </bullet>
    <div v-if="adminGroups.length > 0" class="admin-groups">
      <hr>
      <div class="ml-3 text-muted">Cộng đồng quản trị</div>
      <div class="mt-2">
        <bullet
          v-for="group in adminGroups"
          :key="group.id"
          :img-src="group.avatar || require('@/assets/icons/group-btn-icon.png')"
          :name="group.name"
          :route="{ name: 'group-details', params: { id: group.id } }"
          class="pl-3 py-2"
        />
      </div>
    </div>
    <div v-if="memberGroups.length > 0" class="member-groups">
      <hr>
      <div class="ml-3 text-muted">Cộng đồng của bạn</div>
      <div class="mt-2">
        <bullet
          v-for="group in memberGroups"
          :key="group.id"
          :img-src="group.avatar || require('@/assets/icons/group-btn-icon.png')"
          :name="group.name"
          :route="{ name: 'group-details', params: { id: group.id } }"
          class="pl-3 py-2"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import BrandToggler from '@/components/BrandToggler.vue'
import Bullet from '@/components/Bullet.vue'
import { Group } from '@/models/group'
import { Getter } from 'vuex-class'

@Component({
  components: {
    BrandToggler,
    Bullet
  }
})
export default class Sidebar extends Vue {
  @Getter memberGroups!: Group[]
  @Getter adminGroups!: Group[]
}
</script>

<style scoped lang="scss">
.sidebar {
  width: 260px;
  height: 100vh;
  background-color: white;
  position: fixed;

  .notif {
    background-color: red;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: white;
    font-size: 13px;
  }
}
</style>
