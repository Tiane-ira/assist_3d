<template>
    <div class="main">
        <div class="top">
            <div>
                <el-button type="primary" @click="clearAll">清空</el-button>
                <el-button type="primary" @click="doCalc">计算</el-button>
                <el-button type="primary" @click="copyResult">复制结果</el-button>
            </div>
            <div>
                <el-select v-model="currentMode" placeholder="选择模式">
                    <el-option v-for="(item, index) in modes" :key="index" :label="item" :value="item">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="content">
            <el-card class="area">
                <div slot="header">转直号码</div>
                <div>
                    <el-input v-model="directNums" placeholder="输入号码（空格分隔）"></el-input>
                </div>
            </el-card>
            <el-card class="area">
                <div slot="header">转直结果</div>
                <div>
                    <div class="result">{{ groupNums }}</div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import { group2Direct } from "@/utils/code";
export default {
    name: 'ConvertTool',

    data() {
        return {
            modes: ["组转直", "差集", "合集"],
            currentMode: "组转直",
            directNums: "",
            groupNums: "",
            checkRules: []
        };
    },
    computed: {
        directArr() {
            return this.directNums.trim().split(" ").filter(item => item,length > 0);
        },
        // groupResult(){
        //     return this.groupNums.trim().split(" ").map(item => item.trim()).filter(item => item.length > 0)
        // }
    },

    methods: {
        clearAll() {
            this.directNums = "";
            this.groupNums = "";
        },
        doCalc() {
            let groupArr = []
            for (const code of this.directArr) {
                groupArr = [...groupArr, ...group2Direct([...code])];
            }
            this.groupNums = [...groupArr].join(" ");
        },
        copyResult() {

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