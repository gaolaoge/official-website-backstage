import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'newsList',
      component: () => import('@/components/newsList')
    },
    {
      path: '/keyWordsList',
      name: 'keyWordsList',
      component: () => import('@/components/keyWordsList')
    },
    {
      path: '/joinUsList',
      name: 'joinUsList',
      component: () => import('@/components/joinUs')
    }
  ]
})
