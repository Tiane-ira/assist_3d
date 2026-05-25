<script setup lang="ts">
import { computed, ref } from 'vue'
import { direct2Group, group2Direct, validCodes } from '@/utils/code'
import { ElMessage } from 'element-plus'
import _ from 'lodash'

const props = defineProps<{
  type: string
}>()

const groupNums = ref('')
const resultArr = ref<string[]>([])

const groupArr = computed(() => groupNums.value.trim().split(' ').filter(item => item.length > 0))
const resultNums = computed(() => resultArr.value.join(' '))

function zu2zhi() {
  const errCode = validCodes(groupArr.value)
  if (errCode) {
    ElMessage({ message: `${errCode}不是三位数字, 请检查`, type: 'error', duration: 1000 })
    return
  }
  let directArr: string[] = []
  for (const code of groupArr.value) {
    directArr = [...directArr, ...group2Direct([...code])]
  }
  directArr = _.uniq(directArr)
  resultArr.value.splice(0, resultArr.value.length, ...directArr)
  ElMessage({ message: '计算完成', type: 'success', duration: 1000 })
}

function zhi2zu() {
  const errCode = validCodes(groupArr.value)
  if (errCode) {
    ElMessage({ message: `${errCode}不是三位数字, 请检查`, type: 'error', duration: 1000 })
    return
  }
  let newArr: string[] = []
  for (const code of groupArr.value) {
    newArr = [...newArr, direct2Group(code)]
  }
  newArr = _.uniq(newArr)
  resultArr.value.splice(0, resultArr.value.length, ...newArr)
  ElMessage({ message: '计算完成', type: 'success', duration: 1000 })
}

function doCalc() {
  props.type === 'group' ? zu2zhi() : zhi2zu()
}

function doClear() {
  groupNums.value = ''
  resultArr.value.splice(0, resultArr.value.length)
}

defineExpose({ resultNums, doCalc, doClear })
</script>

<template>
  <div class="content">
    <el-card class="area">
      <template #header>{{ type === 'group' ? '组选号码' : '直选号码' }} (号码数: {{ groupArr.length }}个)</template>
      <div>
        <el-input type="textarea" autosize v-model="groupNums" placeholder="输入号码（空格分隔）"></el-input>
      </div>
    </el-card>
    <el-card class="area">
      <template #header>计算结果 (号码数: {{ resultArr.length }}个)</template>
      <div>
        <div class="result">{{ resultNums }}</div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.area {
  margin-bottom: 10px;
}

.result {
  font-size: 14px;
  color: #606266;
}
</style>
