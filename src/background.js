"use strict";

import { app, protocol, BrowserWindow, ipcMain, clipboard, Menu } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";

const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");
const debug = true;
// const debug = false;

const Store = require("electron-store");
const store = new Store();

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
]);

const winUrl = process.env.WEBPACK_DEV_SERVER_URL ? process.env.WEBPACK_DEV_SERVER_URL : "app://./index.html"

let mainWindow = null
async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        minWidth: 1200,
        minHeight: 600,
        autoHideMenuBar: true,
        icon: "build/icons/icon.ico",
        webPreferences: {
            nodeIntegration: true,
            preload: path.resolve(__dirname, "preload.js"),
            devTools: isDevelopment, // 禁用开发者工具
        },
    });
    win.maximize();

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(winUrl);
        // if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        win.loadURL(winUrl);
    }
    // for mac copy paset shortcut
    if (process.platform === 'darwin') {
        app.setName("Assist 3D");
        const template = [
            // { role: 'appMenu' },
            {
                label: app.name,
                submenu: [
                    { role: 'about' },
                    { type: 'separator' },
                    { role: 'services' },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'hideothers' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' },
                ],
            },
            // { role: 'fileMenu' },
            { role: 'editMenu' },
            // { role: 'viewMenu' },
            {
                label: 'View',
                submenu: [
                    ...(
                        (process.env.NODE_ENV === 'production') ? [] : [{ role: 'toggledevtools' }]
                    ),
                    { role: 'togglefullscreen' },
                ],
            },
            // { role: 'windowMenu' },
            {
                role: 'window',
                submenu: [
                    { role: 'minimize' },
                    { role: 'zoom' },
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    // { role: 'window' }
                ],
            }
        ];

        let menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = createWindow();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            console.error("Vue Devtools failed to install:", e.toString());
        }
    }
    mainWindow = createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", (data) => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}

ipcMain.handle("setConfig", (e, key, value) => {
    store.set(key, value);
    console.log("保存配置", key, value);
});

ipcMain.handle("getConfig", (e, key) => {
    let value = store.get(key);
    console.log("获取配置", key, value);
    return value;
});

ipcMain.handle("copy2Clipboard", (e, data) => {
    clipboard.writeText(data);
});

ipcMain.handle("filterCodes", (e, codeList, ruleList, igCounts, orderType) => {
    return codesFilter(codeList, ruleList, igCounts, orderType);
});

ipcMain.handle("openWindow", (e, param) => {
    return openChildWindow(param);
});

function openChildWindow(param) {
    var childWin = new BrowserWindow({
        title: param.title,
        width: param.width,
        height: param.height,
        parent: mainWindow, // win是主窗口，不加parent，新建的窗口将于主窗口平级
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.resolve(__dirname, "preload.js"),
            devTools: isDevelopment,
        }
    })

    childWin.loadURL(winUrl + '#' + param.url)  // hash路由

    // childWin.webContents.openDevTools()

    childWin.on('closed', () => { childWin = null })
}

//获取缓慢移动行所有下标组合
function getSlowRowIndexArrList(index, slowRowArr, ruleGroupLens) {
    let rowIndexArrList = [];
    for (let slowRow of slowRowArr) {
        let rowIndexRow = [];
        let start = index + 1;
        let end = ruleGroupLens[slowRow] - 1;
        if (start >= end) {
            // 行下标已到末尾
            rowIndexRow.push(end);
        } else {
            while (start <= end) {
                rowIndexRow.push(start);
                start++;
            }
        }
        rowIndexArrList.push(rowIndexRow);
    }
    let slowRowIndexArrList = [];
    combine(rowIndexArrList, slowRowIndexArrList);
    clearTemp();
    sortIndexArrAsc(slowRowIndexArrList);
    return slowRowIndexArrList;
}

function resetIndexWithSlow(
    indexGroup,
    index,
    ruleGroupLens,
    slowRowArr,
    slowRowIndexArr
) {
    for (let i = 0; i < indexGroup.length; i++) {
        let tmp = index;
        tmp = tmp < ruleGroupLens[i] - 1 ? tmp : ruleGroupLens[i] - 1;
        indexGroup[i] = tmp;
    }
    for (let i = 0; i < slowRowArr.length; i++) {
        indexGroup[slowRowArr[i]] = slowRowIndexArr[i];
    }
}

function resetIndex(indexGroup, index, ruleGroupLens) {
    for (let i = 0; i < indexGroup.length; i++) {
        let tmp = index;
        tmp = tmp < ruleGroupLens[i] - 1 ? tmp : ruleGroupLens[i] - 1;
        indexGroup[i] = tmp;
    }
}

// 交叉顺序
function getCalcGroups2(ruleList, igIndexArr) {
    if (ruleList.length === 0) return [];
    //将规则转换成规则项组
    let ruleGroups = [];
    let ruleGroupLens = [];
    let maxLen = 0;
    for (let i = 0; i < ruleList.length; i++) {
        let rule = ruleList[i];
        let withdraw = igIndexArr.indexOf(i) > -1; //当前规则组是否进行容错
        let ruleGroup = [];
        // 胆码组、断组、容错条件、不参与排序出号的条件，当成一整个计算项进行计算
        if (
            rule.label === "dmz" ||
            rule.label === "dz" ||
            !rule.isOrder ||
            (rule.ignore && withdraw)
        ) {
            rule.ignore = withdraw && rule.isOrder;
            ruleGroup.push(rule);
        } else {
            for (let ruleValue of rule.checks) {
                ruleGroup.push({ label: rule.label, ruleValue, isOrder: true });
            }
        }
        ruleGroups.push(ruleGroup);
        ruleGroupLens.push(ruleGroup.length);
        maxLen = Math.max(maxLen, ruleGroup.length); //最大优先下标+1值
    }
    //将规则组中每组排序计算得到规则项组
    let indexGroups = [];
    let allIndexGroups = [];
    for (let len of ruleGroupLens) {
        allIndexGroups.push([...new Array(len).keys()]);
    }
    combine(allIndexGroups, indexGroups);
    clearTemp();
    sortIndexArrAsc(indexGroups);
    //根据indexGroups获取从ruleGroups中获取对用的计算项
    let calcGroups = [];
    let len = ruleGroups.length;
    for (let indexGroup of indexGroups) {
        let calcGroup = [];
        for (let i = 0; i < len; i++) {
            calcGroup.push(ruleGroups[i][indexGroup[i]]);
        }
        calcGroups.push(calcGroup);
    }
    return calcGroups;
}

let temp = [];

function combine(arr, results, index = 0) {
    arr[index].forEach((item) => {
        temp[index] = item;
        index + 1 < arr.length
            ? combine(arr, results, index + 1)
            : results.push(temp.slice());
    });
}

function clearTemp() {
    temp = [];
}

function sortIndexArrAsc(arr) {
    // 按照最小值更小的排列
    arr.sort((arr1, arr2) => {
        let len = arr1.length;
        let tmp1 = structuredClone(arr1).sort();
        let tmp2 = structuredClone(arr2).sort();
        for (let i = 0; i < len; i++) {
            if (tmp1[i] !== tmp2[i]) {
                return tmp1[i] - tmp2[i];
            }
        }
        return 0;
    });
}

function subsets(nums) {
    let res = [],
        len = nums.length;
    for (let i = 0; i < 1 << len; i++) {
        let arr = [];
        for (let j = 0; j < len; j++) {
            if (i & (1 << j)) arr.push(nums[j]);
        }
        res.push(arr);
    }
    return res;
}

function getMoveRowArrList(changeCount, subArrs) {
    if (changeCount === 0) return [];
    let changeIndexArr = [];
    for (let subArr of subArrs) {
        //符合变动条件数量
        if (changeCount === subArr.length) {
            changeIndexArr.push(subArr);
        }
    }
    return changeIndexArr.sort((arr1, arr2) => {
        // 和值较大的排前面
        let sumDiff =
            arr2.reduce((pre, cur) => pre + cur, 0) -
            arr1.reduce((pre, cur) => pre + cur, 0);
        if (sumDiff !== 0) return sumDiff;
        // 最大值较大的排前面
        return Math.max(...arr2) - Math.max(...arr1);
    });
}

const dzxArr = ["小", "中", "大"];

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

function getStartIndexArr(len) {
    let startIndexArr = [];
    for (let i = 0; i < len; i++) {
        startIndexArr.push(0);
    }
    return startIndexArr;
}

// 递增顺序
function getCalcGroups(ruleList, igIndexArr) {
    if (ruleList.length === 0) return [];
    //将规则转换成规则项组
    let ruleGroups = [];
    let ruleGroupLens = [];
    let maxLen = 0;
    for (let i = 0; i < ruleList.length; i++) {
        let rule = ruleList[i];
        let withdraw = igIndexArr.indexOf(i) > -1; //当前规则组是否进行容错
        let ruleGroup = [];
        // 胆码组、断组、容错条件、不参与排序出号的条件，当成一整个计算项进行计算
        if (
            rule.label === "dmz" ||
            rule.label === "dz" ||
            !rule.isOrder ||
            (rule.ignore && withdraw)
        ) {
            let newRule = structuredClone(rule);
            newRule.ignore = withdraw;
            ruleGroup.push(newRule);
        } else {
            for (let ruleValue of rule.checks) {
                ruleGroup.push({ label: rule.label, ruleValue, isOrder: true });
            }
        }
        ruleGroups.push(ruleGroup);
        ruleGroupLens.push(ruleGroup.length);
        maxLen = Math.max(maxLen, ruleGroup.length); // 优先下标+1值
    }
    //将规则组中每组排序计算得到规则项组
    let indexGroups = [];
    let index = 0; //当前优先下标
    let maxCount = ruleGroups.length; // 优先下标最大个数,行数
    let rowArrList = subsets([...new Array(maxCount).keys()]); // 所有行的组合下标可能性
    let indexGroup = getStartIndexArr(maxCount);
    while (index <= maxLen - 1) {
        resetIndex(indexGroup, index, ruleGroupLens);
        //最大优先下标个数依次递减
        for (let fixCount = maxCount; fixCount > 0; fixCount--) {
            let moveRowArrList = getMoveRowArrList(maxCount - fixCount, rowArrList); // 获取指定行数下表的可能性
            if (moveRowArrList.length > 0) {
                for (let moveRowArr of moveRowArrList) {
                    for (let i = moveRowArr.length - 1; i >= 0; i--) {
                        resetIndex(indexGroup, index, ruleGroupLens);
                        // 快速移动到len下标的行
                        let quickRow = moveRowArr[i];
                        // 缓慢移动的行的列表
                        let slowRowArr = structuredClone(moveRowArr);
                        slowRowArr.splice(moveRowArr.indexOf(quickRow), 1);
                        if (slowRowArr.length > 0) {
                            let slowRowIndexArrList = getSlowRowIndexArrList(
                                index,
                                slowRowArr,
                                ruleGroupLens
                            );
                            for (let slowRowIndexArr of slowRowIndexArrList) {
                                // console.log("当前缓慢移动行下标:",slowRowIndexArr,"快速移动行",quickRow)
                                resetIndexWithSlow(
                                    indexGroup,
                                    index,
                                    ruleGroupLens,
                                    slowRowArr,
                                    slowRowIndexArr
                                );
                                let tmpQuickIndex = index; //当前浮动条件值得下标
                                //当前变动下标从index+1依次递增到当前最大下标
                                while (tmpQuickIndex < ruleGroupLens[quickRow] - 1) {
                                    indexGroup[quickRow] = ++tmpQuickIndex;
                                    if (!contains(indexGroups, indexGroup)) {
                                        indexGroups.push(structuredClone(indexGroup));
                                    }
                                }
                            }
                        } else {
                            let tmpQuickIndex = index; //当前浮动条件值得下标
                            //当前变动下标从index+1依次递增到当前最大下标
                            while (tmpQuickIndex < ruleGroupLens[quickRow] - 1) {
                                indexGroup[quickRow] = ++tmpQuickIndex;
                                if (!contains(indexGroups, indexGroup)) {
                                    indexGroups.push(structuredClone(indexGroup));
                                }
                            }
                        }
                    }
                }
            } else {
                if (!contains(indexGroups, indexGroup)) {
                    indexGroups.push(structuredClone(indexGroup));
                }
            }
        }
        index++; //优先下标后移
    }
    //根据indexGroups获取从ruleGroups中获取对用的计算项
    let calcGroups = [];
    for (let indexGroup of indexGroups) {
        let calcGroup = [];
        for (let i = 0; i < maxCount; i++) {
            calcGroup.push(ruleGroups[i][indexGroup[i]]);
        }
        calcGroups.push(calcGroup);
    }
    return calcGroups;
}

function contains(arrList, arr) {
    if (arrList.length === 0) return false;
    let len = arrList[0].length;
    if (len !== arr.length) return false;
    let s = arr.toString();
    let contains = false;
    for (let item of arrList) {
        contains = item.toString() === s;
        if (contains) return true;
    }
    return contains;
}

function doFilter(codeList, calcGroup) {
    let resultCodes = [];
    for (let code of codeList) {
        let count = calcGroup.length;
        for (const calcItem of calcGroup) {
            // if (debug) {
            //     console.log(code, calcItem);
            // }
            let ok = checkCode(code, calcItem);
            if (ok) count--;
        }
        if (count === 0) {
            resultCodes.push(code);
        }
    }
    return resultCodes;
}

const allJiOu = ["3奇", "2奇1偶", "1奇2偶", "3偶"];

function checkJo(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let oCount = 0;
    for (let num of [hun, ten, bit]) {
        if (num % 2 === 0) oCount++;
    }
    let ruleJiOuCounts = [];
    for (let item of checks) {
        let jiOuCount = allJiOu.findIndex((val) => item === val);
        if (jiOuCount > -1) {
            ruleJiOuCounts.push(jiOuCount);
        }
    }
    return ruleJiOuCounts.indexOf(oCount) === -1;
}

function checkHz(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let sum = hun + ten + bit;
    return checks.indexOf(sum.toString()) === -1;
}

function checkKd(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let diff = Math.max(hun, ten, bit) - Math.min(hun, ten, bit);
    return checks.indexOf(diff.toString()) === -1;
}

function checkLmh(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let highSum = (hun + ten) % 10;
    let midSum = (hun + bit) % 10;
    let lowSum = (ten + bit) % 10;
    for (let sum of [highSum, midSum, lowSum]) {
        if (checks.indexOf(sum.toString()) > -1) return false;
    }
    return true;
}

function checkRylmc(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let highDiff = Math.abs(hun - ten);
    let midDiff = Math.abs(hun - bit);
    let lowDiff = Math.abs(ten - bit);
    for (let diff of [highDiff, midDiff, lowDiff]) {
        if (checks.indexOf(diff.toString()) > -1) return false;
    }
    return true;
}

function checkZxlmh(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let highSum = (hun + ten) % 10;
    let midSum = (hun + bit) % 10;
    let lowSum = (ten + bit) % 10;
    let minSum = [highSum, midSum, lowSum].sort((a, b) => a - b)[0];
    return checks.indexOf(minSum.toString()) === -1;
}

function checkZjlmh(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let highSum = (hun + ten) % 10;
    let midSum = (hun + bit) % 10;
    let lowSum = (ten + bit) % 10;
    let zjSum = [highSum, midSum, lowSum].sort((a, b) => a - b)[1];
    return checks.indexOf(zjSum.toString()) === -1;
}

function checkZdlmh(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let highSum = (hun + ten) % 10;
    let midSum = (hun + bit) % 10;
    let lowSum = (ten + bit) % 10;
    let maxSum = [highSum, midSum, lowSum].sort((a, b) => a - b)[2];
    return checks.indexOf(maxSum.toString()) === -1;
}

function checkZdz(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let max = Math.max(hun, ten, bit);
    return checks.indexOf(max.toString()) === -1;
}

function checkZjz(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let arr = [hun, ten, bit].sort();
    return checks.indexOf(arr[1].toString()) === -1;
}

function checkZxz(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let min = Math.min(hun, ten, bit);
    return checks.indexOf(min.toString()) === -1;
}

function checkDzx(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let tLabel = getDzxLabel([hun, ten, bit]);
    return checks.indexOf(tLabel) === -1;
}

function check023L(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let tLabel = get012Label([hun, ten, bit]);
    return checks.indexOf(tLabel) === -1;
}

function checkHz2(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let hz = (hun + ten + bit) % 10;
    return checks.indexOf(hz.toString()) === -1;
}

function checkMcsm(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let highDiff = Math.abs(hun - ten);
    let midDiff = Math.abs(hun - bit);
    let lowDiff = Math.abs(ten - bit);
    let diffArr = [highDiff, midDiff, lowDiff].sort();
    let diffCode = `${diffArr[0]}${diffArr[1]}${diffArr[2]}`;
    return checks.indexOf(diffCode) === -1;
}

function getHmxtLabel(hun, ten, bit) {
    let hmxt = ""
    if (bit === ten && ten === hun) {
        hmxt = "平行形"
    } else if (hun < ten && ten < bit) {
        hmxt = "上升形"
    } else if (hun > ten && ten > bit) {
        hmxt = "下降形"
    } else if (hun === ten || ten === bit || hun === bit) {
        hmxt = "组三"
    } else if (hun < ten && ten > bit) {
        hmxt = "凸起形"
    } else if (hun > ten && ten < bit) {
        hmxt = "凹下形"
    }
    return hmxt
}

function checkHmxt(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    return checks.indexOf(getHmxtLabel(hun, ten, bit)) === -1;
}

function getJoLabel(code) {
    if (code % 2 === 0) return "偶"
    return "奇"
}

function checkJodw(code, checks) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let jodw = `${getJoLabel(hun)}${getJoLabel(ten)}${getJoLabel(bit)}`
    return checks.indexOf(jodw) === -1;
}

function checkDmz(code, calcItem) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let dmzRules = calcItem.checks.filter((item) => item.values.length > 0);
    // 胆码组无容错
    let count = dmzRules.length;
    for (let dmzRule of dmzRules) {
        let bitCount = 0;
        for (let num of [hun, ten, bit]) {
            if (dmzRule.values.indexOf(num) > -1) {
                bitCount++;
            }
        }
        if (dmzRule.counts.indexOf(bitCount) > -1) count--;
    }
    return count === 0;
}

function checkDz(code, calcItem) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let dzRules = calcItem.checks.map((item) => item.values);
    let countArr = [0, 0, 0];
    for (let i = 0; i < dzRules.length; i++) {
        [hun, ten, bit].forEach((item) => {
            if (dzRules[i].indexOf(item) > -1) countArr[i]++;
        });
    }
    return !countArr.every((item) => item === 1);
}

function checkDzxs(code, calcItem) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let arr = [hun, ten, bit].sort((a, b) => b - a);
    let passCount = 0;
    for (let index = 0; index <= 2; index++) {
        let match = calcItem.checks[index].values.includes(arr[index]);
        if (match) {
            passCount++;
        }
    }
    return calcItem.conditionNums.includes(passCount + '');
}

function checkDzxlmh(code, calcItem) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let arr = [(hun + ten) % 10, (ten + bit) % 10, (bit + hun) % 10].sort((a, b) => b - a);
    let passCount = 0;
    for (let index = 0; index <= 2; index++) {
        let match = calcItem.checks[index].values.includes(arr[index]);
        if (match) {
            passCount++;
        }
    }
    return calcItem.conditionNums.includes(passCount + '');
}

function checkDzxlmc(code, calcItem) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let arr = [Math.abs(hun - ten), Math.abs(ten - bit), Math.abs(bit - hun)].sort((a, b) => b - a);
    let passCount = 0;
    for (let index = 0; index <= 2; index++) {
        let match = calcItem.checks[index].values.includes(arr[index]);
        if (match) {
            passCount++;
        }
    }
    return calcItem.conditionNums.includes(passCount + '');
}

const fstjLabel = [['复', '隔', '中'], ['重', '斜', '跳'], ['邻', '孤', '传'], ['热', '温', '冷']]
function checkFstj(code, calcItem) {
    let hun = parseInt(code[0]);
    let ten = parseInt(code[1]);
    let bit = parseInt(code[2]);
    let passCount = 0;
    for (let index = 0; index <= 3; index++) {
        let rule = calcItem.checks[index]
        let valueIndexArr = getFstjValueArr(rule.values, fstjLabel[index])
        let labelArr = []
        let match = false
        for (const item of [hun, ten, bit]) {
            let labelIndex = getFsIndex(item, rule.numArr)
            if (labelIndex == -1) {
                continue
            }
            labelArr.push(labelIndex)
        }
        if (labelArr.length !== 3) {
            continue
        }
        let label = labelArr.sort((a, b) => a - b).join('')
        match = valueIndexArr.includes(label)
        if (match) {
            passCount++
        }
    }
    return calcItem.conditionNums.includes(passCount + '');
}

function getFstjValueArr(values, labels) {
    let indexValueArr = []
    for (const value of values) {
        let indexValue = []
        for (const valueLabel of [...value]) {
            let index = labels.findIndex((label) => label === valueLabel)
            indexValue.push(index)
        }
        let indexValueStr = indexValue.sort((a, b) => a - b).join('')
        indexValueArr.push(indexValueStr)
    }
    return indexValueArr
}

function getFsIndex(code, numsArr) {
    if (numsArr.nums1.includes(code)) {
        return 0
    }
    if (numsArr.nums2.includes(code)) {
        return 1
    }
    if (numsArr.nums3.includes(code)) {
        return 2
    }
    return -1
}


function checkCode(code, calcItem) {
    let label = calcItem.label;
    // console.log("计算项", code, calcItem)
    if (label === "dmz") {
        return checkDmz(code, calcItem);
    }
    if (label === "dz") {
        return checkDz(code, calcItem);
    } else if (label === "dzxs") {
        return checkDzxs(code, calcItem);
    } else if (label === "dzxlmh") {
        return checkDzxlmh(code, calcItem);
    } else if (label === "dzxlmc") {
        return checkDzxlmc(code, calcItem);
    } else if (label === "fstj") {
        return checkFstj(code, calcItem);
    } else if (calcItem.ignore) {
        let checks = calcItem.checks;
        // 容错计算,容错忽略排序,规则作为整体计算反向
        if (label === "jo") {
            return checkJo(code, checks);
        } else if (label === "hz") {
            return checkHz(code, checks);
        } else if (label === "kd") {
            return checkKd(code, checks);
        } else if (label === "lmh") {
            return checkLmh(code, checks);
        } else if (label === "rylmc") {
            return checkRylmc(code, checks);
        } else if (label === "zxlmh") {
            console.log(code, checks);
            return checkZxlmh(code, checks);
        } else if (label === "zjlmh") {
            return checkZjlmh(code, checks);
        } else if (label === "zdlmh") {
            return checkZdlmh(code, checks);
        } else if (label === "zdz") {
            return checkZdz(code, checks);
        } else if (label === "zjz") {
            return checkZjz(code, checks);
        } else if (label === "zxz") {
            return checkZxz(code, checks);
        } else if (label === "dzx") {
            return checkDzx(code, checks);
        } else if (label === "012l") {
            return check023L(code, checks);
        } else if (label === "hz2") {
            return checkHz2(code, checks);
        } else if (label === "mcsm") {
            return checkMcsm(code, checks);
        } else if (label === "hmxt") {
            return checkHmxt(code, checks);
        } else if (label === "jodw") {
            return checkJodw(code, checks);
        }
    } else if (!calcItem.isOrder) {
        let checks = calcItem.checks;
        // 非排序计算，规则视为整体计算
        if (label === "jo") {
            return !checkJo(code, checks);
        } else if (label === "hz") {
            return !checkHz(code, checks);
        } else if (label === "kd") {
            return !checkKd(code, checks);
        } else if (label === "lmh") {
            return !checkLmh(code, checks);
        } else if (label === "rylmc") {
            return !checkRylmc(code, checks);
        } else if (label === "zxlmh") {
            return !checkZxlmh(code, checks);
        } else if (label === "zjlmh") {
            return !checkZjlmh(code, checks);
        } else if (label === "zdlmh") {
            return !checkZdlmh(code, checks);
        } else if (label === "zdz") {
            return !checkZdz(code, checks);
        } else if (label === "zjz") {
            return !checkZjz(code, checks);
        } else if (label === "zxz") {
            return !checkZxz(code, checks);
        } else if (label === "dzx") {
            return !checkDzx(code, checks);
        } else if (label === "012l") {
            return !check023L(code, checks);
        } else if (label === "hz2") {
            return !checkHz2(code, checks);
        } else if (label === "mcsm") {
            return !checkMcsm(code, checks);
        } else if (label === "hmxt") {
            return !checkHmxt(code, checks);
        } else if (label === "jodw") {
            return !checkJodw(code, checks);
        }
    } else {
        let hun = parseInt(code[0]);
        let ten = parseInt(code[1]);
        let bit = parseInt(code[2]);
        // 正常条件排列项计算
        if (label === "jo") {
            let jCount = 0;
            for (let num of [hun, ten, bit]) {
                if (num % 2 === 1) jCount++;
            }
            let tCount = 3 - allJiOu.indexOf(calcItem.ruleValue);
            return tCount === jCount;
        } else if (label === "hz") {
            let sum = hun + ten + bit;
            return sum === parseInt(calcItem.ruleValue);
        } else if (label === "kd") {
            let diff = Math.max(hun, ten, bit) - Math.min(hun, ten, bit);
            return diff === parseInt(calcItem.ruleValue);
        } else if (label === "lmh") {
            let highSum = (hun + ten) % 10;
            let midSum = (hun + bit) % 10;
            let lowSum = (ten + bit) % 10;
            return (
                [highSum, midSum, lowSum].indexOf(parseInt(calcItem.ruleValue)) > -1
            );
        } else if (label === "rylmc") {
            let highDiff = Math.abs(hun - ten);
            let midDiff = Math.abs(hun - bit);
            let lowDiff = Math.abs(ten - bit);
            return (
                [highDiff, midDiff, lowDiff].indexOf(parseInt(calcItem.ruleValue)) > -1
            );
        } else if (label === "zxlmh") {
            let highSum = (hun + ten) % 10;
            let midSum = (hun + bit) % 10;
            let lowSum = (ten + bit) % 10;
            let orderedArr = [highSum, midSum, lowSum].sort((a, b) => a - b);
            return orderedArr[0] === parseInt(calcItem.ruleValue);
        } else if (label === "zjlmh") {
            let highSum = (hun + ten) % 10;
            let midSum = (hun + bit) % 10;
            let lowSum = (ten + bit) % 10;
            let orderedArr = [highSum, midSum, lowSum].sort((a, b) => a - b);
            return orderedArr[1] === parseInt(calcItem.ruleValue);
        } else if (label === "zdlmh") {
            let highSum = (hun + ten) % 10;
            let midSum = (hun + bit) % 10;
            let lowSum = (ten + bit) % 10;
            let orderedArr = [highSum, midSum, lowSum].sort((a, b) => a - b);
            return orderedArr[2] === parseInt(calcItem.ruleValue);
        } else if (label === "zdz") {
            let max = Math.max(hun, ten, bit);
            return max === parseInt(calcItem.ruleValue);
        } else if (label === "zjz") {
            let arr = [hun, ten, bit].sort();
            return arr[1] === parseInt(calcItem.ruleValue);
        } else if (label === "zxz") {
            let min = Math.max(hun, ten, bit);
            return min === parseInt(calcItem.ruleValue);
        } else if (label === "dzx") {
            let tLabel = getDzxLabel([hun, ten, bit]);
            // console.log("dzx过滤", code, tLabel, dmzRule)
            return tLabel === calcItem.ruleValue;
        } else if (label === "012l") {
            let tLabel = get012Label([hun, ten, bit]);
            return tLabel === calcItem.ruleValue;
        } else if (label === "hz2") {
            let hz = (hun + ten + bit) % 10;
            return hz === parseInt(calcItem.ruleValue);
        } else if (label === "mcsm") {
            let highDiff = Math.abs(hun - ten);
            let midDiff = Math.abs(hun - bit);
            let lowDiff = Math.abs(ten - bit);
            let diffArr = [highDiff, midDiff, lowDiff].sort();
            let diffCode = `${diffArr[0]}${diffArr[1]}${diffArr[2]}`;
            return diffCode === calcItem.ruleValue;
        } else if (label === "hmxt") {
            return getHmxtLabel(hun, ten, bit) === calcItem.ruleValue
        } else if (label === "jodw") {
            let jodw = `${getJoLabel(hun)}${getJoLabel(ten)}${getJoLabel(bit)}`
            return jodw === calcItem.ruleValue
        }
    }
}

function getIgIndexArrList(igCount, subIgIndexArrList) {
    let igIndexArrList = [];
    for (let subArr of subIgIndexArrList) {
        if (subArr.length === igCount) {
            igIndexArrList.push(subArr);
        }
    }
    return igIndexArrList;
}

function codesFilter(codeList, ruleList, igCounts, orderType) {
    if (ruleList.length === 0) return codeList;
    let restCodes = structuredClone(codeList); //剩余未过滤成功的code列表,如果为空即停止过滤
    let resultCodes = []; //最终得到的code列表
    // 获取可以容错的条件下标数组
    let igAllIndexArr = [];
    for (let i = 0; i < ruleList.length; i++) {
        if (ruleList[i].ignore) {
            igAllIndexArr.push(i);
        }
    }
    if (debug) {
        console.log("可容错条件:", igAllIndexArr);
    }
    // 获取所有容错条件下标子集,按照子数组和子数组元素之和进行倒叙排序
    let subIgIndexArrList = subsets(igAllIndexArr).sort((arr1, arr2) => {
        let lenDiff = arr2.length - arr1.length;
        if (lenDiff === 0) {
            return (
                arr2.reduce((pre, cur) => pre + cur, 0) -
                arr1.reduce((pre, cur) => pre + cur, 0)
            );
        }
        return lenDiff;
    });
    if (debug) {
        console.log("容错条件组合:", subIgIndexArrList);
    }
    for (let igCount of igCounts) {
        let igIndexArrList = getIgIndexArrList(igCount, subIgIndexArrList); //获取当前容错数量的所有容错条件的组合可能
        for (let igIndexArr of igIndexArrList) {
            if (debug) {
                console.log("容错下标组", igIndexArrList);
            }
            let calcGroups;
            if (orderType) {
                console.log("交叉排列");
                calcGroups = getCalcGroups2(ruleList, igIndexArr);
            } else {
                console.log("顺序排列");
                calcGroups = getCalcGroups(ruleList, igIndexArr);
            }
            if (debug) {
                console.log("当前容错计算项", igIndexArr, calcGroups, codeList);
            }
            for (let calcGroup of calcGroups) {
                let filterCodes = doFilter(codeList, calcGroup); //单次过滤得到的code列表
                if (debug) {
                    console.log("过滤结果", filterCodes);
                }
                for (let filterCode of filterCodes) {
                    if (resultCodes.indexOf(filterCode) === -1) {
                        resultCodes.push(filterCode);
                        restCodes.splice(restCodes.indexOf(filterCode), 1);
                    }
                }
                if (restCodes.length === 0) break;
            }
            console.log(
                "条件数:",
                calcGroups.length,
                "最终结果数:",
                resultCodes.length
            );
        }
    }
    return resultCodes;
}
