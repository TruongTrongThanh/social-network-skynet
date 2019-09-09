<template>
  <div class="feed-input rounded">
    <div class="who-where rounded-top px-3 py-2">Đăng bài viết</div>
    <div class="p-3 clearfix">
      <textarea v-model="content" class="w-100 border p-2"></textarea>
      <button class="btn btn-success btn-sm px-4 mt-2 float-right" @click="post">Đăng bài</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { postFeed } from '@/apis/feed'

@Component
export default class FeedInput extends Vue {
  content: string = ''

  async post() {
    try {
      postFeed(this.content)
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style scoped lang="scss">
  .feed-input {
    background-color: white;

    .who-where {
      background-color: #f8f8f8;
    }
  }
</style>
