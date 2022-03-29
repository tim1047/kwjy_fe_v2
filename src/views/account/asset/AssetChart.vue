<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>자산 비율</strong>
      </CCardHeader>
      <CCardBody>
        <GChart type="PieChart" :data="chartData" :options="chartOptions" />
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'
import axios from 'axios'
import { dateToYYYYMMDD } from '../../../lib/utils/date_utils.js'

export default {
  name: 'AssetChart',
  components: {
    GChart,
  },
  data() {
    return {
      // Array will be automatically processed with visualization.arrayToDataTable function
      chartData: [],
      chartOptions: {
        chart: {
          title: '',
          subtitle: '',
        },
        height: 500,
      },
      procDt: '',
      item: {},
    }
  },
  methods: {
    init() {
      this.getMyAssetList()
    },
    getMyAssetList() {
      var now = new Date()
      //var yesterday = new Date(now.setDate(now.getDate() - 1))
      this.procDt = dateToYYYYMMDD(now)
      this.chartData = [['자산', '금액']]

      // axios call
      axios
        .get(
          this.serverSideUrl +
            '/my_asset_list?strtDt=' +
            this.procDt +
            '&endDt=' +
            this.procDt,
        )
        .then((res) => {
          var result_data_info = res.data.result_data
          this.item = result_data_info.data

          var realEstateList = []
          var realEstatePrice = 0
          for (var key in this.item) {
            var assetInfo = this.item[key]

            if (key == '6') {
              realEstatePrice += assetInfo.asset_tot_sum_price
            }
            if (key == '5') {
              realEstateList.push(assetInfo.asset_nm)
              realEstatePrice += assetInfo.asset_tot_sum_price
            } else {
              var tempList = []
              tempList.push(assetInfo.asset_nm)
              tempList.push(Math.abs(assetInfo.asset_tot_sum_price))
              this.chartData.push(tempList)
            }
          }
          realEstateList.push(realEstatePrice)
          this.chartData.push(realEstateList)
        })
        .then((err) => {
          console.log(err)
        })
    },
  },
  created() {
    this.init()
  },
  computed: {
    serverSideUrl() {
      return this.$store.state.apiUrl
    },
  },
}
</script>
