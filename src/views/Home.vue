<template>
  <main-layout>
    <div class="home">
      <div class="row justify-content-center">
        <div class="feed-list col-md-6 mr-5">
          <feed-comp
            v-for="x in 5"
            :key="x"
            :feed="sampleFeed"
            class="mb-3"
          />
        </div>
        <div class="suggestion sticky-top col-md-3">
          this is suggestion...
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MainLayout from '@/layouts/MainLayout.vue'
import FeedComp from '@/components/FeedComp.vue'
import { Feed, VoteState } from '@/models/feed'

@Component({
  components: {
    MainLayout,
    FeedComp
  }
})
export default class Home extends Vue {
  sampleFeed: Feed = {
    id: 0,
    originalPoster: {
      id: 'thanhtt21',
      fullname: 'Trương Trọng Thanh',
      avatar: 'https://www.w3schools.com/howto/img_avatar.png'
    },
    content: 'this is content feed...',
    voteState: VoteState.Up,
    upvote: 50,
    downvote: 21,
    share: 20,
    comment: 5,
    createdAt: new Date(2019, 7, 22, 12, 20, 33)
  }
}
</script>

<style scoped lang="scss">
  .home {
    margin-top: $topOffset;

    .suggestion {
      background-color: white;
      top: $topOffset;
    }
  }
</style>
