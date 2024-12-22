<template>
    <div class="content">
        <el-card class="area">
            <div slot="header">号码组1 (号码数: {{ this.groupArr.length }}个)</div>
            <div>
                <el-input type="textarea" autosize v-model="groupNums" placeholder="输入号码（空格分隔）"></el-input>
            </div>
        </el-card>
        <el-card class="area">
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
</template>

<script>
import { validCodes } from "@/utils/code";
import _ from 'lodash'
export default {
    name: 'DiffUnion',
    props: {
        type: {
            type: String,
            default: 'diff'
        }
    },
    data() {
        return {
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
    },

    mounted() {

    },

    methods: {
        doCalc() {
            this.type === 'diff' ? this.diffCode() : this.unionCode()
        },
        diffCode() {
            let errCode = validCodes([...this.groupArr, ...this.groupArr2])
            if (errCode) {
                this.$message({
                    message: `${errCode}不是三位数字, 请检查`,
                    type: "error",
                    duration: 1000
                });
                return
            }
            let arr1 = _.difference(this.groupArr, this.groupArr2)
            let arr2 = _.difference(this.groupArr2, this.groupArr)
            this.resultArr.splice(0, this.resultArr.length, ...[...arr1, ...arr2]);
            this.$message({
                message: "计算完成",
                type: "success",
                duration: 1000
            });
        },
        unionCode() {
            let errCode = validCodes([...this.groupArr, ...this.groupArr2])
            if (errCode) {
                this.$message({
                    message: `${errCode}不是三位数字, 请检查`,
                    type: "error",
                    duration: 1000
                });
                return
            }
            let arr1 = _.intersection(this.groupArr, this.groupArr2)
            this.resultArr.splice(0, this.resultArr.length, ...arr1);
            this.$message({
                message: "计算完成",
                type: "success",
                duration: 1000
            });
        },
        doClear() {
            this.groupNums = ''
            this.groupNums2 = ''
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