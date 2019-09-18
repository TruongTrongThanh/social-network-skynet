<template>
  <div class="comment-input border rounded">
    <textarea v-model="content" class="w-100 rounded-top p-2" placeholder="What are your thoughts?"/>
    <div class="comment-control rounded-bottom clearfix">
      <button
        class="btn btn-primary btn-sm comment-btn px-3 mx-2 my-1 float-right"
        @click="post"
      >
        Comment
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { postComment } from '@/apis/feed'
import { FeedComment } from '@/models/feed'
import { State, Mutation } from 'vuex-class'
import User from '@/models/user'

@Component
export default class CommentInput extends Vue {
  @State authUser!: User

  content: string = ''

  async post() {
    const id = await postComment(this.$route.params.id as any, this.content)
    const cmt: FeedComment = {
      id,
      originalPoster: this.authUser,
      content: this.content,
      upvote: 0,
      downvote: 0,
      createdAt: new Date().toString()
    }
    this.$emit('posted', cmt)
  }
}
</script>

<style scoped lang="scss">
  .comment-input {
    .comment-control {
      background-color: #f8f8f8;
    }

    .comment-btn {
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
