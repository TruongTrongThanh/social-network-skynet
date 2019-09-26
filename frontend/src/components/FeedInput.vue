<template>
  <div class="feed-input rounded">
    <div class="who-where rounded-top px-3 py-2">
      {{ sharedFeed ? 'Chia sẻ bài viết' : 'Đăng bài viết' }}
    </div>
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
              :place-holder="'Gắn tag'"
              :data.sync="form.tags"
              class="form-control-sm"
            />
          </div>
        </div>
      </div>
      <div v-if="sharedFeed" class="row mt-2">
        <div class="col">
          <div class="share-section d-flex p-1 justify-content-center align-items-center rounded">
            <div class="mr-2">Chia sẻ bài đăng từ</div>
            <img
              :src="sharedFeed.originalPoster.avatar || require('@/assets/empty-avatar.png')"
              class="avatar mr-1 rounded-circle"
            >
            <div class="name mr-2 font-weight-bold">{{ sharedFeed.originalPoster.fullname }}</div>
            <div class="mr-2">trong nhóm</div>
            <img
              :src="sharedFeed.group.avatar || require('@/assets/empty-avatar.png')"
              class="avatar mr-1 rounded-circle"
            >
            <div class="name font-weight-bold">{{ sharedFeed.group.name }}</div>
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
            <image-input v-if="!sharedFeed" @image-changed="(img) => form.image = img"/>
            <button class="btn btn-success btn-sm px-4 ml-2" @click="post">
              {{ sharedFeed ? 'Chia sẻ' : 'Đăng bài' }}
            </button>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { postFeed } from '@/apis/feed'
import { Group } from '@/models/group'
import { State } from 'vuex-class'
import TagsInput from '@/components/TagsInput.vue'
import ImageInput from '@/components/FeedImageInput.vue'
import { FeedForm, Feed } from '@/models/feed'
import { getTagsFromGroup } from '@/apis/group'
import User from '@/models/user'

@Component({
  components: {
    TagsInput,
    ImageInput
  }
})
export default class FeedInput extends Vue {
  @Prop({ type: Object }) readonly sharedFeed!: Feed

  @State followingGroups!: Group[]
  @State authUser!: User

  form: FeedForm = {
    content: '',
    image: '',
    groupID: 0,
    tags: [],
    shareFromFeedID: this.sharedFeed ? this.sharedFeed.id : undefined
  }

  @Watch('form.groupID')
  async onFormGroupIDChanged(newVal: number, oldVal: number) {
    if (newVal === 0) return
    const tags = await getTagsFromGroup(newVal)
    Vue.set(this.form, 'tags', tags)
  }

  async post() {
    const res = await postFeed(this.form)
    const feedEntity: Feed = {
      id: res,
      originalPoster: this.authUser,
      content: this.form.content,
      group: this.followingGroups.find(g => g.id === this.form.groupID),
      voteState: null,
      upvote: 0,
      downvote: 0,
      share: 0,
      comment: 0,
      createdAt: new Date().toString(),
      commentList: [],
      tags: this.form.tags
    }
    this.resetForm()
    this.$emit('posted', feedEntity)
  }

  resetForm() {
    const reset = {
      content: '',
      image: '',
      groupID: 0,
      tags: [],
      shareFromFeedID: this.sharedFeed ? this.sharedFeed.id : undefined
    }
    Vue.set(this, 'form', reset)
  }
}
</script>

<style scoped lang="scss">
  .feed-input {
    background-color: white;

    .who-where {
      background-color: #f8f8f8;
    }

    .share-section {
      background-color: #ececec;
      border: 2px dashed #bfbebe;

      .avatar {
        object-fit: cover;
        width: 22px;
        height: 22px;
      }

      .name {
        max-width: 30%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>
