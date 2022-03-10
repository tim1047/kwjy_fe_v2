<template>
  <CHeader position="sticky" class="mb-4">
    <CContainer fluid>
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CAvatar
        class="mx-auto d-lg-none"
        size="md"
        :src="coupleAvatar"
        status="success"
      />
    </CContainer>
    <CHeaderDivider />
    <CContainer fluid>
      <AppBreadcrumb />
      <CHeaderDivider />
      <CFormSelect
        id="accountDt"
        @change="setDate($event.target.value)"
        v-model="this.accountDt"
      >
        <option
          v-for="accountDt in accountDtList"
          :key="accountDt"
          :value="accountDt"
        >
          {{
            accountDt.substring(0, 4) + '년 ' + accountDt.substring(4, 6) + '월'
          }}
        </option>
      </CFormSelect>
    </CContainer>
  </CHeader>
</template>

<script>
import AppBreadcrumb from './AppBreadcrumb'
import { logo } from '@/assets/brand/logo'
import coupleAvatar from '@/assets/images/avatars/couple.png'

export default {
  name: 'AppHeader',
  components: {
    AppBreadcrumb,
  },
  setup() {
    return {
      logo,
      coupleAvatar,
    }
  },
  data() {
    return {
      accountDtList: [],
      accountDt:
        this.$store.state.date.curYear +
        ('0' + this.$store.state.date.curMonth).slice(-2),
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      var year = this.$store.state.date.curYear
      var month = this.$store.state.date.curMonth

      this.accountDtList = []
      for (var j = 2021; j <= year; j++) {
        for (var i = 1; i <= 12; i++) {
          this.accountDtList.push(String(j) + ('0' + String(i)).slice(-2))
          if (j == year && i == month) {
            break
          }
        }
      }
      this.accountDtList.sort(function (a, b) {
        return b - a
      })
    },
    setDate(val) {
      this.$store.commit('setYear', Number(val.substring(0, 4)))
      this.$store.commit('setMonth', Number(val.substring(4, 6)))
    },
  },
}
</script>
