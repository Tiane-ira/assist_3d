<script>
import { getNumObjByCodes, validCodes } from "@/utils/code";
export default {
    name: "TableShow",
    data() {
        return {
            tableHeight: window.innerHeight / 2,
            resultList: [],
            codeNums: "",
        };
    },
    computed: {
        codeArr() {
            return this.codeNums.trim().split(" ").filter(item => item, length > 0);
        }
    },
    methods: {
        doCalc() {
            let errCode = validCodes(this.codeArr)
            if (errCode) {
                this.$message({
                    message: `${errCode}不是三位数字, 请检查`,
                    type: "error",
                    duration: 1000
                });
                return
            }
            this.resultList = getNumObjByCodes(this.codeArr)
        },
        clearAll() {
            this.codeNums = "";
            this.resultList.splice(0, this.resultList.length);
        },
        delCode(row){
            let index = this.resultList.findIndex(item => item.code === row.code)
            this.resultList.splice(index, 1)
        }
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.tableHeight = window.innerHeight / 2;
            })();
        };
    },
};
</script>

<template>
    <div class="main">
        <div class="area">
            <el-button type="primary" @click="doCalc">计算</el-button>
            <el-button type="primary" @click="clearAll">清空</el-button>
        </div>
        <el-card class="area">
            <div slot="header">待展示号码 (号码数: {{ this.codeArr.length }}个)</div>
            <div>
                <el-input type="textarea" autosize v-model="codeNums" placeholder="输入号码（空格分隔）"></el-input>
            </div>
        </el-card>
        <el-card class="area">
            <el-table :data="resultList" :max-height="tableHeight" style="width: 100%"
                :border="true" :header-cell-style="{ 'text-align': 'center' }" ref="table">
                <el-table-column prop="code" label="号码" sortable align="center">
                </el-table-column>
                <el-table-column prop="sum" label="和值" sortable align="center">
                </el-table-column>
                <el-table-column prop="diff" sortable label="跨度" align="center">
                </el-table-column>
                <el-table-column prop="dzx" label="大小" align="center">
                </el-table-column>
                <el-table-column prop="lye" label="012路" align="center">
                </el-table-column>
                <el-table-column prop="smc" label="三码差" align="center">
                </el-table-column>
                <el-table-column prop="smh" label="三码合" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template v-slot="{ row }">
                        <el-button @click.native.prevent="delCode(row)" type="text" size="small">
                            移除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-card class="area">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div>
                        <el-statistic :value="resultList.length" title="注数" />
                    </div>
                </el-col>
                <el-col :span="12">
                    <div>
                        <el-statistic :value="2 * resultList.length" title="金额" />
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<style scoped>
.main {
    margin: 20px;
}

.num-card {
    margin: 10px 0;
    font-size: 12px;

    span {
        color: #7e8c8d;
    }

}

.area {
    margin-bottom: 10px;
}
</style>
