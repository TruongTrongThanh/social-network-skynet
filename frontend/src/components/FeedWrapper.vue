<template>
  <div class="feed-wrapper rounded pb-2">
    <feed-comp :data="feed" @share-click="$emit('share-click')"/>
    <comment-input
      class="mt-3"
      @posted="updateCommentList"
    />
    <div class="d-flex mt-3">
      <div
        :class="{ selected: cmtToggle }"
        class="switch-btn mr-3 clickable"
        @click="cmtToggle = true"
      >
        Bình luận
      </div>
      <div
        :class="{ selected: !cmtToggle }"
        class="switch-btn clickable"
        @click="cmtToggle = false"
      >
        Chia sẻ
      </div>
    </div>
    <hr class="mt-2">
    <comment-list v-show="cmtToggle" :feed-id="feed.id" :data="feed.commentList"/>
    <share-list v-show="!cmtToggle" :feed-id="feed.id"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { FeedComment, Feed } from '@/models/feed'
import FeedComp from '@/components/FeedComp.vue'
import CommentInput from '@/components/CommentInput.vue'
import CommentList from '@/components/CommentList.vue'
import ShareList from '@/components/ShareList.vue'

@Component({
  components: {
    FeedComp,
    CommentInput,
    CommentList,
    ShareList
  }
})
export default class FeedWrapper extends Vue {
  @Prop({ type: Object, required: true }) data!: Feed

  feed: Feed = this.data
  cmtToggle: boolean = true

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

  .switch-btn {
    color: #c2c2c2;
    font-size: 14px;

    &.selected {
      color: black;
      font-weight: bold;
      padding-bottom: 5px;
      border-bottom: 2px solid #4c95c0;
    }
  }
}
</style>
