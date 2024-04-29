import Vue from "vue";
import Vuex from "vuex";
import { allNum, allType } from "@/config";
import { getConfigList, setConfigList } from "@/utils/config";
import { getNumObjByCodes,group2Direct } from "@/utils/code";

Vue.use(Vuex);

// 暴露vuex的仓库实例
export default new Vuex.Store({
  state: {
    bitList: allNum,
    tenList: allNum,
    hundredList: allNum,
    groupList: allNum,
    groupTypes: allType,
    activeTab: "group",
    checkRules: [],
    igMin: 0,
    igMax: 0,
    orderType: false,
    configList: [],
    resultList: [],
    codesResult: "",
    transCodes: [],
  },
  mutations: {
    CHANGE_CHECK_TAB(state, activeTab) {
      state.activeTab = activeTab;
    },
    CHANGE_GROUP_LIST(state, groupList) {
      state.groupList = groupList;
    },
    CHANGE_GROUP_TYPE(state, groupTypes) {
      state.groupTypes = groupTypes;
    },
    CHANGE_BIT_LIST(state, bitList) {
      state.bitList = bitList;
    },
    CHANGE_TEN_LIST(state, tenList) {
      state.tenList = tenList;
    },
    CHANGE_HUN_LIST(state, hunList) {
      state.hundredList = hunList;
    },
    CHANG_CHECK_RULES(state, ruleList) {
      state.checkRules = ruleList;
    },
    RESET_IGNORE_ERR(state) {
      let igNum = state.checkRules.reduce(
        (pre, cur) => (cur.ignore ? pre + 1 : pre),
        0
      );
      if (state.igMin > igNum || state.igMax > igNum) {
        state.igMin = 0;
        state.igMax = 0;
      }
    },
    CHANGE_IG_MIN(state, igMin) {
      state.igMin = igMin;
      if (igMin > state.igMax) {
        state.igMax = igMin;
      }
    },
    CHANGE_IG_MAX(state, igMax) {
      if (igMax < state.igMin) {
        this._vm.$message({
          type: "warning",
          message: "最大容错数不能小于最小容错数!",
        });
      } else {
        state.igMax = igMax;
      }
    },
    CHANGE_ORDER_TYPE(state) {
      state.orderType = !state.orderType;
    },
    SET_CONFIG(state, index) {
      let config = structuredClone(state.configList[index]);
      state.checkRules = config.rule || [];
      state.hundredList = config.hun || [];
      state.tenList = config.ten || [];
      state.bitList = config.bit || [];
      state.groupList = config.group || [];
      state.groupTypes = config.groupType || [];
      state.igMin = config.igMin || 0;
      state.igMax = config.igMax || 0;
    },
    async SAVE_CONFIG(state, config) {
      state.configList.unshift(config);
      console.log(config, state.configList);
      await setConfigList(state.configList);
    },
    async DELETE_CONFIG(state, index) {
      state.configList.splice(index, 1);
      await setConfigList(state.configList);
    },
    SAVE_CONFIG_LIST(state, configList) {
      state.configList = configList;
    },
    CHANGE_RESULT_LIST(state, codeList) {
      state.resultList = getNumObjByCodes(codeList);
    },
    CHANGE_CODES_RESULT(state, codesList) {
      state.codesResult = codesList.join(" ");
      state.transCodes = []
      for (let code of codesList){
        state.transCodes = [...state.transCodes, ...group2Direct([...code])]
      }
    },
    DELETE_CODE(state, code) {
      let index = state.resultList.findIndex((item) => item.code === code);
      state.resultList.splice(index, 1);
    },
  },
  actions: {
    changeIgnoreErr({ commit, checked }) {
      if (!checked) {
        commit("RESET_IGNORE_ERR");
      }
    },
    async loadConfig({ commit }) {
      let configList = await getConfigList();
      if (configList.length > 0) {
        commit("SAVE_CONFIG_LIST", configList);
        commit("SET_CONFIG", 0);
      }
    },
  },
  getters: {
    igNum: (state) =>
      state.checkRules.reduce((pre, cur) => (cur.ignore ? pre + 1 : pre), 0),
    isGroup: (state) => state.activeTab === "group",
  },
});
