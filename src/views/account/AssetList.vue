<template>
  <div>
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
    <br /><br />
    <CCard>
      <CCardHeader>
        <strong>{{
          '총계 ( 기준일: ' + strToYYYYMMDDHypen(procDt) + ' )'
        }}</strong>
      </CCardHeader>
      <CCardBody>
        <strong>{{
          '총 자산 : ' +
          comma(items.tot_sum_price) +
          ' / 환율 : ' +
          comma(items.usd_krw_rate)
        }}</strong>
      </CCardBody>
    </CCard>
    <br />
    <CCol :xs="12">
      <CCard class="mb-4" v-for="(val, key) in this.items.data" :key="key">
        <CCardHeader>
          <strong>{{
            val.asset_nm + ' ( 총계 : ' + comma(val.asset_tot_sum_price) + ' )'
          }}</strong>
        </CCardHeader>
        <CCardBody>
          <CAccordion>
            <CAccordionItem v-for="item in val.data" :key="item">
              <CAccordionHeader>
                <CCardText>
                  <strong>{{
                    comma(item.sum_price) + ' / ' + item.qty + '개'
                  }}</strong>
                  <br />
                  <h6 style="font-size: 0.8em">
                    {{ item.my_asset_nm }}
                  </h6>
                </CCardText>
              </CAccordionHeader>
              <CAccordionBody>
                <CButton
                  color="info"
                  @click="
                    () => {
                      this.selectItem(item)
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
                      this.delete(item.my_asset_id)
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
        <CModalTitle>자산 수정</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormLabel for="assetFormLabel">자산</CFormLabel>
        <CFormSelect
          id="assetForm"
          aria-label="Default select example"
          v-model="this.selectedForm.assetId"
        >
          <option></option>
          <option
            v-for="item in assetList"
            :key="item.asset_id"
            :value="item.asset_id"
          >
            {{ item.asset_nm }}
          </option>
        </CFormSelect>
        <CFormLabel for="myAssetNmFormLabel">이름</CFormLabel>
        <CFormInput
          type="text"
          :placeholder="this.selectedForm.myAssetNm"
          v-model="this.selectedForm.myAssetNm"
          aria-label="default input example"
        />
        <CFormLabel for="tickerFormLabel">티커</CFormLabel>
        <CFormInput
          type="text"
          :placeholder="this.selectedForm.ticker"
          v-model="this.selectedForm.ticker"
          aria-label="default input example"
        />
        <CFormLabel for="priceDivCdFormLabel">가격세팅</CFormLabel>
        <CFormSelect
          id="priceDivCdFormLabel"
          aria-label="Default select example"
          v-model="this.selectedForm.priceDivCd"
          @change="setPriceDivCd($event.target.value)"
        >
          <option value="MANUAL">MANUAL</option>
          <option value="AUTO">AUTO</option>
        </CFormSelect>
        <CFormLabel for="priceFormLabel">가격</CFormLabel>
        <CFormInput
          type="number"
          :placeholder="this.selectedForm.price"
          v-model="this.selectedForm.price"
          aria-label="default input example"
          :disabled="priceDisabled"
        />
        <CFormLabel for="qtyFormLabel">개수</CFormLabel>
        <CFormInput
          type="number"
          :placeholder="this.selectedForm.qty"
          v-model="this.selectedForm.qty"
          aria-label="default input example"
        />
        <CFormLabel for="exchangeRateYnFormLabel">환율적용 여부</CFormLabel>
        <CFormSelect
          id="exchangeRateYnFormLabel"
          aria-label="Default select example"
          v-model="this.selectedForm.exchangeRateYn"
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
import {
  dateToYYYYMMDD,
  strToYYYYMMDDHypen,
} from '../../lib/utils/date_utils.js'
import { comma } from '../../lib/utils/comm_utils.js'

export default {
  name: 'AssetList',
  data() {
    return {
      items: [],
      visibleModal: false,
      selectedIdx: '',
      selectedForm: {
        myAssetId: '',
        assetId: '',
        myAssetNm: '',
        ticker: '',
        priceDivCd: '',
        price: 0,
        qty: 0.0,
        exchangeRateYn: 'N',
      },
      assetList: [],
      toasts: [],
      priceDisabled: false,
      procDt: '',
    }
  },
  methods: {
    init() {
      this.getAssetList()
      this.getMyAssetList()
    },
    initForm() {
      this.selectedForm = {
        myAssetId: '',
        assetId: '',
        myAssetNm: '',
        ticker: '',
        priceDivCd: '',
        price: 0,
        qty: 0.0,
        exchangeRateYn: 'N',
      }
    },
    delete(my_asset_id) {
      if (!confirm('자산을 삭제하시겠습니까?')) {
        return
      }
      var requestParam = {
        my_asset_id: my_asset_id,
      }

      axios
        .delete(this.serverSideUrl + '/my_asset', {
          data: requestParam,
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
      var requestParam = {
        my_asset_id: this.selectedForm.myAssetId,
        my_asset_nm: this.selectedForm.myAssetNm,
        asset_id: this.selectedForm.assetId,
        ticker: this.selectedForm.ticker,
        price_div_cd: this.selectedForm.priceDivCd,
        price: this.selectedForm.price,
        qty: this.selectedForm.qty,
        exchange_rate_yn: this.selectedForm.exchangeRateYn,
      }

      if (requestParam.my_asset_id == '') {
        axios
          .post(this.serverSideUrl + '/my_asset', requestParam)
          .then((res) => {
            if (res.data.result_message == 'SUCCESS') {
              this.createToast('등록 완료')
              this.init()
              requestParam = {}
            }
          })
          .then((err) => {
            console.log(err)
          })
      } else {
        axios
          .put(this.serverSideUrl + '/my_asset', requestParam)
          .then((res) => {
            if (res.data.result_message == 'SUCCESS') {
              this.createToast('수정 완료')
              this.init()
              requestParam = {}
            }
          })
          .then((err) => {
            console.log(err)
          })
      }
    },
    getMyAssetList() {
      var now = new Date()
      //var yesterday = new Date(now.setDate(now.getDate() - 1))
      this.procDt = dateToYYYYMMDD(now)

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
          this.items = result_data_info
        })
        .then((err) => {
          console.log(err)
        })
    },
    getAssetList() {
      // axios call
      axios
        .get(this.serverSideUrl + '/asset_list')
        .then((res) => {
          var result_data_info = res.data.result_data
          this.assetList = result_data_info
        })
        .then((err) => {
          console.log(err)
        })
    },
    comma(val) {
      return comma(val)
    },
    selectItem(item) {
      this.selectedForm = {
        assetId: item.asset_id,
        myAssetId: item.my_asset_id,
        myAssetNm: item.my_asset_nm,
        ticker: item.ticker,
        priceDivCd: item.price_div_cd,
        price: item.price,
        qty: item.qty,
        exchangeRateYn: item.exchange_rate_yn,
      }
      this.setPriceDivCd(item.price_div_cd)
    },
    createToast(content) {
      this.toasts.push({
        content: content,
      })
    },
    setPriceDivCd(val) {
      if (val == 'AUTO') {
        this.selectedForm.price = 0
        this.priceDisabled = true
      } else {
        this.priceDisabled = false
      }
    },
    strToYYYYMMDDHypen(val) {
      return strToYYYYMMDDHypen(val)
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
