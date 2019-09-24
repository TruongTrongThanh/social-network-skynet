<template>
  <div class="feed rounded p-0" @click="$emit('click')">
    <div class="group row rounded-top py-1">
      <div class="col">
        <router-link :to="{ name: 'group-details', params: { id: feed.group.id } }">
          <img :src="require('@/assets/empty-avatar.png')" class="group-avatar mr-2" width="30">
          <span class="group-name">{{ feed.group.name }}</span>
        </router-link>
      </div>
    </div>
    <div class="title row justify-content-between pt-2">
      <div class="col-4">
        <div class="d-flex">
          <img :src="feed.originalPoster.avatar || require('@/assets/empty-avatar.png')" class="rounded mr-2" width="40">
          <span class="fullname">{{ feed.originalPoster.fullname }}</span>
        </div>
      </div>
      <div class="col-2 text-right">
        <router-link :to="{ name: 'feed', params: { id: feed.id } }" class="time">{{ calcTime }}</router-link>
      </div>
    </div>
    <div class="content row" v-text="feed.content"/>
    <div v-if="feed.image" class="image row">
      <div class="col">
        <img
        :src="feed.image"
        :class="{ 'scale-down': isScaleDown }"
        class="feed-image mb-2"
        >
      </div>
    </div>
    <div class="footer row rounded-bottom justify-content-center align-items-center">
      <div class="col-5">
        <div class="row justify-content-center align-items-center">
          <div class="col">
            <down-arrow
              :class="{ upvote: feed.voteState === true }"
              class="icon arrow rotate-180 clickable mr-1"
              @click.stop="vote(true)"
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
              @click.stop="vote(false)"
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
import { Feed, FeedVoteNumber } from '@/models/feed'
import { voteFeed } from '@/apis/feed'
import socketIO from '@/apis/socket'

@Component({
  components: {
    DownArrow,
    Comment,
    Share
  }
})
export default class FeedComp extends Mixins(CalcTimeMixin) {
  @Prop({type: Object, required: true}) readonly init!: Feed
  @Prop({type: Boolean, default: false}) readonly isScaleDown!: boolean

  feed: Feed = this.init

  created() {
    socketIO.on(`feed-vote-update-${this.feed.id}`, (data: FeedVoteNumber) => {
      this.feed.upvote = data.upvote
      this.feed.downvote = data.downvote
    })
  }

  get calcTime(): string {
    return this.getCalcTime(new Date(this.feed.createdAt))
  }

  async vote(val: boolean) {
    this.feed.voteState = this.feed.voteState === val ? null : val
    await voteFeed(this.feed.id, this.feed.voteState)
  }

  beforeDestroy() {
    socketIO.off(`feed-vote-update-${this.feed.id}`)
  }
}
</script>

<style scoped lang="scss">
  .feed {
    background-color: white;

    .group {
      background-color: #f8f8f8;

      .group-avatar {
        border-radius: 20px;
      }
      .group-name {
        font-size: 0.9em;
        color: gray;
      }
    }

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
      white-space: pre-line;
    }

    .feed-image {
      width: 100%;
      background-color: #696969;

      &.scale-down {
        height: 500px;
        object-fit: scale-down;
      }
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
