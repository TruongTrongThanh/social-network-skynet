<template>
  <form @submit.prevent="()=>{}" class="group-form container-fluid">
    <div class="row">
      <div class="col">
        <div v-show="form.name.length > 0 && !isValidName" class="alert alert-danger">Tên cộng đồng không được dài hơn 50 ký tự!</div>
        <div v-show="form.intro.length > 0 && !isValidIntro" class="alert alert-danger">Giới thiệu chỉ gói gọn dưới 1000 từ!</div>
      </div>
    </div>
    <div class="row">
      <div class="col-8">
        <div class="form-group">
          <label for="name">Tên cộng đồng</label>
          <input
            v-model="form.name"
            type="text"
            class="form-control"
            id="name"
            placeholder="Tên không được quá 50 kí tự..."
          >
        </div>
        <div class="form-group">
          <label for="intro">Lời giới thiệu</label>
          <textarea
            v-model="form.intro"
            class="form-control"
            id="intro"
            placeholder="Lời giới thiệu không được quá 1000 kí tự..."
          >
          </textarea>
        </div>
      </div>
      <div class="col">
        <avatar-upload @image-changed="img => form.avatar = img"/>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="form-group">
          <label for="tags-input">Gắn tag cho cộng đồng</label>
          <tags-input
            :data.sync="form.tags"
            :place-holder="'Số lượng tag bắt buộc từ 1 tới 3...'"
          />
        </div>
        <div class="form-group">
          <label for="description">Mô tả chi tiết về cộng đồng</label>
          <textarea
            v-model="form.description"
            class="form-control"
            id="description"
            placeholder="Cho mọi người hiểu rõ hơn về cộng đồng của bạn!"
            rows="7"
          />
          <LoadingButton
            type="button"
            class="btn-lg btn-block btn-outline-success px-5 mt-4"
            :is-loading="isProcessing"
            :disabled="!isGoodToSubmit"
            @click="submit"
          >
            Thành lập cộng đồng mới!
          </LoadingButton>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import AvatarUpload from '@/components/AvatarUpload.vue'
import TagsInput from '@/components/TagsInput.vue'
import { GroupForm, Group } from '@/models/group'
import { createGroup } from '@/apis/group'
import LoadingButton from '@/components/LoadingButton.vue'
import { Mutation } from 'vuex-class'

@Component({
  components: {
    AvatarUpload,
    TagsInput,
    LoadingButton
  }
})
export default class GroupFormComp extends Vue {
  @Mutation readonly addFollowingGroup!: (g: Group) => void

  form: GroupForm = {
    name: '',
    intro: '',
    description: '',
    tags: [],
    avatar: ''
  }
  isProcessing: boolean = false

  get isValidName(): boolean {
    return this.form.name.length < 50
  }
  get isValidIntro(): boolean {
    return this.form.intro.length < 1000
  }
  get isValidTags(): boolean {
    return this.form.tags.length > 0 && this.form.tags.length < 5
  }
  get isGoodToSubmit(): boolean {
    return this.isValidName && this.isValidIntro && this.isValidTags
  }

  async submit() {
    this.isProcessing = true
    const res = await createGroup(this.form)
    this.isProcessing = false
    this.addFollowingGroup({
      id: res,
      name: this.form.name,
      role: 'admin',
      tags: this.form.tags,
      memberList: []
    })
    this.$router.push({ name: 'group-details', params: { id: res.toString() } })
  }
}
</script>

<style lang="scss">
</style>
