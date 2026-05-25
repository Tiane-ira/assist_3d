<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import DiffUnion from '@/components/Convert/DiffUnion.vue'
import DirGroupTrans from '@/components/Convert/DirGroupTrans.vue'

const modes = ['组转直', '直转组', '差集', '交集']
const types = ['group', 'direct', 'diff', 'union']
const currentMode = ref(0)

const ref1 = ref<InstanceType<typeof DirGroupTrans>>()
const ref2 = ref<InstanceType<typeof DiffUnion>>()

const isDiffUnion = computed(() => currentMode.value > 1)

function clearAll() {
  if (isDiffUnion.value) ref2.value?.doClear()
  else ref1.value?.doClear()
}

function getResult() {
  if (isDiffUnion.value) ref2.value?.doCalc()
  else ref1.value?.doCalc()
}

function copyResult() {
  const resultNums = isDiffUnion.value ? ref2.value?.resultNums : ref1.value?.resultNums
  window.electron.copy2Clipboard(resultNums || '')
  ElMessage.success({ message: '已复制结果', duration: 1000 })
}

function openTableTool() {
  window.electron.openWindow({ title: '展示工具', url: '/tableShow', width: 800, height: 800 })
}
</script>

<template>
  <div class="main">
    <div class="top">
      <div>
        <el-button type="primary" @click="getResult">计算</el-button>
        <el-button type="primary" @click="clearAll">清空</el-button>
        <el-button type="warning" @click="copyResult">复制结果</el-button>
        <el-button type="danger" @click="openTableTool">展示工具</el-button>
      </div>
      <div>
        <el-select v-model="currentMode" placeholder="选择模式">
          <el-option v-for="(item, index) in modes" :key="index" :label="item" :value="index" />
        </el-select>
      </div>
    </div>

    <DirGroupTrans ref="ref1" v-if="!isDiffUnion" :type="types[currentMode]" />
    <DiffUnion ref="ref2" v-else :type="types[currentMode]" />
  </div>
</template>

<style scoped>
.main {
  margin: 20px;
}

.top {
  display: flex;
  justify-content: space-between;
  height: 50px;
}
</style>
