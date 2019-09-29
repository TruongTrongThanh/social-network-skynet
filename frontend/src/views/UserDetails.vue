<template>
  <div class="user-details container">
    <div class="row no-gutters justify-content-between align-items-start">
      <div class="col-8">
        <FeedList
          :has-feed-input="false"
          :data="feeds"
        />
      </div>
      <div v-if="userInfo" class="user-section col-4 px-3 sticky-top rounded">
        <div class="info p-3 rounded">
          <div class="d-flex align-items-center">
            <img :src="userInfo.avatar || require('@/assets/empty-avatar.png')" class="avatar rounded-circle"> 
            <div class="ml-2 font-weight-bold">{{ userInfo.fullname }}</div>
          </div>
          <hr>
          <div class="d-flex justify-content-around mb-3">
            <div class="feed-count text-center">
              <h3 class="mb-0">{{ userInfo.feedCount }}</h3>
              <div>Bài đăng</div>
            </div>
            <div class="comment-count text-center">
              <h3 class="mb-0">{{ userInfo.cmtCount }}</h3>
              <div>Bình luận</div>
            </div>
          </div>
          <button class="btn btn-success btn-block">Theo dõi</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import FeedList from '@/components/FeedList.vue'
import { getUserDetails } from '@/apis/user'
import User from '@/models/user'
import { Feed } from '../models/feed'
import { getUserFeeds } from '../apis/feed'

@Component({
  components: {
    FeedList
  }
})
export default class UserDetails extends Vue {
  userInfo: User | null = null
  feeds: Feed[] = []

  async created() {
    const userID = this.$route.params.id
    const userPromise = getUserDetails(userID)
    const feedPromise = getUserFeeds(userID)

    const [user, feeds] = await Promise.all([userPromise, feedPromise])
    this.userInfo = user
    this.feeds = feeds
  }
}
</script>

<style scoped lang="scss">
.user-details {
  .user-section {
    top: $topOffset;

    .info {
      background-color: white;
      .avatar {
        width: 60px;
        height: 60px;
      }
    }
  }
}
</style>
