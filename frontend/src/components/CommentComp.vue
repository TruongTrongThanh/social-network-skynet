<template>
  <div class="comment container-fluid p-0" @click="expandReplyClick">
    <div class="row no-gutters align-items-center justify-content-between">
      <div class="col-11">
        <div class="row no-gutters">
          <div class="avatar col-1 mr-1">
            <img :src="comment.originalPoster.avatar || 'https://www.w3schools.com/howto/img_avatar.png'" class="rounded" width="30">
          </div>
          <div class="col-10 content">
            <div class="row no-gutters">
              <div class="col">
                <span class="name mr-2">{{ comment.originalPoster.fullname }}</span>
                <span class="time">- {{ calcTime }}</span>
              </div>
            </div>
            <div class="row no-gutters"><div class="col">{{ comment.content }}</div></div>
          </div>
        </div>
      </div>
      <div
        v-if="isNotReply"
        class="col-1 flex-fill text-right"
      >
        <span
          :class="{ 'rotate-down': styleArrowToggle }"
          class="expand-arrow clickable"
        >
          &#10148;
        </span>
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
  @Prop({type: Boolean, default: true}) isNotReply!: boolean

  styleArrowToggle: boolean = false

  get calcTime(): string {
    return this.getCalcTime(new Date(this.comment.createdAt))
  }

  expandReplyClick() {
    this.styleArrowToggle = !this.styleArrowToggle
    this.$emit(`expand-reply-click`)
  }
}
</script>

<style scoped lang="scss">
  .comment {
    .avatar {
      max-width: 5.5%;
      position: relative;
      top: 6px;
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
    .expand-arrow {
      display: inline-block;
      color: gray;

      transform: rotateZ(180deg);
      &.rotate-down {
        transform: rotateZ(90deg);
      }
    }
  }
</style>
