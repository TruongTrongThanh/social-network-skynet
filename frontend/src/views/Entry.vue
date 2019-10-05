<template>
  <div class="entry container">
    <h1 class="font-weight-bold mt-5">Chào mừng bạn đến mạng xã hội SKYNET</h1>
    <h2 class="sub-text font-weight-light">Mạng xã hội dành cho lập trình viên</h2>
    <EntryForm/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import EntryForm from '@/components/EntryForm.vue'
import { NextFunction } from '../models/vue-api'
import { Route } from 'vue-router'
import { Getter, Mutation } from 'vuex-class'
import { hasLoggedIn } from '@/apis/authentication'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave'
])

declare let document: Document

@Component({
  components: {
    EntryForm
  }
})
export default class Entry extends Vue {
  @Getter readonly hasLoggedIn!: boolean

  mounted() {
    document.body.style.backgroundImage = `url(${require('@/assets/entry-background.png')})`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
  }

  async beforeRouteEnter(to: Route, from: Route, next: NextFunction) {
    if (await hasLoggedIn()) next('/')
    else next()
  }

  beforeRouteLeave(to: Route, from: Route, next: NextFunction) {
    document.body.style.backgroundImage = 'none'
    next()
  }
}
</script>

<style scoped lang="scss">
  .entry {
    text-align: center;
    color: white;
    .sub-text {
      color: #b3b3b3;
    }
  }
</style>
