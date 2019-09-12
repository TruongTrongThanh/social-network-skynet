<template>
  <div class="feed-detail container">
    <div class="row">
      <div class="col-8 feed-wrapper rounded">
        <feed-comp :init="sampleFeed"/>
        <comment-input class="mt-3"/>
        <hr class="mt-4">
        <comment-list/>
      </div>
      <div class="col ml-3">This is post liên quan</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Feed } from '@/models/feed'
import FeedComp from '@/components/FeedComp.vue'
import CommentInput from '@/components/CommentInput.vue'
import CommentList from '@/components/CommentList.vue'

@Component({
  components: {
    FeedComp,
    CommentInput,
    CommentList
  }
})
export default class FeedDetail extends Vue {
  sampleFeed: Feed = {
    id: 0,
    originalPoster: {
      id: 'thanhtt21',
      fullname: 'Trương Trọng Thanh',
      avatar: 'https://www.w3schools.com/howto/img_avatar.png'
    },
    content: 'this is content feed...',
    voteState: true,
    upvote: 50,
    downvote: 21,
    share: 20,
    comment: 5,
    createdAt: new Date(2019, 7, 22, 12, 20, 33).toString()
  }
}
</script>

<style scoped lang="scss">
  .feed-wrapper {
    background-color: white;
  }
  .offset {
    position: relative;
    bottom: 2px;
  }
</style>
