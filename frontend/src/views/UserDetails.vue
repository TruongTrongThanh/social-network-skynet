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
          <LoadingButton
            v-if="isHomeUser"
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
            v-if="isHomeUser"
            class="title py-2 border-bottom"
          >
            Mật khẩu
          </div>
          <input v-if="isEditing && isHomeUser" v-model="userInfo.password" type="password" class="form-control">
          <div v-else-if="isHomeUser">************</div>

          <div v-if="isHomeUser" class="title py-2 mt-1 border-bottom">Địa chỉ email</div>
          <input v-if="isEditing && isHomeUser" v-model="userInfo.email" type="text" class="form-control">
          <div v-else-if="isHomeUser && userInfo.email" class="d-flex align-items-center">
            <div>{{ userInfo.email }}</div>
            <SuccessIcon v-if="authUser.isActivated" class="status-icon text-success ml-1"/>
            <WarningIcon v-else class="status-icon text-danger ml-2"/>
          </div>
          <div v-else-if="isHomeUser" class="text-danger">Bạn chưa thiết lập địa chỉ Email!</div>

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
import { State, Mutation } from 'vuex-class'
import LoadingButton from '@/components/LoadingButton.vue'
import WarningIcon from '@/assets/icons/warning-icon.svg'
import SuccessIcon from '@/assets/icons/success-icon.svg'
import { ModalOptions, ModalResult } from '@/models/modal'
import { AxiosError } from 'axios'

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
  @State readonly modalResult!: ModalResult
  @Mutation readonly triggerModal!: (opts: ModalOptions) => void

  userInfo: User | null = null
  feeds: Feed[] = []
  isEditing: boolean = false
  editLoading: boolean = false
  oldUserJSON: string = ''

  get userIsChanged(): boolean {
    return this.oldUserJSON !== JSON.stringify(this.userInfo)
  }
  get isHomeUser(): boolean {
    return this.userInfo!.id === this.authUser.id
  }

  async created() {
    const userID = this.$route.params.id
    const userPromise = getUserDetails(userID)
    const feedPromise = getUserFeeds(userID)

    const [user, feeds] = await Promise.all([userPromise, feedPromise])
    this.userInfo = user
    this.userInfo!.email = this.authUser.email
    this.feeds = feeds
    this.oldUserJSON = JSON.stringify(this.userInfo)
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
    if (this.isEditing && this.userIsChanged) {
      // Email or password are changed
      if (this.userInfo!.password && this.userInfo!.password !== ''
      || this.userInfo!.email !== this.authUser.email) {
        const updateUserCallback = async (res: ModalResult) => {
          if (res.result === 'ok') {
            this.editLoading = true
            try {
              await updateUser(this.userInfo!, res.content)
              this.editLoading = false
            } catch (err) {
              this.editLoading = false
              const axiosErr: AxiosError<any> = err
              if (axiosErr.response && axiosErr.response.status === 401) {
                this.callUnauthorizedModal()
              } else throw err
            }
          }
          this.isEditing = false
        }
        this.triggerModal({
          title: 'Nhập mật khẩu',
          content: 'Khi thay đổi email hoặc password, bạn cần nhập mật khẩu hiện tại.',
          type: 'danger',
          showPasswordForm: true,
          callback: updateUserCallback
        })
      // Email and password are not changed
      } else {
        this.editLoading = true
        await updateUser(this.userInfo!)
        this.editLoading = false
        this.isEditing = false
      }
    } else {
      this.isEditing = !this.isEditing
    }
  }

  callUnauthorizedModal() {
    // setTimeout de tranh bi trung modal khi loi xay ra o callback modal
    setTimeout(() => {
      this.triggerModal({
        title: 'Mật khẩu không chính xác',
        content: 'Mật khẩu bạn vừa nhập không chính xác, vui lòng thử lại.',
        type: 'danger',
        removeOkButton: true
      })
    }, 500)
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
