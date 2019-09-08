<template>
  <nav class="navbar fixed-top navbar-light bg-light shadow-sm">
    <brand-toggler/>
    <div>
      {{ authUser.fullname }}
    </div>
  </nav>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import BrandToggler from '@/components/BrandToggler.vue'
import User from '@/models/user'

@Component({
  components: {
    BrandToggler
  }
})
export default class Navbar extends Vue {
  @Prop({type: Object, required: true}) authUser!: User
}
</script>

<style scoped lang="scss">
</style>
