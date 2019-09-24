<template>
  <div class="comment-group">
    <comment-comp
      :comment="comment"
      class="mb-2"
      @expand-reply-click="expandToggle = !expandToggle"
    />
    <div
      v-show="expandToggle"
      class="reply-section"
    >
      <comment-comp
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :is-not-reply="false"
        class="ml-5 mb-2"
      />
      <reply-input
        :comment-id="comment.id"
        class="ml-5"
        @posted="replyListUpdate"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CommentComp from '@/components/CommentComp.vue'
import ReplyInput from '@/components/ReplyInput.vue'
import { FeedComment } from '@/models/feed'

@Component({
  components: {
    CommentComp,
    ReplyInput
  }
})
export default class CommentGroup extends Vue {
  @Prop({type: Object, required: true}) data!: FeedComment

  comment: FeedComment = this.data
  expandToggle: boolean = false

  created() {
    if (!this.comment.replies) {
      this.comment.replies = []
    }
  }

  replyListUpdate(reply: FeedComment) {
    this.comment.replies.push(reply)
  }
}
</script>

<style scoped lang="scss">
</style>
