import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { allNum, allType } from '@/config'
import { getConfigList, setConfigList } from '@/utils/config'
import { getNumObjByCodes, group2Direct } from '@/utils/code'

interface ConfigItem {
  id: number
  name: string
  rule: any[]
  hun: string[]
  ten: string[]
  bit: string[]
  group: string[]
  groupType: string[]
  igMin: number
  igMax: number
  createTime: string
}

interface CodeObj {
  code: string
  sum: number
  diff: number
  dzx: string
  lye: string
  smc: string
  smh: string
}

export const useAppStore = defineStore('app', {
  state: () => ({
    bitList: [...allNum] as string[],
    tenList: [...allNum] as string[],
    hundredList: [...allNum] as string[],
    groupList: [...allNum] as string[],
    groupTypes: [...allType] as string[],
    activeTab: 'group' as string,
    checkRules: [] as any[],
    igMin: 0,
    igMax: 0,
    orderType: false,
    configList: [] as ConfigItem[],
    resultList: [] as CodeObj[],
    codesResult: '',
    transCodes: [] as string[],
    shCodes: [] as string[]
  }),

  getters: {
    igNum: (state) =>
      state.checkRules.reduce((pre: number, cur: any) => (cur.ignore ? pre + 1 : pre), 0),
    isGroup: (state) => state.activeTab === 'group'
  },

  actions: {
    changeCheckTab(activeTab: string) {
      this.activeTab = activeTab
      this.checkRules = []
      this.resultList = []
      this.codesResult = ''
      this.transCodes = []
    },

    changeGroupList(groupList: string[]) {
      this.groupList = groupList
    },

    changeGroupType(groupTypes: string[]) {
      this.groupTypes = groupTypes
    },

    changeBitList(bitList: string[]) {
      this.bitList = bitList
    },

    changeTenList(tenList: string[]) {
      this.tenList = tenList
    },

    changeHunList(hunList: string[]) {
      this.hundredList = hunList
    },

    changeCheckRules(ruleList: any[]) {
      this.checkRules = ruleList
    },

    resetIgnoreErr() {
      const igNum = this.checkRules.reduce((pre: number, cur: any) => (cur.ignore ? pre + 1 : pre), 0)
      if (this.igMin > igNum || this.igMax > igNum) {
        this.igMin = 0
        this.igMax = 0
      }
    },

    changeIgMin(igMin: number) {
      this.igMin = igMin
      if (igMin > this.igMax) {
        this.igMax = igMin
      }
    },

    changeIgMax(igMax: number) {
      if (igMax < this.igMin) {
        ElMessage({
          type: 'warning',
          message: '最大容错数不能小于最小容错数!'
        })
      } else {
        this.igMax = igMax
      }
    },

    changeOrderType() {
      this.orderType = !this.orderType
    },

    setConfig(index: number) {
      const config = structuredClone(this.configList[index])
      this.checkRules = config.rule || []
      this.hundredList = config.hun || []
      this.tenList = config.ten || []
      this.bitList = config.bit || []
      this.groupList = config.group || []
      this.groupTypes = config.groupType || []
      this.igMin = config.igMin || 0
      this.igMax = config.igMax || 0
    },

    async saveConfig(config: ConfigItem) {
      this.configList.unshift(config)
      await setConfigList(this.configList)
    },

    async deleteConfig(index: number) {
      this.configList.splice(index, 1)
      await setConfigList(this.configList)
    },

    saveConfigList(configList: ConfigItem[]) {
      this.configList = configList
    },

    changeResultList(codeList: string[]) {
      this.resultList = getNumObjByCodes(codeList)
    },

    changeCodesResult(codesList: string[]) {
      this.codesResult = codesList.join(' ')
      if (this.activeTab === 'group') {
        this.transCodes = []
        for (const code of codesList) {
          this.transCodes = [...this.transCodes, ...group2Direct([...code])]
        }
      }
    },

    deleteCode(code: string) {
      const index = this.resultList.findIndex((item) => item.code === code)
      this.resultList.splice(index, 1)
    },

    setShCodes(codes: string[]) {
      this.shCodes = codes
    },

    changeIgnoreErr(checked: boolean) {
      if (!checked) {
        this.resetIgnoreErr()
      }
    },

    async loadConfig() {
      const configList = await getConfigList()
      if (configList.length > 0) {
        this.saveConfigList(configList)
        this.setConfig(0)
      }
    }
  }
})
