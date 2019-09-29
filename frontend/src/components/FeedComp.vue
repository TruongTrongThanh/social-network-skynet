<template>
  <div class="feed rounded p-0" @click="$emit('click')">
    <div
      v-if="hasGroupInfo"
      class="group row rounded-top py-1"
    >
      <div class="col">
        <div @click.stop="moveToGroupPage(feed.group.id)" class="clickable">
          <span v-if="isInnerSharedFeed" class="group-name mr-2">Crosspost từ</span>
          <img :src="require('@/assets/empty-avatar.png')" class="group-avatar mr-2" width="30">
          <span class="group-name">{{ feed.group.name }}</span>
        </div>
      </div>
    </div>
    <div class="title row justify-content-between pt-2">
      <div class="col-4">
        <div class="d-flex align-items-center">
          <img :src="feed.originalPoster.avatar || require('@/assets/empty-avatar.png')" class="avatar rounded mr-2">
          <div>
            <div class="fullname"
              @click.stop="moveToUserPage(feed.originalPoster.id)"
            >
              {{ feed.originalPoster.fullname }}
            </div>
            <div class="tag-list">
              <span v-for="t in feed.tags" :key="t" class="badge badge-pill badge-info mr-1" v-text="t"/>
            </div>
          </div>
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
    <div v-if="!feed.image && feed.shareFromFeed" class="row">
      <div class="col">
        <feed-comp
          :data="feed.shareFromFeed"
          :is-scale-down="isScaleDown"
          :is-inner-shared-feed="true"
          class="share-feed px-3 mb-2"
        />
      </div>
    </div>
    <div 
      v-if="!isInnerSharedFeed"
      class="footer row rounded-bottom justify-content-center align-items-center"
    >
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
            <div class="ratio-bar-novote position-absolute"/>
            <div
              :style="{ width: `${upvoteRatio}%` }"
              class="ratio-bar-upvote position-absolute"
            />
            <div
              :style="{ width: `${downvoteRatio}%` }"
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
      <div v-if="!feed.shareFromFeed" class="col-2">
        <share class="icon share" @click.stop="setClickedShareFeed(feed)"/>
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
import { State, Mutation } from 'vuex-class'
import User from '@/models/user'

@Component({
  components: {
    DownArrow,
    Comment,
    Share
  }
})
export default class FeedComp extends Mixins(CalcTimeMixin) {
  @Prop({ type: Object, required: true }) readonly data!: Feed
  @Prop({ type: Boolean, default: false }) readonly isScaleDown!: boolean
  @Prop({ type: Boolean, default: false }) readonly isInnerSharedFeed!: boolean
  @Prop({ type: Boolean, default: true }) readonly hasGroupInfo!: boolean

  @State readonly authUser!: User
  @Mutation setClickedShareFeed!: (val: Feed) => void

  feed: Feed = this.data
  HasOtherListener: boolean = false

  get upvoteRatio(): number {
    if (+this.feed.upvote === 0 && +this.feed.downvote === 0) return 0
    return (this.feed.upvote / (+this.feed.upvote + +this.feed.downvote)) * 100
  }

  get downvoteRatio(): number {
    if (+this.feed.upvote === 0 && +this.feed.downvote === 0) return 0
    return (this.feed.downvote / (+this.feed.upvote + +this.feed.downvote)) * 100
  }

  get calcTime(): string {
    return this.getCalcTime(new Date(this.feed.createdAt))
  }

  async vote(val: boolean) {
    this.feed.voteState = this.feed.voteState === val ? null : val
    await voteFeed(this.feed.id, this.feed.voteState)
  }

  moveToGroupPage(id: number) {
    this.$router.push({ name: 'group-details', params: { id: String(id) } })
  }

  moveToUserPage(id: string) {
    this.$router.push({ name: 'user-details', params: { id } })
  }

  created() {
    if (socketIO.hasListeners(`feed-vote-update-${this.feed.id}`)) {
      this.HasOtherListener = true
    }

    socketIO.on(`feed-vote-update-${this.feed.id}`, (data: FeedVoteNumber) => {
      this.feed.upvote = data.upvote
      this.feed.downvote = data.downvote
      if (data.userID === this.authUser.id) {
        this.feed.voteState = data.voteState
      }
    })
  }

  beforeDestroy() {
    if (!this.HasOtherListener) {
      socketIO.off(`feed-vote-update-${this.feed.id}`)
    }
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
    .avatar {
      width: 40px;
      height: 40px;
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

  .share-feed {
    border: 2px dashed gray;
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

      .ratio-bar-upvote,
      .ratio-bar-downvote,
      .ratio-bar-novote {
        top: 0;
        height: 100%;
      }

      .ratio-bar-upvote {
        left: 0;
        background-color: $themeColor;
      }

      .ratio-bar-downvote {
        right: 0;
        background-color: invert($themeColor);
      }

      .ratio-bar-novote {
        width: 100%;
        left: 0;
        background-color: #afafaf;
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
