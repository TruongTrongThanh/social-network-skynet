<template>
  <div class="home container-fluid">
    <div class="row align-items-start justify-content-center">
      <div class="feed-list col-md-6 mr-5">
        <feed-input class="mb-3"/>
        <feed-comp
          v-for="feed in feeds"
          :key="feed.id"
          :init="feed"
          :is-scale-down="true"
          class="px-3 mb-3 clickable raise-border"
          @click="getFeed(feed.id)"
          @share-click="clickedShareFeed = feed"
        />
      </div>
      <div class="trending sticky-top col-md-3">
        <popular-lang class="mb-3"/>
        <famous class="mb-2"/>
        <div class="copyright text-muted">&copy; {{ new Date().getFullYear() }} Skynet, Open University. All rights reserved</div>
      </div>
    </div>

    <!-- feed mini-window -->
    <feed-wrapper
      v-if="clickedFeed"
      class="mini-window-content container"
      :data="clickedFeed"
      @share-click="clickedShareFeed = clickedFeed"
    />
    <div v-show="clickedFeed" class="blackscreen" @click="clickedFeed = null"></div>

    <!-- share mini-window -->
    <feed-input
      v-if="clickedShareFeed"
      :shared-feed="clickedShareFeed"
      class="mini-window-content on-top"
    />
    <div v-show="clickedShareFeed" class="blackscreen on-top" @click="clickedShareFeed = null"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MainLayout from '@/layouts/MainLayout.vue'
import FeedComp from '@/components/FeedComp.vue'
import Famous from '@/components/Famous.vue'
import PopularLang from '@/components/PopularLang.vue'
import FeedInput from '@/components/FeedInput.vue'
import { Feed } from '@/models/feed'
import { getHomeFeeds, getFeedDetail } from '@/apis/feed'
import FeedWrapper from '@/components/FeedWrapper.vue'

@Component({
  components: {
    MainLayout,
    FeedComp,
    Famous,
    PopularLang,
    FeedInput,
    FeedWrapper
  }
})
export default class Home extends Vue {
  feeds: Feed[] = []

  clickedFeed: Feed | null = null
  clickedShareFeed: Feed | null = null

  async created() {
    this.feeds = await getHomeFeeds()
  }

  async getFeed(id: number) {
    this.clickedFeed = await getFeedDetail(id)
  }
}
</script>

<style scoped lang="scss">
$feed-width: 800px;

.home {
  .trending {
    top: $topOffset;
  }

  .copyright {
    font-size: 0.9rem;
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

    &.on-top {
      z-index: 1024;
    }
  }

  .blackscreen {
    background-color: #00000045;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1022;

    &.on-top {
      z-index: 1023;
    }
  }

  .raise-border:hover {
    border: 1px solid #979797;
  }
}
</style>
