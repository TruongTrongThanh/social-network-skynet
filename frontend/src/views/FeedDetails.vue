<template>
  <div
    v-if="feed"
    class="feed-details container"
  >
    <div class="row">
      <feed-wrapper :data="feed" class="col-8" @share-click="clickedShareFeed = feed"/>
      <div class="col ml-3">This is post liên quan</div>
    </div>
    <!-- share mini-window -->
    <feed-input
      v-if="clickedShareFeed"
      :shared-feed="clickedShareFeed"
      class="mini-window-content"
    />
    <div v-show="clickedShareFeed" class="blackscreen" @click="clickedShareFeed = null"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Feed, FeedComment } from '@/models/feed'
import { getFeedDetail } from '@/apis/feed'
import FeedWrapper from '@/components/FeedWrapper.vue'
import FeedInput from '@/components/FeedInput.vue'
import { Route } from 'vue-router'
import { NextFunction } from '../models/vue-api'

@Component({
  components: {
    FeedWrapper,
    FeedInput
  }
})
export default class FeedDetails extends Vue {
  feed: Feed | null = null
  clickedShareFeed: Feed | null = null

  async init() {
    this.feed = await getFeedDetail(this.$route.params.id as any)
  }

  created() {
    this.init()
  }

  updateCommentList(cmt: FeedComment) {
    this.feed!.commentList.unshift(cmt)
  }
}
</script>

<style scoped lang="scss">
$feed-width: 800px;

.feed-wrapper {
  background-color: white;
}
.offset {
  position: relative;
  bottom: 2px;
}
  .mini-window-content {
  position: fixed;
  top: $topOffset + 10px;
  left: 50%;
  width: $feed-width;
  max-height: 600px;
  margin-left: - ($feed-width / 2);
  background-color: white;
  overflow: auto;
  z-index: 1023;
}

.blackscreen {
  background-color: #00000045;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1022;
}
</style>
