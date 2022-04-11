import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    meta: { title: '首页', icon: 'home' },
    children: [{
      path: 'index',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: '' }
    }]
  },
  // {
  //   path: '/user',
  //   component: Layout,
  //   redirect: '/user/index',
  //   meta: { title: '用户管理', icon: 'aver' },
  //   hidden: true,
  //   children: [{
  //     path: 'index',
  //     name: 'User',
  //     component: () => import('@/views/user/index'),
  //     meta: { title: '用户管理', icon: '' }
  //   },
  //   {
  //     path: 'detail',
  //     name: 'Detail',
  //     component: () => import('@/views/user/detail'),
  //     meta: { title: '用户详情', icon: '' },
  //     hidden: true
  //   }]
  // },
  {
    path: '/risk',
    component: Layout,
    redirect: '/risk/index',
    meta: { title: '检测结果', icon: 'risk' },
    children: [{
      path: 'index',
      name: 'Risk',
      component: () => import('@/views/risk/index'),
      meta: { title: '检测结果', icon: '' }
    }]
  },
  {
    path: '/organization',
    component: Layout,
    redirect: '/organization/index',
    meta: { title: '组织机构管理', icon: 'tree' },
    children: [{
      path: 'index',
      name: 'Organization',
      component: () => import('@/views/organization/index'),
      meta: { title: '组织机构管理', icon: '' }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/blg',
    component: Layout,
    redirect: '/blg/index',
    meta: { title: '统计分析', icon: 'qc', roles: ['tenant_admin'] },
    hidden: true,
    children: [{
      path: 'index',
      name: 'Blg',
      component: () => import('@/views/blg/index'),
      meta: { title: '统计分析', icon: '' }

    },
    {
      path: 'operatorblg',
      name: 'Operatorblg',
      component: () => import('@/views/blg/operatorblg'),
      meta: { title: '操作人检测统计分析', icon: '' },
      hidden: true
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
