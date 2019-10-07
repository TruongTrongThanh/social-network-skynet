<template>
  <div id="app">
    <router-view/>
    <Modal/>
    <button ref="alertTrigger" type="button" class="d-none" data-toggle="modal" data-target="#alertModal"></button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import Modal from '@/components/Modal.vue'
import { State, Mutation } from 'vuex-class'
import { ModalOptions } from '@/models/modal'

@Component({
  components: {
    Modal
  }
})
export default class App extends Vue {
  @State readonly modalTrigger!: boolean
  @Mutation readonly triggerModal!: (opts: ModalOptions) => void

  @Watch('modalTrigger')
  showModal(newVal: boolean, oldVal: boolean) {
    console.log('trigger show-modal');
    (this.$refs.alertTrigger as HTMLElement).click()
  }
}
</script>

<style lang="scss">
.clickable {
  cursor: pointer;
}

.raise-border:hover {
  border: 1px solid #979797;
}

.raise-color:hover {
  background-color: #d3fde5;
}

textarea {
  border: 0;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}

.link-unstyled {
  &,
  &:visited,
  &:hover,
  &:active,
  &:focus,
  &:active:hover {
    font-style: inherit;
    color: inherit;
    background-color: transparent;
    font-size: inherit;
    text-decoration: none;
    font-variant: inherit;
    font-weight: inherit;
    line-height: inherit;
    font-family: inherit;
    border-radius: inherit;
    border: inherit;
    outline: inherit;
    box-shadow: inherit;
    padding: inherit;
    vertical-align: inherit;
  }
}
</style>
