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

function getNum(hunStr, tenStr, bitStr) {
    let hun = parseInt(hunStr);
    let ten = parseInt(tenStr);
    let bit = parseInt(bitStr);
    let abs = Math.max(hun, ten, bit) - Math.min(hun, ten, bit)
    let sum = hun + ten + bit
    let code = `${hun}${ten}${bit}`
    return {code, sum, abs}
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