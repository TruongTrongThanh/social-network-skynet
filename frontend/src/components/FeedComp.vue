<template>
  <div class="feed rounded container-fluid p-0">
    <div class="title rounded-top row justify-content-between align-items-center py-2">
      <div class="col-4">
        <img :src="feed.originalPoster.avatar || 'https://www.w3schools.com/howto/img_avatar.png'" class="mr-2" width="40">
        <span class="fullname">{{ feed.originalPoster.fullname }}</span>
      </div>
      <div class="time col-4 text-right">Posted {{ calcTime }} ago</div>
    </div>
    <div class="content row">
      {{ feed.content }}
    </div>
    <div class="footer row rounded-bottom justify-content-center align-items-center">
      <div class="col-5">
        <div class="row justify-content-center align-items-center">
          <div class="col">
            <down-arrow
              :class="{ upvote: feed.voteState === true }"
              class="icon arrow rotate-180 clickable mr-1"
              @click="vote(true)"
            />
            <span :class="{ 'upvote-color': feed.voteState === true }">{{ feed.upvote }}</span>
          </div>
          <div class="col-6 ratio-bar position-relative">
            <div class="ratio-bar-upvote position-absolute"/>
            <div
              :style="{ width: `${(feed.downvote / (feed.upvote + feed.downvote)) * 100}%` }"
              class="ratio-bar-downvote position-absolute"
            />
          </div>
          <div class="col">
            <span :class="{ 'downvote-color': feed.voteState === false }">{{ feed.downvote }}</span>
            <down-arrow
              :class="{ downvote: feed.voteState === false }"
              class="icon arrow clickable ml-1"
              @click="vote(false)"
            />
          </div>
        </div>
      </div>
      <div class="col-3">
        <comment class="icon comment"/>
        {{ feed.comment }}
      </div>
      <div class="col-2">
        <share class="icon share"/>
        {{ feed.share }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import CalcTimeMixin from '@/mixins/calc-time'
import DownArrow from '@/assets/icons/down-arrow.svg'
import Comment from '@/assets/icons/comment.svg'
import Share from '@/assets/icons/share.svg'
import { Feed } from '@/models/feed'

@Component({
  components: {
    DownArrow,
    Comment,
    Share
  }
})
export default class FeedComp extends Mixins(CalcTimeMixin) {
  @Prop({type: Object, required: true}) readonly init!: Feed

  feed: Feed = Object.assign({}, this.init)

  get calcTime(): string {
    return this.getCalcTime(new Date(this.feed.createdAt))
  }

  vote(val: boolean) {
    this.feed.voteState = this.feed.voteState === val ? null : val
  }
}
</script>

<style scoped lang="scss">
  .feed {
    background-color: white;

    .title {
      .time {
        color: #848484;
        font-size: 0.8em;
      }
      .fullname {
        font-weight: bold;
      }
    }
    .content {
      padding: 10px 20px;
    }
    .footer {
      height: 2.2rem;
      text-align: center;
      color: gray;
      background-color: #f8f8f8;

      .ratio-bar {
        width: 80%;
        margin: 0 auto;
        height: 5px;

        .ratio-bar-upvote {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: $themeColor;
        }

        .ratio-bar-downvote {
          top: 0;
          right: 0;
          height: 100%;
          background-color: invert($themeColor);
        }
      }
    }

    .upvote-color {
      color: $themeColor;
    }
    .downvote-color {
      color: invert($themeColor);
    }

    .icon {
      position: relative;
      width: 15px;
      height: 15px;
      top: -2px;
      fill: #afafaf;

      &.rotate-180 {
        transform: rotate(180deg);
      }

      &.arrow {
        &.upvote {
          fill: $themeColor;
        }
        &.downvote {
          fill: invert($themeColor);
        }
      }

      &.comment {
        top: 0;
        width: 17px;
        height: 17px;
      }
      &.share {
        width: 17px;
        height: 17px;
      }
    }
  }
</style>
