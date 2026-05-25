<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAppStore } from '@/stores'
import DirectCheck from './DirectCheck/index.vue'
import GroupCheck from './GroupCheck/index.vue'

const store = useAppStore()
const activeTab = ref('group')

watch(activeTab, (val: string) => {
  store.changeCheckTab(val)
})
</script>

<template>
  <div class="num-checker">
    <el-tabs v-model="activeTab" class="check">
      <el-tab-pane label="组选" name="group">
        <GroupCheck />
      </el-tab-pane>
      <el-tab-pane label="直选" name="direct">
        <DirectCheck />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.num-checker {
  margin-bottom: 5px;
}
</style>
