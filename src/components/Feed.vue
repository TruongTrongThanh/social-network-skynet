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
          <div class="col">Li {{ like }}</div>
          <div class="col-6 ratio-bar position-relative">
            <div class="ratio-bar-like position-absolute"/>
            <div
              :style="{ width: `${(dislike / (like + dislike)) * 100}%` }"
              class="ratio-bar-dislike position-absolute"
            />
          </div>
          <div class="col">{{ dislike }} Di</div>
        </div>
      </div>
      <div class="col-3">Re Reply</div>
      <div class="col-2">Sh Share</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Feed extends Vue {
  @Prop({type: String, required: true}) readonly avatar!: string
  @Prop(String) readonly groupName!: string
  @Prop({type: String, required: true}) readonly originalPoster!: string
  @Prop({type: String, required: true}) readonly content!: string
  @Prop(String) readonly image!: string
  @Prop({type: Number, required: true}) readonly like!: number
  @Prop({type: Number, required: true}) readonly dislike!: number
  @Prop({type: Number, required: true}) readonly share!: number
}
</script>

<style scoped lang="scss">
  .feed {
    background-color: #f1f1f1;
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
      background-color: #e2e2e2;

      .ratio-bar {
        width: 80%;
        margin: 0 auto;
        height: 5px;

        .ratio-bar-like {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: $themeColor;
        }

        .ratio-bar-dislike {
          top: 0;
          right: 0;
          height: 100%;
          background-color: invert($themeColor);
        }
      }
    }
  }
</style>
