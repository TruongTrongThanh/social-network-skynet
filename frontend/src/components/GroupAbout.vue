<template>
  <div class="group-about rounded px-3 py-2">
    <div>{{ data }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class GroupAbout extends Vue {
  @Prop({ type: String, default: '' }) data!: string
}
</script>

<style scoped lang="scss">
.group-about {
  background-color: white;
}
</style>
