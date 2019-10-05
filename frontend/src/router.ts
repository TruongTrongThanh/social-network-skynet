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
          path: '/search/:text',
          name: 'search-result',
          component: () => import('./views/SearchResult.vue')
        },
        {
          path: 'user/:id',
          name: 'user-details',
          component: () => import('./views/UserDetails.vue')
        }
      ]
    },
    {
      path: '/entry',
      name: 'entry',
      component: () => import('./views/Entry.vue')
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: () => import('./views/ChangePassword.vue')
    },
    {
      path: '/activate-email',
      name: 'activate-email',
      component: () => import('./views/ActivateEmail.vue')
    }
  ]
})
