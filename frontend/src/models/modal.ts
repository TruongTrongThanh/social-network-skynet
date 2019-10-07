export interface ModalOptions {
  title: string
  type: 'primary' | 'success' | 'danger'
  showPasswordForm?: boolean
  removeOkButton?: boolean
  content?: string
  callback?: (result: ModalResult) => void
}

export interface ModalResult {
  result: 'ok' | 'cancel'
  content?: any
}
