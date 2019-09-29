<template>
  <div class="feed-list">
    <div v-if="(groupId !== 0 && !hasJoined)"
      class="alert alert-danger"
    >
      Bạn cần tham gia cộng đồng để có thể đăng bài viết!
    </div>
    <feed-input
      v-else-if="hasFeedInput"
      :group-id="groupId"
      class="mb-3"
      @posted="updateFeedList"
    />
    <transition-group v-if="data.length > 0" name="feed-list" tag="div">
      <feed-comp
        v-for="feed in data"
        :key="feed.id"
        :data="feed"
        :is-scale-down="true"
        :has-group-info="groupId === 0 ? true : false"
        class="px-3 mb-3 clickable raise-border"
        @click="setClickedFeedByID(feed.id)"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Feed } from '@/models/feed'
import { Mutation, Action, Getter } from 'vuex-class'
import FeedInput from '@/components/FeedInput.vue'
import FeedComp from '@/components/FeedComp.vue'

@Component({
  components: {
    FeedInput,
    FeedComp
  }
})
export default class FeedList extends Vue {
  @Prop({ type: Array, default: [] }) readonly data!: Feed[]
  @Prop({ type: Boolean, default: true }) readonly hasFeedInput!: boolean
  @Prop({ type: Number, default: 0 }) readonly groupId!: number

  @Getter readonly hasjoinedGroup!: (id: number) => boolean
  @Action readonly setClickedFeedByID!: (id: number) => void

  get hasJoined(): boolean {
    return this.hasjoinedGroup(this.groupId)
  }

  updateFeedList(f: Feed) {
    const fs = Array.from(this.data)
    fs.unshift(f)
    this.$emit('update:data', fs)
  }
}
</script>

<style scoped lang="scss">
.feed-list-enter {
  background-color: orange;
}
.feed-list-enter-active {
  transition: background-color 5s ease;
}
.feed-list-enter-to {
  background-color: none;
}
.raise-border:hover {
  border: 1px solid #979797;
}
</style>
