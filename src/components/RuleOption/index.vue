<script>
import { direct2Group, getSeqArr, validCodes } from "@/utils/code";
import _ from 'lodash'
import { all012l, allDzx, allHmxt, allJiOu, allJodw, allMCSM } from "@/config";
import IgnoreErrorCheck from "@/components/IgnoreErrorCheck/index.vue";
import OrderCheck from "@/components/OrderCheck/index.vue";
import { mapState } from "vuex";

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
      szsRule: {
        show: false,
        title: "",
        label: "",
        id: null,
        checks: [
          { label: "", values: [] },
          { label: "", values: [] },
          { label: "", values: [] },
        ],
        conditionNums: ['3'],
      },
      fstjRule: {
        show: false,
        title: "",
        label: "",
        id: null,
        checks: [
          {
            label: "",
            valuesAll: ['复复复', '隔隔隔', '中中中', '复隔中', '复复隔', '复复中', '隔隔复', '隔隔中', '中中复', '中中隔'],
            values: [],
            numArr: {
              nums1: [],
              nums2: [],
              nums3: [],
            },
          },
          {
            label: "",
            valuesAll: ['重重重', '斜斜斜', '跳跳跳', '重斜跳', '重重斜', '重重跳', '斜斜重', '斜斜跳', '跳跳重', '跳跳斜'],
            values: [],
            numArr: {
              nums1: [],
              nums2: [],
              nums3: [],
            },
          },
          {
            label: "",
            valuesAll: ['邻邻邻', '孤孤孤', '传传传', '邻孤传', '邻邻孤', '邻邻传', '孤孤邻', '孤孤传', '传传邻', '传传孤'],
            values: [],
            numArr: {
              nums1: [],
              nums2: [],
              nums3: [],
            },
          },
          {
            label: "",
            valuesAll: ['热热热', '温温温', '冷冷冷', '热温冷', '热热温', '热热冷', '温温热', '温温冷', '冷冷热', '冷冷温'],
            values: [],
            numArr: {
              nums1: [],
              nums2: [],
              nums3: [],
            },
          },
        ],
        conditionNums: ['4'],
      },
      shRule: {
        show: false,
        title: "",
        shInput: ""
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
    ...mapState(["activeTab", "shCodes"]),
    shGroup() {
      return this.shRule.shInput.trim().split(" ").filter(item => item, length > 0);
    },
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
      } else if (label === "dzxs") {
        this.szsRule.show = true;
        this.szsRule.label = label;
        this.szsRule.title = "大中小数";
        this.szsRule.checks[0].label = "最大数";
        this.szsRule.checks[1].label = "中间数";
        this.szsRule.checks[2].label = "最小数";
      } else if (label === "dzxlmh") {
        this.szsRule.show = true;
        this.szsRule.label = label;
        this.szsRule.title = "大中小两码合";
        this.szsRule.checks[0].label = "最大两码合";
        this.szsRule.checks[1].label = "中间两码合";
        this.szsRule.checks[2].label = "最小两码合";
      } else if (label === "dzxlmc") {
        this.szsRule.show = true;
        this.szsRule.label = label;
        this.szsRule.title = "大中小两码差";
        this.szsRule.checks[0].label = "最大两码差";
        this.szsRule.checks[1].label = "中间两码差";
        this.szsRule.checks[2].label = "最小两码差";
      } else if (label === "fstj") {
        this.fstjRule.show = true;
        this.fstjRule.label = label;
        this.fstjRule.title = "复式条件";
        this.fstjRule.checks[0].label = "复隔中";
        this.fstjRule.checks[1].label = "重斜跳";
        this.fstjRule.checks[2].label = "邻孤传";
        this.fstjRule.checks[3].label = "热温冷";
      } else if (label === 'sh') {
        this.shRule.show = true
        this.shRule.title = '杀号'
        this.shRule.shInput = this.shCodes.join(' ')
      }
    },
    reverseRule(type) {
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
      } else if (type === "szs") {
        Object.assign(this.$data.szsRule, this.$options.data().szsRule);
      } else if (type === "fstj") {
        Object.assign(this.$data.fstjRule, this.$options.data().fstjRule);
      } else if (type === "sh") {
        this.shRule.show = false
        this.shRule.shInput = ''
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
    szsRuleAll(index, label) {
      this.szsRule.checks[index].values.splice(0, this.szsRule.checks[index].values.length, ...this.getSzsAll(index, label))
    },
    szsRuleReverse(index, label) {
      let all = this.getSzsAll(index, label)
      let reverseArr = all.filter(num => this.szsRule.checks[index].values.indexOf(num) === -1)
      this.szsRule.checks[index].values.splice(0, this.szsRule.checks[index].values.length, ...reverseArr)
    },
    getSzsAll(index, label) {
      if (label === "dzxlmc" && index === 2) {
        return [0, 1, 2, 3, 4]
      }
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    saveSzsRule() {
      if (this.szsRule.id) {
        let rule = this.checkRules.find((item) => item.id === this.szsRule.id);
        rule.checks = this.szsRule.checks
        rule.conditionNums = this.szsRule.conditionNums
      } else {
        let rule = {
          id: Date.now(),
          title: this.szsRule.title,
          label: this.szsRule.label,
          type: "szs",
          ignore: false,
          isOrder: false,
          checks: this.szsRule.checks,
          conditionNums: this.szsRule.conditionNums,
        };
        this.checkRules.push(rule);
      }
      Object.assign(this.$data.szsRule, this.$options.data().szsRule);
    },
    saveFstjRule() {
      let checkMsg = this.checkFstj();
      console.log(checkMsg);
      if (checkMsg) {
        this.$message.error({
          message: checkMsg,
          duration: 1000
        });
        return
      }
      if (this.fstjRule.id) {
        let rule = this.checkRules.find((item) => item.id === this.fstjRule.id);
        rule.checks = this.fstjRule.checks
        rule.conditionNums = this.fstjRule.conditionNums
      } else {
        let rule = {
          id: Date.now(),
          title: this.fstjRule.title,
          label: this.fstjRule.label,
          type: "fstj",
          ignore: false,
          isOrder: false,
          checks: this.fstjRule.checks,
          conditionNums: this.fstjRule.conditionNums,
        };
        this.checkRules.push(rule);
      }
      Object.assign(this.$data.fstjRule, this.$options.data().fstjRule);
    },
    checkFstj() {
      for (const check of this.fstjRule.checks) {
        let countMap = new Map()
        for (const item of [...check.numArr.nums1, ...check.numArr.nums2, ...check.numArr.nums3]) {
          if (countMap.has(item)) {
            countMap.set(item, countMap.get(item) + 1);
          } else {
            countMap.set(item, 1);
          }
        }
        for (let [key, value] of countMap) {
          if (value > 1) {
            return `${check.label}: ${key}重复出现${value}次, 请检查`
          }
        }
      }
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
      } else if (checkRule.type === "szs") {
        this.szsRule.id = checkRule.id;
        this.szsRule.checks = structuredClone(checkRule.checks);
        this.szsRule.conditionNums = checkRule.conditionNums;
        this.showRule(checkRule.label);
      } else if (checkRule.type === "fstj") {
        this.fstjRule.id = checkRule.id;
        this.fstjRule.checks = structuredClone(checkRule.checks);
        this.fstjRule.conditionNums = checkRule.conditionNums;
        this.showRule(checkRule.label);
      }
    },
    delRule(index) {
      this.checkRules.splice(index, 1);
      this.$store.commit("RESET_IGNORE_ERR");
    },
    saveShRule() {
      let errCode = validCodes(this.shGroup)
      if (errCode) {
        this.$message({
          message: `${errCode}不是三位数字, 请检查`,
          type: "error",
          duration: 1000
        });
        return
      }
      let newArr = []
      for (const code of this.shGroup) {
        newArr = [...newArr, direct2Group(code)];
      }
      newArr = _.uniq(newArr)
      this.$store.commit("SET_SH_CODE", newArr);
      this.shRule.show = false
    }
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
        <el-button class="rule" size="small" type="success" @click="showRule('hz2')">合值
        </el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('kd')">跨度
        </el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('012l')">012路
        </el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('dzx')">大中小
        </el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('rylmc')">任意两码差
        </el-button>
      </div>
      <div class="row">
        <el-button class="rule" size="small" type="success" @click="showRule('lmh')">两码合
        </el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('zxlmh')">最小两码合
        </el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('zjlmh')">中间两码合
        </el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('zdlmh')">最大两码合
        </el-button>
      </div>
      <div class="row">
        <el-button class="rule" size="small" type="success" @click="showRule('mcsm')">码差三码
        </el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('zdz')">最大值
        </el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('hz')">和值
        </el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('jo')">奇偶
        </el-button>
      </div>

      <!-- 号码形态，直选才有 -->
      <div class="row" v-if="activeTab === 'direct'">
        <el-button class="rule" size="small" type="success" @click="showRule('hmxt')">号码形态
        </el-button>
        <el-button class="rule" size="small" type="success" @click="showRule('jodw')">奇偶定位
        </el-button>
      </div>

      <!-- 不支持排序和容错 -->
      <div class="row">
        <el-button class="rule" size="small" type="warning" @click="showRule('dmz')">胆码组
        </el-button>
        <el-button class="rule" size="small" type="warning" @click="showRule('dz')">断组
        </el-button>
        <el-button class="rule" size="small" type="warning" @click="showRule('dzxs')">大中小数
        </el-button>
        <el-button class="rule" size="small" type="warning" @click="showRule('dzxlmh')">大中小两码合
        </el-button>
        <el-button class="rule" size="small" type="warning" @click="showRule('dzxlmc')">大中小两码差
        </el-button>
        <el-button class="rule" size="small" type="warning" @click="showRule('fstj')">复式条件
        </el-button>
      </div>
      <div class="row">
        <el-button class="rule" size="small" type="warning" @click="showRule('sh')">杀号
        </el-button>
      </div>
    </el-card>

    <!-- 普通单选条件类型 -->
    <el-dialog :title="normalRule.title" :visible.sync="normalRule.show" center width="80%">
      <div class="rule-form">
        <div v-if="normalRule.ruleTip" style="padding-bottom: 5px">
          <span>{{ normalRule.ruleTip }}:</span>
        </div>
        <el-checkbox-group v-model="normalRule.checks" size="mini">
          <el-checkbox-button v-for="(item, index) in normalRule.valList" :key="index" :label="item">
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
    <!-- 胆码组条件类型 -->
    <el-dialog :title="dmzRule.title" :visible.sync="dmzRule.show" center width="90%">
      <div class="rule-form">
        <div v-for="(rule, index) in dmzRule.checks" :key="index" class="item-rule">
          <div class="title">
            <span>{{ rule.label }}:</span>
          </div>
          <el-checkbox-group v-model="rule.values" size="mini" class="irc-group">
            <el-checkbox-button v-for="num in 10" :key="num" :label="num - 1">
              {{ num - 1 }}
            </el-checkbox-button>
          </el-checkbox-group>
          <div class="title"><span>出现:</span></div>
          <el-checkbox-group v-model="rule.counts" size="mini">
            <el-checkbox v-for="count in 4" :key="count - 1" :label="count - 1">{{ count - 1 }}个
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRule('dmz')">取 消</el-button>
        <el-button type="primary" @click="saveDmzRule">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 断组条件类型 -->
    <el-dialog :title="dzRule.title" :visible.sync="dzRule.show" center width="90%">
      <div class="rule-form">
        <div v-for="(rule, index) in dzRule.checks" :key="index" class="item-rule">
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

    <!-- 三组数条件类型 -->
    <el-dialog :title="szsRule.title" :visible.sync="szsRule.show" center width="90%">
      <div class="rule-form">
        <div v-for="(rule, index) in szsRule.checks" :key="index" class="item-rule">
          <div class="title">
            <span>{{ rule.label }}:</span>
          </div>
          <el-checkbox-group v-if="szsRule.label === 'dzxlmc' && index === 2" v-model="rule.values" size="mini"
            class="irc-group">
            <el-checkbox-button v-for="num in 5" :key="num" :label="num - 1">
              {{ num - 1 }}
            </el-checkbox-button>
          </el-checkbox-group>
          <el-checkbox-group v-else v-model="rule.values" size="mini" class="irc-group">
            <el-checkbox-button v-for="num in 10" :key="num" :label="num - 1">
              {{ num - 1 }}
            </el-checkbox-button>
          </el-checkbox-group>
          <el-button type="danger" size="mini" @click="szsRuleAll(index, szsRule.label)">全选</el-button>
          <el-button type="danger" size="mini" @click="szsRuleReverse(index, szsRule.label)">反选</el-button>
        </div>
        <div class="rule-foot">
          <span class="rule-foot-title">满足:</span>
          <el-checkbox-group v-model="szsRule.conditionNums">
            <el-checkbox label="0">0个</el-checkbox>
            <el-checkbox label="1">1个</el-checkbox>
            <el-checkbox label="2">2个</el-checkbox>
            <el-checkbox label="3">3个</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRule('szs')">取 消</el-button>
        <el-button type="primary" @click="saveSzsRule">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 复式条件 -->
    <el-dialog :title="fstjRule.title" :visible.sync="fstjRule.show" center width="90%">
      <div class="rule-form">
        <div v-for="(rule, index) in fstjRule.checks" :key="index" class="item-rule">
          <div class="title">
            <span>{{ rule.label }}:</span>
          </div>
          <div class="fs-item">
            <el-checkbox-group v-model="rule.numArr.nums1" size="mini" class="irc-group">
              <el-checkbox-button v-for="num in 10" :key="num" :label="num - 1">
                {{ num - 1 }}
              </el-checkbox-button>
            </el-checkbox-group>
            <el-checkbox-group v-model="rule.numArr.nums2" size="mini" class="irc-group">
              <el-checkbox-button v-for="num in 10" :key="num" :label="num - 1">
                {{ num - 1 }}
              </el-checkbox-button>
            </el-checkbox-group>
            <el-checkbox-group v-model="rule.numArr.nums3" size="mini" class="irc-group">
              <el-checkbox-button v-for="num in 10" :key="num" :label="num - 1">
                {{ num - 1 }}
              </el-checkbox-button>
            </el-checkbox-group>
            <el-checkbox-group v-model="rule.values" size="mini" class="irc-group">
              <el-checkbox-button v-for="(item, index) in rule.valuesAll" :key="index" :label="item">
                {{ item }}
              </el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <div class="rule-foot">
          <span class="rule-foot-title">满足:</span>
          <el-checkbox-group v-model="fstjRule.conditionNums">
            <el-checkbox label="0">0个</el-checkbox>
            <el-checkbox label="1">1个</el-checkbox>
            <el-checkbox label="2">2个</el-checkbox>
            <el-checkbox label="3">3个</el-checkbox>
            <el-checkbox label="4">4个</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRule('fstj')">取 消</el-button>
        <el-button type="primary" @click="saveFstjRule">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 输入型条件类型 -->
    <el-dialog :title="shRule.title" :visible.sync="shRule.show" center width="90%">
      <div class="rule-form">
        <el-input v-model="shRule.shInput" placeholder="输入杀号数字" type="textarea"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRule('sh')">取 消</el-button>
        <el-button type="primary" @click="saveShRule">确 定</el-button>
      </span>
    </el-dialog>
    <el-card style="margin-top: 5px">
      <div class="rule-list">
        <span v-if="!checkRules.length">暂无条件</span>
        <div v-for="(item, index) in checkRules" :key="item.id" class="rule-item">
          <div class="title">
            <div class="name">
              <span>【{{ index + 1 }}】{{ item.title }}</span>
            </div>
            <div class="operator">
              <!-- 普通类型条件才有排序和容错 -->
              <el-checkbox v-if="item.type == 'normal'" v-model="item.isOrder" style="margin-right: 10px">排序
              </el-checkbox>
              <el-checkbox v-model="item.ignore" v-if="item.type == 'normal'" style="margin-right: 10px"
                @change="changeIg">容错
              </el-checkbox>
              <el-button size="mini" type="warning" @click="changeRule(index)">修改
              </el-button>
              <el-button size="mini" type="danger" @click="delRule(index)">移除
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
          <div v-else-if="item.type === 'szs'">
            <div v-for="(child, index) in item.checks" :key="index">
              <span style="margin-right: 5px">{{ child.label }}:</span>
              <span style="margin-right: 10px">{{ child.values }}</span>
            </div>
            <span>满足：{{ item.conditionNums }}个</span>
          </div>
          <div v-else-if="item.type === 'fstj'">
            <div v-for="(child, index) in item.checks" :key="index">
              <div class="fs-show">
                <span style="margin-right: 5px">{{ child.label }}:</span>
                <span style="margin-right: 10px">{{ child.values }}</span>
              </div>
              <div class="fs-show">
                <span style="margin-right: 10px">{{ child.numArr.nums1 }}</span>
                <span style="margin-right: 10px">{{ child.numArr.nums2 }}</span>
                <span style="margin-right: 10px">{{ child.numArr.nums3 }}</span>
              </div>
            </div>
            <span>满足：{{ item.conditionNums }}个</span>
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

.item-rule {
  display: flex;
  justify-content: left;
  line-height: 28px;
  margin-bottom: 10px;

  .title {
    font-size: 20;
    font-weight: bold;
    margin-right: 10px;
  }
}

.irc-group {
  margin-right: 10px;
  margin-bottom: 5px;
}

.rule-foot-title {
  margin-right: 10px;
}

.fs-item {
  display: flex;
  flex-direction: column;
}

.fs-show {
  margin-bottom: 5px;
}
</style>
