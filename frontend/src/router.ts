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
          component: () => import('./views/FeedDetails.vue')
        },
        {
          path: '/create-group',
          name: 'group-create',
          component: () => import('./views/GroupCreate.vue')
        },
        {
          path: '/group/:id',
          name: 'group-details',
          component: () => import('./views/GroupDetails.vue')
        },
        {
          path: '/search',
          name: 'search-list',
          component: () => import('./views/SearchList.vue')
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
