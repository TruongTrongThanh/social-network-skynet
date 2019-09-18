<template>
  <div
    v-if="this.commentList && this.commentList.length > 0"
    class="comment-list px-3 pb-2"
  >
    <div
      v-for="cm in commentList"
      :key="cm.id"
      class="mb-4"
    >
      <comment-group
        :data="cm"
      />
    </div>
  </div>
  <div v-else class="no-comment my-4">There is no comment(s) :(</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { FeedComment } from '@/models/feed'
import CommentGroup from '@/components/CommentGroup.vue'
import socketIO from '@/apis/socket'

@Component({
  components: {
    CommentGroup
  }
})
export default class CommentList extends Vue {
  @Prop({type: Number, required: true}) feedId!: number
  @Prop({type: Array}) init!: FeedComment[]

  commentList: FeedComment[] = this.init
}
</script>

<style scoped lang="scss">
  .no-comment {
    color: gray;
    text-align: center;
  }
</style>
