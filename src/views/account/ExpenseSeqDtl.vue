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
                  :icon="icons[item.category_id + String(item.category_seq)]"
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
      icons: {
        11: 'cil-house',
        12: 'cil-input-power',
        13: 'cil-settings',
        21: 'cil-screen-smartphone',
        22: 'cib-internet-explorer',
        31: 'cil-cash',
        32: 'cil-cash',
        33: 'cil-cash',
        34: 'cil-cash',
        41: 'cil-restaurant',
        42: 'cil-pizza',
        43: 'cil-cart',
        44: 'cil-truck',
        45: 'cil-drink',
        46: 'cil-options',
        51: 'cil-basket',
        52: 'cil-tv',
        61: 'cil-bus-alt',
        62: 'cil-taxi',
        63: 'cil-bus-alt',
        64: 'cil-car-alt',
        71: 'cil-walk',
        72: 'cil-diamond',
        81: 'cil-flower',
        82: 'cil-cut',
        83: 'cil-brush',
        84: 'cil-shower',
        91: 'cil-hospital',
        92: 'cil-hospital',
        93: 'cil-medical-cross',
        101: 'cil-movie',
        102: 'cil-airplane-mode',
        103: 'cil-globe-alt',
        111: 'cil-education',
        112: 'cil-book',
        121: 'cil-birthday-cake',
        122: 'cil-gift',
        123: 'cil-cash',
        124: 'cil-cash',
        125: 'cil-cash',
      },
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
