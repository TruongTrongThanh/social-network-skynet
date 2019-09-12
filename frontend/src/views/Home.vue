<template>
  <div class="home">
    <div class="row align-items-start justify-content-center">
      <div class="feed-list col-md-6 mr-5">
        <feed-input class="mb-3"/>
        <feed-comp
          v-for="feed in feeds"
          :key="feed.id"
          :init="feed"
          class="px-3 mb-3"
        />
      </div>
      <div class="trending sticky-top col-md-3">
        <popular-lang class="mb-3"/>
        <famous class="mb-2"/>
        <div class="copyright text-muted">&copy; {{ new Date().getFullYear() }} Skynet, Open University. All rights reserved</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MainLayout from '@/layouts/MainLayout.vue'
import FeedComp from '@/components/FeedComp.vue'
import Famous from '@/components/Famous.vue'
import PopularLang from '@/components/PopularLang.vue'
import FeedInput from '@/components/FeedInput.vue'
import { Feed } from '@/models/feed'
import { getHomeFeeds } from '@/apis/feed'

@Component({
  components: {
    MainLayout,
    FeedComp,
    Famous,
    PopularLang,
    FeedInput
  }
})
export default class Home extends Vue {
  feeds: Feed[] = []

  async created() {
    try {
      this.feeds = await getHomeFeeds()
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style scoped lang="scss">
  .home {
    .trending {
      top: $topOffset;
    }

    .copyright {
      font-size: 0.9rem;
    }
  }
</style>
