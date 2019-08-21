<template>
  <main-layout>
    <div class="home">
      <div class="row justify-content-center">
        <div class="feed-list col-md-6 mr-5">
          <Feed
            avatar="https://www.w3schools.com/howto/img_avatar.png"
            original-poster="Thanh2111"
            content="this is content feed..."
            :initVoteState="1"
            :upvote="51"
            :downvote="20"
            :share="10"
          />
        </div>
        <div class="other col-md-3">this is notif, action,...</div>
      </div>
    </div>
  </main-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MainLayout from '@/layouts/MainLayout.vue'
import Feed from '@/components/Feed.vue'

@Component({
  components: {
    MainLayout,
    Feed
  }
})
export default class Home extends Vue {
  mounted() {
    document.body.style.backgroundColor = '#eaeaea'
  }
}
</script>

<style scoped lang="scss">
.home {
  margin-top: 80px;

  .other {
    background-color: green;
  }
}
</style>
