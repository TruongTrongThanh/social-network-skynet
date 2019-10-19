<template>
  <div class="popular-tags">
    <div class="title font-weight-bold px-2 py-3">Popular Tags</div>
    <ul class="list-group list-group-flush">
      <li
        v-for="(tag, index) in tags"
        :key="tag.name"
        class="list-group-item list-group-item-action clickable"
      >
        <span>{{ tag.name }}</span>
        <span class="float-right">
          <span class="order mr-2 font-weight-bold">{{ index + 1 }}</span>
          <span class="arrow">&#8599;</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getPopularFeedTags } from '@/apis/feed'
import { Tag } from '@/models/tag'

@Component
export default class PopularTags extends Vue {
  tags: Tag[] = []
  async created() {
    this.tags = await getPopularFeedTags()
  }
}
</script>

<style scoped lang="scss">
  .popular-tags {
    .title {
      font-size: 1.3em;
      color: #747474;
      background-color: #e7ffe7;
    }

    .arrow {
      color: #02de02;
      font-size: 1.2rem;
    }
  }
</style>
