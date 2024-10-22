<template>
    <div class="main">
        <div class="top">
            <div>
                <el-button type="primary">清空</el-button>
                <el-button type="primary">计算</el-button>
                <el-button type="primary">复制结果</el-button>
            </div>
            <div>
                <el-select v-model="currentMode" placeholder="选择模式">
                <el-option v-for="(item,index) in modes" :key="index" :label="item" :value="item">
                </el-option>
            </el-select>
            </div>
        </div>
        <div class="content">
            <el-card class="area">
                <div slot="header">转直号码</div>
                <div></div>
            </el-card>
            <el-card class="area">
                <div slot="header">转直结果</div>
                <div></div>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConvertTool',

    data() {
        return {
            modes: ["转直", "差集", "合集"],
            currentMode: "转直",
            directNums: [],
            groupNums: [],
            checkRules: []
        };
    },

    mounted() {

    },

    methods: {

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
</style>