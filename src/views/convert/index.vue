<template>
    <div class="main">
        <div class="top">
            <div>
                <el-button type="primary" @click="getResult">计算</el-button>
                <el-button type="primary" @click="clearAll">清空</el-button>
                <el-button type="warning" @click="copyResult">复制结果</el-button>
                <el-button type="danger" @click="openTableTool">展示工具</el-button>
            </div>
            <div>
                <el-select v-model="currentMode" placeholder="选择模式">
                    <el-option v-for="(item, index) in modes" :key="index" :label="item" :value="index">
                    </el-option>
                </el-select>
            </div>
        </div>

        <dir-group-trans ref="ref1" v-if="!isDiffUnion" :type="types[currentMode]" />
        <diff-union ref="ref2" v-else :type="types[currentMode]" />
    </div>
</template>

<script>
import DiffUnion from "@/components/Convert/DiffUnion.vue";
import DirGroupTrans from "@/components/Convert/DirGroupTrans.vue";
export default {
    name: 'ConvertTool',

    data() {
        return {
            modes: ["组转直", "直转组", "差集", "交集"],
            currentMode: 0,
            types: ['group', 'direct', 'diff', 'union']
        };
    },
    components: {
        DirGroupTrans, DiffUnion
    },
    computed: {
        isDiffUnion() {
            return this.currentMode > 1
        }
    },

    methods: {
        clearAll() {
            if (this.isDiffUnion) {
                this.$refs.ref2.doClear()
            } else {
                this.$refs.ref1.doClear()
            }
        },
        getResult() {
            if (this.isDiffUnion) {
                this.$refs.ref2.doCalc()
            } else {
                this.$refs.ref1.doCalc()
            }
        },
        copyResult() {
            let resultNums = this.isDiffUnion ? this.$refs.ref2.resultNums : this.$refs.ref1.resultNums
            window.electron.copy2Clipboard(resultNums);
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
</style>