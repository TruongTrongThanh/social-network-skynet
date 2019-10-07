<template>
  <div id="alertModal" :class="`modal modal-${modalOptions.type} fade`" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-light">{{ modalOptions.title }}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ modalOptions.content }}</p>
          <div v-if="modalOptions.showPasswordForm" class="form-group clearfix">
            <label for="password">Mật khẩu</label>
            <input v-model="password" type="password" class="form-control mb-2" id="password" placeholder="Nhập mật khẩu">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="cancel">Close</button>
          <button v-if="!modalOptions.removeOkButton" type="button" :class="`btn btn-${modalOptions.type}`" data-dismiss="modal" @click="ok">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ModalOptions, ModalResult } from '@/models/modal'
import { State } from 'vuex-class'

@Component
export default class Modal extends Vue {
  @State readonly modalOptions!: ModalOptions

  password: string = ''

  cancel() {
    if (this.modalOptions.callback) {
      this.modalOptions.callback({ result: 'cancel' })
    }
  }

  ok() {
    if (this.modalOptions.callback) {
      this.modalOptions.callback({ result: 'ok', content: this.password })
    }
  }
}
</script>

<style scoped lang="scss">
.modal-primary .modal-header {
  background-color: #007bff;
}
.modal-success .modal-header {
  background-color: #28a745;
}
.modal-danger .modal-header {
  background-color: #dc3545;
}
</style>
