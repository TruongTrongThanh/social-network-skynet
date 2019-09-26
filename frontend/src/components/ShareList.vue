<template>
  <ul class="share-list list-unstyled">
    <router-link
      v-for="feed in feeds"
      :key="feed.id"
      :to="{ name: 'feed', params: { id: feed.id } }"
      tag="li"
      class="share-comp d-flex align-items-center p-2 rounded clickable"
    >
      <img :src="feed.originalPoster.avatar || require('@/assets/empty-avatar.png')" class="avatar rounded-circle mr-1">
      <div class="mr-2">{{ feed.originalPoster.fullname }}</div>
      <div class="cross-symbol mr-2">&#10541;</div>
      <img :src="feed.group.avatar || require('@/assets/icons/group-btn-icon.png')" class="avatar rounded-circle mr-1">
      <div>{{ feed.group.name }}</div>
    </router-link>
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getShareFeeds } from '@/apis/feed'
import { Feed } from '@/models/feed'

@Component
export default class ShareList extends Vue {
  @Prop({ type: Number, required: true }) readonly feedId!: number
  feeds: Feed[] = []

  async created() {
    this.feeds = await getShareFeeds(this.feedId)
  }
}
</script>

<style scoped lang="scss">
.share-list {
  .share-comp {
    .avatar {
      width: 30px;
      height: 30px;
    }
    .cross-symbol {
      font-size: 34px;
      line-height: 30px;
      position: relative;
      top: -2px;
      color: gray;
    }

    &:hover {
      background-color: #eee;
    }
  }

}
</style>
