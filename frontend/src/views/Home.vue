<template>
  <div class="home">
    <div class="row align-items-start justify-content-center">
      <div class="feed-list col-md-6 mr-5">
        <feed-comp
          v-for="x in 50"
          :key="x"
          :init="sampleFeed"
          class="px-3 mb-3"
        />
      </div>
      <div class="trending sticky-top col-md-3">
        <popular-lang class="mb-3"/>
        <famous class="mb-2"/>
        <div class="copyright text-muted">&copy; {{ new Date().getFullYear() }} Skynet, Open University. All rights reserved</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MainLayout from '@/layouts/MainLayout.vue'
import FeedComp from '@/components/FeedComp.vue'
import Famous from '@/components/Famous.vue'
import PopularLang from '@/components/PopularLang.vue'
import { Feed, VoteState } from '@/models/feed'

@Component({
  components: {
    MainLayout,
    FeedComp,
    Famous,
    PopularLang
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
    .trending {
      top: $topOffset;
    }

    .copyright {
      font-size: 0.9rem;
    }
  }
</style>
