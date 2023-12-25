export function getNumGroup(numList, typeList) {
    let resultList = []
    console.log(numList)
    console.log(typeList)
    if (typeList.indexOf('组三') > -1 && numList.length < 2) {
        console.log('待选值数量小于2,无法产生组三号码')
    }
    if (typeList.indexOf('组六') > -1 && numList.length < 3) {
        console.log('待选值数量小于3,无法产生组六号码')
    }
    for (let hun of numList) {
        for (let ten of numList) {
            for (let bit of numList) {
                if (typeList.indexOf('豹子') > -1 && hun === ten && ten === bit) {
                    let num = parseInt(hun);
                    let code = `${num}${num}${num}`
                    resultList.push({code, sum: 3 * num, abs: 0})
                }
                if (typeList.indexOf('组三') > -1
                    && ((hun === ten && ten !== bit) ||
                        (hun !== ten && ten === bit) ||
                        (hun === bit && ten !== bit))) {
                    resultList.push(getNum(hun, ten, bit))
                }
                if (typeList.indexOf('组六') > -1 && hun !== ten && ten !== bit && hun !== bit) {
                    resultList.push(getNum(hun, ten, bit))
                }
                if (typeList.indexOf('顺子') > -1 && isShunZi(hun, ten, bit)) {
                    resultList.push(getNum(hun, ten, bit))
                }
                if (typeList.indexOf('半顺') > -1 && isHalfShunZi(hun, ten, bit)) {
                    resultList.push(getNum(hun, ten, bit))
                }
                if (typeList.indexOf('杂六') > -1 && isZaLiu(hun, ten, bit)) {
                    resultList.push(getNum(hun, ten, bit))
                }
            }
        }
    }
    return distinctList(resultList)
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
