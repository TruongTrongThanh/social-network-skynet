<template>
  <div class="feed-wrapper rounded">
    <feed-comp :init="feed" @share-click="$emit('share-click')"/>
    <comment-input
      class="mt-3"
      @posted="updateCommentList"
    />
    <hr class="mt-4">
    <comment-list :feed-id="feed.id" :data="feed.commentList"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { FeedComment, Feed } from '@/models/feed'
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
export default class FeedWrapper extends Vue {
  @Prop({ type: Object, required: true }) data!: Feed

  feed: Feed = this.data

  created() {
    if (!this.feed.commentList) {
      this.feed.commentList = []
    }
  }

  updateCommentList(cmt: FeedComment) {
    this.feed.commentList.unshift(cmt)
  }
}
</script>

<style scoped lang="scss">
.feed-wrapper {
  background-color: white;
}
</style>
