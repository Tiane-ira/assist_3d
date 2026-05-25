<script setup lang="ts">
import { computed, ref, toRaw } from 'vue'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/stores'
import { getIgCounts, getNumDirect, getNumGroup } from '@/utils/code'
import { formatDate } from '@/utils/date'
import _ from 'lodash'

const store = useAppStore()
const loading = ref(false)
const hisShow = ref(false)
const configName = ref('')
const saveConfigShow = ref(false)

const activeTab = computed(() => store.activeTab)
const hundredList = computed(() => store.hundredList)
const tenList = computed(() => store.tenList)
const bitList = computed(() => store.bitList)
const groupList = computed(() => store.groupList)
const groupTypes = computed(() => store.groupTypes)
const igMin = computed(() => store.igMin)
const igMax = computed(() => store.igMax)
const resultList = computed(() => store.resultList)
const checkRules = computed(() => store.checkRules)
const codesResult = computed(() => store.codesResult)
const transCodes = computed(() => store.transCodes)
const shCodes = computed(() => store.shCodes)
const isGroup = computed(() => store.isGroup)
const orderType = computed(() => store.orderType)

const hisList = computed(() => {
  const hisArr: { id: number; name: string; label: string; createTime: string }[] = []
  for (const config of store.configList) {
    const labelArr: string[] = []
    for (const ruleItem of config.rule) {
      labelArr.push(ruleItem.title)
    }
    hisArr.push({
      id: config.id,
      name: config.name,
      label: labelArr.join(','),
      createTime: config.createTime
    })
  }
  return hisArr
})

async function getResult() {
  loading.value = true
  let codeList: string[]
  if (isGroup.value) {
    codeList = getNumGroup(groupList.value, groupTypes.value)
  } else {
    codeList = getNumDirect(bitList.value, tenList.value, hundredList.value, groupTypes.value)
  }
  _.pullAll(codeList, shCodes.value)

  const igCounts = getIgCounts(igMin.value, igMax.value)
  const zxsmcRule = checkRules.value.find((item: any) => item.label === 'zxsmc')

  try {
    let filteredCodeList = await window.electron.filterCodes(
      [...codeList],
      JSON.parse(JSON.stringify(toRaw(checkRules.value))),
      [...igCounts],
      orderType.value
    )
    if (zxsmcRule) {
      filteredCodeList = zxsmcFilterAndSort(filteredCodeList, zxsmcRule)
    }
    store.changeResultList(filteredCodeList)
    store.changeCodesResult(filteredCodeList)
    loading.value = false
    ElMessage.success('结果计算成功')
  } catch (e: any) {
    loading.value = false
    ElMessage.error('结果计算失败:' + e.toString())
  }
}

function zxsmcFilterAndSort(codeList: string[], rule: any): string[] {
  const codePool = rule.checks
  const filterCodeItems = codeList.map((code: string) => {
    const hun = parseInt(code[0])
    const ten = parseInt(code[1])
    const bit = parseInt(code[2])
    const highDiff = Math.abs(hun - ten)
    const midDiff = Math.abs(hun - bit)
    const lowDiff = Math.abs(ten - bit)
    const smcCode = `${highDiff}${midDiff}${lowDiff}`
    return { code, smcCode }
  }).filter((item: { code: string; smcCode: string }) => codePool.includes(item.smcCode))
  filterCodeItems.sort((a: { code: string; smcCode: string }, b: { code: string; smcCode: string }) => {
    return codePool.indexOf(a.smcCode) - codePool.indexOf(b.smcCode)
  })
  return filterCodeItems.map((item: { code: string; smcCode: string }) => item.code)
}

function copyResult() {
  if (resultList.value.length === 0) {
    ElMessage.error('结果为空无法复制')
    return
  }
  window.electron.copy2Clipboard(codesResult.value)
  ElMessage.success({ message: `已复制${resultList.value.length}个结果`, duration: 1000 })
}

function showSaveRule() {
  configName.value = ''
  saveConfigShow.value = true
}

function showRuleHis() {
  hisShow.value = true
}

function delConfig(index: number) {
  store.deleteConfig(index)
  ElMessage.success('删除条件成功')
}

function applyConfig(index: number) {
  store.setConfig(index)
  ElMessage.success('应用条件成功')
  hisShow.value = false
}

function saveConfig() {
  const config = {
    id: Date.now(),
    name: configName.value,
    rule: structuredClone(checkRules.value),
    hun: structuredClone(hundredList.value),
    ten: structuredClone(tenList.value),
    bit: structuredClone(bitList.value),
    group: structuredClone(groupList.value),
    groupType: structuredClone(groupTypes.value),
    igMin: igMin.value,
    igMax: igMax.value,
    createTime: formatDate(new Date())
  }
  store.saveConfig(config)
  saveConfigShow.value = false
  ElMessage.success('保存条件成功')
}

function copyTransResult() {
  if (resultList.value.length === 0) {
    ElMessage.error('结果为空无法复制')
    return
  }
  window.electron.copy2Clipboard(transCodes.value.join(' '))
  ElMessage.success(`已复制组转直的${transCodes.value.length}个结果`)
}

function openConvertTool() {
  window.electron.openWindow({ title: '转换工具', url: '/convert', width: 800, height: 800 })
}

function openTableTool() {
  window.electron.openWindow({ title: '展示工具', url: '/tableShow', width: 800, height: 800 })
}
</script>

<template>
  <div class="res-op">
    <el-button :loading="loading" type="primary" size="mini" @click="getResult">获取结果</el-button>
    <el-button :disabled="!resultList.length" type="warning" size="mini" @click="copyResult">复制结果</el-button>
    <el-button :disabled="!checkRules.length" type="primary" size="mini" @click="showSaveRule">保存条件</el-button>
    <el-button type="warning" @click="showRuleHis" size="mini">条件历史</el-button>
    <el-button type="primary" @click="openConvertTool" size="mini">转换工具</el-button>
    <el-button type="danger" @click="openTableTool" size="mini">展示工具</el-button>

    <el-dialog v-model="hisShow" center title="条件历史列表" width="60%">
      <el-table ref="hisTable" :border="true" :data="hisList" :header-cell-style="{ 'text-align': 'center' }">
        <el-table-column align="center" label="序号" type="index" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="条件" prop="label" show-overflow-tooltip />
        <el-table-column align="center" label="保存时间" prop="createTime" width="160" />
        <el-table-column align="center" label="操作" width="200">
          <template v-slot="{ $index }">
            <el-button size="mini" type="success" @click.prevent="applyConfig($index)">使用</el-button>
            <el-button size="mini" type="danger" @click.prevent="delConfig($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog v-model="saveConfigShow" center title="保存条件" width="60%">
      <div>
        <el-input v-model="configName" placeholder="输入条件集的名称" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="saveConfigShow = false">取 消</el-button>
          <el-button type="primary" @click="saveConfig">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.res-op {
  margin-bottom: 10px;
}
</style>
