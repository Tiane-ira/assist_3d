export const getIgCounts = (min: number, max: number): number[] => {
  const igCounts: number[] = []
  while (min <= max) {
    igCounts.push(min)
    min++
  }
  return igCounts
}

export const getSeqArr = (end: number): string[] => {
  const nums = [...new Array(end + 1).keys()]
  return nums.reduce<string[]>((pre, cur) => {
    pre.push(cur.toString())
    return pre
  }, [])
}

export interface CodeObj {
  code: string
  sum: number
  diff: number
  dzx: string
  lye: string
  smc: string
  smh: string
}

// 豹子
function getBzList(numList: string[]): string[] {
  const orderList = [...numList].sort()
  const resArr: string[] = []
  for (const num of orderList) {
    resArr.push(`${num}${num}${num}`)
  }
  return resArr
}

function isBz(code: string): boolean {
  return code[0] === code[1] && code[1] === code[2]
}

// 组三
function getZsList(numList: string[]): string[] {
  if (numList.length < 2) {
    console.log('待选值数量小于2,无法产生组三号码')
  }
  const orderList = [...numList].sort()
  const resArr: string[] = []
  for (const one of orderList) {
    for (const two of orderList) {
      if (one < two) {
        resArr.push(`${one}${two}${two}`)
      } else if (one > two) {
        resArr.push(`${two}${two}${one}`)
      }
    }
  }
  return resArr
}

function isZs(code: string): boolean {
  return !isBz(code) && (code[0] === code[1] || code[1] === code[2] || code[0] === code[2])
}

// 组六
function getZulList(numList: string[]): string[] {
  if (numList.length < 3) {
    console.log('待选值数量小于3,无法产生组六号码')
  }
  const orderList = [...numList].sort()
  const resArr: string[] = []
  for (const first of orderList) {
    for (const second of orderList) {
      for (const third of orderList) {
        if (first !== second && second !== third && first !== third) {
          const bitList = [first, second, third].sort((a, b) => a.localeCompare(b))
          const code = `${bitList[0]}${bitList[1]}${bitList[2]}`
          if (resArr.indexOf(code) === -1) {
            resArr.push(code)
          }
        }
      }
    }
  }
  return resArr
}

function isZul(code: string): boolean {
  return code[0] !== code[1] && code[1] !== code[2] && code[0] !== code[2]
}

function szIncrement(num: string): string {
  if (num === '9') return '0'
  return (parseInt(num) + 1) + ''
}

// 顺子
function getSzList(numList: string[]): string[] {
  const orderList = [...numList].sort()
  const resArr: string[] = []
  for (const first of orderList) {
    for (const second of orderList) {
      for (const third of orderList) {
        if (first !== second && second !== third && first !== third) {
          const incrFirst = szIncrement(first)
          const incrSecond = szIncrement(second)
          if (incrFirst === second && incrSecond === third) {
            resArr.push(`${first}${second}${third}`)
          }
        }
      }
    }
  }
  return resArr
}

function isShunZi(code: string): boolean {
  const codeArr = [code[0], code[1], code[2]].sort()
  return (
    (szIncrement(codeArr[0]) === codeArr[1] && szIncrement(codeArr[1]) === codeArr[2]) ||
    (szIncrement(codeArr[1]) === codeArr[2] && szIncrement(codeArr[2]) === codeArr[0]) ||
    (szIncrement(codeArr[2]) === codeArr[0] && szIncrement(codeArr[0]) === codeArr[1])
  )
}

function isBanShun(code: string): boolean {
  if (isShunZi(code) || isZs(code)) return false
  const codeArr = [code[0], code[1], code[2]].sort()
  return (
    szIncrement(codeArr[0]) === codeArr[1] ||
    szIncrement(codeArr[1]) === codeArr[2] ||
    szIncrement(codeArr[2]) === codeArr[0]
  )
}

// 半顺
function getBsList(numList: string[]): string[] {
  const orderList = [...numList].sort()
  const resArr: string[] = []
  for (const first of orderList) {
    for (const second of orderList) {
      for (const third of orderList) {
        if (first !== second && second !== third && first !== third) {
          const bitList = [first, second, third].sort((a, b) => a.localeCompare(b))
          const code = `${bitList[0]}${bitList[1]}${bitList[2]}`
          if (resArr.indexOf(code) === -1 && isBanShun(code) && !isShunZi(code)) {
            resArr.push(code)
          }
        }
      }
    }
  }
  return resArr
}

// 杂六
function isZal(code: string): boolean {
  return !isBz(code) && !isZs(code) && !isShunZi(code) && !isBanShun(code)
}

function getZalList(numList: string[]): string[] {
  const orderList = [...numList].sort()
  const resArr: string[] = []
  for (const first of orderList) {
    for (const second of orderList) {
      for (const third of orderList) {
        if (first !== second && second !== third && first !== third) {
          const bitList = [first, second, third].sort((a, b) => a.localeCompare(b))
          const code = `${bitList[0]}${bitList[1]}${bitList[2]}`
          if (resArr.indexOf(code) === -1 && !isShunZi(code) && !isBanShun(code)) {
            resArr.push(code)
          }
        }
      }
    }
  }
  return resArr
}

export const getNumGroup = (numList: string[], typeList: string[]): string[] => {
  let resultList: string[] = []
  if (typeList.indexOf('组三') > -1 && numList.length < 2) {
    console.log('待选值数量小于2,无法产生组三号码')
  }
  if (typeList.indexOf('组六') > -1 && numList.length < 3) {
    console.log('待选值数量小于3,无法产生组六号码')
  }
  if (typeList.indexOf('豹子') > -1) {
    resultList = [...resultList, ...getBzList(numList)]
  }
  if (typeList.indexOf('组三') > -1) {
    resultList = [...resultList, ...getZsList(numList)]
  }
  if (typeList.indexOf('组六') > -1) {
    resultList = [...resultList, ...getZulList(numList)]
  } else {
    if (typeList.indexOf('顺子') > -1) {
      resultList = [...resultList, ...getSzList(numList)]
    }
    if (typeList.indexOf('半顺') > -1) {
      resultList = [...resultList, ...getBsList(numList)]
    }
    if (typeList.indexOf('杂六') > -1) {
      resultList = [...resultList, ...getZalList(numList)]
    }
  }
  return distinctCodes(resultList)
}

export const getNumDirect = (bitList: string[], tenList: string[], hunList: string[], typeList: string[]): string[] => {
  let resultList: string[] = []
  const codeList: string[] = []
  for (const hun of hunList) {
    for (const ten of tenList) {
      for (const bit of bitList) {
        codeList.push(`${hun}${ten}${bit}`)
      }
    }
  }
  for (const code of codeList) {
    if (typeList.indexOf('豹子') > -1 && isBz(code)) {
      resultList = [...resultList, code]
      continue
    }
    if (typeList.indexOf('组三') > -1 && isZs(code)) {
      resultList = [...resultList, code]
      continue
    }
    if (typeList.indexOf('组六') > -1 && isZul(code)) {
      resultList = [...resultList, code]
      continue
    } else {
      if (typeList.indexOf('顺子') > -1 && isShunZi(code)) {
        resultList = [...resultList, code]
        continue
      }
      if (typeList.indexOf('半顺') > -1 && isBanShun(code)) {
        resultList = [...resultList, code]
        continue
      }
      if (typeList.indexOf('杂六') > -1 && isZal(code)) {
        resultList = [...resultList, code]
        continue
      }
    }
  }
  return resultList
}

function distinctCodes(codeList: string[]): string[] {
  const map = new Map<string, number>()
  for (const code of codeList) {
    map.set(code, 0)
  }
  return [...map.keys()]
}

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

function getSmcLabel(bitList: number[]): string {
  const highDiff = Math.abs(bitList[0] - bitList[1])
  const midDiff = Math.abs(bitList[1] - bitList[2])
  const lowDiff = Math.abs(bitList[0] - bitList[2])
  const labelArr = [highDiff, midDiff, lowDiff].sort((a, b) => a - b)
  return `${labelArr[0]}${labelArr[1]}${labelArr[2]}`
}

function getSmhLabel(bitList: number[]): string {
  const highSum = (bitList[0] + bitList[1]) % 10
  const midSum = (bitList[1] + bitList[2]) % 10
  const lowSum = (bitList[0] + bitList[2]) % 10
  const labelArr = [highSum, midSum, lowSum].sort((a, b) => a - b)
  return `${labelArr[0]}${labelArr[1]}${labelArr[2]}`
}

export const getNumObjByCodes = (codeList: string[]): CodeObj[] => {
  const objList: CodeObj[] = []
  for (const code of codeList) {
    const hun = parseInt(code[0])
    const ten = parseInt(code[1])
    const bit = parseInt(code[2])
    const sum = hun + ten + bit
    const diff = Math.max(hun, ten, bit) - Math.min(hun, ten, bit)
    const dzx = getDzxLabel([hun, ten, bit])
    const lye = get012Label([hun, ten, bit])
    const smc = getSmcLabel([hun, ten, bit])
    const smh = getSmhLabel([hun, ten, bit])
    objList.push({ code, sum, diff, dzx, lye, smc, smh })
  }
  return objList
}

export const group2Direct = (arr: string[]): Set<string> => {
  const len = arr.length
  const res: string[] = []
  const arrange = (tempArr: string[], leftArr: string[]) => {
    if (tempArr.length === len) {
      res.push(tempArr.join(''))
    } else {
      leftArr.forEach((item, index) => {
        const temp = [...leftArr]
        temp.splice(index, 1)
        arrange(tempArr.concat(item), temp)
      })
    }
  }
  arrange([], arr)
  return new Set(res)
}

export const direct2Group = (code: string): string => {
  const arr = [...code]
  arr.sort((a, b) => a.localeCompare(b))
  return `${arr[0]}${arr[1]}${arr[2]}`
}

export const validCodes = (codes: string[]): string | undefined => {
  for (const code of codes) {
    const regex = /^\d{3}$/
    if (!regex.test(code)) {
      return code
    }
  }
}
