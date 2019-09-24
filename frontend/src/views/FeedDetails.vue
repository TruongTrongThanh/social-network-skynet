<template>
  <div
    v-if="feed"
    class="feed-details container"
  >
    <div class="row">
      <feed-wrapper :data="feed" class="col-8"/>
      <div class="col ml-3">This is post liên quan</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Feed, FeedComment } from '@/models/feed'
import { getFeedDetail } from '@/apis/feed'
import FeedWrapper from '@/components/FeedWrapper.vue'

@Component({
  components: {
    FeedWrapper
  }
})
export default class FeedDetails extends Vue {
  feed: Feed | null = null
  async created() {
    this.feed = await getFeedDetail(this.$route.params.id as any)
  }

  updateCommentList(cmt: FeedComment) {
    this.feed!.commentList.unshift(cmt)
  }
}
</script>

<style scoped lang="scss">
  .feed-wrapper {
    background-color: white;
  }
  .offset {
    position: relative;
    bottom: 2px;
  }
</style>
