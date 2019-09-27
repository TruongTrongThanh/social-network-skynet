<template>
  <div v-if="group" class="group-details container px-0">
    <div class="row">
      <div class="col position-relative">
        <div class="banner"></div>
        <div class="group-title d-flex align-items-center">
          <img :src="group.avatar || require('@/assets/community.png')" class="avatar rounded-circle">
          <h3 class="name ml-2">{{ group.name }}</h3>
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
          <li v-if="isAdminOfGroup(group.id)" class="nav-item">
            <a class="nav-link rounded-0" href="#">Setting</a>
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
          :data="group.description"
        />
        <group-members
          v-show="mode === 2"
          :data="group.memberList"
        />
      </div>
      <div class="group-desc col ml-4 px-3 sticky-top rounded">
        <button type="button"
          :class="[hasJoined ? 'btn-outline-success' : 'btn-success']"
          class="btn btn-block rounded-pill mt-3 mb-2"
          @click="setStatus"
        >
          {{ hasJoined ? 'Rời khỏi nhóm' : 'Tham gia nhóm' }}
        </button>
        <div class="members-title title d-flex justify-content-between py-2 border-bottom">
          <div>Thành viên</div>
          <div class="text-muted">Số lượng: {{ group.memberList.length }}</div>
        </div>
        <div class="d-flex flex-wrap py-3">
          <img
            v-for="(mem, index) in group.memberList" :key="mem.id"
            :src="mem.avatar || require('@/assets/empty-avatar.png')"
            :class="{ 'mr-3': (+index+1) % 5 !== 0 }"
            class="avatar rounded-circle mb-2"
            :title="mem.fullname"
          >
        </div>
        <div class="intro-title title pb-2 border-bottom">
          Giới thiệu
        </div>
        <p class="intro text-wrap py-2">
          {{ group.intro }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Group } from '@/models/group'
import { Feed } from '@/models/feed'
import { getHomeFeeds, getGroupFeeds } from '@/apis/feed'
import FeedList from '@/components/FeedList.vue'
import GroupAbout from '@/components/GroupAbout.vue'
import GroupMembers from '@/components/GroupMembers.vue'
import { getGroupDetails, setGroupMemberStatus } from '@/apis/group'
import { Getter, Mutation, State } from 'vuex-class'
import User from '../models/user'
import { Route } from 'vue-router'
import { NextFunction } from '../models/vue-api'

Component.registerHooks([
  'beforeRouteEnter'
])

enum View {
  FEED = 0,
  ABOUT = 1,
  MEMBER_LIST = 2
}

@Component({
  components: {
    FeedList,
    GroupAbout,
    GroupMembers
  }
})
export default class GroupDetails extends Vue {
  @Getter readonly hasjoinedGroup!: (id: number) => boolean
  @Getter readonly isAdminOfGroup!: (id: number) => boolean
  @Mutation readonly addFollowingGroup!: (g: Group) => void
  @Mutation readonly removeFollowingGroup!: (gid: number) => void

  group: Group | null = null
  feeds: Feed[] = []
  mode: number = View.FEED

  get hasJoined(): boolean {
    return this.hasjoinedGroup(Number(this.$route.params.id))
  }

  dataInit(g: Group, fs: Feed[]) {
    this.group = g
    this.feeds = fs
  }

  async beforeRouteEnter(to: Route, from: Route, next: NextFunction) {
    const groupID = Number(to.params.id)

    const promise1 = getGroupFeeds(groupID)
    const promise2 = getGroupDetails(groupID)

    const [feedsRes, groupRes] = await Promise.all([promise1, promise2])
    next((vm: any) => vm.dataInit(groupRes, feedsRes))

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
}
</script>

<style scoped lang="scss">
$avatar-size: 100px;
$avatar-memberlist-size: 51px;

.group-details {
  .banner {
    width: 100%;
    height: 250px;
    background-color: #bdbdbd;
  }
  
  .group-title {
    position: absolute;
    bottom: 30px;
    left: 35px;

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

  .feed-list-enter {
    background-color: orange;
  }
  .feed-list-enter-active {
    transition: background-color 5s ease;
  }
  .feed-list-enter-to {
    background-color: none;
  }
}
</style>
