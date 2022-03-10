<template>
  <div>
    <CRow :xs="{ cols: 1, gutter: 4 }" :md="{ cols: 3 }">
      <CCol xs>
        <CCardGroup>
          <CWidgetStatsC
            class="mb-3"
            color=""
            :progress="{ value: 75 }"
            title="수입"
            :value="comma(divisionSum['income'])"
          >
            <template #icon><CIcon icon="cil-dollar" height="36" /></template>
          </CWidgetStatsC>
        </CCardGroup>
      </CCol>
      <CCol xs>
        <CCardGroup>
          <CWidgetStatsC
            class="mb-3"
            color=""
            :progress="{ value: 75 }"
            title="지출"
            :value="comma(divisionSum['expense'])"
          >
            <template #icon><CIcon icon="cil-basket" height="36" /></template>
          </CWidgetStatsC>
        </CCardGroup>
      </CCol>
      <CCol xs>
        <CCardGroup>
          <CWidgetStatsC
            class="mb-3"
            color=""
            :progress="{ value: 75 }"
            title="순수익(수입-지출)"
            :value="comma(divisionSum['interest'])"
          >
            <template #icon><CIcon icon="cil-wallet" height="36" /></template>
          </CWidgetStatsC>
        </CCardGroup>
      </CCol>
      <CCol xs>
        <CCardGroup>
          <CWidgetStatsC
            class="mb-3"
            color=""
            :progress="{ value: 75 }"
            title="투자"
            :value="comma(divisionSum['invest'])"
          >
            <template #icon><CIcon icon="cil-building" height="36" /></template>
          </CWidgetStatsC>
        </CCardGroup>
      </CCol>
      <CCol xs>
        <CCardGroup>
          <CWidgetStatsC
            class="mb-3"
            color="warning"
            inverse
            :progress="{ value: 75 }"
            title="투자율"
            :value="divisionSum['invest_rate']"
          >
            <template #icon
              ><CIcon icon="cil-speedometer" height="36"
            /></template>
          </CWidgetStatsC>
        </CCardGroup>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AccountSummary',
  data() {
    return {
      divisionSum: {},
      prevDivisionSum: {},
    }
  },
  methods: {
    init() {
      this.getAccountSummary()
    },
    getAccountSummary() {
      this.getDivisionSum()
    },
    getDivisionSum() {
      axios
        .get(
          this.serverSideUrl +
            '/division_sum?strtDt=' +
            this.prevStrtDt +
            '&endDt=' +
            this.prevEndDt,
        )
        .then((res) => {
          if (res.data.result_message == 'SUCCESS') {
            this.prevDivisionSum = res.data.result_data
          }
        })

      axios
        .get(
          this.serverSideUrl +
            '/division_sum?strtDt=' +
            this.strtDt +
            '&endDt=' +
            this.endDt,
        )
        .then((res) => {
          if (res.data.result_message == 'SUCCESS') {
            this.divisionSum = res.data.result_data
          }
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
