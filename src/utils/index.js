//候选集codeList,根据规则列表中所有的索引组合出过滤项，通过过滤就加入结果集,直到候选集都通过或所有过滤项过滤完
import moment from "moment";

export const filterCodes = (codeList, ruleList, igCounts) => {
    if (ruleList.length === 0) return codeList
    let restCodes = structuredClone(codeList) //剩余未过滤成功的code列表,如果为空即停止过滤
    let resultCodes = [] //最终得到的code列表
    // 获取可以容错的条件下标数组
    let igAllIndexArr = []
    for (let i = 0; i < ruleList.length; i++) {
        if (ruleList[i].ignore) {
            igAllIndexArr.push(i)
        }
    }
    // 获取所有容错条件下标子集,按照子数组和子数组元素之和进行倒叙排序
    let subIgIndexArrList = subsets(igAllIndexArr).sort((arr1, arr2) => {
        let lenDiff = arr2.length - arr1.length
        if (lenDiff === 0) {
            return arr2.reduce((pre, cur) => pre + cur, 0) - arr1.reduce((pre, cur) => pre + cur, 0)
        }
        return lenDiff
    })
    for (let igCount of igCounts) {
        let igIndexArrList = getIgIndexArrList(igCount, subIgIndexArrList) //获取当前容错数量的所有容错条件的组合可能
        for (let igIndexArr of igIndexArrList) {
            // console.log('容错下标组', igIndexArrList)
            let calcGroups = getCalcGroups2(ruleList, igIndexArr)
            // console.log('当前容错计算项', igIndexArr, calcGroups)
            for (let calcGroup of calcGroups) {
                let filterCodes = doFilter(codeList, calcGroup) //单次过滤得到的code列表
                // console.log('过滤结果', filterCodes)
                for (let filterCode of filterCodes) {
                    if (resultCodes.indexOf(filterCode) === -1) {
                        resultCodes.push(filterCode)
                        restCodes.splice(restCodes.indexOf(filterCode), 1)
                    }
                }
                if (restCodes.length === 0) break
            }
            console.log('条件数:', calcGroups.length, '最终结果数:', resultCodes.length)
        }
    }
    return resultCodes
}

function getIgIndexArrList(igCount, subIgIndexArrList) {
    let igIndexArrList = []
    for (let subArr of subIgIndexArrList) {
        if (subArr.length === igCount) {
            igIndexArrList.push(subArr)
        }
    }
    return igIndexArrList
}

export const getIgCounts = (min, max) => {
    let igCounts = []
    while (min <= max) {
        igCounts.push(min)
        min++
    }
    return igCounts
}

function doFilter(codeList, calcGroup) {
    let resultCodes = []
    for (let code of codeList) {
        let count = calcGroup.length
        for (const calcItem of calcGroup) {
            let ok = checkCode(code, calcItem)
            if (ok) count--
        }
        if (count === 0) {
            resultCodes.push(code)
        }
    }
    return resultCodes
}

const allJiOu = ['3奇', '2奇1偶', '1奇2偶', '3偶']

function checkCode(code, calcItem) {
    let hun = parseInt(code[0])
    let ten = parseInt(code[1])
    let bit = parseInt(code[2])
    let label = calcItem.label
    if (label === 'dmz') {
        let dmzRules = calcItem.checks.filter(item => item.values.length > 0)
        // 胆码组无容错
        let count = dmzRules.length
        for (let dmzRule of dmzRules) {
            let bitCount = 0
            for (let num of [hun, ten, bit]) {
                if (dmzRule.values.indexOf(num) > -1) {
                    bitCount++
                }
            }
            if (dmzRule.counts.indexOf(bitCount) > -1) count--
        }
        return count === 0
    } else if (calcItem.ignore) {
        let checks = calcItem.checks
        // 容错计算
        if (label === 'jo') {
            let jCount = 0
            for (let num of [hun, ten, bit]) {
                if (num % 2 === 1) jCount++
            }
            let ruleJiOuCounts = []
            for (let item of checks) {
                let jiOuCount = allJiOu.findIndex(val => item === val)
                if (jiOuCount > -1) {
                    ruleJiOuCounts.push(jiOuCount)
                }
            }
            return ruleJiOuCounts.indexOf(jCount) === -1
        } else if (label === 'hz') {
            let sum = hun + ten + bit
            return checks.indexOf(sum.toString()) === -1
        } else if (label === 'kd') {
            let diff = Math.max(hun, ten, bit) - Math.min(hun, ten, bit)
            return checks.indexOf(diff.toString()) === -1
        } else if (label === 'lmh') {
            let highSum = hun + ten
            let midSum = hun + bit
            let lowSum = ten + bit
            for (let sum of [highSum, midSum, lowSum]) {
                if (checks.indexOf(sum.toString()) > -1) return false
            }
            return true
        } else if (label === 'lmc') {
            let highDiff = Math.abs(hun - ten)
            let midDiff = Math.abs(hun - bit)
            let lowDiff = Math.abs(ten - bit)
            for (let diff of [highDiff, midDiff, lowDiff]) {
                if (checks.indexOf(diff.toString()) > -1) return false
            }
            return true
        } else if (label === 'zdz') {
            let max = Math.max(hun, ten, bit)
            return checks.indexOf(max.toString()) === -1
        } else if (label === 'zjz') {
            let arr = [hun, ten, bit].sort()
            return checks.indexOf(arr[1].toString()) === -1
        } else if (label === 'zxz') {
            let min = Math.max(hun, ten, bit)
            return checks.indexOf(min.toString()) === -1
        } else if (label === 'dzx') {
            let tLabel = getDzxLabel([hun, ten, bit])
            return checks.indexOf(tLabel) === -1
        } else if (label === '012l') {
            let tLabel = get012Label([hun, ten, bit])
            return checks.indexOf(tLabel) === -1
        } else if (label === 'hz2') {
            let hz = (hun + ten + bit) % 10
            return checks.indexOf(hz.toString()) === -1
        } else if (label === 'mcsm') {
            let highDiff = Math.abs(hun - ten)
            let midDiff = Math.abs(hun - bit)
            let lowDiff = Math.abs(ten - bit)
            let diffArr = [highDiff, midDiff, lowDiff].sort()
            let diffCode = `${diffArr[0]}${diffArr[1]}${diffArr[2]}`
            return checks.indexOf(diffCode) === -1
        }
    } else {
        // 正常条件排列项计算
        if (label === 'jo') {
            let jCount = 0
            for (let num of [hun, ten, bit]) {
                if (num % 2 === 1) jCount++
            }
            let tCount = 3 - allJiOu.indexOf(calcItem.ruleValue)
            return tCount === jCount
        } else if (label === 'hz') {
            let sum = hun + ten + bit
            return sum === parseInt(calcItem.ruleValue)
        } else if (label === 'kd') {
            let diff = Math.max(hun, ten, bit) - Math.min(hun, ten, bit)
            return diff === parseInt(calcItem.ruleValue)
        } else if (label === 'lmh') {
            let highSum = hun + ten
            let midSum = hun + bit
            let lowSum = ten + bit
            return [highSum, midSum, lowSum].indexOf(parseInt(calcItem.ruleValue)) > -1
        } else if (label === 'lmc') {
            let highDiff = Math.abs(hun - ten)
            let midDiff = Math.abs(hun - bit)
            let lowDiff = Math.abs(ten - bit)
            return [highDiff, midDiff, lowDiff].indexOf(parseInt(calcItem.ruleValue)) > -1
        } else if (label === 'zdz') {
            let max = Math.max(hun, ten, bit)
            return max === parseInt(calcItem.ruleValue)
        } else if (label === 'zjz') {
            let arr = [hun, ten, bit].sort()
            return arr[1] === parseInt(calcItem.ruleValue)
        } else if (label === 'zxz') {
            let min = Math.max(hun, ten, bit)
            return min === parseInt(calcItem.ruleValue)
        } else if (label === 'dzx') {
            let tLabel = getDzxLabel([hun, ten, bit])
            // console.log("dzx过滤", code, tLabel, dmzRule)
            return tLabel === calcItem.ruleValue
        } else if (label === '012l') {
            let tLabel = get012Label([hun, ten, bit])
            return tLabel === calcItem.ruleValue
        } else if (label === 'hz2') {
            let hz = (hun + ten + bit) % 10
            return hz === parseInt(calcItem.ruleValue)
        } else if (label === 'mcsm') {
            let highDiff = Math.abs(hun - ten)
            let midDiff = Math.abs(hun - bit)
            let lowDiff = Math.abs(ten - bit)
            let diffArr = [highDiff, midDiff, lowDiff].sort()
            let diffCode = `${diffArr[0]}${diffArr[1]}${diffArr[2]}`
            return diffCode === calcItem.ruleValue
        }
    }
}

function contains(arrList, arr) {
    if (arrList.length === 0) return false
    let len = arrList[0].length;
    if (len !== arr.length) return false
    let s = arr.toString()
    let contains = false
    for (let item of arrList) {
        contains = item.toString() === s
        if (contains) return true
    }
    return contains
}

// 递增顺序
function getCalcGroups(ruleList, igIndexArr) {
    if (ruleList.length === 0) return []
    //将规则转换成规则项组
    let ruleGroups = []
    let ruleGroupLens = []
    let maxLen = 0
    for (let i = 0; i < ruleList.length; i++) {
        let rule = ruleList[i]
        let withdraw = igIndexArr.indexOf(i) > -1 //当前规则组是否进行容错
        let ruleGroup = []
        // 胆码组和容错得条件当成一整个计算项进行计算
        if ((rule.label === 'dmz') || (rule.ignore && withdraw)) {
            ruleGroup.push(rule)
        } else {
            for (let ruleValue of rule.checks) {
                ruleGroup.push({label: rule.label, ruleValue})
            }
        }
        ruleGroups.push(ruleGroup)
        ruleGroupLens.push(ruleGroup.length)
        maxLen = Math.max(maxLen, ruleGroup.length) // 优先下标+1值
    }
    //将规则组中每组排序计算得到规则项组
    let indexGroups = []
    let index = 0 //当前优先下标
    let len = ruleGroups.length // 优先下标最大个数,行数
    let subArrs = subsets([...new Array(len).keys()]) // 所有行的组合下标可能性
    let startIndexArr = getStartIndexArr(len)
    while (index <= maxLen - 1) {
        resetIndex(startIndexArr, index, ruleGroupLens)
        //从最大优先下标个数开始依次递减
        for (let fixCount = len; fixCount > 0; fixCount--) {
            let changeIndexArr = getChangeIndexArr(len - fixCount, subArrs) // 获取指定行数下表的可能性
            if (changeIndexArr.length > 0) {
                for (let indexArr of changeIndexArr) {
                    for (let i = indexArr.length - 1; i >= 0; i--) {
                        // 快速移动到len下标的行
                        let changeIndex = indexArr[i]
                        // 其他需要缓慢移动的行的下表
                        let otherIndexArr = structuredClone(indexArr).splice(indexArr.indexOf(changeIndex), 1)
                        let tmpOtherIndex = index + 1
                        for (let j = otherIndexArr.length - 1; j >= 0; j--) {
                            // 缓慢移动的行,changeIndex行移动到顶之后 + 1
                            let otherRowIndex = otherIndexArr[j]
                            for (let k = tmpOtherIndex; k < ruleGroupLens[otherRowIndex]; k++) {
                                resetIndex(startIndexArr, index, ruleGroupLens, otherRowIndex, tmpOtherIndex)
                                //非当前浮动条件值的下标固定index依次递增直到最大值
                                for (let otherFixIndex of otherIndexArr) {
                                    if (otherFixIndex !== changeIndex) {
                                        let oIndex = startIndexArr[otherFixIndex] + 1
                                        oIndex = oIndex > ruleGroupLens[otherFixIndex] - 1 ? ruleGroupLens[otherFixIndex] - 1 : oIndex
                                        startIndexArr[otherFixIndex] = oIndex
                                    }
                                }
                                let indexTmp = startIndexArr[changeIndex] //当前浮动条件值得下标
                                //当前变动下标从index+1依次递增到当前最大下标
                                while (indexTmp < ruleGroupLens[changeIndex] - 1) {
                                    startIndexArr[changeIndex] = ++indexTmp
                                    if (!contains(indexGroups, startIndexArr)) {
                                        indexGroups.push(structuredClone(startIndexArr))
                                    }
                                }
                                tmpOtherIndex++
                            }
                        }
                    }
                }
            } else {
                if (!contains(indexGroups, startIndexArr)) {
                    indexGroups.push(structuredClone(startIndexArr))
                }
            }
        }
        index++ //优先下标后移
    }
    //根据indexGroups获取从ruleGroups中获取对用的计算项
    let calcGroups = []
    for (let indexGroup of indexGroups) {
        let calcGroup = []
        for (let i = 0; i < len; i++) {
            calcGroup.push(ruleGroups[i][indexGroup[i]])
        }
        calcGroups.push(calcGroup)
    }
    return calcGroups
}

// 交叉顺序
function getCalcGroups2(ruleList, igIndexArr) {
    if (ruleList.length === 0) return []
    //将规则转换成规则项组
    let ruleGroups = []
    let ruleGroupLens = []
    let maxLen = 0
    for (let i = 0; i < ruleList.length; i++) {
        let rule = ruleList[i]
        let withdraw = igIndexArr.indexOf(i) > -1 //当前规则组是否进行容错
        let ruleGroup = []
        // 胆码组和容错得条件当成一整个计算项进行计算
        if ((rule.label === 'dmz') || (rule.ignore && withdraw)) {
            ruleGroup.push(rule)
        } else {
            for (let ruleValue of rule.checks) {
                ruleGroup.push({label: rule.label, ruleValue})
            }
        }
        ruleGroups.push(ruleGroup)
        ruleGroupLens.push(ruleGroup.length)
        maxLen = Math.max(maxLen, ruleGroup.length) //最大优先下标+1值
    }
    //将规则组中每组排序计算得到规则项组
    let indexGroups = []
    let allIndexGroups = []
    for (let len of ruleGroupLens) {
        allIndexGroups.push([...new Array(len).keys()])
    }
    combine(allIndexGroups, indexGroups)
    clearTemp()
    sortIndexArrAsc(indexGroups)
    //根据indexGroups获取从ruleGroups中获取对用的计算项
    let calcGroups = []
    let len = ruleGroups.length
    for (let indexGroup of indexGroups) {
        let calcGroup = []
        for (let i = 0; i < len; i++) {
            calcGroup.push(ruleGroups[i][indexGroup[i]])
        }
        calcGroups.push(calcGroup)
    }
    return calcGroups
}

let temp = []

function combine(arr, results, index = 0) {
    arr[index].forEach(item => {
        temp[index] = item
        index + 1 < arr.length
            ? combine(arr, results, index + 1)
            : results.push(temp.slice())
    })
}

function clearTemp() {
    temp = []
}

function sortIndexArrAsc(arr) {
    // 按照最小值更小的排列
    arr.sort((arr1, arr2) => {
        let len = arr1.length
        let tmp1 = structuredClone(arr1).sort()
        let tmp2 = structuredClone(arr2).sort()
        for (let i = 0; i < len; i++) {
            if (tmp1[i] !== tmp2[i]) {
                return tmp1[i] - tmp2[i]
            }
        }
        return 0
    })
}

function subsets(nums) {
    let res = [], len = nums.length;
    for (let i = 0; i < (1 << len); i++) {
        let arr = [];
        for (let j = 0; j < len; j++) {
            if (i & (1 << j)) arr.push(nums[j]);
        }
        res.push(arr);
    }
    return res;
}

function resetIndex(startIndexArr, index, ruleGroupLens, otherRowIndex, tmpOtherIndex) {
    for (let i = 0; i < startIndexArr.length; i++) {
        let tmp = index
        tmp = tmp < ruleGroupLens[i] - 1 ? tmp : ruleGroupLens[i] - 1
        startIndexArr[i] = tmp
    }
    startIndexArr[otherRowIndex] = tmpOtherIndex
}

function getChangeIndexArr(changeCount, subArrs) {
    if (changeCount === 0) return []
    let changeIndexArr = []
    for (let subArr of subArrs) {
        //符合变动条件数量
        if (changeCount === subArr.length) {
            changeIndexArr.push(subArr)
        }
    }
    return changeIndexArr
}

function getStartIndexArr(len) {
    let startIndexArr = []
    for (let i = 0; i < len; i++) {
        startIndexArr.push(0)
    }
    return startIndexArr
}

export const getSeqArr = (end) => {
    let nums = [...new Array(end + 1).keys()]
    return nums.reduce((pre, cur) => {
        pre.push(cur.toString())
        return pre
    }, [])
}

export const getNumGroup = (numList, typeList) => {
    let resultList = []
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
    // console.log(resultList)
    return distinctCodes(resultList);
}

//豹子:竟猜三位开奖号码，即百位、十位和个位三位相同
function getBzList(numList) {
    let orderList = numList.sort()
    let resArr = []
    for (let num of orderList) {
        resArr.push(`${num}${num}${num}`)
    }
    return resArr
}

//组三:竟猜三位开奖号码，即百位、十位和个位，顺序不限，且投注时三位号码有两位相同。
function getZsList(numList) {
    if (numList.length < 2) {
        console.log('待选值数量小于2,无法产生组三号码')
    }
    let orderList = numList.sort()
    let resArr = []
    for (let one of orderList) {
        for (let two of orderList) {
            if (one < two) {
                resArr.push(`${one}${two}${two}`)
            } else if (one > two) {
                resArr.push(`${two}${two}${one}`)
            }
        }
    }
    return resArr
}

//组六:竟猜三位开奖号码，即百位、十位和个位，顺序不限，且投注时三位号码各不相同
function getZulList(numList) {
    if (numList.length < 3) {
        console.log('待选值数量小于3,无法产生组六号码')
    }
    let orderList = numList.sort()
    let resArr = []
    for (let first of orderList) {
        for (let second of orderList) {
            for (let third of orderList) {
                if (first !== second && second !== third && first !== third) {
                    let bitList = [first, second, third].sort((a, b) => a - b)
                    let code = `${bitList[0]}${bitList[1]}${bitList[2]}`
                    if (resArr.indexOf(code) === -1) {
                        resArr.push(code)
                    }
                }
            }
        }
    }
    return resArr
}

//顺子:竟猜三位开奖号码，即百位、十位和个位，百位、十位和个位都不相同且依次递增为1,从0-9,9-0循环
function getSzList(numList) {
    let orderList = numList.sort()
    let resArr = []
    for (let first of orderList) {
        for (let second of orderList) {
            for (let third of orderList) {
                if (first !== second && second !== third && first !== third) {
                    let incrFirst = szIncrement(first)
                    let incrSecond = szIncrement(second)
                    if (incrFirst === second && incrSecond === third) {
                        resArr.push(`${first}${second}${third}`)
                    }
                }
            }
        }
    }
    return resArr
}

function szIncrement(num) {
    if (num === '9') return '0'
    return parseInt(num) + 1 + ''
}

//半顺:竟猜三位开奖号码，即百位、十位和个位，百位、十位和个位都不相同且百十位或十个位依次递增为1,从0-9,9-0循环
function getBsList(numList) {
    let orderList = numList.sort()
    let resArr = []
    for (let first of orderList) {
        for (let second of orderList) {
            for (let third of orderList) {
                if (first !== second && second !== third && first !== third) {
                    let bitList = [first, second, third].sort((a, b) => a - b)
                    let code = `${bitList[0]}${bitList[1]}${bitList[2]}`
                    if (resArr.indexOf(code) === -1 && isBanShun(code) && !isShunZi(code)) {
                        resArr.push(code)
                    }
                }
            }
        }
    }
    // console.log(resArr)
    return resArr
}

function isShunZi(code) {
    let codeArr = [code[0], code[1], code[2]].sort()
    return (szIncrement(codeArr[0]) === codeArr[1] && szIncrement(codeArr[1]) === codeArr[2]) ||
        (szIncrement(codeArr[1]) === codeArr[2] && szIncrement(codeArr[2]) === codeArr[0]) ||
        (szIncrement(codeArr[2]) === codeArr[0] && szIncrement(codeArr[0]) === codeArr[1])
}

function isBanShun(code) {
    let codeArr = [code[0], code[1], code[2]].sort()
    return szIncrement(codeArr[0]) === codeArr[1] || szIncrement(codeArr[1]) === codeArr[2] || szIncrement(codeArr[2]) === codeArr[0]
}

//杂六:竟猜三位开奖号码，即百位、十位和个位，百位、十位和个位都不相同且互不相邻
function getZalList(numList) {
    let orderList = numList.sort()
    let resArr = []
    for (let first of orderList) {
        for (let second of orderList) {
            for (let third of orderList) {
                if (first !== second && second !== third && first !== third) {
                    let bitList = [first, second, third].sort((a, b) => a - b)
                    let code = `${bitList[0]}${bitList[1]}${bitList[2]}`
                    if (resArr.indexOf(code) === -1 && !isShunZi(code) && !isBanShun(code)) {
                        resArr.push(code)
                    }
                }
            }
        }
    }
    return resArr
}

export const getNumDirect = (bitList, tenList, hunList) => {
    let codeList = []
    for (let hun of hunList) {
        for (let ten of tenList) {
            for (let bit of bitList) {
                codeList.push(`${hun}${ten}${bit}`)
            }
        }
    }
    return codeList
}

function distinctCodes(codeList) {
    let map = new Map();
    for (let code of codeList) {
        map.set(code, 0)
    }
    return [...map.keys()]
}

export const getNumObjByCodes = (codeList) => {
    let objList = []
    for (let code of codeList) {
        let hun = parseInt(code[0])
        let ten = parseInt(code[1])
        let bit = parseInt(code[2])
        let sum = hun + ten + bit
        let diff = Math.max(hun, ten, bit) - Math.min(hun, ten, bit)
        let dzx = getDzxLabel([hun, ten, bit])
        let lye = get012Label([hun, ten, bit])
        objList.push({code, sum, diff, dzx, lye})
    }
    return objList
}

let dzxArr = ['小', '中', '大']

function getDzxLabel(bitList) {
    let labelArr = []
    for (let num of bitList) {
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

function get012Label(bitList) {
    let labelArr = []
    for (let num of bitList) {
        labelArr.push(num % 3)
    }
    return labelArr.sort().join('')
}

export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(new Date(date).getTime()).format(format)
}


