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
      <el-table
        :data="resultList"
        @sort-change="sortChange"
        :max-height="tableHeight"
        style="width: 100%"
        :border="true"
        :header-cell-style="{ 'text-align': 'center' }"
        ref="table"
      >
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
            <el-button
              @click.native.prevent="delCode(row)"
              type="text"
              size="small"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="num-card" :body-style="{ padding: '10px' }">
      <span v-if="codesResult === ''">没数据了</span>
      <span v-else>{{ codesResult }}</span>
    </el-card>
    <el-card class="num-card" v-show="activeTab === 'group' && transCodes.length > 0" :body-style="{ padding: '10px' }">
      <span>{{ transCodes.join(" ") }}</span>
    </el-card>
    <el-card>
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
.num-card {
  margin: 10px 0;
  font-size: 12px;

  span {
    color: #7e8c8d;
  }
}
</style>
