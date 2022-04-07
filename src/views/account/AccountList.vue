<template>
  <div>
    <CRow :xs="{ cols: 8, gutter: 4 }" :md="{ cols: 8 }">
      <CCol>
        <CButton
          color="info"
          @click="
            () => {
              initForm()
              visibleModal = true
            }
          "
        >
          <CIcon icon="cil-plus" />
        </CButton>
      </CCol>
      <CCol>
        <CButton
          color="info"
          @click="
            () => {
              this.getAccountList()
            }
          "
          style="float: right"
        >
          <CIcon icon="cil-search" />
        </CButton>
      </CCol>
    </CRow>
    <br />
    <CCard class="mb-4">
      <CCardHeader><strong>조회 조건</strong></CCardHeader>
      <CCardBody>
        <CRow>
          <CCol xs="3">
            <CFormLabel for="searchDivision" style="float: right"
              >구분</CFormLabel
            >
          </CCol>
          <CCol>
            <CFormSelect
              id="searchDivisionId"
              aria-label="Default select example"
              v-model="this.searchForm.searchDivisionId"
              @change="changeDivisionId($event.target.value)"
            >
              <option value="">전체</option>
              <option
                v-for="item in divisionList"
                :key="item.division_id"
                :value="item.division_id"
              >
                {{ item.division_nm }}
              </option>
            </CFormSelect>
          </CCol>
          <CCol xs="2">
            <CFormLabel for="searchFixedPriceYn" style="float: right"
              >고정지출</CFormLabel
            >
          </CCol>
          <CCol>
            <CFormSelect
              id="searchFixedPriceYn"
              aria-label="Default select example"
              v-model="this.searchForm.searchFixedPriceYn"
              :disabled="this.searchForm.searchDivisionId != '3'"
            >
              <option value="">전체</option>
              <option value="N">N</option>
              <option value="Y">Y</option>
            </CFormSelect>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="3">
            <CFormLabel for="searchCategoryId" style="float: right">
              대분류
            </CFormLabel>
          </CCol>
          <CCol>
            <CFormSelect
              id="searchCategory"
              aria-label="Default select example"
              v-model="this.searchForm.searchCategoryId"
              @change="getCategorySeqList($event.target.value)"
            >
              <option value="">전체</option>
              <option
                v-for="item in categoryList"
                :key="item.category_id"
                :value="item.category_id"
              >
                {{ item.category_nm }}
              </option>
            </CFormSelect>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="3">
            <CFormLabel for="searchCategorySeq" style="float: right">
              소분류
            </CFormLabel>
          </CCol>
          <CCol>
            <CFormSelect
              id="searchCategorySeq"
              aria-label="Default select example"
              v-model="this.searchForm.searchCategorySeq"
            >
              <option value="">전체</option>
              <option
                v-for="item in categorySeqList"
                :key="item.category_seq"
                :value="item.category_seq"
              >
                {{ item.category_seq_nm }}
              </option>
            </CFormSelect>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <CCol :xs="12">
      <CCard class="mb-4" v-for="item in this.items" :key="item">
        <CCardHeader>
          <strong>{{
            item.accountDt.substring(0, 4) +
            '년 ' +
            item.accountDt.substring(4, 6) +
            '월 ' +
            item.accountDt.substring(6, 8) +
            '일'
          }}</strong>
        </CCardHeader>
        <CCardBody>
          <CAccordion>
            <CAccordionItem v-for="item in item.data" :key="item.name">
              <CAccordionHeader>
                <div style="width: 55px">
                  <CAvatar
                    size="md"
                    :src="avatars[Number(item.member_id) - 1]"
                    :status="avatarStatusList[Number(item.division_id) - 1]"
                  />
                </div>
                <CCardText>
                  <strong>{{ comma(item.price) }}</strong>
                  <CBadge
                    v-if="item.impulse_yn == 'Y'"
                    color="danger"
                    shape="rounded-pill"
                    >충동</CBadge
                  >
                  <br />
                  <h6 style="font-size: 0.8em">
                    {{ item.accountCntt }}
                  </h6>
                </CCardText>
              </CAccordionHeader>
              <CAccordionBody>
                <strong>{{ item.remark }}</strong>
                <CButton
                  color="info"
                  @click="
                    () => {
                      this.selectItem(item)
                      this.getPaymentList(item.member_id)
                      this.getCategoryList(item.division_id)
                      this.getCategorySeqList(item.category_id)
                      visibleModal = true
                    }
                  "
                >
                  <CIcon icon="cil-save" />
                </CButton>
                <CButton
                  color="danger"
                  @click="
                    () => {
                      this.delete(item.account_id)
                    }
                  "
                >
                  <CIcon icon="cil-trash" />
                </CButton>
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>
        </CCardBody>
      </CCard>
    </CCol>

    <CModal
      :visible="visibleModal"
      @close="
        () => {
          visibleModal = false
        }
      "
    >
      <CModalHeader
        dismiss
        @close="
          () => {
            visibleModal = false
          }
        "
      >
        <CModalTitle>가계부 수정</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormLabel for="accountDtFormLabel">날짜</CFormLabel>
        <Datepicker
          v-model="this.selectedForm.account_dt"
          :format="datepicker_format"
        ></Datepicker>
        <CFormLabel for="divisionFormLabel">구분</CFormLabel>
        <CFormSelect
          id="divisionForm"
          aria-label="Default select example"
          v-model="this.selectedForm.division_id"
          @change="getCategoryList($event.target.value)"
        >
          <option></option>
          <option
            v-for="item in divisionList"
            :key="item.division_id"
            :value="item.division_id"
          >
            {{ item.division_nm }}
          </option>
        </CFormSelect>
        <CFormLabel for="memberFormLabel">주체</CFormLabel>
        <CFormSelect
          id="memberForm"
          aria-label="Default select example"
          v-model="this.selectedForm.member_id"
          @change="getPaymentList($event.target.value)"
        >
          <option></option>
          <option
            v-for="item in memberList"
            :key="item.member_id"
            :value="item.member_id"
          >
            {{ item.member_nm }}
          </option>
        </CFormSelect>
        <CFormLabel for="paymentFormLabel">결제수단</CFormLabel>
        <CFormSelect
          id="paymentForm"
          aria-label="Default select example"
          v-model="this.selectedForm.payment_id"
        >
          <option></option>
          <option
            v-for="item in paymentList"
            :key="item.payment_id"
            :value="item.payment_id"
          >
            {{ item.payment_nm }}
          </option>
        </CFormSelect>
        <CFormLabel for="categoryFormLabel">대분류</CFormLabel>
        <CFormSelect
          id="categoryFormLabel"
          aria-label="Default select example"
          v-model="this.selectedForm.category_id"
          @change="getCategorySeqList($event.target.value)"
        >
          <option></option>
          <option
            v-for="item in categoryList"
            :key="item.category_id"
            :value="item.category_id"
          >
            {{ item.category_nm }}
          </option>
        </CFormSelect>
        <CFormLabel for="categorySeqFormLabel">소분류</CFormLabel>
        <CFormSelect
          id="categorySeqFormLabel"
          aria-label="Default select example"
          v-model="this.selectedForm.category_seq"
        >
          <option></option>
          <option
            v-for="item in categorySeqList"
            :key="item.category_seq"
            :value="item.category_seq"
          >
            {{ item.category_seq_nm }}
          </option>
        </CFormSelect>
        <CFormLabel for="priceFormLabel">가격</CFormLabel>
        <CFormInput
          type="text"
          :placeholder="this.selectedForm.price"
          v-model="this.selectedForm.price"
          aria-label="default input example"
        />
        <CFormLabel for="remarkFormLabel">내용</CFormLabel>
        <CFormInput
          type="text"
          :placeholder="this.selectedForm.remark"
          v-model="this.selectedForm.remark"
          aria-label="default input example"
        />
        <CFormLabel for="impulseYnFormLabel">충동구매 여부</CFormLabel>
        <CFormSelect
          id="impulseYnFormLabel"
          aria-label="Default select example"
          v-model="this.selectedForm.impulse_yn"
        >
          <option value="N">N</option>
          <option value="Y">Y</option>
        </CFormSelect>
      </CModalBody>
      <CModalFooter>
        <CButton
          color="secondary"
          @click="
            () => {
              visibleModal = false
            }
          "
        >
          닫기
        </CButton>
        <CButton
          color="primary"
          @click="
            () => {
              update()
              visibleModal = false
            }
          "
        >
          저장
        </CButton>
      </CModalFooter>
    </CModal>

    <CToaster placement="top-end">
      <CToast
        v-for="(toast, index) in toasts"
        :key="index"
        color="primary"
        class="text-white align-items-center"
      >
        <CToastBody>
          <strong>{{ toast.content }}</strong>
        </CToastBody>
      </CToast>
    </CToaster>
  </div>
</template>
<script>
import axios from 'axios'
import coupleAvatar from '@/assets/images/avatars/couple.png'
import manAvatar from '@/assets/images/avatars/man.png'
import girlAvatar from '@/assets/images/avatars/girl.png'
import Datepicker from 'vue3-date-time-picker'
import 'vue3-date-time-picker/dist/main.css'
import { dateToYYYYMMDD, YYYYMMDDToDate } from '../../lib/utils/date_utils.js'
import { comma } from '../../lib/utils/comm_utils.js'

export default {
  name: 'AccountList',
  components: {
    Datepicker,
  },
  data() {
    return {
      items: [],
      avatars: [manAvatar, girlAvatar, coupleAvatar],
      visibleModal: false,
      selectedIdx: '',
      selectedForm: {
        account_id: '',
        account_dt: '',
        division_id: '',
        member_id: '',
        payment_id: '',
        category_id: '',
        category_seq: '',
        price: 0,
        remark: '',
        impulse_yn: 'N',
      },
      searchForm: {
        searchDivisionId: '',
        searchCategoryId: '',
        searchCategorySeq: '',
        searchFixedPriceYn: '',
      },
      divisionList: [],
      memberList: [],
      paymentList: [],
      categoryList: [],
      categorySeqList: [],
      requestParam: {},
      toasts: [],
      avatarStatusList: ['success', 'info', 'danger'],
    }
  },
  methods: {
    init() {
      this.getAccountList()
      this.getDivisionList()
      this.getMemberList()
    },
    initForm() {
      this.selectedForm = {
        account_id: '',
        account_dt: new Date(),
        division_id: '',
        member_id: '',
        payment_id: '',
        category_id: '',
        category_seq: '',
        price: 0,
        remark: '',
        impulse_yn: 'N',
      }
    },
    delete(account_id) {
      if (!confirm('가계부를 삭제하시겠습니까?')) {
        return
      }
      this.requestParam = {
        account_id: account_id,
      }

      axios
        .delete(this.serverSideUrl + '/account', {
          data: this.requestParam,
        })
        .then((res) => {
          if (res.data.result_message == 'SUCCESS') {
            this.createToast('삭제 완료')
            this.init()
            this.requestParam = {}
          }
        })
        .then((err) => {
          console.log(err)
        })
    },
    update() {
      this.selectedForm.account_dt = dateToYYYYMMDD(
        this.selectedForm.account_dt,
      )
      this.requestParam = this.selectedForm

      if (this.requestParam.account_id == '') {
        axios
          .post(this.serverSideUrl + '/account', this.requestParam)
          .then((res) => {
            if (res.data.result_message == 'SUCCESS') {
              this.createToast('등록 완료')
              this.init()
              this.requestParam = {}
            }
          })
          .then((err) => {
            console.log(err)
          })
      } else {
        axios
          .put(this.serverSideUrl + '/account', this.requestParam)
          .then((res) => {
            if (res.data.result_message == 'SUCCESS') {
              this.createToast('수정 완료')
              this.init()
              this.requestParam = {}
            }
          })
          .then((err) => {
            console.log(err)
          })
      }
    },
    selectItem(item) {
      this.selectedForm = {}
      for (var i in item) {
        if (i == 'account_dt') {
          this.selectedForm[i] = YYYYMMDDToDate(item[i])
        } else {
          this.selectedForm[i] = item[i]
        }
      }
    },
    getAccountList() {
      // axios call
      axios
        .get(
          this.serverSideUrl +
            '/account?strtDt=' +
            this.strtDt +
            '&endDt=' +
            this.endDt +
            '&searchDivisionId=' +
            this.searchForm.searchDivisionId +
            '&searchCategoryId=' +
            this.searchForm.searchCategoryId +
            '&searchCategorySeq=' +
            this.searchForm.searchCategorySeq +
            '&searchFixedPriceYn=' +
            this.searchForm.searchFixedPriceYn,
        )
        .then((res) => {
          var result_data_list = res.data.result_data
          var temp_obj = {
            data: [],
            accountDt: '',
          }
          this.items = []

          for (var i = 0; i < result_data_list.length; i++) {
            var accountCntt = ''
            var result_data = result_data_list[i]

            accountCntt +=
              result_data.division_nm + ' / ' + result_data.category_nm

            if (result_data.category_seq_nm) {
              accountCntt += ' / ' + result_data.category_seq_nm
            }
            result_data_list[i].accountCntt = accountCntt

            if (temp_obj.accountDt != result_data.account_dt) {
              if (temp_obj.accountDt != '') {
                this.items.push(temp_obj)
              }

              temp_obj = {
                data: [],
                accountDt: result_data.account_dt,
              }
            }
            temp_obj.data.push(result_data_list[i])
          }
          this.items.push(temp_obj)
        })
        .then((err) => {
          console.log(err)
        })
    },
    getDivisionList() {
      // axios call
      axios
        .get(this.serverSideUrl + '/division_list')
        .then((res) => {
          // set account list
          this.divisionList = []
          this.divisionList = res.data.result_data
        })
        .then((err) => {
          console.log(err)
        })
    },
    getMemberList() {
      // axios call
      axios
        .get(this.serverSideUrl + '/member_list')
        .then((res) => {
          // set account list
          this.memberList = []
          this.memberList = res.data.result_data
        })
        .then((err) => {
          console.log(err)
        })
    },
    getPaymentList(value) {
      // axios call
      axios
        .get(this.serverSideUrl + '/payment_list/' + value)
        .then((res) => {
          // set account list
          this.paymentList = []
          this.paymentList = res.data.result_data
        })
        .then((err) => {
          console.log(err)
        })
    },
    getCategoryList(value) {
      // axios call
      axios
        .get(this.serverSideUrl + '/category_list/' + value)
        .then((res) => {
          // set account list
          this.categoryList = []
          this.categoryList = res.data.result_data
        })
        .then((err) => {
          console.log(err)
        })
    },
    getCategorySeqList(value) {
      // axios call
      axios
        .get(this.serverSideUrl + '/category_seq_list/' + value)
        .then((res) => {
          // set account list
          this.categorySeqList = []
          this.categorySeqList = res.data.result_data
        })
        .then((err) => {
          console.log(err)
        })
    },
    comma(val) {
      return comma(val)
    },
    datepicker_format(val) {
      const day = val.getDate()
      const month = val.getMonth() + 1
      const year = val.getFullYear()
      return `${year}-${month}-${day}`
    },
    createToast(content) {
      this.toasts.push({
        content: content,
      })
    },
    changeDivisionId(value) {
      this.getCategoryList(value)
      if (value != '3') {
        this.searchForm.searchFixedPriceYn = ''
      }
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
