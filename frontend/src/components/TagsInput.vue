<template>
  <div
    class="tags-input form-group"
    @click="$refs.tagInput.focus()"
  >
    <label for="tag-input-id">Gắn tag cho cộng đồng</label>
    <div
      :class="{ 'form-control-focus': focusToggle }"
      class="tag-container form-control"
    >
      <div
        v-for="t in tags"
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
        type="text"
        id="tag-input-id"
        class="tag-input"
        @focus="onFocus"
        @blur="onBlur"
        @keyup.enter="insertToTags"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class TagsInput extends Vue {
  tags: string[] = []
  tag: string = ''
  focusToggle: boolean = false

  insertToTags() {
    if (this.tag.trim() !== '') {
      this.tags.push(this.tag)
      this.$emit('tags-changed', this.tags)
    }
    this.tag = ''
  }
  remove(t: string) {
    const index = this.tags.findIndex(tag => t === tag)
    this.tags.splice(index, 1)
    this.$emit('tags-changed', this.tags)
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
  .tag-container {
    overflow: auto;
    height: 1%;

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
      width: 100px;
    }
    .text-cursor {
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
  }
}
</style>
