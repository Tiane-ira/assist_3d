<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/stores'
import { direct2Group, getSeqArr, validCodes } from '@/utils/code'
import { all012l, allDzx, allHmxt, allJiOu, allJodw, allMCSM, allSmc as allZxsmc } from '@/config'
import _ from 'lodash'
import IgnoreErrorCheck from '@/components/IgnoreErrorCheck/index.vue'
import OrderCheck from '@/components/OrderCheck/index.vue'

const store = useAppStore()

const activeTab = computed(() => store.activeTab)
const shCodes = computed(() => store.shCodes)

const checkRules = computed({
  get: () => store.checkRules,
  set: (val: any[]) => store.changeCheckRules(val)
})

const shGroup = computed(() => {
  const arr = shRule.shInput.trim().split(' ').filter(item => item.length > 0)
  return [...new Set(arr)]
})

// Dialog state objects
function makeNormalRule() {
  return { show: false, ruleTip: null as string | null, title: null as string | null, label: '', valList: [] as string[], id: null as number | null, checks: [] as string[] }
}

function makeDmzRule() {
  return {
    show: false, title: '', label: '', id: null as number | null,
    checks: [
      { label: '', values: [] as number[], counts: [] as number[] },
      { label: '', values: [] as number[], counts: [] as number[] },
      { label: '', values: [] as number[], counts: [] as number[] }
    ]
  }
}

function makeDzRule() {
  return {
    show: false, title: '', label: '', id: null as number | null,
    checks: [
      { label: '', values: [] as number[] },
      { label: '', values: [] as number[] },
      { label: '', values: [] as number[] }
    ]
  }
}

function makeSzsRule() {
  return {
    show: false, title: '', label: '', id: null as number | null,
    checks: [
      { label: '', values: [] as number[] },
      { label: '', values: [] as number[] },
      { label: '', values: [] as number[] }
    ],
    conditionNums: ['3'] as string[]
  }
}

function makeFstjRule() {
  return {
    show: false, title: '', label: '', id: null as number | null,
    checks: [
      { label: '', valuesAll: ['复复复', '隔隔隔', '中中中', '复隔中', '复复隔', '复复中', '隔隔复', '隔隔中', '中中复', '中中隔'], values: [] as string[], numArr: { nums1: [] as number[], nums2: [] as number[], nums3: [] as number[] } },
      { label: '', valuesAll: ['重重重', '斜斜斜', '跳跳跳', '重斜跳', '重重斜', '重重跳', '斜斜重', '斜斜跳', '跳跳重', '跳跳斜'], values: [] as string[], numArr: { nums1: [] as number[], nums2: [] as number[], nums3: [] as number[] } },
      { label: '', valuesAll: ['邻邻邻', '孤孤孤', '传传传', '邻孤传', '邻邻孤', '邻邻传', '孤孤邻', '孤孤传', '传传邻', '传传孤'], values: [] as string[], numArr: { nums1: [] as number[], nums2: [] as number[], nums3: [] as number[] } },
      { label: '', valuesAll: ['热热热', '温温温', '冷冷冷', '热温冷', '热热温', '热热冷', '温温热', '温温冷', '冷冷热', '冷冷温'], values: [] as string[], numArr: { nums1: [] as number[], nums2: [] as number[], nums3: [] as number[] } }
    ],
    conditionNums: ['4'] as string[]
  }
}

const normalRule = reactive(makeNormalRule())
const dmzRule = reactive(makeDmzRule())
const dzRule = reactive(makeDzRule())
const szsRule = reactive(makeSzsRule())
const fstjRule = reactive(makeFstjRule())
const shRule = reactive({ show: false, title: '', shInput: '' })

function resetNormalRule() { Object.assign(normalRule, makeNormalRule()) }
function resetDmzRule() { Object.assign(dmzRule, makeDmzRule()) }
function resetDzRule() { Object.assign(dzRule, makeDzRule()) }
function resetSzsRule() { Object.assign(szsRule, makeSzsRule()) }
function resetFstjRule() { Object.assign(fstjRule, makeFstjRule()) }

function changeIg(checked: boolean) {
  store.changeIgnoreErr(checked)
}

function showRule(label: string) {
  if (label === 'jo') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '奇偶'; normalRule.valList = structuredClone(allJiOu as unknown as string[])
  } else if (label === 'hz') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '和值'; normalRule.valList = getSeqArr(27)
  } else if (label === 'kd') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '跨度'; normalRule.valList = getSeqArr(9)
  } else if (label === 'lmh') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '任意两码合'; normalRule.valList = getSeqArr(9)
  } else if (label === 'rylmc') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '任意两码差'; normalRule.valList = getSeqArr(9)
  } else if (label === 'zxlmh') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '最小两码合'; normalRule.valList = getSeqArr(9)
  } else if (label === 'zjlmh') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '中间两码合'; normalRule.valList = getSeqArr(9)
  } else if (label === 'zdlmh') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '最大两码合'; normalRule.valList = getSeqArr(9)
  } else if (label === 'zdz') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '最大值'; normalRule.valList = getSeqArr(9)
  } else if (label === 'zjz') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '中间值'; normalRule.valList = getSeqArr(9)
  } else if (label === 'zxz') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '最小值'; normalRule.valList = getSeqArr(9)
  } else if (label === 'dzx') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '大中小'; normalRule.valList = structuredClone(allDzx as unknown as string[])
  } else if (label === '012l') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '012路'; normalRule.valList = structuredClone(all012l as unknown as string[])
  } else if (label === 'hz2') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '合值'; normalRule.valList = getSeqArr(9)
  } else if (label === 'mcsm') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '码差三码'; normalRule.valList = structuredClone(allMCSM as unknown as string[])
  } else if (label === 'hmxt') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '号码形态'; normalRule.valList = structuredClone(allHmxt as unknown as string[])
  } else if (label === 'jodw') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '奇偶定位'; normalRule.valList = structuredClone(allJodw as unknown as string[])
  } else if (label === 'zxsmc') {
    resetNormalRule()
    normalRule.show = true; normalRule.label = label; normalRule.title = '直选三码差'; normalRule.valList = structuredClone(allZxsmc as unknown as string[])
  } else if (label === 'dmz') {
    resetDmzRule()
    dmzRule.show = true; dmzRule.label = label; dmzRule.title = '胆码组'
    dmzRule.checks[0].label = '胆组1'; dmzRule.checks[1].label = '胆组2'; dmzRule.checks[2].label = '胆组3'
  } else if (label === 'dz') {
    resetDzRule()
    dzRule.show = true; dzRule.label = label; dzRule.title = '断组'
    dzRule.checks[0].label = '断组1'; dzRule.checks[1].label = '断组2'; dzRule.checks[2].label = '断组3'
  } else if (label === 'dzxs') {
    resetSzsRule()
    szsRule.show = true; szsRule.label = label; szsRule.title = '大中小数'
    szsRule.checks[0].label = '最大数'; szsRule.checks[1].label = '中间数'; szsRule.checks[2].label = '最小数'
  } else if (label === 'dzxlmh') {
    resetSzsRule()
    szsRule.show = true; szsRule.label = label; szsRule.title = '大中小两码合'
    szsRule.checks[0].label = '最大两码合'; szsRule.checks[1].label = '中间两码合'; szsRule.checks[2].label = '最小两码合'
  } else if (label === 'dzxlmc') {
    resetSzsRule()
    szsRule.show = true; szsRule.label = label; szsRule.title = '大中小两码差'
    szsRule.checks[0].label = '最大两码差'; szsRule.checks[1].label = '中间两码差'; szsRule.checks[2].label = '最小两码差'
  } else if (label === 'fstj') {
    resetFstjRule()
    fstjRule.show = true; fstjRule.label = label; fstjRule.title = '复式条件'
    fstjRule.checks[0].label = '复隔中'; fstjRule.checks[1].label = '重斜跳'; fstjRule.checks[2].label = '邻孤传'; fstjRule.checks[3].label = '热温冷'
  } else if (label === 'ecdw') {
    resetSzsRule()
    szsRule.show = true; szsRule.label = label; szsRule.title = '二次定位'
    szsRule.checks[0].label = '百位'; szsRule.checks[1].label = '十位'; szsRule.checks[2].label = '个位'
  } else if (label === 'sh') {
    shRule.show = true
    shRule.title = '杀号'
    shRule.shInput = shCodes.value.join(' ')
  }
}

function reverseRule(type: string) {
  if (type === 'normal') {
    normalRule.checks = normalRule.valList.filter((item: string) => normalRule.checks.indexOf(item) === -1)
  }
}

function cancelRule(type: string) {
  if (type === 'normal') resetNormalRule()
  else if (type === 'dmz') resetDmzRule()
  else if (type === 'dz') resetDzRule()
  else if (type === 'szs') resetSzsRule()
  else if (type === 'fstj') resetFstjRule()
  else if (type === 'sh') { shRule.show = false; shRule.shInput = '' }
}

function saveNormalRule() {
  if (normalRule.checks.length === 0) {
    ElMessage.warning('至少需要选择一个条件才能保存!')
    return
  }
  if (normalRule.id) {
    const rule = checkRules.value.find((item: any) => item.id === normalRule.id)
    if (rule) rule.checks = normalRule.checks
  } else {
    const rule = {
      id: Date.now(), title: normalRule.title, label: normalRule.label,
      type: 'normal', ignore: false, isOrder: false, checks: normalRule.checks
    }
    checkRules.value.push(rule)
  }
  resetNormalRule()
}

function saveDmzRule() {
  const dmzChecks = dmzRule.checks
  if (dmzChecks[0].values.length === 0 && dmzChecks[1].values.length === 0 && dmzChecks[2].values.length === 0) {
    ElMessage.warning('至少需要选择一个条件才能保存!')
    return
  }
  if ((dmzChecks[0].values.length !== 0 && dmzChecks[0].counts.length === 0) ||
      (dmzChecks[1].values.length !== 0 && dmzChecks[1].counts.length === 0) ||
      (dmzChecks[2].values.length !== 0 && dmzChecks[2].counts.length === 0)) {
    ElMessage.warning('胆组出现个数必选')
    return
  }
  if (dmzRule.id) {
    const rule = checkRules.value.find((item: any) => item.id === dmzRule.id)
    if (rule) {
      rule.checks[0].values = dmzChecks[0].values; rule.checks[0].counts = dmzChecks[0].counts
      rule.checks[1].values = dmzChecks[1].values; rule.checks[1].counts = dmzChecks[1].counts
      rule.checks[2].values = dmzChecks[2].values; rule.checks[2].counts = dmzChecks[2].counts
    }
  } else {
    checkRules.value.push({
      id: Date.now(), title: dmzRule.title, label: dmzRule.label,
      type: 'dmz', ignore: false, isOrder: false, checks: dmzChecks
    })
  }
  resetDmzRule()
}

function saveDzRule() {
  const dzChecks = dzRule.checks
  if (dzChecks[0].values.length === 0 || dzChecks[1].values.length === 0 || dzChecks[2].values.length === 0) {
    ElMessage.warning('断组的三个分组都必须选择!')
    return
  }
  if (dzRule.id) {
    const rule = checkRules.value.find((item: any) => item.id === dzRule.id)
    if (rule) {
      rule.checks[0].values = dzChecks[0].values; rule.checks[1].values = dzChecks[1].values; rule.checks[2].values = dzChecks[2].values
    }
  } else {
    checkRules.value.push({
      id: Date.now(), title: dzRule.title, label: dzRule.label,
      type: 'dz', ignore: false, isOrder: false, checks: dzChecks
    })
  }
  resetDzRule()
}

function getSzsAll(index: number, label: string): number[] {
  if (label === 'dzxlmc' && index === 2) return [0, 1, 2, 3, 4]
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
}

function szsRuleAll(index: number, label: string) {
  szsRule.checks[index].values.splice(0, szsRule.checks[index].values.length, ...getSzsAll(index, label))
}

function szsRuleReverse(index: number, label: string) {
  const all = getSzsAll(index, label)
  const reverseArr = all.filter((num: number) => szsRule.checks[index].values.indexOf(num) === -1)
  szsRule.checks[index].values.splice(0, szsRule.checks[index].values.length, ...reverseArr)
}

function saveSzsRule() {
  if (szsRule.id) {
    const rule = checkRules.value.find((item: any) => item.id === szsRule.id)
    if (rule) {
      rule.checks = szsRule.checks
      rule.conditionNums = szsRule.conditionNums
    }
  } else {
    checkRules.value.push({
      id: Date.now(), title: szsRule.title, label: szsRule.label,
      type: 'szs', ignore: false, isOrder: false,
      checks: szsRule.checks, conditionNums: szsRule.conditionNums
    })
  }
  resetSzsRule()
}

function checkFstj(): string | undefined {
  for (const check of fstjRule.checks) {
    const countMap = new Map<number, number>()
    for (const item of [...check.numArr.nums1, ...check.numArr.nums2, ...check.numArr.nums3]) {
      if (countMap.has(item)) {
        countMap.set(item, countMap.get(item)! + 1)
      } else {
        countMap.set(item, 1)
      }
    }
    for (const [key, value] of countMap) {
      if (value > 1) {
        return `${check.label}: ${key}重复出现${value}次, 请检查`
      }
    }
  }
}

function saveFstjRule() {
  const checkMsg = checkFstj()
  if (checkMsg) {
    ElMessage.error({ message: checkMsg, duration: 1000 })
    return
  }
  if (fstjRule.id) {
    const rule = checkRules.value.find((item: any) => item.id === fstjRule.id)
    if (rule) {
      rule.checks = fstjRule.checks
      rule.conditionNums = fstjRule.conditionNums
    }
  } else {
    checkRules.value.push({
      id: Date.now(), title: fstjRule.title, label: fstjRule.label,
      type: 'fstj', ignore: false, isOrder: false,
      checks: fstjRule.checks, conditionNums: fstjRule.conditionNums
    })
  }
  resetFstjRule()
}

function changeRule(index: number) {
  const checkRule = checkRules.value[index]
  if (checkRule.type === 'normal') {
    normalRule.id = checkRule.id
    normalRule.checks = structuredClone(checkRule.checks)
    showRule(checkRule.label)
  } else if (checkRule.type === 'dmz') {
    dmzRule.id = checkRule.id
    dmzRule.checks = structuredClone(checkRule.checks)
    showRule(checkRule.label)
  } else if (checkRule.type === 'dz') {
    dzRule.id = checkRule.id
    dzRule.checks = structuredClone(checkRule.checks)
    showRule(checkRule.label)
  } else if (checkRule.type === 'szs') {
    szsRule.id = checkRule.id
    szsRule.checks = structuredClone(checkRule.checks)
    szsRule.conditionNums = checkRule.conditionNums
    showRule(checkRule.label)
  } else if (checkRule.type === 'fstj') {
    fstjRule.id = checkRule.id
    fstjRule.checks = structuredClone(checkRule.checks)
    fstjRule.conditionNums = checkRule.conditionNums
    showRule(checkRule.label)
  }
}

function delRule(index: number) {
  checkRules.value.splice(index, 1)
  store.resetIgnoreErr()
}

function saveShRule() {
  const errCode = validCodes(shGroup.value)
  if (errCode) {
    ElMessage({ message: `${errCode}不是三位数字, 请检查`, type: 'error', duration: 1000 })
    return
  }
  if (activeTab.value === 'direct') {
    store.setShCodes(shGroup.value)
  } else {
    let newArr: string[] = []
    for (const code of shGroup.value) {
      newArr = [...newArr, direct2Group(code)]
    }
    newArr = _.uniq(newArr)
    store.setShCodes(newArr)
  }
  shRule.show = false
}

function clearShCodes() {
  store.setShCodes([])
}

store.loadConfig()
</script>

<template>
  <div class="rule-option">
    <el-card>
      <div class="row">
        <el-button class="rule" size="small" type="success" @click="showRule('hz2')">合值</el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('kd')">跨度</el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('012l')">012路</el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('dzx')">大中小</el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('rylmc')">任意两码差</el-button>
      </div>
      <div class="row">
        <el-button class="rule" size="small" type="success" @click="showRule('lmh')">两码合</el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('zxlmh')">最小两码合</el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('zjlmh')">中间两码合</el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('zdlmh')">最大两码合</el-button>
      </div>
      <div class="row">
        <el-button class="rule" size="small" type="success" @click="showRule('mcsm')">码差三码</el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('zdz')">最大值</el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('hz')">和值</el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('jo')">奇偶</el-button>
      </div>

      <div class="row" v-if="activeTab === 'direct'">
        <el-button class="rule" size="small" type="success" @click="showRule('hmxt')">号码形态</el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('jodw')">奇偶定位</el-button>
        <el-button v-if="activeTab === 'direct'" class="rule" size="small" type="success" @click="showRule('zxsmc')">直选三码差</el-button>
      </div>

      <div class="row">
        <el-button class="rule" size="small" type="warning" @click="showRule('dmz')">胆码组</el-button>
        <el-button class="rule" size="small" type="warning" @click="showRule('dz')">断组</el-button>
        <el-button class="rule" size="small" type="warning" @click="showRule('dzxs')">大中小数</el-button>
        <el-button class="rule" size="small" type="warning" @click="showRule('dzxlmh')">大中小两码合</el-button>
        <el-button class="rule" size="small" type="warning" @click="showRule('dzxlmc')">大中小两码差</el-button>
        <el-button class="rule" size="small" type="warning" @click="showRule('fstj')">复式条件</el-button>
      </div>
      <div class="row">
        <el-button class="rule" size="small" type="warning" @click="showRule('sh')">杀号</el-button>
        <el-button v-if="activeTab === 'direct'" class="rule" size="small" type="warning" @click="showRule('ecdw')">二次定位</el-button>
      </div>
    </el-card>

    <el-card v-if="shCodes.length" style="margin-top: 5px;">
      <div class="sh-rule">
        <div><span>杀号：{{ shCodes }}</span></div>
        <div>
          <el-button size="mini" type="warning" @click="showRule('sh')">修改</el-button>
          <el-button size="mini" type="danger" @click="clearShCodes">清除</el-button>
        </div>
      </div>
    </el-card>

    <!-- Normal rule dialog -->
    <el-dialog :title="normalRule.title" v-model="normalRule.show" center width="80%">
      <div class="rule-form">
        <div v-if="normalRule.ruleTip" style="padding-bottom: 5px">
          <span>{{ normalRule.ruleTip }}:</span>
        </div>
        <el-checkbox-group v-model="normalRule.checks" size="mini">
          <el-checkbox-button v-for="(item, index) in normalRule.valList" :key="index" :label="item">
            {{ item }}
          </el-checkbox-button>
        </el-checkbox-group>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reverseRule('normal')">排 除</el-button>
          <el-button @click="cancelRule('normal')">取 消</el-button>
          <el-button type="primary" @click="saveNormalRule">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 胆码组 dialog -->
    <el-dialog :title="dmzRule.title" v-model="dmzRule.show" center width="90%">
      <div class="rule-form">
        <div v-for="(rule, index) in dmzRule.checks" :key="index" class="item-rule">
          <div class="title"><span>{{ rule.label }}:</span></div>
          <el-checkbox-group v-model="rule.values" size="mini" class="irc-group">
            <el-checkbox-button v-for="num in 10" :key="num" :label="num - 1">{{ num - 1 }}</el-checkbox-button>
          </el-checkbox-group>
          <div class="title"><span>出现:</span></div>
          <el-checkbox-group v-model="rule.counts" size="mini">
            <el-checkbox v-for="count in 4" :key="count - 1" :label="count - 1">{{ count - 1 }}个</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelRule('dmz')">取 消</el-button>
          <el-button type="primary" @click="saveDmzRule">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 断组 dialog -->
    <el-dialog :title="dzRule.title" v-model="dzRule.show" center width="90%">
      <div class="rule-form">
        <div v-for="(rule, index) in dzRule.checks" :key="index" class="item-rule">
          <div class="title"><span>{{ rule.label }}:</span></div>
          <el-checkbox-group v-model="rule.values" size="mini">
            <el-checkbox-button v-for="num in 10" :key="num" :label="num - 1">{{ num - 1 }}</el-checkbox-button>
          </el-checkbox-group>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelRule('dz')">取 消</el-button>
          <el-button type="primary" @click="saveDzRule">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 三组数 dialog -->
    <el-dialog :title="szsRule.title" v-model="szsRule.show" center width="90%">
      <div class="rule-form">
        <div v-for="(rule, index) in szsRule.checks" :key="index" class="item-rule">
          <div class="title"><span>{{ rule.label }}:</span></div>
          <el-checkbox-group v-if="szsRule.label === 'dzxlmc' && index === 2" v-model="rule.values" size="mini" class="irc-group">
            <el-checkbox-button v-for="num in 5" :key="num" :label="num - 1">{{ num - 1 }}</el-checkbox-button>
          </el-checkbox-group>
          <el-checkbox-group v-else v-model="rule.values" size="mini" class="irc-group">
            <el-checkbox-button v-for="num in 10" :key="num" :label="num - 1">{{ num - 1 }}</el-checkbox-button>
          </el-checkbox-group>
          <el-button type="danger" size="mini" @click="szsRuleAll(index, szsRule.label)">全选</el-button>
          <el-button type="danger" size="mini" @click="szsRuleReverse(index, szsRule.label)">反选</el-button>
        </div>
        <div class="rule-foot">
          <span class="rule-foot-title">满足:</span>
          <el-checkbox-group v-model="szsRule.conditionNums">
            <el-checkbox label="0">0个</el-checkbox>
            <el-checkbox label="1">1个</el-checkbox>
            <el-checkbox label="2">2个</el-checkbox>
            <el-checkbox label="3">3个</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelRule('szs')">取 消</el-button>
          <el-button type="primary" @click="saveSzsRule">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 复式条件 dialog -->
    <el-dialog :title="fstjRule.title" v-model="fstjRule.show" center width="90%">
      <div class="rule-form">
        <div v-for="(rule, index) in fstjRule.checks" :key="index" class="item-rule">
          <div class="title"><span>{{ rule.label }}:</span></div>
          <div class="fs-item">
            <el-checkbox-group v-model="rule.numArr.nums1" size="mini" class="irc-group">
              <el-checkbox-button v-for="num in 10" :key="num" :label="num - 1">{{ num - 1 }}</el-checkbox-button>
            </el-checkbox-group>
            <el-checkbox-group v-model="rule.numArr.nums2" size="mini" class="irc-group">
              <el-checkbox-button v-for="num in 10" :key="num" :label="num - 1">{{ num - 1 }}</el-checkbox-button>
            </el-checkbox-group>
            <el-checkbox-group v-model="rule.numArr.nums3" size="mini" class="irc-group">
              <el-checkbox-button v-for="num in 10" :key="num" :label="num - 1">{{ num - 1 }}</el-checkbox-button>
            </el-checkbox-group>
            <el-checkbox-group v-model="rule.values" size="mini" class="irc-group">
              <el-checkbox-button v-for="(item, idx) in rule.valuesAll" :key="idx" :label="item">{{ item }}</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <div class="rule-foot">
          <span class="rule-foot-title">满足:</span>
          <el-checkbox-group v-model="fstjRule.conditionNums">
            <el-checkbox label="0">0个</el-checkbox>
            <el-checkbox label="1">1个</el-checkbox>
            <el-checkbox label="2">2个</el-checkbox>
            <el-checkbox label="3">3个</el-checkbox>
            <el-checkbox label="4">4个</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelRule('fstj')">取 消</el-button>
          <el-button type="primary" @click="saveFstjRule">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 杀号 dialog -->
    <el-dialog :title="shRule.title" v-model="shRule.show" center width="90%">
      <div class="rule-form">
        <el-input v-model="shRule.shInput" placeholder="输入杀号数字" type="textarea"></el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelRule('sh')">取 消</el-button>
          <el-button type="primary" @click="saveShRule">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-card style="margin-top: 5px">
      <div class="rule-list">
        <span v-if="!checkRules.length">暂无条件</span>
        <div v-for="(item, index) in checkRules" :key="item.id" class="rule-item">
          <div class="title">
            <div class="name">
              <span>【{{ index + 1 }}】{{ item.title }}</span>
            </div>
            <div class="operator">
              <el-checkbox v-if="item.type == 'normal' && item.label != 'zxsmc'" v-model="item.isOrder" style="margin-right: 10px">排序</el-checkbox>
              <el-checkbox v-model="item.ignore" v-if="item.type == 'normal' && item.label != 'zxsmc'" style="margin-right: 10px" @change="changeIg">容错</el-checkbox>
              <el-button size="mini" type="warning" @click="changeRule(index)">修改</el-button>
              <el-button size="mini" type="danger" @click="delRule(index)">移除</el-button>
            </div>
          </div>
          <div v-if="item.type === 'normal'">
            <span>选定值:{{ item.checks }}</span>
          </div>
          <div v-else-if="item.type === 'dmz'">
            <div v-for="(child, cIdx) in item.checks" :key="cIdx">
              <span style="margin-right: 5px">{{ child.label }}:</span>
              <span style="margin-right: 10px">{{ child.values }}</span>
              <span style="margin-right: 5px">出现个数:</span>
              <span>{{ child.counts }}</span>
            </div>
          </div>
          <div v-else-if="item.type === 'dz'">
            <div v-for="(child, cIdx) in item.checks" :key="cIdx">
              <span style="margin-right: 5px">{{ child.label }}:</span>
              <span style="margin-right: 10px">{{ child.values }}</span>
            </div>
          </div>
          <div v-else-if="item.type === 'szs'">
            <div v-for="(child, cIdx) in item.checks" :key="cIdx">
              <span style="margin-right: 5px">{{ child.label }}:</span>
              <span style="margin-right: 10px">{{ child.values }}</span>
            </div>
            <span>满足：{{ item.conditionNums }}个</span>
          </div>
          <div v-else-if="item.type === 'fstj'">
            <div v-for="(child, cIdx) in item.checks" :key="cIdx">
              <div class="fs-show">
                <span style="margin-right: 5px">{{ child.label }}:</span>
                <span style="margin-right: 10px">{{ child.values }}</span>
              </div>
              <div class="fs-show">
                <span style="margin-right: 10px">{{ child.numArr.nums1 }}</span>
                <span style="margin-right: 10px">{{ child.numArr.nums2 }}</span>
                <span style="margin-right: 10px">{{ child.numArr.nums3 }}</span>
              </div>
            </div>
            <span>满足：{{ item.conditionNums }}个</span>
          </div>
        </div>
      </div>
      <IgnoreErrorCheck />
      <OrderCheck />
    </el-card>
  </div>
</template>

<style scoped>
.row {
  margin-bottom: 10px;
}

.row:last-child {
  margin-bottom: 0;
}

.rule-item {
  padding: 10px;
  border: 1px solid #e5eaee;
  margin-bottom: 5px;
}

.rule-item .title {
  display: flex;
  justify-content: space-between;
}

.rule-item:last-child {
  margin-bottom: 0;
}

.item-rule {
  display: flex;
  justify-content: left;
  line-height: 28px;
  margin-bottom: 10px;
}

.item-rule .title {
  font-size: 20;
  font-weight: bold;
  margin-right: 10px;
}

.irc-group {
  margin-right: 10px;
  margin-bottom: 5px;
}

.rule-foot-title {
  margin-right: 10px;
}

.fs-item {
  display: flex;
  flex-direction: column;
}

.fs-show {
  margin-bottom: 5px;
}

.sh-rule {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
}
</style>
