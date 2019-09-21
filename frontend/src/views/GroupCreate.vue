<template>
  <div class="group-create container p-5 mb-3 rounded">
    <div class="text-center">
      <img class="mb-4" :src="require('@/assets/community.png')" width="200">
    </div>
    <hr>
    <group-form-comp/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import GroupFormComp from '@/components/GroupFormComp.vue'

@Component({
  components: {
    GroupFormComp
  }
})
export default class GroupCreate extends Vue {}
</script>

<style scoped lang="scss">
  .group-create {
    background-color: white;

    .title {
      text-align: center;
    }
    
  }
</style>
