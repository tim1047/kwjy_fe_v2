export default [
  {
    component: 'CNavItem',
    name: '가계부 Home',
    to: '/accountSummary',
    icon: 'cil-spreadsheet',
  },
  {
    component: 'CNavItem',
    name: '가계부 목록',
    to: '/accountList',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavGroup',
    name: '구분별 상세',
    to: '/division',
    icon: 'cil-cursor',
    items: [
      {
        component: 'CNavItem',
        name: '수입',
        to: '/division/incomeDtl',
      },
      {
        component: 'CNavItem',
        name: '투자',
        to: '/division/investDtl',
      },
      {
        component: 'CNavItem',
        name: '지출',
        to: '/division/expenseDtl',
      },
      {
        component: 'CNavItem',
        name: '지출 상세',
        to: '/division/expenseSeqDtl',
      },
    ],
  },
  {
    component: 'CNavItem',
    name: '주체별 지출',
    to: '/memberExpense',
    icon: 'cil-people',
  },
  {
    component: 'CNavItem',
    name: '달력 보기',
    to: '/dailySummary',
    icon: 'cil-calendar',
  },
  {
    component: 'CNavGroup',
    name: '차트',
    to: '/charts',
    icon: 'cil-chart',
    items: [
      {
        component: 'CNavItem',
        name: '지출 차트',
        to: '/charts/expense',
      },
      {
        component: 'CNavItem',
        name: '기간별 차트',
        to: '/charts/summaryPeriod',
      },
      {
        component: 'CNavItem',
        name: '일별 지출 추이 차트',
        to: '/charts/dailyExpensePeriod',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: '자산',
    to: '/asset',
    icon: 'cil-cash',
    items: [
      {
        component: 'CNavItem',
        name: '자산 목록',
        to: '/asset/assetList',
      },
      {
        component: 'CNavItem',
        name: '자산 비율',
        to: '/asset/assetChart',
      },
    ],
  },

  // {
  //   component: 'CNavItem',
  //   name: 'Download CoreUI',
  //   href: 'http://coreui.io/vue/',
  //   icon: { name: 'cil-cloud-download', class: 'text-white' },
  //   _class: 'bg-success text-white',
  //   target: '_blank'
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Try CoreUI PRO',
  //   href: 'http://coreui.io/pro/vue/',
  //   icon: { name: 'cil-layers', class: 'text-white' },
  //   _class: 'bg-danger text-white',
  //   target: '_blank'
  // }
]
