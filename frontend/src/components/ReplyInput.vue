<template>
  <div
    v-if="toggle"
    class="reply-input border rounded"
  >
    <textarea
      v-model="content"
      class="w-100 rounded-top p-2"
      placeholder="What are your thoughts?"
      rows="1"
    />
    <div class="reply-control rounded-bottom clearfix">
      <button
        class="btn btn-link btn-sm mx-2 my-1"
      >
        Cancel
      </button>
      <button
        class="btn btn-primary btn-sm reply-btn px-4 mx-2 my-1 float-right"
        @click="post"
      >
        Reply
      </button>
    </div>
  </div>
  <div
    v-else
    @click="toggle = !toggle"
  >
    Trả lời...
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { postReply } from '@/apis/feed'
import { FeedComment } from '../models/feed'
import User from '@/models/user'
import { State } from 'vuex-class'

@Component
export default class ReplyInput extends Vue {
  @Prop({type: Number, required: true}) commentId!: number
  @State authUser!: User

  content: string = ''
  toggle: boolean = false

  async post() {
    const id = await postReply(this.commentId, this.content)
    const reply: FeedComment = {
      id,
      originalPoster: this.authUser,
      content: this.content,
      upvote: 0,
      downvote: 0,
      createdAt: new Date().toString()
    }
    this.$emit('posted', reply)
  }
}
</script>

<style scoped lang="scss">
  .reply-input {
    .reply-control {
      background-color: #f8f8f8;
    }

    .reply-btn {
      font-size: .8rem;
      &:active:focus {
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
      }
      &:focus {
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
      }
    }
  }
</style>
