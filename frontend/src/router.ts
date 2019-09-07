import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '',
      component: () => import('./layouts/MainLayout.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('./views/Home.vue')
        },
        {
          path: '/feed/:id',
          name: 'feed',
          component: () => import('./views/FeedDetail.vue')
        }
      ]
    },
    {
      path: '/entry',
      name: 'entry',
      component: () => import('./views/Entry.vue')
    }
  ]
})