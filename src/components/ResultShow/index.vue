<script>
import { mapState } from "vuex";
import { nextTick } from "vue";

export default {
  name: "ResultShow",
  data() {
    return {
      tableHeight: window.innerHeight / 2,
    };
  },
  computed: {
    ...mapState(["resultList", "codesResult", "transCodes", "activeTab"]),
  },
  methods: {
    sortChange() {
      let codeList = [];
      this.$refs.table.tableData.forEach((item) => codeList.push(item.code));
      this.$store.commit("CHANGE_CODES_RESULT", codeList);
    },
    delCode(row) {
      this.$store.commit("DELETE_CODE", row.code);
      nextTick(() => {
        this.sortChange();
      });
    },
    copyResult() {
      if (this.resultList.length === 0) {
        this.$message.error("结果为空无法复制");
        return;
      }
      window.electron.copy2Clipboard(this.codesResult);
      this.$message.success({
        message: `已复制${this.resultList.length}个结果`,
        duration: 1000
      });
    },
    copyTransResult() {
      if (this.resultList.length === 0) {
        this.$message.error("结果为空无法复制");
        return;
      }
      window.electron.copy2Clipboard(this.transCodes.join(" "));
      this.$message.success(`已复制组转直的${this.transCodes.length}个结果`);
    },
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
  <div class="data">
    <el-card>
      <el-table :data="resultList" @sort-change="sortChange" :max-height="tableHeight" style="width: 100%"
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
    <el-tooltip :content="`点击复制计算结果${resultList.length}注`" placement="top" class="num-card"
      v-show="resultList.length > 0">
      <button class="code-btn" @click="copyResult">
        {{ codesResult }}
      </button>
    </el-tooltip>
    <el-tooltip :content="`点击复制组转直结果${transCodes.length}注`" placement="top" class="num-card"
      v-show="activeTab === 'group' && transCodes.length > 0" style="max-height: 45px;">
      <button class="code-btn" @click="copyTransResult">
        {{ transCodes.join(" ") }}
      </button>
    </el-tooltip>
    <el-card style="margin-top: 5px;">
      <el-row :gutter="20">
        <el-col :span="12">
          <div>
            <el-statistic :value="resultList.length" suffix="注" />
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <el-statistic :value="2 * resultList.length" suffix="元" />
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped>
.num-card {
  margin-top: 5px;
  font-size: 12px;
  max-height: 150px;
  overflow: auto;
  background-color: #FFFFFF;
  border: 1px solid #EFEFEF;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding: 5px;

  span {
    color: #7e8c8d;
  }
}

.code-btn {
  width: 100%;
  white-space: normal;
  text-align: left
}
</style>
