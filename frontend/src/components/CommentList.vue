<template>
  <div
    v-if="this.commentList && this.commentList.length > 0"
    class="comment-list px-3 pb-2"
  >
    <transition-group name="comment-list" tag="div">
      <comment-group
        v-for="(cm) in commentList"
        :key="cm.id"
        :data="cm"
      />
    </transition-group>
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
  @Prop({type: Array, default: []}) data!: FeedComment[]

  commentList: FeedComment[] = this.data
}
</script>

<style lang="scss">
.comment-list {
  .comment-list-enter {
    background-color: orange;
  }
  .comment-list-enter-active {
    transition: background-color 5s ease;
  }
  .comment-list-enter-to {
    background-color: none;
  }
}

.no-comment {
  color: gray;
  text-align: center;
}
</style>
