import Vue from "vue";
import Vuex from "vuex"
import {allNum, allType} from "@/config";

Vue.use(Vuex);

// 暴露vuex的仓库实例
export default new Vuex.Store({
    state: {
        bitList: allNum,
        tenList: allNum,
        hundredList: allNum,
        groupList: allNum,
        groupTypes: allType,
        activeTab: 'group',
        checkRules: [],
        igMin: 0,
        igMax: 0,
    },
    mutations: {
        CHANGE_CHECK_TAB(state, activeTab) {
            state.activeTab = activeTab
        },
        CHANGE_GROUP_LIST(state, groupList) {
            state.groupList = groupList
        },
        CHANGE_GROUP_TYPE(state, groupTypes) {
            state.groupTypes = groupTypes
        },
        CHANGE_BIT_LIST(state, bitList) {
            state.bitList = bitList
        },
        CHANGE_TEN_LIST(state, tenList) {
            state.tenList = tenList
        },
        CHANGE_HUN_LIST(state, hunList) {
            state.hunList = hunList
        },
        CHANG_CHECK_RULES(state, ruleList) {
            state.checkRules = ruleList
        },
        RESET_IGNORE_ERR(state) {
            state.igMin = 0
            state.igMax = 0
        }
    },
    actions: {
        changeIgnoreErr({commit, checked}) {
            if (!checked) {
                if (this.igMin > this.igNum() || this.igMax > this.igNum()) {
                    commit('RESET_IGNORE_ERR', checked)
                }
            }

        }
    },
    getters: {
        igNum() {
            return this.checkRules.reduce((pre, cur) => cur.ignore ? pre + 1 : pre, 0)
        },
    }
})