<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>기간 선택</strong>
    </CCardHeader>
    <CCardBody>
      <CFormCheck
        type="radio"
        name="flexRadioDefault"
        label="연간"
        @change="updateRadio()"
      />
      <CFormCheck
        type="radio"
        name="flexRadioDefault"
        label="월간"
        @change="updateRadio()"
        checked
      />
      <CFormSelect
        size="lg"
        class="mb-3"
        v-model="this.selectedValue"
        @change="updateChart($event.target.value)"
      >
        <option v-for="item in selectList" :key="item" :value="item.value">
          {{ item.text }}
        </option>
      </CFormSelect>
    </CCardBody>
  </CCard>
  <GChart type="LineChart" :data="chartData" :options="chartOptions" />
</template>

<script>
import { GChart } from 'vue-google-charts'
import axios from 'axios'

export default {
  name: 'ChartDailyExpensePeriod',
  components: {
    GChart,
  },
  data() {
    return {
      // Array will be automatically processed with visualization.arrayToDataTable function
      chartData: [],
      chartOptions: {
        title: '일별 지출 추이 차트',
        vAxis: { title: '금액' },
        hAxis: { title: '일자' },
        height: 500,
      },
      selectList: [],
      selectedValue: 6,
      radioYear: false,
      radioMonth: true,
    }
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
  methods: {
    onChartReady(chart, google) {
      this.chartsLib = google
    },
    init() {
      this.chartData = []

      var strtYear = this.date.curYear
      var strtMonth = this.date.curMonth
      var endYear = this.date.curYear
      var endMonth = this.date.curMonth

      if (!this.radioYear) {
        for (var i = 1; i < this.selectedValue; i++) {
          strtMonth -= 1
          if (strtMonth == 0) {
            strtMonth = 12
            strtYear -= 1
          }
        }
      } else {
        strtYear = this.selectedValue
        endYear = this.selectedValue
        strtMonth = 1
        endMonth = 12
      }
      this.getExpenseSumDaily(strtYear, strtMonth, endYear, endMonth)
      this.updateSelectList()
    },
    getExpenseSumDaily(strtYear, strtMonth, endYear, endMonth) {
      var strtDt = strtYear + ('0' + String(strtMonth)).slice(-2) + '01'
      var endDt =
        endYear +
        ('0' + String(endMonth)).slice(-2) +
        new Date(endYear, String(endMonth), 0).getDate()

      axios
        .get(
          this.serverSideUrl +
            '/expense_sum_daily?strtDt=' +
            strtDt +
            '&endDt=' +
            endDt,
        )
        .then((res) => {
          if (res.data.result_message == 'SUCCESS') {
            this.chartData = res.data.result_data
          }
        })
    },
    updateSelectList() {
      this.selectList = []
      var selectInfo = {}

      if (!this.radioYear) {
        for (var i = 1; i <= 12; i++) {
          selectInfo = {
            text: i + '개월',
            value: i,
          }
          this.selectList.push(selectInfo)
        }
      } else {
        for (var j = 2021; j <= 2022; j++) {
          selectInfo = {
            text: j + '년',
            value: j,
          }
          this.selectList.push(selectInfo)
        }
      }
    },
    updateChart(value) {
      this.selectedValue = value
      this.init()
    },
    updateRadio() {
      this.radioYear = !this.radioYear
      this.radioMonth = !this.radioMonth

      this.selectedValue = this.radioYear ? this.date.curYear : 6
      this.updateSelectList()
      this.updateChart(this.selectedValue)
    },
  },
  created() {
    this.init()
  },
  watch: {
    date() {
      this.init()
    },
  },
}
</script>
