<template>
  <CCard>
    <CCardHeader>
      <strong>지출 차트</strong>
    </CCardHeader>
    <CCardBody>
      <GChart
        :settings="{ packages: ['bar'] }"
        :data="chartData"
        :options="chartOptions"
        :createChart="(el, google) => new google.charts.Bar(el)"
        @ready="onChartReady"
      />
    </CCardBody>
  </CCard>
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
      chartsLib: null,
      // Array will be automatically processed with visualization.arrayToDataTable function
      chartData: [],
    }
  },
  computed: {
    chartOptions() {
      if (!this.chartsLib) return null
      return this.chartsLib.charts.Bar.convertOptions({
        chart: {
          title: '',
          subtitle: '',
        },
        bars: 'horizontal', // Required for Material Bar Charts.
        hAxis: { format: 'decimal' },
        height: 400,
        colors: ['#1b9e77', '#d95f02', '#7570b3'],
      })
    },
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
  methods: {
    onChartReady(chart, google) {
      this.chartsLib = google
    },
    init() {
      this.getExpense()
    },
    getExpense() {
      axios
        .get(
          this.serverSideUrl +
            '/category_sum/3?strtDt=' +
            this.strtDt +
            '&endDt=' +
            this.endDt,
        )
        .then((res) => {
          var result_data = res.data.result_data
          this.chartData = []
          this.chartData.push(['지출 카테고리', '지출 금액'])

          for (var i = 0; i < result_data.length; i++) {
            var dataArray = []
            dataArray.push(result_data[i].category_nm)
            dataArray.push(result_data[i].sum_price)
            this.chartData.push(dataArray)
          }
        })
        .then((err) => {
          console.log(err)
        })
    },
  },
  created() {
    this.init()
  },
}
</script>
