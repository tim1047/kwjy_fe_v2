<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader> 주체별 지출 </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol :sm="12" :lg="12">
            <CRow>
              <CCol :sm="4" v-for="item in memberSum" :key="item.member_id">
                <div :class="borderColorList[Number(item.member_id) - 1]">
                  <div class="text-medium-emphasis small">
                    {{ item.member_nm }}
                  </div>
                  <div class="fs-5 fw-semibold">
                    {{ comma(item.sum_price) }}
                  </div>
                </div>
              </CCol>
            </CRow>
            <hr class="mt-0" />
            <div class="mb-5"></div>
            <div
              v-for="item in memberSum"
              :key="item.member_id"
              class="progress-group"
            >
              <div class="progress-group-header">
                <CAvatar
                  size="md"
                  :src="avatars[Number(item.member_id) - 1]"
                  status="success"
                />
                <span class="ms-auto fw-semibold">
                  {{ comma(item.sum_price) }}
                  <span class="text-medium-emphasis small"
                    >({{
                      (
                        (item.sum_price / this.totalMemberSumPrice) *
                        100
                      ).toFixed(2)
                    }}%)</span
                  >
                </span>
              </div>
              <div class="progress-group-bars">
                <CProgress
                  thin
                  :value="(item.sum_price / this.totalMemberSumPrice) * 100"
                  :color="progressBarColorList[Number(item.member_id) - 1]"
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
import coupleAvatar from '@/assets/images/avatars/couple.png'
import manAvatar from '@/assets/images/avatars/man.png'
import girlAvatar from '@/assets/images/avatars/girl.png'

export default {
  name: 'MemberExpense',
  data() {
    return {
      memberSum: [],
      totalMemberSumPrice: 0,
      borderColorList: [
        'border-start border-start-4 border-start-warning py-1 px-3 mb-3',
        'border-start border-start-4 border-start-success py-1 px-3 mb-3',
        'border-start border-start-4 border-start-info py-1 px-3 mb-3',
      ],
      progressBarColorList: ['warning', 'success', 'info'],
      avatars: [manAvatar, girlAvatar, coupleAvatar],
    }
  },
  methods: {
    init() {
      this.getMemberSum()
    },
    getMemberSum() {
      // axios call
      axios
        .get(
          this.serverSideUrl +
            '/member_sum?strtDt=' +
            this.strtDt +
            '&endDt=' +
            this.endDt,
        )
        .then((res) => {
          // set account list
          this.memberSum = res.data.result_data
          this.totalMemberSumPrice = 0

          for (var i = 0; i < this.memberSum.length; i++) {
            this.totalMemberSumPrice += this.memberSum[i].sum_price
          }
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
