<template>
    <div class="content">
        <el-card class="area">
            <div slot="header">{{ type === 'group' ? "组选号码" : '直选号码' }} (号码数: {{ this.groupArr.length }}个)</div>
            <div>
                <el-input type="textarea" autosize v-model="groupNums" placeholder="输入号码（空格分隔）"></el-input>
            </div>
        </el-card>
        <el-card class="area">
            <div slot="header">计算结果 (号码数: {{ this.resultArr.length }}个)</div>
            <div>
                <div class="result">{{ resultNums }}</div>
            </div>
        </el-card>
    </div>
</template>

<script>
import { direct2Group, group2Direct, validCodes } from "@/utils/code";
import _ from 'lodash'
export default {
    name: 'DirGroupTrans',
    props: {
        type: {
            type: String,
            default: "group"
        }
    },
    data() {
        return {
            groupNums: "",
            resultArr: [],
        };
    },

    computed: {
        groupArr() {
            return this.groupNums.trim().split(" ").filter(item => item, length > 0);
        },
        resultNums() {
            return this.resultArr.join(" ");
        },
    },
    methods: {
        doCalc() {
            this.type === 'group' ? this.zu2zhi() : this.zhi2zu()
        },
        zu2zhi() {
            let errCode = validCodes(this.groupArr)
            if (errCode) {
                this.$message({
                    message: `${errCode}不是三位数字, 请检查`,
                    type: "error",
                    duration: 1000
                });
                return
            }
            let directArr = []
            for (const code of this.groupArr) {
                directArr = [...directArr, ...group2Direct([...code])];
            }
            directArr = _.uniq(directArr)
            this.resultArr.splice(0, this.resultArr.length, ...directArr);
            this.$message({
                message: "计算完成",
                type: "success",
                duration: 1000
            });
        },
        zhi2zu() {
            let errCode = validCodes(this.groupArr)
            if (errCode) {
                this.$message({
                    message: `${errCode}不是三位数字, 请检查`,
                    type: "error",
                    duration: 1000
                });
                return
            }
            let newArr = []
            for (const code of this.groupArr) {
                newArr = [...newArr, direct2Group(code)];
            }
            newArr = _.uniq(newArr)
            this.resultArr.splice(0, this.resultArr.length, ...newArr);
            this.$message({
                message: "计算完成",
                type: "success",
                duration: 1000
            });
        },
        doClear() {
            this.groupNums = ''
            this.resultArr.splice(0, this.resultArr.length, ...[]);
        }
    },
};
</script>

<style scoped>
.area {
    margin-bottom: 10px;
}

.result {
    font-size: 14px;
    color: #606266;
}
</style>