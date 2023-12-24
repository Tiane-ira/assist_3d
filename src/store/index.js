import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        bitList: ['1'],
        tenList: ['1'],
        hundredList: ['1'],
        groupList: ['1'],
    },
    mutations: {
        BIT_ALL(state) {
            state.bitList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        },
        TEN_ALL(state) {
            state.tenList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        },
        HUN_ALL(state) {
            state.hundredList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        },
        GROUP_ALL(state) {
            state.groupList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        },
        BIT_CLEAR(state) {
            state.bitList = []
        },
        TEN_CLEAR(state) {
            state.tenList = []
        },
        HUN_CLEAR(state) {
            state.hundredList = []
        },
        GROUP_CLEAR(state) {
            state.groupList = []
        },
    },
    actions: {
        checkAll({commit, type}) {
            if (type === '1') {
                commit('BIT_ALL')
            } else if (type === '2') {
                commit('TEN_ALL')
            } else if (type === '3') {
                commit('HUN_ALL')
            } else {
                commit('GROUP_ALL')
            }
        },
        clearAll({commit, type}) {
            if (type === '1') {
                commit('BIT_CLEAR')
            } else if (type === '2') {
                commit('TEN_CLEAR')
            } else if (type === '3') {
                commit('HUN_CLEAR')
            } else {
                commit('GROUP_CLEAR')
            }
        }
    }
});