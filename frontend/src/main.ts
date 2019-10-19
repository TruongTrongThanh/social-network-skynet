import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios, { AxiosError } from 'axios'

import 'popper.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'highlight.js/styles/default.css'

Vue.config.productionTip = false

axios.interceptors.response.use(res => res, err => {
  const axiosErr: AxiosError<any> = err
  const isServerError = axiosErr.response && axiosErr.response.status === 500
  const isUserError = axiosErr.response && axiosErr.response.status === 400
  if (!axiosErr.response || isServerError) {
    store.commit('triggerModal', {
      title: 'Lỗi',
      content: 'Hệ thống đang có vấn đề, vui lòng thử lại sau.',
      type: 'danger',
      removeOkButton: true
    })
  } else if (isUserError) {
    store.commit('triggerModal', {
      title: 'Lỗi',
      content: axiosErr.response.data === 'Bad Request' ? 'Thông tin bạn nhập không hợp lệ, vui lòng kiểm tra lại.' : axiosErr.response.data,
      type: 'danger',
      removeOkButton: true
    })
  }
  return Promise.reject(err)
})


router.beforeEach((to, from, next) => {
  store.commit('setSidebarDisplay', false)
  store.commit('setClickedFeed', null)
  store.commit('setClickedShareFeed', null)
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
