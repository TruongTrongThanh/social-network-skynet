<template>
  <div class="home container-fluid">
    <div class="row align-items-start justify-content-center">
      <feed-list
        :data.sync="feeds"
        class="col-6 mr-5"
      />
      <div class="trending sticky-top col-3">
        <popular-tags class="mb-3"/>
        <famous class="mb-2"/>
        <Copyright/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Famous from '@/components/Famous.vue'
import PopularTags from '@/components/PopularTags.vue'
import FeedList from '@/components/FeedList.vue'
import { Feed } from '@/models/feed'
import { getHomeFeeds, getFeedDetail } from '@/apis/feed'
import FeedWrapper from '@/components/FeedWrapper.vue'
import Copyright from '@/components/Copyright.vue'

@Component({
  components: {
    Famous,
    PopularTags,
    FeedList,
    Copyright
  }
})
export default class Home extends Vue {
  feeds: Feed[] = []

  async created() {
    const res = await getHomeFeeds()
    Vue.set(this, 'feeds', res)
  }
}
</script>

<style scoped lang="scss">
.home {
  .trending {
    top: $topOffset;
  }
}
</style>
