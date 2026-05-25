<script setup lang="ts">
import { computed, ref } from 'vue'
import { validCodes } from '@/utils/code'
import { ElMessage } from 'element-plus'
import _ from 'lodash'

const props = defineProps<{
  type: string
}>()

const groupNums = ref('')
const groupNums2 = ref('')
const resultArr = ref<string[]>([])

const groupArr = computed(() => groupNums.value.trim().split(' ').filter(item => item.length > 0))
const groupArr2 = computed(() => groupNums2.value.trim().split(' ').filter(item => item.length > 0))
const resultNums = computed(() => resultArr.value.join(' '))

function diffCode() {
  const errCode = validCodes([...groupArr.value, ...groupArr2.value])
  if (errCode) {
    ElMessage({ message: `${errCode}不是三位数字, 请检查`, type: 'error', duration: 1000 })
    return
  }
  const arr1 = _.difference(groupArr.value, groupArr2.value)
  resultArr.value.splice(0, resultArr.value.length, ...arr1)
  ElMessage({ message: '计算完成', type: 'success', duration: 1000 })
}

function unionCode() {
  const errCode = validCodes([...groupArr.value, ...groupArr2.value])
  if (errCode) {
    ElMessage({ message: `${errCode}不是三位数字, 请检查`, type: 'error', duration: 1000 })
    return
  }
  const arr1 = _.intersection(groupArr.value, groupArr2.value)
  resultArr.value.splice(0, resultArr.value.length, ...arr1)
  ElMessage({ message: '计算完成', type: 'success', duration: 1000 })
}

function doCalc() {
  props.type === 'diff' ? diffCode() : unionCode()
}

function doClear() {
  groupNums.value = ''
  groupNums2.value = ''
  resultArr.value.splice(0, resultArr.value.length)
}

function deduplication1() {
  const arr = groupNums.value.trim().split(' ').filter(item => item.length > 0)
  groupNums.value = [...new Set(arr)].join(' ')
}

function deduplication2() {
  const arr = groupNums2.value.trim().split(' ').filter(item => item.length > 0)
  groupNums2.value = [...new Set(arr)].join(' ')
}

defineExpose({ resultNums, doCalc, doClear })
</script>

<template>
  <div class="content">
    <el-card class="area">
      <template #header>号码组1 (号码数: {{ groupArr.length }}个)</template>
      <div>
        <el-input type="textarea" autosize v-model="groupNums" @blur="deduplication1"
          placeholder="输入号码（空格分隔）"></el-input>
      </div>
    </el-card>
    <el-card class="area">
      <template #header>号码组2 (号码数: {{ groupArr2.length }}个)</template>
      <div>
        <el-input type="textarea" autosize v-model="groupNums2" @blur="deduplication2"
          placeholder="输入号码（空格分隔）"></el-input>
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
