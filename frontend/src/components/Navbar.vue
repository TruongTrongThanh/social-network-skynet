<template>
  <nav class="navbar fixed-top navbar-light bg-light shadow-sm">
    <div class="d-flex">
      <brand-toggler class="mr-5"/>
      <search-bar/>
    </div>
    <div class="d-flex align-items-center user-section">
      <img :src="authUser.avatar || require('@/assets/empty-avatar.png')" class="rounded" width="35">
      <div class="dropdown mr-1">
        <button
          type="button"
          class="btn btn-link dropdown-toggle"
          id="dropdownMenuOffset"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {{ authUser.fullname }}
        </button>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuOffset">
          <a class="dropdown-item" href="#">Nhà của tôi</a>
          <a class="dropdown-item" href="#">Tùy chỉnh trang cá nhân</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Đăng xuất</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import BrandToggler from '@/components/BrandToggler.vue'
import User from '@/models/user'
import SearchBar from '@/components/SearchBar.vue'

@Component({
  components: {
    BrandToggler,
    SearchBar
  }
})
export default class Navbar extends Vue {
  @Prop({type: Object, required: true}) authUser!: User
}
</script>

<style scoped lang="scss">
</style>
