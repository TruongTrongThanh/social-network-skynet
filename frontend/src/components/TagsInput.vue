<template>
  <div
    :class="{ 'form-control-focus': focusToggle }"
    class="tags-input form-control text-cursor"
    @click="$refs.tagInput.focus()"
  >
    <div
      v-for="t in data"
      :key="t"
      class="tag d-inline-flex align-items-center mr-1"
    >
      <span class="text px-2 rounded-left">{{ t }}</span>
      <button type="button" class="close-btn close px-1 rounded-right" @click="remove(t)">
        <span class="x-text">&times;</span>
      </button>
    </div>
    <input
      ref="tagInput"
      v-model="tag"
      :placeholder="data.length === 0 ? placeHolder : ''"
      type="text"
      id="tags-input"
      class="tag-input"
      @focus="onFocus"
      @blur="onBlur"
      @keyup.enter="insertToTags"
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class TagsInput extends Vue {
  @Prop({ type: Array, required: true }) readonly data!: string[]
  @Prop({ type: String }) placeHolder!: string

  tags: string[] = this.data
  tag: string = ''
  focusToggle: boolean = false

  @Watch('data')
  onDataChanged(newVal: string[], oldVal: string[]) {
    this.tags = this.data
  }

  insertToTags() {
    if (this.tag.trim() !== '') {
      this.tags.push(this.tag)
      this.$emit('update:data', this.tags)
    }
    this.tag = ''
  }

  remove(t: string) {
    const index = this.data.findIndex(tag => t === tag)
    this.tags.splice(index, 1)
    this.$emit('update:data', this.tags)
  }

  onFocus() {
    this.focusToggle = true
  }

  onBlur() {
    this.focusToggle = false
  }
}
</script>

<style scoped lang="scss">
.tags-input {
  overflow: auto;
  height: 1%;

  &.text-cursor {
    cursor: text;
  }
  &.form-control-focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    -webkit-box-shadow: 0 0 0 .2rem rgba(0,123,255,.25);
    box-shadow: 0 0 0 .2rem rgba(0,123,255,.25);
  }

  .tag {
    position: relative;
    top: -1px;

    .text {
      background-color: #b2b6f6;
      font-size: 14px;
    }

    .close-btn {
      background-color: #b2b6f6;
      font-size: 21px;

      .x-text {
        position: relative;
        top: -1px;
        padding: 2px;
      }
    }
  }

  .tag-input {
    background: none;
    border: none;
    width: 250px;
  }
}
</style>
