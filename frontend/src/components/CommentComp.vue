<template>
  <div class="comment container-fluid p-0">
    <div class="row no-gutters align-items-center">
      <div class="col-1 avatar">
        <img :src="comment.originalPoster.avatar" width="30">
      </div>
      <div class="col-10 content">
        <div class="row no-gutters">
          <div class="col">
            <span class="name mr-2">{{ comment.originalPoster.fullname }}</span>
            <span class="buttons clickable mr-1">Like</span>
            <span class="buttons clickable mr-1">Dislike</span>
            <span class="time">- {{ calcTime }} ago</span>
          </div>
        </div>
        <div class="row no-gutters"><div class="col">{{ comment.content }}</div></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import CalcTimeMixin from '@/mixins/calc-time'
import { FeedComment } from '@/models/feed'

@Component
export default class CommentComp extends Mixins(CalcTimeMixin) {
  @Prop({type: Object, required: true}) comment!: FeedComment

  get calcTime(): string {
    return this.getCalcTime(this.comment.createdAt)
  }
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
    .buttons, .time {
      font-size: 13px;
      color: gray;
    }
  }
</style>
