<template>
  <div class="comment-group p-2 rounded">
    <comment-comp
      :comment="comment"
      class="mb-2"
      @expand-reply-click="expandToggle = !expandToggle"
    />
    <div
      v-show="expandToggle"
      class="reply-section"
    >
      <transition-group name="comment-list" tag="div" class="replies-wrapper pl-5">
        <comment-comp
          v-for="reply in comment.replies"
          :key="reply.id"
          :comment="reply"
          :is-not-reply="false"
          class="px-2 py-1 rounded"
        />
      </transition-group>
      <reply-input
        :comment-id="comment.id"
        class="ml-5 mt-2"
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
