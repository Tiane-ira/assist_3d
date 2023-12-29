const allNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

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
    console.log(resultList)
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
    let orderList = numList.sort()
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

function getDzxLabel(bitList) {
    let label = ''
    for (let num of bitList) {
        if (num >= 0 && num <= 2) {
            label += '小'
        } else if (num >= 3 && num <= 6) {
            label += '中'
        } else {
            label += '大'
        }
    }
    return label
}

function get012Label(bitList) {
    let label = ''
    for (let num of bitList) {
        label += num % 3
    }
    return label
}


