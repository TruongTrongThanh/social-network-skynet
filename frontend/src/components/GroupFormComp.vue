<template>
  <form @submit.prevent="()=>{}" class="group-form container-fluid">
    <div class="row">
      <div class="col-8">
        <div class="form-group">
          <label for="name">Tên cộng đồng</label>
          <input
            v-model="form.name"
            type="text"
            class="form-control"
            id="name"
            placeholder="Tên không được quá 30 kí tự..."
          >
        </div>
        <div class="form-group">
          <label for="intro">Lời giới thiệu</label>
          <textarea
            v-model="form.intro"
            class="form-control"
            id="intro"
            placeholder="Lời giới thiệu không được quá 100 kí tự..."
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
          <button type="button" class="btn btn-lg btn-block btn-outline-success px-5 mt-4" @click="submit">
            Thành lập cộng đồng mới!
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import AvatarUpload from '@/components/AvatarUpload.vue'
import TagsInput from '@/components/TagsInput.vue'
import { GroupForm } from '@/models/group'
import { createGroup } from '@/apis/group'

@Component({
  components: {
    AvatarUpload,
    TagsInput
  }
})
export default class GroupFormComp extends Vue {
  form: GroupForm = {
    name: '',
    intro: '',
    description: '',
    tags: [],
    avatar: ''
  }

  async submit() {
    const res = await createGroup(this.form)
    console.log(res)
    this.$router.push({ name: 'group-details', params: { id: res.toString() } })
  }
}
</script>

<style lang="scss">
</style>
