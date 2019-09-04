<template>
  <div class="comment-list px-3 pb-2">
    <comment-comp
      v-for="cm in commentList"
      :key="cm.id"
      :comment="cm"
      class="mb-2"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { FeedComment, CommentReply } from '@/models/feed'
import CommentComp from '@/components/CommentComp.vue'

@Component({
  components: {
    CommentComp
  }
})
export default class CommentList extends Vue {
  comment1: FeedComment = {
    id: 123,
    originalPoster: {
      id: 'thanhtt21',
      fullname: 'Trương Trọng Thanh',
      avatar: 'https://www.w3schools.com/howto/img_avatar.png'
    },
    content: 'this is comment... ahahaha...',
    upvote: 2,
    downvote: 0
  }

  comment2: FeedComment = {
    id: 24,
    originalPoster: {
      id: 'thanhtt11',
      fullname: 'Trương Trọng Thanh 2',
      avatar: 'https://www.w3schools.com/howto/img_avatar.png'
    },
    content: 'this is comment 2... ahahaha...',
    upvote: 1,
    downvote: 1
  }

  commentList: FeedComment[] = [this.comment1, this.comment2]
}
</script>

<style scoped lang="scss">
</style>
