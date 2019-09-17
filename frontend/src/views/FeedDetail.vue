<template>
  <div
    v-if="feed"
    class="feed-detail container"
  >
    <div class="row">
      <div class="col-8 feed-wrapper rounded">
        <feed-comp :init="feed"/>
        <comment-input
          class="mt-3"
          @posted="updateCommentList"
        />
        <hr class="mt-4">
        <comment-list :feed-id="feed.id" :init="feed.commentList"/>
      </div>
      <div class="col ml-3">This is post liên quan</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Feed, FeedComment } from '@/models/feed'
import { getFeedDetail } from '@/apis/feed'
import FeedComp from '@/components/FeedComp.vue'
import CommentInput from '@/components/CommentInput.vue'
import CommentList from '@/components/CommentList.vue'

@Component({
  components: {
    FeedComp,
    CommentInput,
    CommentList
  }
})
export default class FeedDetail extends Vue {
  feed: Feed | null = null
  async created() {
    this.feed = await getFeedDetail(this.$route.params.id as any)
  }

  updateCommentList(cmt: FeedComment) {
    if (!this.feed!.commentList) {
      this.feed!.commentList = []
    }
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
