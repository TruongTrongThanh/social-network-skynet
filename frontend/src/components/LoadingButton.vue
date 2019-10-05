<template>
  <button class="loading-button btn" @click="$emit('click')">
    <div v-if="isLoading" class="spinner-border text-light" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <div v-else><slot/></div>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class LoadingButton extends Vue {
  @Prop({ type: Boolean, required: true }) isLoading!: boolean
}
</script>

<style scoped lang="scss">
</style>
