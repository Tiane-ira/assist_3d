<template>
    <div class="main">
        <div class="top">
            <div>
                <el-button type="primary" @click="doCalc">计算</el-button>
                <el-button type="primary" @click="clearAll">清空</el-button>
                <el-button type="warning" @click="copyResult">复制结果</el-button>
                <el-button type="danger" @click="openTableTool">展示工具</el-button>
            </div>
            <div>
                <el-select v-model="currentMode" placeholder="选择模式" @change="modeChange">
                    <el-option v-for="(item, index) in modes" :key="index" :label="item" :value="item">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="content">
            <el-card class="area">
                <div slot="header" v-if="currentMode === '组转直'">组选号码 (号码数: {{ this.groupArr.length }}个)</div>
                <div slot="header" v-else-if="currentMode === '直转组'">直选号码 (号码数: {{ this.groupArr.length }}个)</div>
                <div slot="header" v-else>号码组1 (号码数: {{ this.groupArr.length }}个)</div>
                <div>
                    <el-input type="textarea" autosize v-model="groupNums" placeholder="输入号码（空格分隔）"></el-input>
                </div>
            </el-card>
            <el-card class="area" v-if="!transFlag">
                <div slot="header">号码组2 (号码数: {{ this.groupArr2.length }}个)</div>
                <div>
                    <el-input type="textarea" autosize v-model="groupNums2" placeholder="输入号码（空格分隔）"></el-input>
                </div>
            </el-card>
            <el-card class="area">
                <div slot="header">计算结果 (号码数: {{ this.resultArr.length }}个)</div>
                <div>
                    <div class="result">{{ resultNums }}</div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import { direct2Group, group2Direct, validCodes } from "@/utils/code";
import _ from 'lodash'
export default {
    name: 'ConvertTool',

    data() {
        return {
            modes: ["组转直", "直转组", "差集", "合集"],
            currentMode: "组转直",
            groupNums: "",
            groupNums2: "",
            resultArr: [],
        };
    },
    computed: {
        groupArr() {
            return this.groupNums.trim().split(" ").filter(item => item, length > 0);
        },
        groupArr2() {
            return this.groupNums2.trim().split(" ").filter(item => item, length > 0);
        },
        resultNums() {
            return this.resultArr.join(" ");
        },
        transFlag() {
            return this.currentMode === '直转组' || this.currentMode === '组转直'
        }
    },

    methods: {
        modeChange() {
            this.clearAll();
        },
        clearAll() {
            this.groupNums = "";
            this.groupNums2 = "";
            this.resultArr.splice(0, this.resultArr.length);
        },
        doCalc() {
            let failed = false
            if (this.currentMode === "组转直") {
                failed = this.transCode1();
            } else if (this.currentMode === "直转组") {
                failed = this.transCode2();
            } else if (this.currentMode === "差集") {
                failed = this.diffCode();
            } else if (this.currentMode === "合集") {
                failed = this.unionCode();
            }

            if (failed) {
                return;
            }

            this.$message({
                message: "计算完成",
                type: "success",
                duration: 1000
            });
        },
        transCode1() {
            let errCode = validCodes(this.groupArr)
            if (errCode) {
                this.$message({
                    message: `${errCode}不是三位数字, 请检查`,
                    type: "error",
                    duration: 1000
                });
                return true
            }
            let directArr = []
            for (const code of this.groupArr) {
                directArr = [...directArr, ...group2Direct([...code])];
            }
            directArr = _.uniq(directArr)
            this.resultArr.splice(0, this.resultArr.length, ...directArr);
            return false
        },
        transCode2() {
            let errCode = validCodes(this.groupArr)
            if (errCode) {
                this.$message({
                    message: `${errCode}不是三位数字, 请检查`,
                    type: "error",
                    duration: 1000
                });
                return true
            }
            let newArr = []
            for (const code of this.groupArr) {
                newArr = [...newArr, direct2Group(code)];
            }
            newArr = _.uniq(newArr)
            this.resultArr.splice(0, this.resultArr.length, ...newArr);
            return false
        },
        diffCode() {
            let errCode = validCodes([...this.groupArr, ...this.groupArr2])
            if (errCode) {
                this.$message({
                    message: `${errCode}不是三位数字, 请检查`,
                    type: "error",
                    duration: 1000
                });
                return true
            }
            let arr1 = _.difference(this.groupArr, this.groupArr2)
            let arr2 = _.difference(this.groupArr2, this.groupArr)
            this.resultArr.splice(0, this.resultArr.length, ...[...arr1, ...arr2]);
            return false
        },
        unionCode() {
            let errCode = validCodes([...this.groupArr, ...this.groupArr2])
            if (errCode) {
                this.$message({
                    message: `${errCode}不是三位数字, 请检查`,
                    type: "error",
                    duration: 1000
                });
                return true
            }
            let arr1 = _.union(this.groupArr, this.groupArr2)
            this.resultArr.splice(0, this.resultArr.length, ...arr1);
            return false
        },
        copyResult() {
            window.electron.copy2Clipboard(this.resultNums);
            this.$message.success({
                message: "已复制结果",
                duration: 1000
            });
        },
        openTableTool() {
            const param = {
                title: "展示工具",
                url: '/tableShow',
                width: 800,
                height: 800
            }
            window.electron.openWindow(param);
        }
    },
};
</script>

<style scoped>
.main {
    margin: 20px;
}

.top {
    display: flex;
    justify-content: space-between;
    height: 50px;
}

.area {
    margin-bottom: 10px;
}

.result {
    font-size: 14px;
    color: #606266;
}
</style>