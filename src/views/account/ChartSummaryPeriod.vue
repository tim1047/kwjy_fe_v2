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
  <GChart type="ComboChart" :data="chartData" :options="chartOptions" />
  <GChart
    type="LineChart"
    :data="chartDataInvestRate"
    :options="chartOptionsInvestRate"
  />
  <GChart
    type="LineChart"
    :data="chartDataFixed"
    :options="chartOptionsFixed"
  />
</template>

<script>
import { GChart } from 'vue-google-charts'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    GChart,
  },
  data() {
    return {
      // Array will be automatically processed with visualization.arrayToDataTable function
      chartData: [['월별', '수입', '지출', '투자']],
      chartOptions: {
        title: '기간별 차트 (수입, 지출, 투자)',
        vAxis: { title: '금액' },
        hAxis: { title: '월별' },
        seriesType: 'bars',
        series: { 0: { type: 'line' } },
        height: 350,
      },
      chartDataInvestRate: [['월별', '투자율']],
      chartOptionsInvestRate: {
        title: '기간별 차트 (투자율)',
        height: 350,
        vAxis: { title: '투자율', minValue: 0 },
        hAxis: { title: '월별' },
      },
      chartDataFixed: [['월별', '고정지출']],
      chartOptionsFixed: {
        title: '기간별 차트 (고정지출)',
        height: 350,
        vAxis: { title: '고정지출' },
        hAxis: { title: '월별' },
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
      this.chartData = [['월별', '수입', '지출', '투자']]
      this.chartDataInvestRate = [['월별', '투자율']]
      this.chartDataFixed = [['월별', '고정지출']]

      var year = this.date.curYear
      var month = this.date.curMonth

      if (!this.radioYear) {
        for (var i = 1; i < this.selectedValue; i++) {
          month -= 1
          if (month == 0) {
            month = 12
            year -= 1
          }
        }
      } else {
        year = this.selectedValue
        month = 1
      }
      this.getDivisionSum(year, month, 1)
      this.getFixedPriceSum(year, month, 1)
      this.updateSelectList()
    },
    getDivisionSum(year, month, cnt) {
      var strtDt = year + ('0' + String(month)).slice(-2) + '01'
      var endDt =
        year +
        ('0' + String(month)).slice(-2) +
        new Date(year, String(month), 0).getDate()
      var checkCnt = this.radioYear ? 12 : this.selectedValue

      axios
        .get(
          this.serverSideUrl +
            '/division_sum?strtDt=' +
            strtDt +
            '&endDt=' +
            endDt,
        )
        .then((res) => {
          if (res.data.result_message == 'SUCCESS') {
            var result_data = res.data.result_data
            var summary_data_list = []
            var summary_data_invest_rate_list = []
            summary_data_list.push(
              strtDt.substring(0, 4) + '년 ' + strtDt.substring(4, 6) + '월',
            )
            summary_data_list.push(result_data.income)
            summary_data_list.push(result_data.expense)
            summary_data_list.push(result_data.invest)
            this.chartData.push(summary_data_list)

            summary_data_invest_rate_list.push(
              strtDt.substring(0, 4) + '년 ' + strtDt.substring(4, 6) + '월',
            )
            summary_data_invest_rate_list.push(
              Number(
                ((result_data.invest / result_data.income) * 100).toFixed(2),
              ),
            )
            this.chartDataInvestRate.push(summary_data_invest_rate_list)

            if (cnt < checkCnt) {
              month += 1
              if (month > 12) {
                year += 1
                month = 1
              }
              this.getDivisionSum(year, month, cnt + 1)
            }
          }
        })
    },
    getFixedPriceSum(year, month, cnt) {
      var strtDt = year + ('0' + String(month)).slice(-2) + '01'
      var endDt =
        year +
        ('0' + String(month)).slice(-2) +
        new Date(year, String(month), 0).getDate()
      var checkCnt = this.radioYear ? 12 : this.selectedValue

      axios
        .get(
          this.serverSideUrl +
            '/fixed_price_sum?strtDt=' +
            strtDt +
            '&endDt=' +
            endDt,
        )
        .then((res) => {
          if (res.data.result_message == 'SUCCESS') {
            var result_data_list = res.data.result_data
            var fixed_price_sum_list = []
            fixed_price_sum_list.push(
              strtDt.substring(0, 4) + '년 ' + strtDt.substring(4, 6) + '월',
            )
            fixed_price_sum_list.push(result_data_list[0].sum_price)
            this.chartDataFixed.push(fixed_price_sum_list)

            if (cnt < checkCnt) {
              month += 1
              if (month > 12) {
                year += 1
                month = 1
              }
              this.getFixedPriceSum(year, month, cnt + 1)
            }
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
