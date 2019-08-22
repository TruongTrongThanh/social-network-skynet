<template>
  <div class="feed rounded container-fluid">
    <div class="title rounded-top row justify-content-between align-items-center py-2">
      <div class="col-4">
        <img :src="feed.originalPoster.avatar" class="mr-2" width="30">
        <span>{{ feed.originalPoster.fullname }}</span>
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
              :class="{ upvote: voteState === 1 }"
              class="icon arrow rotate-180 clickable mr-1"
              @click="voteState = voteState === 1 ? 2 : 1"
            />
            <span :class="{ 'upvote-color': voteState === 1 }">{{ feed.upvote }}</span>
          </div>
          <div class="col-6 ratio-bar position-relative">
            <div class="ratio-bar-upvote position-absolute"/>
            <div
              :style="{ width: `${(feed.downvote / (feed.upvote + feed.downvote)) * 100}%` }"
              class="ratio-bar-downvote position-absolute"
            />
          </div>
          <div class="col">
            <span :class="{ 'downvote-color': voteState === 0 }">{{ feed.downvote }}</span>
            <down-arrow
              :class="{ downvote: voteState === 0 }"
              class="icon arrow clickable ml-1"
              @click="voteState = voteState === 0 ? 2 : 0"
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import DownArrow from '@/assets/icons/down-arrow.svg'
import Comment from '@/assets/icons/comment.svg'
import Share from '@/assets/icons/share.svg'
import { Feed, VoteState } from '@/models/feed'

@Component({
  components: {
    DownArrow,
    Comment,
    Share
  }
})
export default class FeedComp extends Vue {
  @Prop({type: Object, required: true}) readonly feed!: Feed

  voteState: VoteState = this.feed.voteState

  get calcTime(): string {
    const MINUTE = 1000 * 60
    const HOUR = MINUTE * 60
    const DAY = HOUR * 24
    const MONTH = DAY * 30
    const YEAR = MONTH * 12

    const created = this.feed.createdAt.getTime()
    const now = new Date().getTime()

    const diff = now - created
    let type: string = ''

    /* tslint:disable:curly align */
    if (diff >= MINUTE)
      if (diff >= HOUR)
        if (diff >= DAY)
          if (diff >= MONTH)
            if (diff >= YEAR)
              type = 'year'
            else type = 'month'
          else type = 'day'
        else type = 'hour'
      else type = 'minute'
    else type = 'second'

    let diffType: number
    switch (type) {
      case 'second':
        diffType = diff / 1000
        break
      case 'minute':
        diffType = diff / MINUTE
        break
      case 'hour':
        diffType = diff / HOUR
        break
      case 'day':
        diffType = diff / DAY
        break
      case 'month':
        diffType = diff / MONTH
        break
      case 'year':
        diffType = diff / YEAR
        break
      default:
        diffType = -1
        break
    }
    return `${diffType.toFixed()} ${type}(s)`
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
