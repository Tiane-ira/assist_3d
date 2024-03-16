<script>
import {
  getIgCounts,
  getNumDirect,
  getNumGroup,
  getNumObjByCodes,
} from "@/utils/code";
import { mapGetters, mapState } from "vuex";
import { formatDate } from "@/utils/date";

export default {
  name: "ResultOperator",
  data() {
    return {
      loading: false,
      hisShow: false,
      configName: "",
      saveConfigShow: false,
    };
  },
  computed: {
    ...mapState([
      "hundredList",
      "tenList",
      "bitList",
      "groupList",
      "groupTypes",
      "igMin",
      "igMax",
      "resultList",
      "checkRules",
    ]),
    ...mapGetters(["isGroup"]),
    hisList() {
      let hisArr = [];
      for (let config of this.$store.state.configList) {
        let labelArr = [];
        for (let ruleItem of config.rule) {
          labelArr.push(ruleItem.title);
        }
        let his = {
          id: config.id,
          name: config.name,
          label: labelArr.join(","),
          createTime: config.createTime,
        };
        hisArr.push(his);
      }
      return hisArr;
    },
  },
  methods: {
    getResult() {
      this.loading = true;
      let codeList;
      if (this.isGroup) {
        codeList = getNumGroup(this.groupList, this.groupTypes);
      } else {
        codeList = getNumDirect(this.bitList, this.tenList, this.hundredList);
      }
      let igCounts = getIgCounts(this.igMin, this.igMax); // 默认0-0无容错
      console.log(codeList, igCounts);
      window.electron
        .filterCodes(codeList, this.checkRules, igCounts, this.orderType)
        .then((filteredCodeList) => {
          this.$store.commit("CHANGE_RESULT_LIST", filteredCodeList);
          this.$store.commit("CHANGE_CODES_RESULT", filteredCodeList);
          this.loading = false;
          this.$message.success("结果计算成功");
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error("结果计算失败:" + e.toString());
        });
    },
    copyResult() {
      if (this.resultList.length === 0) {
        this.$message.error("结果为空无法复制");
        return;
      }
      window.electron.copy2Clipboard(this.codesResult);
      this.$message.success(`已复制${this.resultList.length}个结果`);
    },
    showSaveRule() {
      this.configName = "";
      this.saveConfigShow = true;
    },
    showRuleHis() {
      this.hisShow = true;
    },
    delConfig(index) {
      this.$store.commit("DELETE_CONFIG", index);
      this.$message.success("删除条件成功");
    },
    applyConfig(index) {
      this.$store.commit("SET_CONFIG", index);
      this.$message.success("应用条件成功");
      this.hisShow = false;
    },
    saveConfig() {
      let config = {
        id: Date.now(),
        name: this.configName,
        rule: structuredClone(this.checkRules),
        hun: structuredClone(this.hundredList),
        ten: structuredClone(this.tenList),
        bit: structuredClone(this.bitList),
        group: structuredClone(this.groupList),
        groupType: structuredClone(this.groupTypes),
        igMin: this.igMin,
        igMax: this.igMax,
        createTime: formatDate(new Date()),
      };
      this.$store.commit("SAVE_CONFIG", config);
      this.saveConfigShow = false;
      this.$message.success("保存条件成功");
    },
  },
};
</script>

<template>
  <div class="res-op">
    <el-button :loading="loading" type="primary" @click="getResult"
      >获取结果
    </el-button>
    <el-button :disabled="!resultList.length" type="warning" @click="copyResult"
      >复制结果
    </el-button>
    <el-button
      :disabled="!checkRules.length"
      type="primary"
      @click="showSaveRule"
      >保存条件
    </el-button>
    <el-button type="warning" @click="showRuleHis">条件历史</el-button>
    <el-dialog :visible.sync="hisShow" center title="条件历史列表" width="60%">
      <el-table
        ref="hisTable"
        :border="true"
        :data="hisList"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column align="center" label="序号" type="index">
        </el-table-column>
        <el-table-column align="center" label="名称" prop="name">
        </el-table-column>
        <el-table-column
          align="center"
          label="条件"
          prop="label"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="保存时间"
          prop="createTime"
          width="160"
        >
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template v-slot="{ $index }">
            <el-button
              size="mini"
              type="success"
              @click.native.prevent="applyConfig($index)"
            >
              使用
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click.native.prevent="delConfig($index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      :visible.sync="saveConfigShow"
      center
      title="保存条件"
      width="60%"
    >
      <div>
        <el-input
          v-model="configName"
          placeholder="输入条件集的名称"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveConfigShow = false">取 消</el-button>
        <el-button type="primary" @click="saveConfig">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped>
.res-op {
  margin-bottom: 10px;
}
</style>
