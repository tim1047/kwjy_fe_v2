<template>
  <div>
    <CRow :xs="{ cols: 1, gutter: 4 }" :md="{ cols: 3 }">
      <CCol xs v-for="item in items" :key="item.category_id">
        <CCard class="mb-4">
          <CCardHeader> {{ item.category_nm }} </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol :sm="12" :lg="12">
                <CRow>
                  <CCol :sm="6">
                    <div
                      class="border-start border-start-4 border-start-info py-1 px-3 mb-3"
                    >
                      <div class="text-medium-emphasis small">실제</div>
                      <div class="fs-5 fw-semibold">
                        {{ comma(item.sum_price) }}
                      </div>
                    </div>
                  </CCol>
                  <CCol :sm="6">
                    <div
                      class="border-start border-start-4 border-start-danger py-1 px-3 mb-3"
                    >
                      <div class="text-medium-emphasis small">계획</div>
                      <div class="fs-5 fw-semibold">
                        {{ comma(item.plan_price) }}
                      </div>
                    </div>
                  </CCol>
                </CRow>
                <hr class="mt-0" />
                <div class="progress-group mb-4">
                  <div class="progress-group-prepend">
                    <span class="text-medium-emphasis small">{{
                      item.category_nm
                    }}</span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress
                      thin
                      color="info"
                      :value="(item.sum_price / item.plan_price) * 100"
                    />
                    <CProgress
                      thin
                      color="danger"
                      :value="(item.plan_price / item.plan_price) * 100"
                    />
                  </div>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import axios from 'axios'
import { comma } from '../../../lib/utils/comm_utils.js'

export default {
  name: 'IncomeDtl',
  data() {
    return {
      items: [],
    }
  },
  methods: {
    init() {
      this.getIncome()
    },
    getIncome() {
      // axios call
      axios
        .get(
          this.serverSideUrl +
            '/category_sum/1?strtDt=' +
            this.strtDt +
            '&endDt=' +
            this.endDt,
        )
        .then((res) => {
          // set account list
          this.items = res.data.result_data
        })
        .then((err) => {
          console.log(err)
        })
    },
    comma(val) {
      return comma(val)
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
