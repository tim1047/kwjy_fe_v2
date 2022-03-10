import { h, resolveComponent, nextTick } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/accountSummary',
    children: [
      {
        path: '/accountSummary',
        name: '가계부 Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/account/AccountSummary.vue'
          ),
      },
      {
        path: '/accountList',
        name: '가계부 목록',
        component: () => import('@/views/account/AccountList.vue'),
      },
      {
        path: '/division',
        name: '구분별 상세',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/division/',
        children: [
          {
            path: '/division/incomeDtl',
            name: '수입',
            component: () => import('@/views/account/IncomeDtl.vue'),
          },
          {
            path: '/division/investDtl',
            name: '투자',
            component: () => import('@/views/account/InvestDtl.vue'),
          },
          {
            path: '/division/expenseDtl',
            name: '지출',
            component: () => import('@/views/account/ExpenseDtl.vue'),
          },
          {
            path: '/division/expenseSeqDtl',
            name: '지출 상세',
            component: () => import('@/views/account/ExpenseSeqDtl.vue'),
          },
        ],
      },
      {
        path: '/memberExpense',
        name: '주체별 지출',
        component: () => import('@/views/account/MemberExpense.vue'),
      },
      {
        path: '/charts2',
        name: '차트',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/charts2',
        children: [
          {
            path: '/charts2/expense',
            name: '지출 상세 차트',
            component: () => import('@/views/account/ChartExpense.vue'),
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

router.afterEach(() => {
  nextTick(() => {
    document.title = '강원_정윤_가계부'
  })
})

export default router