// === Types ===

export interface DmzCheck {
  label: string
  values: number[]
  counts: number[]
}

export interface DzCheck {
  label: string
  values: number[]
}

export interface SzsCheck {
  label: string
  values: number[]
}

export interface FstjCheck {
  label: string
  valuesAll: string[]
  values: string[]
  numArr: {
    nums1: number[]
    nums2: number[]
    nums3: number[]
  }
}

export interface CheckRule {
  id: number
  title: string
  label: string
  type: string
  ignore: boolean
  isOrder: boolean
  checks: any[]
  conditionNums?: string[]
  ruleValue?: string
}

const debug = false

// === Helper functions ===

const dzxArr = ['小', '中', '大']

function getDzxLabel(bitList: number[]): string {
  const labelArr: string[] = []
  for (const num of bitList) {
    if (num >= 0 && num <= 2) {
      labelArr.push('小')
    } else if (num >= 3 && num <= 6) {
      labelArr.push('中')
    } else {
      labelArr.push('大')
    }
  }
  return labelArr.sort((a, b) => dzxArr.indexOf(a) - dzxArr.indexOf(b)).join('')
}

function get012Label(bitList: number[]): string {
  const labelArr = bitList.map((num) => num % 3)
  return labelArr.sort().join('')
}

function getHmxtLabel(hun: number, ten: number, bit: number): string {
  if (bit === ten && ten === hun) {
    return '平行形'
  } else if (hun < ten && ten > bit) {
    return '凸起形'
  } else if (hun > ten && ten < bit) {
    return '凹下形'
  } else if (hun <= ten && ten <= bit) {
    return '上升形'
  } else if (hun >= ten && ten >= bit) {
    return '下降形'
  }
  return ''
}

function getJoLabel(code: number): string {
  return code % 2 === 0 ? '偶' : '奇'
}

const allJiOu = ['3奇', '2奇1偶', '1奇2偶', '3偶']

const fstjLabel = [['复', '隔', '中'], ['重', '斜', '跳'], ['邻', '孤', '传'], ['热', '温', '冷']]

function getFstjValueArr(values: string[], labels: string[]): string[] {
  const indexValueArr: string[] = []
  for (const value of values) {
    const indexValue: number[] = []
    for (const valueLabel of [...value]) {
      const index = labels.findIndex((label) => label === valueLabel)
      indexValue.push(index)
    }
    const indexValueStr = indexValue.sort((a, b) => a - b).join('')
    indexValueArr.push(indexValueStr)
  }
  return indexValueArr
}

function getFsIndex(code: number, numsArr: { nums1: number[]; nums2: number[]; nums3: number[] }): number {
  if (numsArr.nums1.includes(code)) return 0
  if (numsArr.nums2.includes(code)) return 1
  if (numsArr.nums3.includes(code)) return 2
  return -1
}

// === Individual check functions ===

function checkJo(code: string, checks: string[]): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  let oCount = 0
  for (const num of [hun, ten, bit]) {
    if (num % 2 === 0) oCount++
  }
  const ruleJiOuCounts: number[] = []
  for (const item of checks) {
    const jiOuCount = allJiOu.findIndex((val) => item === val)
    if (jiOuCount > -1) {
      ruleJiOuCounts.push(jiOuCount)
    }
  }
  return ruleJiOuCounts.indexOf(oCount) === -1
}

function checkHz(code: string, checks: string[]): boolean {
  const sum = parseInt(code[0]) + parseInt(code[1]) + parseInt(code[2])
  return checks.indexOf(sum.toString()) === -1
}

function checkKd(code: string, checks: string[]): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const diff = Math.max(hun, ten, bit) - Math.min(hun, ten, bit)
  return checks.indexOf(diff.toString()) === -1
}

function checkLmh(code: string, checks: string[]): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const highSum = (hun + ten) % 10
  const midSum = (hun + bit) % 10
  const lowSum = (ten + bit) % 10
  for (const sum of [highSum, midSum, lowSum]) {
    if (checks.indexOf(sum.toString()) > -1) return false
  }
  return true
}

function checkRylmc(code: string, checks: string[]): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const highDiff = Math.abs(hun - ten)
  const midDiff = Math.abs(hun - bit)
  const lowDiff = Math.abs(ten - bit)
  for (const diff of [highDiff, midDiff, lowDiff]) {
    if (checks.indexOf(diff.toString()) > -1) return false
  }
  return true
}

function checkZxlmh(code: string, checks: string[]): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const highSum = (hun + ten) % 10
  const midSum = (hun + bit) % 10
  const lowSum = (ten + bit) % 10
  const minSum = [highSum, midSum, lowSum].sort((a, b) => a - b)[0]
  return checks.indexOf(minSum.toString()) === -1
}

function checkZjlmh(code: string, checks: string[]): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const highSum = (hun + ten) % 10
  const midSum = (hun + bit) % 10
  const lowSum = (ten + bit) % 10
  const zjSum = [highSum, midSum, lowSum].sort((a, b) => a - b)[1]
  return checks.indexOf(zjSum.toString()) === -1
}

function checkZdlmh(code: string, checks: string[]): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const highSum = (hun + ten) % 10
  const midSum = (hun + bit) % 10
  const lowSum = (ten + bit) % 10
  const maxSum = [highSum, midSum, lowSum].sort((a, b) => a - b)[2]
  return checks.indexOf(maxSum.toString()) === -1
}

function checkZdz(code: string, checks: string[]): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const max = Math.max(hun, ten, bit)
  return checks.indexOf(max.toString()) === -1
}

function checkZjz(code: string, checks: string[]): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const arr = [hun, ten, bit].sort()
  return checks.indexOf(arr[1].toString()) === -1
}

function checkZxz(code: string, checks: string[]): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const min = Math.min(hun, ten, bit)
  return checks.indexOf(min.toString()) === -1
}

function checkDzx(code: string, checks: string[]): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const tLabel = getDzxLabel([hun, ten, bit])
  return checks.indexOf(tLabel) === -1
}

function check023L(code: string, checks: string[]): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const tLabel = get012Label([hun, ten, bit])
  return checks.indexOf(tLabel) === -1
}

function checkHz2(code: string, checks: string[]): boolean {
  const sum = parseInt(code[0]) + parseInt(code[1]) + parseInt(code[2])
  const hz = sum % 10
  return checks.indexOf(hz.toString()) === -1
}

function checkMcsm(code: string, checks: string[]): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const highDiff = Math.abs(hun - ten)
  const midDiff = Math.abs(hun - bit)
  const lowDiff = Math.abs(ten - bit)
  const diffArr = [highDiff, midDiff, lowDiff].sort()
  const diffCode = `${diffArr[0]}${diffArr[1]}${diffArr[2]}`
  return checks.indexOf(diffCode) === -1
}

function checkHmxt(code: string, checks: string[]): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  return checks.indexOf(getHmxtLabel(hun, ten, bit)) === -1
}

function checkJodw(code: string, checks: string[]): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const jodw = `${getJoLabel(hun)}${getJoLabel(ten)}${getJoLabel(bit)}`
  return checks.indexOf(jodw) === -1
}

function checkZxsmc(code: string, checks: string[]): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const highDiff = Math.abs(hun - ten)
  const midDiff = Math.abs(hun - bit)
  const lowDiff = Math.abs(ten - bit)
  const smcCode = `${highDiff}${midDiff}${lowDiff}`
  return checks.indexOf(smcCode) > -1
}

function checkDmz(code: string, calcItem: CheckRule): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const dmzRules = calcItem.checks.filter((item: any) => item.values.length > 0)
  let count = dmzRules.length
  for (const dmzRule of dmzRules) {
    let bitCount = 0
    for (const num of [hun, ten, bit]) {
      if (dmzRule.values.indexOf(num) > -1) {
        bitCount++
      }
    }
    if (dmzRule.counts.indexOf(bitCount) > -1) count--
  }
  return count === 0
}

function checkDz(code: string, calcItem: CheckRule): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const dzRules = calcItem.checks.map((item: any) => item.values)
  const countArr = [0, 0, 0]
  for (let i = 0; i < dzRules.length; i++) {
    [hun, ten, bit].forEach((item) => {
      if (dzRules[i].indexOf(item) > -1) countArr[i]++
    })
  }
  return !countArr.every((item) => item === 1)
}

function checkDzxs(code: string, calcItem: CheckRule): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const arr = [hun, ten, bit].sort((a, b) => b - a)
  let passCount = 0
  for (let index = 0; index <= 2; index++) {
    const match = calcItem.checks[index].values.includes(arr[index])
    if (match) passCount++
  }
  return calcItem.conditionNums!.includes(passCount + '')
}

function checkDzxlmh(code: string, calcItem: CheckRule): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const arr = [(hun + ten) % 10, (ten + bit) % 10, (bit + hun) % 10].sort((a, b) => b - a)
  let passCount = 0
  for (let index = 0; index <= 2; index++) {
    const match = calcItem.checks[index].values.includes(arr[index])
    if (match) passCount++
  }
  return calcItem.conditionNums!.includes(passCount + '')
}

function checkDzxlmc(code: string, calcItem: CheckRule): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const arr = [Math.abs(hun - ten), Math.abs(ten - bit), Math.abs(bit - hun)].sort((a, b) => b - a)
  let passCount = 0
  for (let index = 0; index <= 2; index++) {
    const match = calcItem.checks[index].values.includes(arr[index])
    if (match) passCount++
  }
  return calcItem.conditionNums!.includes(passCount + '')
}

function checkFstj(code: string, calcItem: CheckRule): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  let passCount = 0
  for (let index = 0; index <= 3; index++) {
    const rule = calcItem.checks[index]
    const valueIndexArr = getFstjValueArr(rule.values, fstjLabel[index])
    const labelArr: number[] = []
    for (const item of [hun, ten, bit]) {
      const labelIndex = getFsIndex(item, rule.numArr)
      if (labelIndex === -1) continue
      labelArr.push(labelIndex)
    }
    if (labelArr.length !== 3) continue
    const label = labelArr.sort((a, b) => a - b).join('')
    const match = valueIndexArr.includes(label)
    if (match) passCount++
  }
  return calcItem.conditionNums!.includes(passCount + '')
}

function checkEcdw(code: string, calcItem: CheckRule): boolean {
  const hun = parseInt(code[0])
  const ten = parseInt(code[1])
  const bit = parseInt(code[2])
  const arr = [hun, ten, bit]
  let passCount = 0
  for (let index = 0; index <= 2; index++) {
    const match = calcItem.checks[index].values.includes(arr[index])
    if (match) passCount++
  }
  return calcItem.conditionNums!.includes(passCount + '')
}

// === Main checkCode dispatcher ===

function checkCode(code: string, calcItem: CheckRule): boolean {
  const label = calcItem.label

  if (label === 'dmz') return checkDmz(code, calcItem)
  if (label === 'dz') return checkDz(code, calcItem)
  if (label === 'dzxs') return checkDzxs(code, calcItem)
  if (label === 'dzxlmh') return checkDzxlmh(code, calcItem)
  if (label === 'dzxlmc') return checkDzxlmc(code, calcItem)
  if (label === 'fstj') return checkFstj(code, calcItem)
  if (label === 'ecdw') return checkEcdw(code, calcItem)
  if (label === 'zxsmc') return checkZxsmc(code, calcItem.checks)

  if (calcItem.ignore) {
    const checks = calcItem.checks
    if (label === 'jo') return checkJo(code, checks)
    if (label === 'hz') return checkHz(code, checks)
    if (label === 'kd') return checkKd(code, checks)
    if (label === 'lmh') return checkLmh(code, checks)
    if (label === 'rylmc') return checkRylmc(code, checks)
    if (label === 'zxlmh') return checkZxlmh(code, checks)
    if (label === 'zjlmh') return checkZjlmh(code, checks)
    if (label === 'zdlmh') return checkZdlmh(code, checks)
    if (label === 'zdz') return checkZdz(code, checks)
    if (label === 'zjz') return checkZjz(code, checks)
    if (label === 'zxz') return checkZxz(code, checks)
    if (label === 'dzx') return checkDzx(code, checks)
    if (label === '012l') return check023L(code, checks)
    if (label === 'hz2') return checkHz2(code, checks)
    if (label === 'mcsm') return checkMcsm(code, checks)
    if (label === 'hmxt') return checkHmxt(code, checks)
    if (label === 'jodw') return checkJodw(code, checks)
  } else if (!calcItem.isOrder) {
    const checks = calcItem.checks
    if (label === 'jo') return !checkJo(code, checks)
    if (label === 'hz') return !checkHz(code, checks)
    if (label === 'kd') return !checkKd(code, checks)
    if (label === 'lmh') return !checkLmh(code, checks)
    if (label === 'rylmc') return !checkRylmc(code, checks)
    if (label === 'zxlmh') return !checkZxlmh(code, checks)
    if (label === 'zjlmh') return !checkZjlmh(code, checks)
    if (label === 'zdlmh') return !checkZdlmh(code, checks)
    if (label === 'zdz') return !checkZdz(code, checks)
    if (label === 'zjz') return !checkZjz(code, checks)
    if (label === 'zxz') return !checkZxz(code, checks)
    if (label === 'dzx') return !checkDzx(code, checks)
    if (label === '012l') return !check023L(code, checks)
    if (label === 'hz2') return !checkHz2(code, checks)
    if (label === 'mcsm') return !checkMcsm(code, checks)
    if (label === 'hmxt') return !checkHmxt(code, checks)
    if (label === 'jodw') return !checkJodw(code, checks)
  } else {
    const hun = parseInt(code[0])
    const ten = parseInt(code[1])
    const bit = parseInt(code[2])
    if (label === 'jo') {
      let jCount = 0
      for (const num of [hun, ten, bit]) {
        if (num % 2 === 1) jCount++
      }
      const tCount = 3 - allJiOu.indexOf(calcItem.ruleValue!)
      return tCount === jCount
    } else if (label === 'hz') {
      const sum = hun + ten + bit
      return sum === parseInt(calcItem.ruleValue!)
    } else if (label === 'kd') {
      const diff = Math.max(hun, ten, bit) - Math.min(hun, ten, bit)
      return diff === parseInt(calcItem.ruleValue!)
    } else if (label === 'lmh') {
      const highSum = (hun + ten) % 10
      const midSum = (hun + bit) % 10
      const lowSum = (ten + bit) % 10
      return [highSum, midSum, lowSum].indexOf(parseInt(calcItem.ruleValue!)) > -1
    } else if (label === 'rylmc') {
      const highDiff = Math.abs(hun - ten)
      const midDiff = Math.abs(hun - bit)
      const lowDiff = Math.abs(ten - bit)
      return [highDiff, midDiff, lowDiff].indexOf(parseInt(calcItem.ruleValue!)) > -1
    } else if (label === 'zxlmh') {
      const highSum = (hun + ten) % 10
      const midSum = (hun + bit) % 10
      const lowSum = (ten + bit) % 10
      const orderedArr = [highSum, midSum, lowSum].sort((a, b) => a - b)
      return orderedArr[0] === parseInt(calcItem.ruleValue!)
    } else if (label === 'zjlmh') {
      const highSum = (hun + ten) % 10
      const midSum = (hun + bit) % 10
      const lowSum = (ten + bit) % 10
      const orderedArr = [highSum, midSum, lowSum].sort((a, b) => a - b)
      return orderedArr[1] === parseInt(calcItem.ruleValue!)
    } else if (label === 'zdlmh') {
      const highSum = (hun + ten) % 10
      const midSum = (hun + bit) % 10
      const lowSum = (ten + bit) % 10
      const orderedArr = [highSum, midSum, lowSum].sort((a, b) => a - b)
      return orderedArr[2] === parseInt(calcItem.ruleValue!)
    } else if (label === 'zdz') {
      const max = Math.max(hun, ten, bit)
      return max === parseInt(calcItem.ruleValue!)
    } else if (label === 'zjz') {
      const arr = [hun, ten, bit].sort()
      return arr[1] === parseInt(calcItem.ruleValue!)
    } else if (label === 'zxz') {
      const min = Math.min(hun, ten, bit)
      return min === parseInt(calcItem.ruleValue!)
    } else if (label === 'dzx') {
      const tLabel = getDzxLabel([hun, ten, bit])
      return tLabel === calcItem.ruleValue!
    } else if (label === '012l') {
      const tLabel = get012Label([hun, ten, bit])
      return tLabel === calcItem.ruleValue!
    } else if (label === 'hz2') {
      const hz = (hun + ten + bit) % 10
      return hz === parseInt(calcItem.ruleValue!)
    } else if (label === 'mcsm') {
      const highDiff = Math.abs(hun - ten)
      const midDiff = Math.abs(hun - bit)
      const lowDiff = Math.abs(ten - bit)
      const diffArr = [highDiff, midDiff, lowDiff].sort()
      const diffCode = `${diffArr[0]}${diffArr[1]}${diffArr[2]}`
      return diffCode === calcItem.ruleValue!
    } else if (label === 'hmxt') {
      return getHmxtLabel(hun, ten, bit) === calcItem.ruleValue!
    } else if (label === 'jodw') {
      const jodw = `${getJoLabel(hun)}${getJoLabel(ten)}${getJoLabel(bit)}`
      return jodw === calcItem.ruleValue!
    }
  }
  return false
}

// === Combination helpers ===

let temp: number[] = []

function combine(arr: any[][], results: any[][], index: number = 0): void {
  arr[index].forEach((item: any) => {
    temp[index] = item
    index + 1 < arr.length ? combine(arr, results, index + 1) : results.push(temp.slice())
  })
}

function clearTemp(): void {
  temp = []
}

function sortIndexArrAsc(arr: number[][]): void {
  arr.sort((arr1, arr2) => {
    const len = arr1.length
    const tmp1 = structuredClone(arr1).sort()
    const tmp2 = structuredClone(arr2).sort()
    for (let i = 0; i < len; i++) {
      if (tmp1[i] !== tmp2[i]) return tmp1[i] - tmp2[i]
    }
    return 0
  })
}

function subsets(nums: number[]): number[][] {
  const res: number[][] = []
  const len = nums.length
  for (let i = 0; i < 1 << len; i++) {
    const arr: number[] = []
    for (let j = 0; j < len; j++) {
      if (i & (1 << j)) arr.push(nums[j])
    }
    res.push(arr)
  }
  return res
}

function contains(arrList: number[][], arr: number[]): boolean {
  if (arrList.length === 0) return false
  const len = arrList[0].length
  if (len !== arr.length) return false
  const s = arr.toString()
  for (const item of arrList) {
    if (item.toString() === s) return true
  }
  return false
}

function getStartIndexArr(len: number): number[] {
  const startIndexArr: number[] = []
  for (let i = 0; i < len; i++) {
    startIndexArr.push(0)
  }
  return startIndexArr
}

// === Group building ===

interface CalcItem {
  label: string
  ruleValue?: any
  isOrder?: boolean
  ignore?: boolean
  checks?: any[]
  values?: number[]
  counts?: number[]
}

function getMoveRowArrList(changeCount: number, subArrs: number[][]): number[][] {
  if (changeCount === 0) return []
  const changeIndexArr: number[][] = []
  for (const subArr of subArrs) {
    if (changeCount === subArr.length) {
      changeIndexArr.push(subArr)
    }
  }
  return changeIndexArr.sort((arr1, arr2) => {
    const sumDiff = arr2.reduce((pre, cur) => pre + cur, 0) - arr1.reduce((pre, cur) => pre + cur, 0)
    if (sumDiff !== 0) return sumDiff
    return Math.max(...arr2) - Math.max(...arr1)
  })
}

function getSlowRowIndexArrList(
  index: number,
  slowRowArr: number[],
  ruleGroupLens: number[]
): number[][] {
  const rowIndexArrList: number[][] = []
  for (const slowRow of slowRowArr) {
    const rowIndexRow: number[] = []
    const start = index + 1
    const end = ruleGroupLens[slowRow] - 1
    if (start >= end) {
      rowIndexRow.push(end)
    } else {
      let i = start
      while (i <= end) {
        rowIndexRow.push(i)
        i++
      }
    }
    rowIndexArrList.push(rowIndexRow)
  }
  const slowRowIndexArrList: number[][] = []
  combine(rowIndexArrList, slowRowIndexArrList)
  clearTemp()
  sortIndexArrAsc(slowRowIndexArrList)
  return slowRowIndexArrList
}

function resetIndexWithSlow(
  indexGroup: number[],
  index: number,
  ruleGroupLens: number[],
  slowRowArr: number[],
  slowRowIndexArr: number[]
): void {
  for (let i = 0; i < indexGroup.length; i++) {
    let tmp = index
    tmp = tmp < ruleGroupLens[i] - 1 ? tmp : ruleGroupLens[i] - 1
    indexGroup[i] = tmp
  }
  for (let i = 0; i < slowRowArr.length; i++) {
    indexGroup[slowRowArr[i]] = slowRowIndexArr[i]
  }
}

function resetIndex(indexGroup: number[], index: number, ruleGroupLens: number[]): void {
  for (let i = 0; i < indexGroup.length; i++) {
    let tmp = index
    tmp = tmp < ruleGroupLens[i] - 1 ? tmp : ruleGroupLens[i] - 1
    indexGroup[i] = tmp
  }
}

// Sequential ordering
function getCalcGroups(ruleList: CheckRule[], igIndexArr: number[]): CalcItem[][] {
  if (ruleList.length === 0) return []

  const ruleGroups: CalcItem[][] = []
  const ruleGroupLens: number[] = []
  let maxLen = 0

  for (let i = 0; i < ruleList.length; i++) {
    const rule = ruleList[i]
    const withdraw = igIndexArr.indexOf(i) > -1
    const ruleGroup: CalcItem[] = []

    if (rule.label === 'dmz' || rule.label === 'dz' || !rule.isOrder || (rule.ignore && withdraw)) {
      const newRule = structuredClone(rule) as unknown as CalcItem
      newRule.ignore = withdraw
      ruleGroup.push(newRule)
    } else {
      for (const ruleValue of rule.checks) {
        ruleGroup.push({ label: rule.label, ruleValue, isOrder: true })
      }
    }
    ruleGroups.push(ruleGroup)
    ruleGroupLens.push(ruleGroup.length)
    maxLen = Math.max(maxLen, ruleGroup.length)
  }

  const indexGroups: number[][] = []
  let index = 0
  const maxCount = ruleGroups.length
  const rowArrList = subsets([...new Array(maxCount).keys()])
  const indexGroup = getStartIndexArr(maxCount)

  while (index <= maxLen - 1) {
    resetIndex(indexGroup, index, ruleGroupLens)
    for (let fixCount = maxCount; fixCount > 0; fixCount--) {
      const moveRowArrList = getMoveRowArrList(maxCount - fixCount, rowArrList)
      if (moveRowArrList.length > 0) {
        for (const moveRowArr of moveRowArrList) {
          for (let i = moveRowArr.length - 1; i >= 0; i--) {
            resetIndex(indexGroup, index, ruleGroupLens)
            const quickRow = moveRowArr[i]
            const slowRowArr = structuredClone(moveRowArr)
            slowRowArr.splice(moveRowArr.indexOf(quickRow), 1)

            if (slowRowArr.length > 0) {
              const slowRowIndexArrList = getSlowRowIndexArrList(index, slowRowArr, ruleGroupLens)
              for (const slowRowIndexArr of slowRowIndexArrList) {
                resetIndexWithSlow(indexGroup, index, ruleGroupLens, slowRowArr, slowRowIndexArr)
                let tmpQuickIndex = index
                while (tmpQuickIndex < ruleGroupLens[quickRow] - 1) {
                  indexGroup[quickRow] = ++tmpQuickIndex
                  if (!contains(indexGroups, indexGroup)) {
                    indexGroups.push(structuredClone(indexGroup))
                  }
                }
              }
            } else {
              let tmpQuickIndex = index
              while (tmpQuickIndex < ruleGroupLens[quickRow] - 1) {
                indexGroup[quickRow] = ++tmpQuickIndex
                if (!contains(indexGroups, indexGroup)) {
                  indexGroups.push(structuredClone(indexGroup))
                }
              }
            }
          }
        }
      } else {
        if (!contains(indexGroups, indexGroup)) {
          indexGroups.push(structuredClone(indexGroup))
        }
      }
    }
    index++
  }

  const calcGroups: CalcItem[][] = []
  for (const ig of indexGroups) {
    const calcGroup: CalcItem[] = []
    for (let i = 0; i < maxCount; i++) {
      calcGroup.push(ruleGroups[i][ig[i]])
    }
    calcGroups.push(calcGroup)
  }
  return calcGroups
}

// Cross ordering
function getCalcGroups2(ruleList: CheckRule[], igIndexArr: number[]): CalcItem[][] {
  if (ruleList.length === 0) return []

  const ruleGroups: CalcItem[][] = []
  const ruleGroupLens: number[] = []
  let maxLen = 0

  for (let i = 0; i < ruleList.length; i++) {
    const rule = ruleList[i]
    const withdraw = igIndexArr.indexOf(i) > -1
    const ruleGroup: CalcItem[] = []

    if (rule.label === 'dmz' || rule.label === 'dz' || !rule.isOrder || (rule.ignore && withdraw)) {
      rule.ignore = withdraw && rule.isOrder
      ruleGroup.push(rule as unknown as CalcItem)
    } else {
      for (const ruleValue of rule.checks) {
        ruleGroup.push({ label: rule.label, ruleValue, isOrder: true })
      }
    }
    ruleGroups.push(ruleGroup)
    ruleGroupLens.push(ruleGroup.length)
    maxLen = Math.max(maxLen, ruleGroup.length)
  }

  const indexGroups: number[][] = []
  const allIndexGroups: number[][] = []
  for (const len of ruleGroupLens) {
    allIndexGroups.push([...new Array(len).keys()])
  }
  combine(allIndexGroups, indexGroups)
  clearTemp()
  sortIndexArrAsc(indexGroups)

  const calcGroups: CalcItem[][] = []
  const len = ruleGroups.length
  for (const indexGroup of indexGroups) {
    const calcGroup: CalcItem[] = []
    for (let i = 0; i < len; i++) {
      calcGroup.push(ruleGroups[i][indexGroup[i]])
    }
    calcGroups.push(calcGroup)
  }
  return calcGroups
}

// === Filtering ===

function doFilter(codeList: string[], calcGroup: CalcItem[]): string[] {
  const resultCodes: string[] = []
  for (const code of codeList) {
    let count = calcGroup.length
    for (const calcItem of calcGroup) {
      const ok = checkCode(code, calcItem as CheckRule)
      if (ok) count--
    }
    if (count === 0) {
      resultCodes.push(code)
    }
  }
  return resultCodes
}

function getIgIndexArrList(igCount: number, subIgIndexArrList: number[][]): number[][] {
  const igIndexArrList: number[][] = []
  for (const subArr of subIgIndexArrList) {
    if (subArr.length === igCount) {
      igIndexArrList.push(subArr)
    }
  }
  return igIndexArrList
}

// === Main export ===

export function codesFilter(
  codeList: string[],
  ruleList: CheckRule[],
  igCounts: number[],
  orderType: boolean
): string[] {
  if (ruleList.length === 0) return codeList

  let restCodes = structuredClone(codeList)
  const resultCodes: string[] = []

  const igAllIndexArr: number[] = []
  for (let i = 0; i < ruleList.length; i++) {
    if (ruleList[i].ignore) {
      igAllIndexArr.push(i)
    }
  }

  const subIgIndexArrList = subsets(igAllIndexArr).sort((arr1, arr2) => {
    const lenDiff = arr2.length - arr1.length
    if (lenDiff === 0) {
      return arr2.reduce((pre, cur) => pre + cur, 0) - arr1.reduce((pre, cur) => pre + cur, 0)
    }
    return lenDiff
  })

  for (const igCount of igCounts) {
    const igIndexArrList = getIgIndexArrList(igCount, subIgIndexArrList)
    for (const igIndexArr of igIndexArrList) {
      const calcGroups = orderType
        ? getCalcGroups2(ruleList, igIndexArr)
        : getCalcGroups(ruleList, igIndexArr)

      for (const calcGroup of calcGroups) {
        const filterCodes = doFilter(codeList, calcGroup)
        for (const filterCode of filterCodes) {
          if (resultCodes.indexOf(filterCode) === -1) {
            resultCodes.push(filterCode)
            restCodes.splice(restCodes.indexOf(filterCode), 1)
          }
        }
        if (restCodes.length === 0) break
      }
    }
  }

  return resultCodes
}
