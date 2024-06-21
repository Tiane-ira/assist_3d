<script>
import { getSeqArr } from "@/utils/code";
import {all012l, allDzx, allHmxt, allJiOu, allJodw, allMCSM} from "@/config";
import IgnoreErrorCheck from "@/components/IgnoreErrorCheck/index.vue";
import OrderCheck from "@/components/OrderCheck/index.vue";
import {mapState} from "vuex";

export default {
  name: "RuleOption",
  components: { OrderCheck, IgnoreErrorCheck },
  data() {
    return {
      normalRule: {
        show: false,
        ruleTip: null,
        title: null,
        label: "",
        valList: [],
        id: null,
        checks: [],
      },
      dmzRule: {
        show: false,
        title: "",
        label: "",
        id: null,
        checks: [
          { label: "", values: [], counts: [] },
          { label: "", values: [], counts: [] },
          { label: "", values: [], counts: [] },
        ],
      },
      dzRule: {
        show: false,
        title: "",
        label: "",
        id: null,
        checks: [
          { label: "", values: [] },
          { label: "", values: [] },
          { label: "", values: [] },
        ],
      },
    };
  },
  computed: {
    checkRules: {
      get() {
        return this.$store.state.checkRules;
      },
      set(newList) {
        this.$store.commit("CHANG_CHECK_RULES", newList);
      },
    },
    ...mapState(["activeTab"]),
  },
  methods: {
    changeIg(checked) {
      this.$store.dispatch("changeIgnoreErr", checked);
    },
    showRule(label) {
      if (label === "jo") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "奇偶";
        this.normalRule.valList = structuredClone(allJiOu);
      } else if (label === "hz") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "和值";
        this.normalRule.valList = getSeqArr(27);
      } else if (label === "kd") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "跨度";
        this.normalRule.valList = getSeqArr(9);
      } else if (label === "lmh") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "任意两码合";
        this.normalRule.valList = getSeqArr(9);
      } else if (label === "rylmc") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "任意两码差";
        this.normalRule.valList = getSeqArr(9);
      } else if (label === "zxlmh") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "最小两码合";
        this.normalRule.valList = getSeqArr(9);
      } else if (label === "zjlmh") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "中间两码合";
        this.normalRule.valList = getSeqArr(9);
      } else if (label === "zdlmh") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "最大两码合";
        this.normalRule.valList = getSeqArr(9);
      } else if (label === "zdz") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "最大值";
        this.normalRule.valList = getSeqArr(9);
      } else if (label === "zjz") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "中间值";
        this.normalRule.valList = getSeqArr(9);
      } else if (label === "zxz") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "最小值";
        this.normalRule.valList = getSeqArr(9);
      } else if (label === "dzx") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "大中小";
        this.normalRule.valList = structuredClone(allDzx);
      } else if (label === "012l") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "012路";
        this.normalRule.valList = structuredClone(all012l);
      } else if (label === "hz2") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "合值";
        this.normalRule.valList = getSeqArr(9);
      } else if (label === "mcsm") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "码差三码";
        this.normalRule.valList = structuredClone(allMCSM);
      } else if (label === "hmxt") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "号码形态";
        this.normalRule.valList = structuredClone(allHmxt);
      } else if (label === "jodw") {
        this.normalRule.show = true;
        this.normalRule.label = label;
        this.normalRule.title = "奇偶定位";
        this.normalRule.valList = structuredClone(allJodw);
      } else if (label === "dmz") {
        this.dmzRule.show = true;
        this.dmzRule.label = label;
        this.dmzRule.title = "胆码组";
        this.dmzRule.checks[0].label = "胆组1";
        this.dmzRule.checks[1].label = "胆组2";
        this.dmzRule.checks[2].label = "胆组3";
      } else if (label === "dz") {
        this.dzRule.show = true;
        this.dzRule.label = label;
        this.dzRule.title = "断组";
        this.dzRule.checks[0].label = "断组1";
        this.dzRule.checks[1].label = "断组2";
        this.dzRule.checks[2].label = "断组3";
      }
    },
    reverseRule(type){
      if (type === "normal") {
        this.normalRule.checks = this.normalRule.valList.filter(item => this.normalRule.checks.indexOf(item) === -1)
      }
    },
    cancelRule(type) {
      if (type === "normal") {
        Object.assign(this.$data.normalRule, this.$options.data().normalRule);
      } else if (type === "dmz") {
        Object.assign(this.$data.dmzRule, this.$options.data().dmzRule);
      } else if (type === "dz") {
        Object.assign(this.$data.dzRule, this.$options.data().dzRule);
      }
    },
    saveNormalRule() {
      if (this.normalRule.checks.length === 0) {
        this.$message.warning("至少需要选择一个条件才能保存!");
      } else {
        if (this.normalRule.id) {
          let rule = this.checkRules.find(
            (item) => item.id === this.normalRule.id
          );
          rule.checks = this.normalRule.checks;
        } else {
          let rule = {
            id: Date.now(),
            title: this.normalRule.title,
            label: this.normalRule.label,
            type: "normal",
            ignore: false,
            isOrder: false,
            checks: this.normalRule.checks,
          };
          this.checkRules.push(rule);
        }
        Object.assign(this.$data.normalRule, this.$options.data().normalRule);
      }
    },
    saveDmzRule() {
      if (
        this.dmzRule.checks[0].values.length === 0 &&
        this.dmzRule.checks[1].values.length === 0 &&
        this.dmzRule.checks[2].values.length === 0
      ) {
        this.$message.warning("至少需要选择一个条件才能保存!");
        return;
      }
      if (
        (this.dmzRule.checks[0].values.length !== 0 &&
          this.dmzRule.checks[0].counts.length === 0) ||
        (this.dmzRule.checks[1].values.length !== 0 &&
          this.dmzRule.checks[1].counts.length === 0) ||
        (this.dmzRule.checks[2].values.length !== 0 &&
          this.dmzRule.checks[2].counts.length === 0)
      ) {
        this.$message.warning("胆组出现个数必选");
        return;
      }
      if (this.dmzRule.id) {
        let rule = this.checkRules.find((item) => item.id === this.dmzRule.id);
        rule.checks[0].values = this.dmzRule.checks[0].values;
        rule.checks[0].counts = this.dmzRule.checks[0].counts;
        rule.checks[1].values = this.dmzRule.checks[1].values;
        rule.checks[1].counts = this.dmzRule.checks[1].counts;
        rule.checks[2].values = this.dmzRule.checks[2].values;
        rule.checks[2].counts = this.dmzRule.checks[2].counts;
      } else {
        let rule = {
          id: Date.now(),
          title: this.dmzRule.title,
          label: this.dmzRule.label,
          type: "dmz",
          ignore: false,
          isOrder: false,
          checks: this.dmzRule.checks,
        };
        this.checkRules.push(rule);
      }
      Object.assign(this.$data.dmzRule, this.$options.data().dmzRule);
    },
    saveDzRule() {
      if (
        this.dzRule.checks[0].values.length === 0 ||
        this.dzRule.checks[1].values.length === 0 ||
        this.dzRule.checks[2].values.length === 0
      ) {
        this.$message.warning("断组的三个分组都必须选择!");
        return;
      }
      if (this.dzRule.id) {
        let rule = this.checkRules.find((item) => item.id === this.dzRule.id);
        rule.checks[0].values = this.dzRule.checks[0].values;
        rule.checks[1].values = this.dzRule.checks[1].values;
        rule.checks[2].values = this.dzRule.checks[2].values;
      } else {
        let rule = {
          id: Date.now(),
          title: this.dzRule.title,
          label: this.dzRule.label,
          type: "dz",
          ignore: false,
          isOrder: false,
          checks: this.dzRule.checks,
        };
        this.checkRules.push(rule);
      }
      Object.assign(this.$data.dzRule, this.$options.data().dzRule);
    },
    changeRule(index) {
      let checkRule = this.checkRules[index];
      if (checkRule.type === "normal") {
        this.normalRule.id = checkRule.id;
        this.normalRule.checks = structuredClone(checkRule.checks);
        this.showRule(checkRule.label);
      } else if (checkRule.type === "dmz") {
        this.dmzRule.id = checkRule.id;
        this.dmzRule.checks = structuredClone(checkRule.checks);
        this.showRule(checkRule.label);
      } else if (checkRule.type === "dz") {
        this.dzRule.id = checkRule.id;
        this.dzRule.checks = structuredClone(checkRule.checks);
        this.showRule(checkRule.label);
      }
    },
    delRule(index) {
      this.checkRules.splice(index, 1);
      this.$store.commit("RESET_IGNORE_ERR");
    },
  },
  mounted() {
    this.$store.dispatch("loadConfig");
  },
};
</script>

<template>
  <div class="rule-option">
    <el-card>
      <div class="row">
        <el-button
          class="rule"
          size="small"
          type="success"
          @click="showRule('hz2')"
          >合值
        </el-button>
        <el-button
          class="rule"
          size="small"
          type="success"
          @click="showRule('kd')"
          >跨度
        </el-button>
        <el-button
          class="rule"
          size="small"
          type="success"
          @click="showRule('012l')"
          >012路
        </el-button>
        <el-button
          class="rule"
          size="small"
          type="success"
          @click="showRule('dzx')"
          >大中小
        </el-button>
        <el-button
          class="rule"
          size="small"
          type="success"
          @click="showRule('rylmc')"
          >任意两码差
        </el-button>
      </div>
      <div class="row">
        <el-button
          class="rule"
          size="small"
          type="success"
          @click="showRule('lmh')"
          >两码合
        </el-button>
        <el-button
          class="rule"
          size="small"
          type="success"
          @click="showRule('zxlmh')"
          >最小两码合
        </el-button>
        <el-button
          class="rule"
          size="small"
          type="success"
          @click="showRule('zjlmh')"
          >中间两码合
        </el-button>
        <el-button
          class="rule"
          size="small"
          type="success"
          @click="showRule('zdlmh')"
          >最大两码合
        </el-button>
      </div>
      <div class="row">
        <el-button
          class="rule"
          size="small"
          type="success"
          @click="showRule('mcsm')"
          >码差三码
        </el-button>
        <el-button
          class="rule"
          size="small"
          type="success"
          @click="showRule('zdz')"
          >最大值
        </el-button>
        <el-button
          class="rule"
          size="small"
          type="success"
          @click="showRule('dmz')"
          >胆码组
        </el-button>
        <el-button
          class="rule"
          size="small"
          type="success"
          @click="showRule('hz')"
          >和值
        </el-button>
        <el-button
          class="rule"
          size="small"
          type="success"
          @click="showRule('jo')"
          >奇偶
        </el-button>
        <el-button
          class="rule"
          size="small"
          type="success"
          @click="showRule('dz')"
          >断组
        </el-button>
      </div>
      <div class="row" v-if="activeTab === 'direct'">
        <el-button
            class="rule"
            size="small"
            type="success"
            @click="showRule('hmxt')"
        >号码形态
        </el-button>
        <el-button
            class="rule"
            size="small"
            type="success"
            @click="showRule('jodw')"
        >奇偶定位
        </el-button>
      </div>
    </el-card>
    <el-dialog
      :title="normalRule.title"
      :visible.sync="normalRule.show"
      center
      width="80%"
    >
      <div class="rule-form">
        <div v-if="normalRule.ruleTip" style="padding-bottom: 5px">
          <span>{{ normalRule.ruleTip }}:</span>
        </div>
        <el-checkbox-group v-model="normalRule.checks" size="mini">
          <el-checkbox-button
            v-for="(item, index) in normalRule.valList"
            :key="index"
            :label="item"
          >
            {{ item }}
          </el-checkbox-button>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reverseRule('normal')">排 除</el-button>
        <el-button @click="cancelRule('normal')">取 消</el-button>
        <el-button type="primary" @click="saveNormalRule">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="dmzRule.title"
      :visible.sync="dmzRule.show"
      center
      width="90%"
    >
      <div class="rule-form">
        <div
          v-for="(rule, index) in dmzRule.checks"
          :key="index"
          class="item-rule"
        >
          <div class="title">
            <span>{{ rule.label }}:</span>
          </div>
          <el-checkbox-group v-model="rule.values" size="mini">
            <el-checkbox-button v-for="num in 10" :key="num" :label="num - 1">
              {{ num - 1 }}
            </el-checkbox-button>
          </el-checkbox-group>
          <div class="title"><span>出现:</span></div>
          <el-checkbox-group v-model="rule.counts" size="mini">
            <el-checkbox v-for="count in 4" :key="count - 1" :label="count - 1"
              >{{ count - 1 }}个
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRule('dmz')">取 消</el-button>
        <el-button type="primary" @click="saveDmzRule">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="dzRule.title"
      :visible.sync="dzRule.show"
      center
      width="90%"
    >
      <div class="rule-form">
        <div
          v-for="(rule, index) in dzRule.checks"
          :key="index"
          class="item-rule"
        >
          <div class="title">
            <span>{{ rule.label }}:</span>
          </div>
          <el-checkbox-group v-model="rule.values" size="mini">
            <el-checkbox-button v-for="num in 10" :key="num" :label="num - 1">
              {{ num - 1 }}
            </el-checkbox-button>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRule('dz')">取 消</el-button>
        <el-button type="primary" @click="saveDzRule">确 定</el-button>
      </span>
    </el-dialog>
    <el-card style="margin-top: 5px">
      <div class="rule-list">
        <span v-if="!checkRules.length">暂无条件</span>
        <div
          v-for="(item, index) in checkRules"
          :key="item.id"
          class="rule-item"
        >
          <div class="title">
            <div class="name">
              <span>【{{ index + 1 }}】{{ item.title }}</span>
            </div>
            <div class="operator">
              <el-checkbox
                v-if="item.label !== 'dmz' && item.label !== 'dz'"
                v-model="item.isOrder"
                style="margin-right: 10px"
                >排序
              </el-checkbox>
              <el-checkbox
                v-if="item.label !== 'dmz' && item.label !== 'dz'"
                v-model="item.ignore"
                style="margin-right: 10px"
                @change="changeIg"
                >容错
              </el-checkbox>
              <el-button size="mini" type="warning" @click="changeRule(index)"
                >修改
              </el-button>
              <el-button size="mini" type="danger" @click="delRule(index)"
                >移除
              </el-button>
            </div>
          </div>
          <div v-if="item.type === 'normal'">
            <span>选定值:{{ item.checks }}</span>
          </div>
          <div v-else-if="item.type === 'dmz'">
            <div v-for="(child, index) in item.checks" :key="index">
              <span style="margin-right: 5px">{{ child.label }}:</span>
              <span style="margin-right: 10px">{{ child.values }}</span>
              <span style="margin-right: 5px">出现个数:</span>
              <span>{{ child.counts }}</span>
            </div>
          </div>
          <div v-else-if="item.type === 'dz'">
            <div v-for="(child, index) in item.checks" :key="index">
              <span style="margin-right: 5px">{{ child.label }}:</span>
              <span style="margin-right: 10px">{{ child.values }}</span>
            </div>
          </div>
        </div>
      </div>
      <ignore-error-check />
      <order-check />
    </el-card>
  </div>
</template>

<style scoped>
.row {
  margin-bottom: 10px;
}

.row:last-child {
  margin-bottom: 0;
}

.rule-item {
  padding: 10px;
  border: 1px solid #e5eaee;
  margin-bottom: 5px;

  .title {
    display: flex;
    justify-content: space-between;
  }
}

.rule-item:last-child {
  margin-bottom: 0;
}
</style>
