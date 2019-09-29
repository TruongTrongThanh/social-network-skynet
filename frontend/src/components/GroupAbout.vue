<template>
  <div class="group-about rounded px-3 py-2">
    <textarea v-model="text" v-if="isEditing" class="form-control"></textarea>
    <div v-else class="text">{{ text }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class GroupAbout extends Vue {
  @Prop({ type: String, default: '' }) data!: string
  @Prop({ type: Boolean, default: false }) isEditing!: boolean

  get text(): string {
    return this.data
  }
  set text(val: string) {
    this.$emit('update:data', val)
  }
}
</script>

<style scoped lang="scss">
.group-about {
  background-color: white;

  .text {
    white-space: pre-line;
  }
}
</style>
