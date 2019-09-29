<template>
  <div v-if="group" class="group-details container px-0">
    <div class="row">
      <div class="col position-relative">
        <div
          :style="{ 'background-image': `url(${group.banner || defaultBanner})` }"
          class="banner"
        >
          <span
            v-if="isEditing"
            class="image-edit-icon banner-edit clickable"
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
            @change="bannerChanged($event)"
          >
        </div>
        <div class="group-title d-flex align-items-center">
          <div>
            <img
              :src="group.avatar || require('@/assets/community.png')"
              class="avatar rounded-circle"
            >
            <span
              v-if="isEditing"
              class="image-edit-icon avatar-edit clickable"
              @click="$refs.avatarInput.click()"
            >
              &#61504;
            </span>
            <input
              v-if="isEditing"
              ref="avatarInput"
              class="d-none"
              type="file"
              accept=".png, .jpg, .jpeg"
              @change="avatarChanged($event)"
            >
          </div>
          <h3 v-if="!nameInputToggle" class="name ml-2 mb-0 font-weight-bold">{{ group.name }}</h3>
          <input
            v-else
            v-model="group.name"
            ref="nameInput"
            class="form-control ml-3 w-50"
            type="text"
          >
          <button
            v-if="isEditing" class="btn btn-light btn-sm border border-dark ml-2"
            @click="nameInputToggle = !nameInputToggle"
            v-text="nameInputToggle ? 'Xong' : 'Sửa'"
          />
        </div>
      </div>
    </div>
    <div class="row no-gutters">
      <div class="col">
        <ul class="group-tabs nav nav-pills">
          <li class="nav-item">
            <a
              :class="{ 'active': mode === 0 }"
              class="nav-link rounded-0"
              href="#"
              @click="mode = 0"
            >
              Feeds
            </a>
          </li>
          <li class="nav-item">
            <a
              :class="{ 'active': mode === 1 }"
              class="nav-link rounded-0"
              href="#"
              @click="mode = 1"
            >
              About
            </a>
          </li>
          <li class="nav-item">
            <a
              :class="{ 'active': mode === 2 }"
              class="nav-link rounded-0"
              href="#"
              @click="mode = 2"
            >
              Members
            </a>
          </li>
        </ul>
      </div>
      <div class="col">
        <ul class="group-tabs nav nav-pills justify-content-end">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle rounded-0"
              data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"
            >
              Notifcation
            </a>
            <div class="dropdown-menu dropdown-menu-right">
              <a class="dropdown-item d-flex justify-content-between" href="#">
                <div class="font-weight-bold">Always</div>
                <div>&#10070;</div>
              </a>
              <a class="dropdown-item" href="#">Never</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="row no-gutters justify-content-between align-items-start mt-3">
      <div class="col-8">
        <feed-list
          v-show="mode === 0"
          :data.sync="feeds"
          :group-id="Number($route.params.id)"
        />
        <group-about
          v-show="mode === 1"
          :data.sync="group.description"
          :is-editing="isEditing"
        />
        <group-members
          v-show="mode === 2"
          :data="group.memberList"
        />
      </div>
      <div class="group-desc col ml-4 px-3 sticky-top rounded">
        <button
          v-if="!isAdminOfGroup(group.id)"
          type="button"
          :class="[hasJoined ? 'btn-outline-success' : 'btn-success']"
          class="btn btn-block rounded-pill mt-3 mb-2"
          @click="setStatus"
        >
          {{ hasJoined ? 'Rời khỏi nhóm' : 'Tham gia nhóm' }}
        </button>
        <button
          v-else
          :class="[isEditing ? 'btn-primary' : 'btn-outline-primary']"
          class="btn btn-block rounded-pill mt-3 mb-2"
          @click="editClicked"
        >
          {{ isEditing ? 'Lưu lại' : 'Chỉnh sửa thông tin' }}
        </button>
        <div class="members-title title d-flex justify-content-between py-2 border-bottom">
          <div>Thành viên</div>
          <div class="text-muted">Số lượng: {{ group.memberList.length }}</div>
        </div>
        <div class="d-flex flex-wrap pt-3 pb-2">
          <img
            v-for="(mem, index) in group.memberList" :key="mem.id"
            :src="mem.avatar || require('@/assets/empty-avatar.png')"
            :class="{ 'mr-3': (+index+1) % 5 !== 0 }"
            class="avatar rounded-circle mb-2"
            :title="mem.fullname"
          >
        </div>
        <div class="tags title pb-2 border-bottom">
          Chủ đề
        </div>
        <div class="tag-list my-2">
          <tags-input
            v-if="isEditing"
            :data.sync="group.tags"
            class="form-control-sm"
          />
          <h5
            v-else
            v-for="tag in group.tags"
            :key="tag"
            class="d-inline-block"
          >
            <span class="badge badge-pill badge-primary mr-1">{{ tag }}</span>
          </h5>
        </div>
        <div class="intro-title title pb-2 border-bottom">
          Giới thiệu
        </div>
        <textarea v-if="isEditing" v-model="group.intro" class="form-control my-3"></textarea>
        <p v-else class="intro text-wrap py-2">
          {{ group.intro }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Group, GroupForm } from '@/models/group'
import { Feed } from '@/models/feed'
import { getHomeFeeds, getGroupFeeds } from '@/apis/feed'
import FeedList from '@/components/FeedList.vue'
import GroupAbout from '@/components/GroupAbout.vue'
import GroupMembers from '@/components/GroupMembers.vue'
import { getGroupDetails, setGroupMemberStatus, updateGroup } from '@/apis/group'
import { Getter, Mutation, State } from 'vuex-class'
import User from '@/models/user'
import { Route } from 'vue-router'
import { NextFunction } from '@/models/vue-api'
import TagsInput from '@/components/TagsInput.vue'

enum View {
  FEED = 0,
  ABOUT = 1,
  MEMBER_LIST = 2
}

function dataInit(groupID: number): Promise<[Feed[], Group]> {
  const promise1 = getGroupFeeds(groupID)
  const promise2 = getGroupDetails(groupID)
  return Promise.all([promise1, promise2])
}

@Component({
  components: {
    FeedList,
    GroupAbout,
    GroupMembers,
    TagsInput
  }
})
export default class GroupDetails extends Vue {
  @Getter readonly hasjoinedGroup!: (id: number) => boolean
  @Getter readonly isAdminOfGroup!: (id: number) => boolean
  @Mutation readonly addFollowingGroup!: (g: Group) => void
  @Mutation readonly removeFollowingGroup!: (gid: number) => void

  group: Group | null = null
  oldGroupJSON: string = ''
  feeds: Feed[] = []
  mode: number = View.FEED
  isEditing: boolean = false
  nameInputToggle: boolean = false

  async created() {
    const groupID = Number(this.$route.params.id)
    const feedPromise = getGroupFeeds(groupID)
    const groupPromise = getGroupDetails(groupID)
    const [feeds, group] = await Promise.all([feedPromise, groupPromise])
    this.feeds = feeds
    this.group = group
    this.oldGroupJSON = JSON.stringify(this.group)
  }

  get hasJoined(): boolean {
    return this.hasjoinedGroup(Number(this.$route.params.id))
  }

  get defaultBanner(): string {
    return 'https://i0.wp.com/ericasadun.com/wp-content/uploads/2013/04/f.png?ssl=1'
  }

  updateFeedList(f: Feed) {
    this.feeds.unshift(f)
  }

  setStatus() {
    const type = this.hasJoined ? 'leave' : 'join'
    if (type === 'join') {
      this.addFollowingGroup(this.group!)
    } else {
      this.removeFollowingGroup(this.group!.id)
    }
    setGroupMemberStatus(this.group!.id, type)
  }

  async editClicked() {
    if (this.isEditing) {
      if (this.oldGroupJSON !== JSON.stringify(this.group)) {
        await updateGroup(this.group as GroupForm)
      }
      this.nameInputToggle = false
    }
    this.isEditing = !this.isEditing
  }

  nameInputToggleClicked() {
    this.nameInputToggle = !this.nameInputToggle;
    (this.$refs.nameInput as any).focus()
  }

  avatarChanged(event: any) {
    this.preview(event, e => {
      this.group!.avatar = e.target.result
    })
  }

  bannerChanged(event: any) {
    this.preview(event, e => {
      this.group!.banner = e.target.result
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

$avatar-size: 100px;
$avatar-memberlist-size: 51px;

.group-details {
  .banner {
    width: 100%;
    height: 250px;
    background-position: center;
  }

  .name {
    color: white;
    text-shadow: 4px 3px 0 #7A7A7A;
  }
  
  .group-title {
    position: absolute;
    bottom: 30px;
    left: 35px;
    width: 90%;

    .avatar {
      width: $avatar-size;
      height: $avatar-size;
      border: 5px solid white;
    }
  }

  .dropdown-menu {
    z-index: 1022;
  }

  .group-tabs {
    background-color: white;

    .nav-item:hover {
      background-color: #edeff9;
    }
  }

  .group-desc {
    background-color: white;
    top: $topOffset;

    .avatar {
      width: $avatar-memberlist-size;
      height: $avatar-memberlist-size;
    }
  }

  .title {
    color: #5ca073;
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

    &.avatar-edit {
      left: 91px;
    }

    &.banner-edit {
      right: 20px;
      top: 7px;
    }

    &:hover {
      color: black;
      background-color: #ececec;
    }
  }
}
</style>
