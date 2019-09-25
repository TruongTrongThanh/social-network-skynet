import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'popper.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.config.productionTip = false

Vue.config.errorHandler = (err, vm, info) => {
  console.log(err)
  console.log(info)
}

router.beforeEach((to, from, next) => {
  store.commit('setSidebarDisplay', false)
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
