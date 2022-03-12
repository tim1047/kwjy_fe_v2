<template>
  <GChart type="ComboChart" :data="chartData" :options="chartOptions" />
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
      chartData: [['월별', '수입', '지출', '투자', '지출']],
      chartOptions: {
        title: '연간 차트',
        vAxis: { title: '금액' },
        hAxis: { title: '월별' },
        seriesType: 'bars',
        series: { 3: { type: 'line' }, 4: { type: 'line' } },
        height: 350,
      },
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
      this.chartData = [['월별', '수입', '지출', '투자', '지출']]
      this.getDivisionSum(1)
    },
    getDivisionSum(month) {
      var curYear = this.date.curYear
      var strtDt = curYear + ('0' + String(month)).slice(-2) + '01'
      var endDt =
        curYear +
        ('0' + String(month)).slice(-2) +
        new Date(curYear, String(month), 0).getDate()

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
            summary_data_list.push(
              strtDt.substring(0, 4) + '년 ' + strtDt.substring(4, 6) + '월',
            )
            summary_data_list.push(result_data.income)
            summary_data_list.push(result_data.expense)
            summary_data_list.push(result_data.invest)
            summary_data_list.push(result_data.expense)
            this.chartData.push(summary_data_list)

            if (month < 12) {
              this.getDivisionSum(month + 1)
            }
          }
        })
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
