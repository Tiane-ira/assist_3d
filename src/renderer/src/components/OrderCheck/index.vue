<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAppStore } from '@/stores'

const store = useAppStore()
const orderType = ref(false)

watch(orderType, () => {
  store.changeOrderType()
})
</script>

<template>
  <div class="order-type">
    <el-checkbox v-model="orderType">交叉排列</el-checkbox>
  </div>
</template>

<style scoped>
.order-type {
  margin-left: 15px;
}
</style>
