<template>
  <div class="simple-layout">
    <slot/>
    <Copyright class="fixed-bottom text-center mb-2"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Copyright from '@/components/Copyright.vue'

@Component({
  components: {
    Copyright
  }
})
export default class SimpleLayout extends Vue {
  mounted() {
    document.body.style.backgroundColor = '#eaeaea'
  }
}
</script>

<style scoped lang="scss">
</style>
