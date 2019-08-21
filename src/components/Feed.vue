<template>
  <div class="feed rounded container-fluid">
    <div class="title rounded-top row justify-content-between align-items-center py-2">
      <div class="col-4">
        <img :src="avatar" class="mr-2" width="30">
        <span>{{ originalPoster }}</span>
      </div>
      <div class="time col-4 text-right">Posted 30 minutes ago</div>
    </div>
    <div class="content row">
      {{ content }}
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
            <span :class="{ 'upvote-color': voteState === 1 }">{{ upvote }}</span>
          </div>
          <div class="col-6 ratio-bar position-relative">
            <div class="ratio-bar-upvote position-absolute"/>
            <div
              :style="{ width: `${(downvote / (upvote + downvote)) * 100}%` }"
              class="ratio-bar-downvote position-absolute"
            />
          </div>
          <div class="col">
            <span :class="{ 'downvote-color': voteState === 0 }">{{ downvote }}</span>
            <down-arrow
              :class="{ downvote: voteState === 0 }"
              class="icon arrow clickable ml-1"
              @click="voteState = voteState === 0 ? 2 : 0"
            />
          </div>
        </div>
      </div>
      <div class="col-3">
        <reply class="icon reply"/>
        Reply
      </div>
      <div class="col-2">
        <share class="icon share"/>
        Share
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import DownArrow from '@/assets/icons/down-arrow.svg'
import Reply from '@/assets/icons/reply.svg'
import Share from '@/assets/icons/share.svg'

enum VoteState {
  Down = 0,
  Up = 1,
  None = 2
}

@Component({
  components: {
    DownArrow,
    Reply,
    Share
  }
})
export default class Feed extends Vue {
  @Prop({type: String, required: true}) readonly avatar!: string
  @Prop(String) readonly groupName!: string
  @Prop({type: String, required: true}) readonly originalPoster!: string
  @Prop({type: String, required: true}) readonly content!: string
  @Prop(String) readonly image!: string
  @Prop({type: Number, required: true}) readonly initVoteState!: VoteState
  @Prop({type: Number, required: true}) readonly upvote!: number
  @Prop({type: Number, required: true}) readonly downvote!: number
  @Prop({type: Number, required: true}) readonly share!: number

  voteState: VoteState = this.initVoteState
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

      &.reply {
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
