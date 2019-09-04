<template>
  <div class="comment container-fluid p-0">
    <div class="row no-gutters align-items-center">
      <div class="col-1 avatar">
        <img :src="comment.originalPoster.avatar" width="30">
      </div>
      <div class="col content">
        <div class="row no-gutters">
          <div class="col name">{{ comment.originalPoster.fullname }}</div>
        </div>
        <div class="row no-gutters"><div class="col">{{ comment.content }}</div></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { FeedComment } from '@/models/feed'

@Component
export default class CommentComp extends Vue {
  @Prop({type: Object, required: true}) comment!: FeedComment
}
</script>

<style scoped lang="scss">
  .comment {
    .avatar {
    max-width: 5.5%;
    }
    .content {
      font-size: 15px;
    }
    .name {
      font-weight: bold;
    }
  }
</style>
