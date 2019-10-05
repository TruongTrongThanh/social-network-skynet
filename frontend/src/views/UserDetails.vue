<template>
  <div class="user-details container">
    <div class="row no-gutters justify-content-between align-items-start">
      <div class="col-8">
        <FeedList
          :has-feed-input="false"
          :data="feeds"
        />
      </div>
      <div v-if="userInfo" class="user-section col-4 px-3 sticky-top rounded">
        <div class="stats p-3 rounded">
          <div class="d-flex align-items-center">
            <div class="avatar-container position-relative">
              <img :src="userInfo.avatar || require('@/assets/empty-avatar.png')" class="avatar rounded-circle"> 
              <span
                v-if="isEditing"
                class="image-edit-icon shadow clickable"
                @click="$refs.bannerInput.click()"
              >
                &#61504;
              </span>
              <input
                v-if="isEditing"
                ref="bannerInput"
                class="d-none"
                type="file"
                accept=".png, .jpg, .jpeg"
                @change="avatarChanged($event)"
              >
            </div>
            <input v-if="isEditing" v-model="userInfo.fullname" type="text" class="form-control ml-2">
            <h5 v-else class="ml-2 font-weight-bold">{{ userInfo.fullname }}</h5>
          </div>
          <hr>
          <div class="d-flex justify-content-around mb-3">
            <div class="feed-count text-center">
              <h3 class="mb-0">{{ userInfo.feedCount }}</h3>
              <div>Bài đăng</div>
            </div>
            <div class="comment-count text-center">
              <h3 class="mb-0">{{ userInfo.cmtCount }}</h3>
              <div>Bình luận</div>
            </div>
          </div>
          <button v-if="userInfo.id !== authUser.id" class="btn btn-success btn-block">Theo dõi</button>
          <LoadingButton
            v-else
            :class="[isEditing ? 'btn-primary' : 'btn-outline-primary']"
            :is-loading="editLoading"
            class="btn-block rounded-pill mt-3 mb-2"
            @click="editClicked"
          >
            {{ isEditing ? 'Lưu lại' : 'Chỉnh sửa thông tin' }}
          </LoadingButton>
        </div>
        <div class="info p-3 mt-3 rounded">
          <div
            v-if="userInfo.id === authUser.id"
            class="title py-2 border-bottom d-flex justify-content-between"
          >
            <div>Mật khẩu</div>
            <div class="text-muted">Thay đổi</div>
          </div>
          <div v-if="userInfo.id === authUser.id">************</div>

          <div class="title py-2 mt-1 border-bottom">Địa chỉ email</div>
          <input v-if="isEditing" v-model="authUser.email" type="text" class="form-control">
          <div v-else-if="authUser.email" class="d-flex align-items-center">
            <div>{{ authUser.email }}</div>
            <SuccessIcon v-if="authUser.isActivated" class="status-icon text-success ml-1"/>
            <WarningIcon v-else class="status-icon text-danger ml-2"/>
          </div>
          <div v-else class="text-danger">Bạn chưa thiết lập địa chỉ Email!</div>

          <div class="title py-2 mt-1 border-bottom">Nghề nghiệp</div>
          <input v-if="isEditing" v-model="userInfo.position" type="text" class="form-control">
          <div v-else>{{ userInfo.position }}</div>

          <div class="title py-2 mt-1 border-bottom">Ngày tham gia</div>
          <div>{{ userJoinDate }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import FeedList from '@/components/FeedList.vue'
import { getUserDetails } from '@/apis/user'
import User from '@/models/user'
import { Feed } from '@/models/feed'
import { getUserFeeds } from '@/apis/feed'
import { updateUser } from '@/apis/user'
import { State } from 'vuex-class'
import LoadingButton from '@/components/LoadingButton.vue'
import WarningIcon from '@/assets/icons/warning-icon.svg'
import SuccessIcon from '@/assets/icons/success-icon.svg'

@Component({
  components: {
    FeedList,
    LoadingButton,
    WarningIcon,
    SuccessIcon
  }
})
export default class UserDetails extends Vue {
  @State readonly authUser!: User

  userInfo: User | null = null
  feeds: Feed[] = []
  isEditing: boolean = false
  editLoading: boolean = false

  async created() {
    const userID = this.$route.params.id
    const userPromise = getUserDetails(userID)
    const feedPromise = getUserFeeds(userID)

    const [user, feeds] = await Promise.all([userPromise, feedPromise])
    this.userInfo = user
    this.feeds = feeds
  }

  get userJoinDate(): string {
    const date =  new Date(this.userInfo!.createdAt!)
    return Intl.DateTimeFormat('vi', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  async editClicked() {
    if (this.isEditing) {
      this.editLoading = true
      try {
        this.userInfo!.email = this.authUser.email
        await updateUser(this.userInfo!)
      } catch (err) {
        this.editLoading = false
        throw err
      }
    }
    this.editLoading = false
    this.isEditing = !this.isEditing
  }

  avatarChanged(event: any) {
    this.preview(event, e => {
      this.userInfo!.avatar = e.target.result
    })
  }

  preview(event: any, callback: (e: any) => void) {
    const input: any = event.target
    if (input.files && input.files[0]) {
      const reader = new FileReader()
      reader.onload = callback
      reader.readAsDataURL(input.files[0])
    }
  }
}
</script>

<style scoped lang="scss">
@import url('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

.user-details {
  .status-icon {
    width: 20px;
    height: 20px;
  }

  .image-edit-icon {
    font-family: 'FontAwesome';
    color: #757575;
    position: absolute;
    background-color: white;
    border-radius: 50%;
    padding-right: 7px;
    padding-left: 7px;
    padding-top: 2px;
    padding-bottom: 2px;
    top: -14px;
    right: -16px;

    &:hover {
      color: black;
      background-color: #ececec;
    }
  }

  .user-section {
    top: $topOffset;

    .stats {
      background-color: white;
      .avatar {
        width: 60px;
        height: 60px;
        object-fit: cover;
      }
    }
    .info {
      background-color: white;

      .title {
        color: #5ca073;
      }
    }
  }
}
</style>
