<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader> 지출 상세 </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol :sm="12" :lg="12">
            <CRow>
              <CCol :sm="6">
                <div
                  class="border-start border-start-4 border-start-warning py-1 px-3 mb-3"
                >
                  <div class="text-medium-emphasis small">고정비용</div>
                  <div class="fs-5 fw-semibold">
                    {{ comma(this.fixedSumPrice) }}
                  </div>
                </div>
              </CCol>
              <CCol :sm="6">
                <div
                  class="border-start border-start-4 border-start-success py-1 px-3 mb-3"
                >
                  <div class="text-medium-emphasis small">지출</div>
                  <div class="fs-5 fw-semibold">
                    {{ comma(totalSumPrice) }}
                  </div>
                </div>
              </CCol>
            </CRow>
            <hr class="mt-0" />
            <div class="mb-5"></div>
            <div
              v-for="item in expenseItems"
              :key="item.title"
              class="progress-group"
            >
              <div class="progress-group-header">
                <CIcon
                  :icon="icons[Number(item.category_id) - 1]"
                  class="me-2"
                  size="lg"
                />
                <span class="title">{{ item.category_seq_nm }}</span>
                <span class="ms-auto fw-semibold">
                  {{ comma(item.sum_price) }}
                  <span class="text-medium-emphasis small"
                    >({{
                      ((item.sum_price / item.total_sum_price) * 100).toFixed(
                        2,
                      )
                    }}%)</span
                  >
                </span>
              </div>
              <div class="progress-group-bars">
                <CProgress
                  thin
                  :value="(item.sum_price / item.total_sum_price) * 100"
                  color="success"
                />
              </div>
            </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ExpenseSeqDtl',
  data() {
    return {
      expenseItems: [],
      fixedPriceItems: [],
      totalSumPrice: 0,
      fixedSumPrice: 0,
      icons: [
        'cil-house',
        'cil-input-power',
        'cil-settings',
        'cil-screen-smartphone',
        'cib-internet-explorer',
        'cil-cash',
        'cil-cash',
        'cil-cash',
        'cil-cash',
        'cil-restaurant',
        'cil-pizza',
        'cil-cart',
        'cil-truck',
        'cil-drink',
        'cil-options',
        'cil-basket',
        'cil-tv',
        'cil-bus-alt',
        'cil-taxi',
        'cil-bus-alt',
        'cil-car-alt',
        'cil-walk',
        'cil-diamond',
        'cil-flower',
        'cil-cut',
        'cil-brush',
        'cil-shower',
        'cil-hospital',
        'cil-hospital',
        'cil-medical-cross',
        'cil-movie',
        'cil-airplane-mode',
        'cil-globe-alt',
        'cil-education',
        'cil-book',
        'cil-birthday-cake',
        'cil-gift',
        'cil-cash',
        'cil-cash',
        'cil-cash',
      ],
    }
  },
  methods: {
    init() {
      this.getCategorySeqSum()
      this.getFixedPriceSum()
    },
    getCategorySeqSum() {
      // axios call
      axios
        .get(
          this.serverSideUrl +
            '/category_seq_sum/3?strtDt=' +
            this.strtDt +
            '&endDt=' +
            this.endDt,
        )
        .then((res) => {
          // set account list
          this.expenseItems = res.data.result_data
          this.totalSumPrice = this.expenseItems[0].total_sum_price
        })
        .then((err) => {
          console.log(err)
        })
    },
    getFixedPriceSum() {
      // axios call
      axios
        .get(
          this.serverSideUrl +
            '/fixed_price_sum?strtDt=' +
            this.strtDt +
            '&endDt=' +
            this.endDt,
        )
        .then((res) => {
          // set account list
          this.fixedPriceItems = res.data.result_data
          this.fixedPriceItems.forEach((value) => {
            this.fixedSumPrice += value.sum_price
          })
        })
        .then((err) => {
          console.log(err)
        })
    },
    comma(val) {
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
  },
  created() {
    this.init()
  },
  computed: {
    date() {
      return {
        curDate: this.$store.state.date.curDate,
        curYear: this.$store.state.date.curYear,
        curMonth: this.$store.state.date.curMonth,
        prevMonth: this.$store.state.date.prevMonth,
      }
    },
    strtDt() {
      return this.date.curYear + ('0' + this.date.curMonth).slice(-2) + '01'
    },
    endDt() {
      return (
        this.date.curYear +
        ('0' + this.date.curMonth).slice(-2) +
        new Date(this.date.curYear, this.date.curMonth, 0).getDate()
      )
    },
    prevStrtDt() {
      return this.date.curYear + ('0' + this.date.prevMonth).slice(-2) + '01'
    },
    prevEndDt() {
      return (
        this.date.curYear +
        ('0' + this.date.prevMonth).slice(-2) +
        new Date(this.date.curYear, this.date.prevMonth, 0).getDate()
      )
    },
    serverSideUrl() {
      return this.$store.state.apiUrl
    },
  },
  watch: {
    date() {
      this.init()
    },
  },
}
</script>
