<template>
  <div class="feed-input rounded">
    <div class="who-where rounded-top px-3 py-2">Đăng bài viết</div>
    <div class="p-3 container-fluid">
      <div class="row">
        <div class="col">
          <textarea v-model="form.content" class="form-control w-100 border p-2"></textarea>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col">
          <div>
            <tags-input
              class="form-control-sm"
              :place-holder="'Gắn tag'"
              @tags-changed="(tags) => form.tags = tags"
            />
          </div>
        </div>
      </div>
      <div class="row align-items-center mt-2">
        <div class="col">
          <div class="d-flex align-items-center">
            <img :src="require('@/assets/icons/group-btn-icon.png')" width="40">
            <select v-model="form.groupID" class="form-control form-control-sm ml-2">
              <option
                v-for="g in followingGroups"
                :key="g.id"
                :value="g.id"
                v-text="g.name"
              />
            </select>
          </div>
        </div>
        <div class="col">
          <div class="d-flex justify-content-end">
            <image-input @image-changed="(img) => form.image = img"/>
            <button class="btn btn-success btn-sm px-4 ml-2" @click="post">Đăng bài</button>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { postFeed } from '@/apis/feed'
import { Group } from '@/models/group'
import { State } from 'vuex-class'
import TagsInput from '@/components/TagsInput.vue'
import ImageInput from '@/components/FeedImageInput.vue'
import { FeedForm } from '@/models/feed'

@Component({
  components: {
    TagsInput,
    ImageInput
  }
})
export default class FeedInput extends Vue {
  @State followingGroups!: Group[]

  form: FeedForm = {
    content: '',
    image: '',
    groupID: 0,
    tags: []
  }

  async post() {
    const res = await postFeed(this.form)
    console.log(res)
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
