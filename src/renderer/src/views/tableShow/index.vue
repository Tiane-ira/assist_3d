<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getNumObjByCodes, validCodes, CodeObj } from '@/utils/code'

const tableHeight = ref(window.innerHeight / 2)
const resultList = ref<CodeObj[]>([])
const codeNums = ref('')

const codeArr = computed(() => codeNums.value.trim().split(' ').filter(item => item.length > 0))

function doCalc() {
  const errCode = validCodes(codeArr.value)
  if (errCode) {
    ElMessage({ message: `${errCode}不是三位数字, 请检查`, type: 'error', duration: 1000 })
    return
  }
  resultList.value = getNumObjByCodes(codeArr.value)
}

function clearAll() {
  codeNums.value = ''
  resultList.value.splice(0, resultList.value.length)
}

function delCode(row: CodeObj) {
  const index = resultList.value.findIndex(item => item.code === row.code)
  resultList.value.splice(index, 1)
}

onMounted(() => {
  window.onresize = () => { tableHeight.value = window.innerHeight / 2 }
})
</script>

<template>
  <div class="main">
    <div class="area">
      <el-button type="primary" @click="doCalc">计算</el-button>
      <el-button type="primary" @click="clearAll">清空</el-button>
    </div>
    <el-card class="area">
      <template #header>待展示号码 ({{ codeArr.length }}个)</template>
      <div>
        <el-input type="textarea" autosize v-model="codeNums" placeholder="输入号码（空格分隔）" />
      </div>
    </el-card>
    <el-card class="area">
      <el-table :data="resultList" :max-height="tableHeight" style="width: 100%"
        :border="true" :header-cell-style="{ 'text-align': 'center' }">
        <el-table-column prop="code" label="号码" sortable align="center" />
        <el-table-column prop="sum" label="和值" sortable align="center" />
        <el-table-column prop="diff" sortable label="跨度" align="center" />
        <el-table-column prop="dzx" label="大小" align="center" />
        <el-table-column prop="lye" label="012路" align="center" />
        <el-table-column prop="smc" label="三码差" align="center" />
        <el-table-column prop="smh" label="三码合" align="center" />
        <el-table-column label="操作" align="center">
          <template v-slot="{ row }">
            <el-button @click.prevent="delCode(row as CodeObj)" type="text" size="small">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="area">
      <el-row :gutter="20">
        <el-col :span="12">
          <div><el-statistic :value="resultList.length" title="注数" /></div>
        </el-col>
        <el-col :span="12">
          <div><el-statistic :value="2 * resultList.length" title="金额" /></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped>
.main {
  margin: 20px;
}

.area {
  margin-bottom: 10px;
}
</style>
