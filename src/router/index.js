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
            component: () => import('@/views/account/division/IncomeDtl.vue'),
          },
          {
            path: '/division/investDtl',
            name: '투자',
            component: () => import('@/views/account/division/InvestDtl.vue'),
          },
          {
            path: '/division/expenseDtl',
            name: '지출',
            component: () => import('@/views/account/division/ExpenseDtl.vue'),
          },
          {
            path: '/division/expenseSeqDtl',
            name: '지출 상세',
            component: () =>
              import('@/views/account/division/ExpenseSeqDtl.vue'),
          },
        ],
      },
      {
        path: '/memberExpense',
        name: '주체별 지출',
        component: () => import('@/views/account/MemberExpense.vue'),
      },
      {
        path: '/dailySummary',
        name: '달력 보기',
        component: () => import('@/views/account/DailySummary.vue'),
      },
      {
        path: '/charts',
        name: '차트',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/charts',
        children: [
          {
            path: '/charts/expense',
            name: '지출 차트',
            component: () => import('@/views/account/charts/ChartExpense.vue'),
          },
          {
            path: '/charts/summaryPeriod',
            name: '기간별 차트',
            component: () =>
              import('@/views/account/charts/ChartSummaryPeriod.vue'),
          },
          {
            path: '/charts/dailyExpensePeriod',
            name: '일별 지출 추이 차트',
            component: () =>
              import('@/views/account/charts/ChartDailyExpensePeriod.vue'),
          },
        ],
      },
      {
        path: '/asset',
        name: '자산',
        component: () => import('@/views/account/AssetList.vue'),
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
