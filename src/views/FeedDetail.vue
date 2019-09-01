<template>
  <div class="feed-detail container">
    <div class="row">
      <div class="col-8">
        <feed-comp :init="sampleFeed"/>
        <comment-input class="mt-3"/>
        <comment-list class="mt-3"/>
      </div>
      <div class="col ml-3">This is post liên quan</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Feed, VoteState } from '@/models/feed'
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
</style>
