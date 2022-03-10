<template>
  <CSidebar
    position="fixed"
    :unfoldable="sidebarUnfoldable"
    :visible="sidebarVisible"
    @visible-change="
      (event) =>
        $store.commit({
          type: 'updateSidebarVisible',
          value: event,
        })
    "
  >
    <CSidebarBrand>
      <CAvatar size="md" :src="coupleAvatar" status="success" />
    </CSidebarBrand>
    <AppSidebarNav />
    <CSidebarToggler
      class="d-none d-lg-flex"
      @click="$store.commit('toggleUnfoldable')"
    />
  </CSidebar>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { AppSidebarNav } from './AppSidebarNav'
import coupleAvatar from '@/assets/images/avatars/couple.png'

export default {
  name: 'AppSidebar',
  components: {
    AppSidebarNav,
  },
  setup() {
    const store = useStore()
    return {
      sidebarUnfoldable: computed(() => store.state.sidebarUnfoldable),
      sidebarVisible: computed(() => store.state.sidebarVisible),
      coupleAvatar,
    }
  },
}
</script>
