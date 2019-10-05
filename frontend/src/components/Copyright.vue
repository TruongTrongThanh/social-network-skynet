<template>
  <div class="copyright text-muted">&copy; {{ new Date().getFullYear() }} Skynet, Open University. All rights reserved</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Copyright extends Vue {}
</script>

<style scoped lang="scss">
.copyright {
  font-size: 0.9rem;
}
</style>
