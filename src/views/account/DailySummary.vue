<template>
  <div id="app">
    <h1>가계부 달력</h1>
    <calendar-view
      :show-date="showDate"
      :items="items"
      class="theme-default holiday-us-traditional holiday-us-official"
    >
      <template #header="{ headerProps }">
        <calendar-view-header
          :header-props="headerProps"
          @input="setShowDate"
        />
      </template>
    </calendar-view>
  </div>
</template>
<script>
import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar'
import '../../../node_modules/vue-simple-calendar/dist/style.css'
import '../../../node_modules/vue-simple-calendar/static/css/default.css'
import '../../../node_modules/vue-simple-calendar/static/css/holidays-us.css'
import axios from 'axios'
import { comma } from '../../lib/utils/comm_utils.js'

export default {
  name: 'DailySummary',
  data: function () {
    return {
      items: [],
      showDate: new Date(),
      strtDt:
        new Date().getFullYear() +
        ('0' + (new Date().getMonth() + 1)).slice(-2) +
        '01',
      endDt:
        new Date().getFullYear() +
        ('0' + (new Date().getMonth() + 1)).slice(-2) +
        new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate(),
    }
  },
  components: {
    CalendarView,
    CalendarViewHeader,
  },
  methods: {
    setShowDate(d) {
      this.showDate = d
      this.strtDt =
        d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + '01'
      this.endDt =
        d.getFullYear() +
        ('0' + (d.getMonth() + 1)).slice(-2) +
        new Date(d.getFullYear(), d.getMonth(), 0).getDate()
    },
    init() {
      this.getDivisionSumDaily()
    },
    getDivisionSumDaily() {
      axios
        .get(
          this.serverSideUrl +
            '/division_sum_daily?strtDt=' +
            this.strtDt +
            '&endDt=' +
            this.endDt,
        )
        .then((res) => {
          if (res.data.result_message == 'SUCCESS') {
            var result_data_list = res.data.result_data
            this.items = []

            for (var i = 0; i < result_data_list.length; i++) {
              var result_data = result_data_list[i]
              var account_dt = result_data.account_dt
              var year = account_dt.substring(0, 4)
              var month = account_dt.substring(4, 6)
              var day = account_dt.substring(6, 8)

              if (result_data.income > 0) {
                var item = {
                  id: account_dt + 'income',
                  startDate: new Date(year, month - 1, day),
                  title: '수입: ' + String(this.comma(result_data.income)),
                }
                this.items.push(item)
              }

              if (result_data.expense > 0) {
                item = {
                  id: account_dt + 'expense',
                  startDate: new Date(year, month - 1, day),
                  title: '지출: ' + String(this.comma(result_data.expense)),
                }
                this.items.push(item)
              }

              if (result_data.invest > 0) {
                item = {
                  id: account_dt + 'invest',
                  startDate: new Date(year, month - 1, day),
                  title: '투자: ' + String(this.comma(result_data.invest)),
                }
                this.items.push(item)
              }
            }
          }
        })
    },
    comma(val) {
      return comma(val)
    },
  },
  computed: {
    serverSideUrl() {
      return this.$store.state.apiUrl
    },
  },
  created() {
    this.init()
  },
  watch: {
    strtDt() {
      this.init()
    },
  },
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #2c3e50;
  height: 67vh;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}
</style>
