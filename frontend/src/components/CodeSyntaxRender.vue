<template>
  <div ref="content" class="code-syntax-render" v-html="content"/>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import highlight from 'highlight.js'

@Component
export default class CodeSyntaxRender extends Vue {
  @Prop({ type: String, required: true }) data!: string

  content: string = ''

  created() {
    this.content = this.data.replace(/<code>/g, '<pre><code>').replace(/<\/code>/g, '</code></pre>')
  }

  mounted() {
    document.querySelectorAll('pre code').forEach(block => {
      highlight.highlightBlock(block)
    })
  }
}
</script>

<style scoped lang="scss">
</style>
