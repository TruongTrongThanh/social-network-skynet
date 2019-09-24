<template>
  <div class="feed-image-input d-flex align-items-center">
    <div
      v-if="!imgFile"
      class="rect mr-1"
    />
    <div v-else class="position-relative mr-1">
      <img
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
        :src="imgFile"
        class="small-img"
      >
      <img v-show="isHover" :src="imgFile" class="hover-img">
    </div>
    <button
      class="btn btn-primary btn-sm px-3"
      @click="$refs.fileInput.click()"
    >
      Ảnh
    </button>
    <input ref="fileInput" type='file' accept=".png, .jpg, .jpeg" class="d-none" @change="readFile($event)"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class FeedImageInput extends Vue {
  imgFile: string = ''
  isHover: boolean = false

  readFile(event: any) {
    const input: any = event.target
    if (input.files && input.files[0]) {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        this.imgFile = e.target.result
        this.$emit('image-changed', e.target.result)
      }
      reader.readAsDataURL(input.files[0])
    }
  }
}
</script>

<style scoped lang="scss">
.rect {
  border: 3px dashed gray;
  width: 29px;
  height: 29px;
}
.small-img {
  width: 29px;
  height: 29px;
  object-fit: cover;
}
.hover-img {
  top: 10px;
  left: -500px;
  position: absolute;
  width: 500px;
  z-index: 1021;
}
</style>
