//候选集codeList,根据规则列表中所有的索引组合出过滤项，通过过滤就加入结果集,直到候选集都通过或所有过滤项过滤完
export const getIgCounts = (min, max) => {
    let igCounts = [];
    while (min <= max) {
        igCounts.push(min);
        min++;
    }
    return igCounts;
};
export const getSeqArr = (end) => {
    let nums = [...new Array(end + 1).keys()];
    return nums.reduce((pre, cur) => {
        pre.push(cur.toString());
        return pre;
    }, []);
};

export const getNumGroup = (numList, typeList) => {
    let resultList = [];
    if (typeList.indexOf("组三") > -1 && numList.length < 2) {
        console.log("待选值数量小于2,无法产生组三号码");
    }
    if (typeList.indexOf("组六") > -1 && numList.length < 3) {
        console.log("待选值数量小于3,无法产生组六号码");
    }
    if (typeList.indexOf("豹子") > -1) {
        resultList = [...resultList, ...getBzList(numList)];
    }
    if (typeList.indexOf("组三") > -1) {
        resultList = [...resultList, ...getZsList(numList)];
    }
    if (typeList.indexOf("组六") > -1) {
        resultList = [...resultList, ...getZulList(numList)];
    } else {
        if (typeList.indexOf("顺子") > -1) {
            resultList = [...resultList, ...getSzList(numList)];
        }
        if (typeList.indexOf("半顺") > -1) {
            resultList = [...resultList, ...getBsList(numList)];
        }
        if (typeList.indexOf("杂六") > -1) {
            resultList = [...resultList, ...getZalList(numList)];
        }
    }
    // console.log(resultList)
    return distinctCodes(resultList);
};

//豹子:竟猜三位开奖号码，即百位、十位和个位三位相同
function getBzList(numList) {
    let orderList = numList.sort();
    let resArr = [];
    for (let num of orderList) {
        resArr.push(`${num}${num}${num}`);
    }
    return resArr;
}

function isBz(code) {
    return code[0] === code[1] && code[1] === code[2];
}

//组三:竟猜三位开奖号码，即百位、十位和个位，顺序不限，且投注时三位号码有两位相同。
function getZsList(numList) {
    if (numList.length < 2) {
        console.log("待选值数量小于2,无法产生组三号码");
    }
    let orderList = numList.sort();
    let resArr = [];
    for (let one of orderList) {
        for (let two of orderList) {
            if (one < two) {
                resArr.push(`${one}${two}${two}`);
            } else if (one > two) {
                resArr.push(`${two}${two}${one}`);
            }
        }
    }
    return resArr;
}

function isZs(code) {
    return !isBz(code) && (code[0] === code[1] || code[1] === code[2] || code[0] === code[2]);
}

//组六:竟猜三位开奖号码，即百位、十位和个位，顺序不限，且投注时三位号码各不相同
function getZulList(numList) {
    if (numList.length < 3) {
        console.log("待选值数量小于3,无法产生组六号码");
    }
    let orderList = numList.sort();
    let resArr = [];
    for (let first of orderList) {
        for (let second of orderList) {
            for (let third of orderList) {
                if (first !== second && second !== third && first !== third) {
                    let bitList = [first, second, third].sort((a, b) => a - b);
                    let code = `${bitList[0]}${bitList[1]}${bitList[2]}`;
                    if (resArr.indexOf(code) === -1) {
                        resArr.push(code);
                    }
                }
            }
        }
    }
    return resArr;
}

function isZul(code) {
    return code[0] !== code[1] && code[1] !== code[2] && code[0] !== code[2];
}

//顺子:竟猜三位开奖号码，即百位、十位和个位，百位、十位和个位都不相同且依次递增为1,从0-9,9-0循环
function getSzList(numList) {
    let orderList = numList.sort();
    let resArr = [];
    for (let first of orderList) {
        for (let second of orderList) {
            for (let third of orderList) {
                if (first !== second && second !== third && first !== third) {
                    let incrFirst = szIncrement(first);
                    let incrSecond = szIncrement(second);
                    if (incrFirst === second && incrSecond === third) {
                        resArr.push(`${first}${second}${third}`);
                    }
                }
            }
        }
    }
    return resArr;
}

function szIncrement(num) {
    if (num === "9") return "0";
    return parseInt(num) + 1 + "";
}

//半顺:竟猜三位开奖号码，即百位、十位和个位，百位、十位和个位都不相同且百十位或十个位依次递增为1,从0-9,9-0循环
function getBsList(numList) {
    let orderList = numList.sort();
    let resArr = [];
    for (let first of orderList) {
        for (let second of orderList) {
            for (let third of orderList) {
                if (first !== second && second !== third && first !== third) {
                    let bitList = [first, second, third].sort((a, b) => a - b);
                    let code = `${bitList[0]}${bitList[1]}${bitList[2]}`;
                    if (
                        resArr.indexOf(code) === -1 &&
                        isBanShun(code) &&
                        !isShunZi(code)
                    ) {
                        resArr.push(code);
                    }
                }
            }
        }
    }
    // console.log(resArr)
    return resArr;
}

function isShunZi(code) {
    let codeArr = [code[0], code[1], code[2]].sort();
    return (
        (szIncrement(codeArr[0]) === codeArr[1] &&
            szIncrement(codeArr[1]) === codeArr[2]) ||
        (szIncrement(codeArr[1]) === codeArr[2] &&
            szIncrement(codeArr[2]) === codeArr[0]) ||
        (szIncrement(codeArr[2]) === codeArr[0] &&
            szIncrement(codeArr[0]) === codeArr[1])
    );
}

function isBanShun(code) {
    if (isShunZi(code) || isZs(code)) return false
    let codeArr = [code[0], code[1], code[2]].sort();
    return (
        szIncrement(codeArr[0]) === codeArr[1] ||
        szIncrement(codeArr[1]) === codeArr[2] ||
        szIncrement(codeArr[2]) === codeArr[0]
    );
}

//杂六:竟猜三位开奖号码，即百位、十位和个位，百位、十位和个位都不相同且互不相邻
function getZalList(numList) {
    let orderList = numList.sort();
    let resArr = [];
    for (let first of orderList) {
        for (let second of orderList) {
            for (let third of orderList) {
                if (first !== second && second !== third && first !== third) {
                    let bitList = [first, second, third].sort((a, b) => a - b);
                    let code = `${bitList[0]}${bitList[1]}${bitList[2]}`;
                    if (
                        resArr.indexOf(code) === -1 &&
                        !isShunZi(code) &&
                        !isBanShun(code)
                    ) {
                        resArr.push(code);
                    }
                }
            }
        }
    }
    return resArr;
}

function isZal(code) {
    return !isBz(code) && !isZs(code) && !isShunZi(code) && !isBanShun(code)
}

export const getNumDirect = (bitList, tenList, hunList, typeList) => {
    let resultList = [];
    let codeList = [];
    for (let hun of hunList) {
        for (let ten of tenList) {
            for (let bit of bitList) {
                codeList.push(`${hun}${ten}${bit}`);
            }
        }
    }
    for (const code of codeList) {
        if (typeList.indexOf("豹子") > -1 && isBz(code)) {
            resultList = [...resultList, code]
            continue
        }
        if (typeList.indexOf("组三") > -1 && isZs(code)) {
            resultList = [...resultList, code]
            continue
        }
        if (typeList.indexOf("组六") > -1 && isZul(code)) {
            resultList = [...resultList, code]
            continue
        } else {
            if (typeList.indexOf("顺子") > -1 && isShunZi(code)) {
                resultList = [...resultList, code]
                continue
            }
            if (typeList.indexOf("半顺") > -1 && isBanShun(code)) {
                resultList = [...resultList, code]
                continue
            }
            if (typeList.indexOf("杂六") > -1 && isZal(code)) {
                resultList = [...resultList, code]
                continue
            }
        }
    }
    return resultList;
};

function distinctCodes(codeList) {
    let map = new Map();
    for (let code of codeList) {
        map.set(code, 0);
    }
    return [...map.keys()];
}

export const getNumObjByCodes = (codeList) => {
    let objList = [];
    for (let code of codeList) {
        let hun = parseInt(code[0]);
        let ten = parseInt(code[1]);
        let bit = parseInt(code[2]);
        let sum = hun + ten + bit;
        let diff = Math.max(hun, ten, bit) - Math.min(hun, ten, bit);
        let dzx = getDzxLabel([hun, ten, bit]);
        let lye = get012Label([hun, ten, bit]);
        let smc = getSmcLabel([hun, ten, bit]);
        let smh = getSmhLabel([hun, ten, bit]);
        objList.push({ code, sum, diff, dzx, lye, smc, smh });
    }
    return objList;
};

let dzxArr = ["小", "中", "大"];

function getDzxLabel(bitList) {
    let labelArr = [];
    for (let num of bitList) {
        if (num >= 0 && num <= 2) {
            labelArr.push("小");
        } else if (num >= 3 && num <= 6) {
            labelArr.push("中");
        } else {
            labelArr.push("大");
        }
    }
    return labelArr
        .sort((a, b) => dzxArr.indexOf(a) - dzxArr.indexOf(b))
        .join("");
}

function get012Label(bitList) {
    let labelArr = [];
    for (let num of bitList) {
        labelArr.push(num % 3);
    }
    return labelArr.sort().join("");
}

function getSmcLabel(bitList) {
    let highDiff = Math.abs(bitList[0] - bitList[1]);
    let midDiff = Math.abs(bitList[1] - bitList[2]);
    let lowDiff = Math.abs(bitList[0] - bitList[2]);
    let labelArr = [highDiff, midDiff, lowDiff].sort((a, b) => a - b);
    return `${labelArr[0]}${labelArr[1]}${labelArr[2]}`;
}

function getSmhLabel(bitList) {
    let highSum = (bitList[0] + bitList[1]) % 10;
    let midSum = (bitList[1] + bitList[2]) % 10;
    let lowSum = (bitList[0] + bitList[2]) % 10;
    let labelArr = [highSum, midSum, lowSum].sort((a, b) => a - b);
    return `${labelArr[0]}${labelArr[1]}${labelArr[2]}`;
}

export const group2Direct = (arr) => {
    let len = arr.length
    let res = [] // 所有排列结果
    /**
     * 【全排列算法】
     * 说明：arrange用来对arr中的元素进行排列组合，将排列好的各个结果存在新数组中
     * @param tempArr：排列好的元素
     * @param leftArr：待排列元素
     */
    let arrange = (tempArr, leftArr) => {
        if (tempArr.length === len) {
            res.push(tempArr.join(''))
        } else {
            leftArr.forEach((item, index) => {
                let temp = [].concat(leftArr)
                temp.splice(index, 1)
                arrange(tempArr.concat(item), temp) //递归
            })
        }
    }
    arrange([], arr)
    return new Set(res)
}

export const direct2Group = (code) => {
    let arr = [...code]
    arr.sort((a, b) => a - b)
    return `${arr[0]}${arr[1]}${arr[2]}`
}

export const validCodes = (codes) => {
    for (const code of codes) {
        // 正则表达式，匹配三位数字
        const regex = /^\d{3}$/;
        if (!regex.test(code)) {
            return code;
        }
    }
}

