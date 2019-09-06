<template>
  <div class="famous rounded">
    <div class="row no-gutters text-center">
      <div
        :class="{ active: tabClick === 0 }"
        class="tab people col-6 px-2 py-3 font-weight-bold clickable"
        @click="tabClick = 0"
      >
        People
      </div>
      <div
        :class="{ active: tabClick === 1 }"
        class="tab group col-6 px-2 py-3 font-weight-bold clickable"
        @click="tabClick = 1"
      >
        Group
      </div>
    </div>
    <famous-people v-show="tabClick === 0"/>
    <famous-group v-show="tabClick === 1"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import FamousPeople from '@/components/FamousPeople.vue'
import FamousGroup from '@/components/FamousGroup.vue'

@Component({
  components: {
    FamousPeople,
    FamousGroup
  }
})
export default class Famous extends Vue {
  tabClick: number = 0
}
</script>

<style scoped lang="scss">
  .famous {
    background-color: white;

    .tab {
      color: gray;
      background-color: whitesmoke;

      &.active {
        color: #31498d;
        background-color: rgba(115, 139, 249, 0.13);
      }

      &.people {
        border-top-left-radius: .25rem;
        border-right: 1px solid rgba(0,0,0,.125);
      }

      &.group {
        border-top-right-radius: .25rem;
      }
    }
  }
</style>
