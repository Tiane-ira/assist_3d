const allNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

export const getNumGroup = (numList, typeList) => {
    let resultList = []
    console.log(numList)
    console.log(typeList)
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
            resultList = [...resultList, ...getZulList(numList)]
        }
    }
    return distinctList(resultList)
}

//豹子:竟猜三位开奖号码，即百位、十位和个位三位相同
function getBzList(numList) {
    let orderList = numList.sort((a, b) => a - b)
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
    let orderList = numList.sort((a, b) => a - b)
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
    let orderList = numList.sort((a, b) => a - b)
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
    let orderList = numList.sort((a, b) => a - b)
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
    let orderList = numList.sort((a, b) => a - b)
    let resArr = []
    for (let first of orderList) {
        for (let second of orderList) {
            for (let third of orderList) {
                if (first !== second && second !== third && first !== third) {
                    let incrFirst = szIncrement(first)
                    let incrSecond = szIncrement(second)
                    // console.log(first,second,third,incrFirst,incrSecond)
                    if ((incrFirst === second && incrSecond !== third) || (incrFirst !== second && incrSecond === third)) {
                        let code = `${first}${second}${third}`
                        let bitList = [first, second, third].sort((a, b) => a - b)
                        if (resArr.findIndex(item => {
                            let itemBitList = [item[0], item[1], item[2]].sort((a, b) => a - b)
                            return itemBitList === bitList
                        }) === -1) {
                            resArr.push(code)
                        }
                    }
                }
            }
        }
    }
    console.log(resArr)
    return resArr
}

//杂六:竟猜三位开奖号码，即百位、十位和个位，百位、十位和个位都不相同且互不相邻
function getZalList(numList) {
    let orderList = numList.sort((a, b) => a - b)
    let resArr = []
    for (let first of orderList) {
        for (let second of orderList) {
            for (let third of orderList) {
                if (first !== second && second !== third && first !== third) {
                    let bitList = [first, second, third].sort((a, b) => a - b)
                    let incrFirst = szIncrement(bitList[0])
                    let incrSecond = szIncrement(bitList[1])
                    if (incrFirst !== bitList[1] && incrSecond !== bitList[2]) {
                        let code = `${bitList[0]}${bitList[1]}${bitList[2]}`
                        if (resArr.indexOf(code) === -1) {
                            resArr.push(code)
                        }
                    }
                }
            }
        }
    }
    return resArr
}

export const getNumDirect = (bitList, tenList, hunList) => {
    let resultList = []
    for (let hun of hunList) {
        for (let ten of tenList) {
            for (let bit of bitList) {
                resultList.push(getNum(hun, ten, bit))
            }
        }
    }
    return resultList
}

export const getIgCount = (igMin, igMax) => {
    let count = 0
    if (igMin === igMax) {
        count = igMin
    } else {
        count = Math.floor(Math.random() * (igMax - igMin + 1)) + igMin;
    }
    return count
}

//选定下标进行截取
export const getRandomList = (checkCount, ruleList) => {
    if (checkCount === 0) return []
    let len = ruleList.length
    if (checkCount >= len) {
        return ruleList
    } else {
        let start = Math.floor(Math.random() * len)
        let end = start + checkCount
        if (end <= len) {
            return ruleList.slice(start, end)
        } else {
            let rest = end - len
            return [...ruleList.slice(start, len), ...ruleList.slice(0, rest)]
        }
    }
}

export const filterCode = (obj, ruleList) => {
    let hun = parseInt(obj.code.slice(0, 1))
    let ten = parseInt(obj.code.slice(1, 2))
    let bit = parseInt(obj.code.slice(2, 3))
    let pass = true
    for (let rule of ruleList) {
        let label = rule.label
        if (label === 'jo') {
            let oddCount = 0
            if (hun % 2 === 1) oddCount++
            if (ten % 2 === 1) oddCount++
            if (bit % 2 === 1) oddCount++
            pass = rule.value.indexOf(oddCount) > -1
        } else if (label === 'hz') {
            let sum = hun + ten + bit
            pass = rule.value.indexOf(sum) > -1
        } else if (label === 'kd') {
            let diff = Math.max(hun, ten, bit) - Math.min(hun, ten, bit)
            pass = rule.value.indexOf(diff) > -1
        } else if (label === 'lmh') {
            let highSum = hun + ten
            let midSum = hun + bit
            let lowSum = ten + bit
            pass = rule.value.indexOf(highSum) > -1 ||
                rule.value.indexOf(midSum) > -1 ||
                rule.value.indexOf(lowSum) > -1
        } else if (label === 'lmc') {
            let highDiff = Math.abs(hun - ten)
            let midDiff = Math.abs(hun - bit)
            let lowDiff = Math.abs(ten - bit)
            pass = rule.value.indexOf(highDiff) > -1 ||
                rule.value.indexOf(midDiff) > -1 ||
                rule.value.indexOf(lowDiff) > -1
        } else if (label === 'zdz') {
            let max = Math.max(hun, ten, bit)
            pass = rule.value.indexOf(max) > -1
        } else if (label === 'zjz') {
            let arr = [hun, ten, bit];
            let orderArr = arr.sort((a, b) => a - b)
            let mid = orderArr[1]
            pass = rule.value.indexOf(mid)
        } else if (label === 'zxz') {
            let min = Math.min(hun, ten, bit)
            pass = rule.value.indexOf(min) > -1
        } else if (label === 'dzx') {
            let maxCount = 0
            let midCount = 0
            let minCount = 0
            for (let num of [hun, ten, bit]) {
                if (num >= 0 && num <= 2) {
                    minCount++
                } else if (num >= 3 && num <= 6) {
                    midCount++
                } else {
                    maxCount++
                }
            }
            pass = rule.value[0].value.indexOf(maxCount) > -1 ||
                rule.value[1].value.indexOf(midCount) > -1 ||
                rule.value[2].value.indexOf(minCount) > -1
        } else if (label === '012l') {
            let zeroCount = 0
            let ondCount = 0
            let twoCount = 0
            for (let num of [hun, ten, bit]) {
                if (num % 3 === 0) {
                    zeroCount++
                } else if (num % 3 === 1) {
                    ondCount++
                } else {
                    twoCount++
                }
            }
            pass = rule.value[0].value.indexOf(zeroCount) > -1 ||
                rule.value[1].value.indexOf(ondCount) > -1 ||
                rule.value[2].value.indexOf(twoCount) > -1
        } else if (label === 'dmz') {
            for (const dmzItem of rule.value) {
                if (dmzItem.value.length > 0) {
                    let count = 0
                    for (const num of [hun, ten, bit]) {
                        if (dmzItem.value.indexOf(num) > -1) {
                            count++
                        }
                    }
                    pass = dmzItem.count.indexOf(count) > -1
                    if (pass) break
                }
            }
        }
        if (!pass) {
            return false
        }
    }
    return true
}

function getNum(hunStr, tenStr, bitStr) {
    let hun = parseInt(hunStr);
    let ten = parseInt(tenStr);
    let bit = parseInt(bitStr);
    let abs = Math.max(hun, ten, bit) - Math.min(hun, ten, bit)
    let sum = hun + ten + bit
    let code = `${hun}${ten}${bit}`
    return {code, sum, abs, ruleNum: 0}
}

function isShunZi(hunStr, tenStr, bitStr) {
    let hun = parseInt(hunStr);
    let ten = parseInt(tenStr);
    let bit = parseInt(bitStr);
    let highDiff = hun - ten;
    let lowDiff = ten - bit;
    return highDiff === lowDiff && (highDiff === 1 || highDiff === -1)
}

function isHalfShunZi(hunStr, tenStr, bitStr) {
    let hun = parseInt(hunStr);
    let ten = parseInt(tenStr);
    let bit = parseInt(bitStr);
    let highDiff = hun - ten;
    let lowDiff = ten - bit;
    return (highDiff === 1 && lowDiff !== 1) ||
        (highDiff !== 1 && lowDiff === 1) ||
        (highDiff === -1 && lowDiff !== -1) ||
        (highDiff !== -1 && lowDiff === -1)
}

function isZaLiu(hunStr, tenStr, bitStr) {
    let hun = parseInt(hunStr);
    let ten = parseInt(tenStr);
    let bit = parseInt(bitStr);
    let highDiff = hun - ten;
    let lowDiff = ten - bit;
    let midDiff = hun - bit;
    return Math.abs(highDiff) > 1 && Math.abs(lowDiff) > 1 && Math.abs(midDiff) > 1
}

function distinctList(numList) {
    let map = new Map();
    for (let num of numList) {
        if (!map.has(num.code)) {
            map.set(num.code, num)
        }
    }
    return [...map.values()]
}
