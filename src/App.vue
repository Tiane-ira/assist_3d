<template>
  <div id="app">

    <div class="header">
      <h3>福彩3d选号助手</h3>
    </div>
    <el-row>
      <el-col :span="12" class="top-left">
        <num-checker/>
        <rule-option/>
        <div class="ignore-check">
          <div class="ig-min">
            <span>最小容错数: </span>
            <el-select :disabled="!igNum" v-model="igMin" placeholder="最小容错" size="small" @change="changeIgMin">
              <el-option
                  v-for="n in igNum+1"
                  :key="n"
                  :label="n-1"
                  :value="n-1">
              </el-option>
            </el-select>
          </div>
          <div class="ig-max">
            <span>最大容错数: </span>
            <el-select :disabled="!igNum" v-model="igMax" placeholder="最大容错" size="small" @change="changeIgMax">
              <el-option
                  v-for="n in igNum+1"
                  :key="n"
                  :label="n-1"
                  :value="n-1">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="ignore-check">
          <el-checkbox v-model="orderType">交叉排列</el-checkbox>
        </div>
      </el-col>
      <el-col :span="12" class="top-right">
        <div class="op">
          <el-button type="primary" :loading="loading" @click="getResult">获取结果</el-button>
          <el-button type="warning" :disabled="!resultList.length" @click="copyResult">复制结果</el-button>
          <el-button type="primary" :disabled="!checkRules.length" @click="showSaveRule">保存条件</el-button>
          <el-button type="warning" @click="showRuleHis">条件历史</el-button>
        </div>
        <div class="data">
          <el-table
              :data="resultList"
              @sort-change="sortChange"
              max-height="350"
              style="width: 100%;"
              :border="true"
              :header-cell-style="{'text-align':'center'}"
              ref="table"
          >
            <el-table-column
                label="序号"
                type="index"
                align="center">
            </el-table-column>
            <el-table-column
                prop="code"
                label="号码"
                sortable
                align="center">
            </el-table-column>
            <el-table-column
                prop="sum"
                label="和值"
                sortable
                align="center">
            </el-table-column>
            <el-table-column
                prop="diff"
                sortable
                label="跨度"
                align="center">
            </el-table-column>
            <el-table-column
                prop="dzx"
                label="大小"
                align="center">
            </el-table-column>
            <el-table-column
                prop="lye"
                label="012路"
                align="center">
            </el-table-column>
            <el-table-column
                prop="smc"
                label="三码差"
                align="center">
            </el-table-column>
            <el-table-column
                prop="smh"
                label="三码合"
                align="center">
            </el-table-column>
            <el-table-column
                label="操作"
                align="center">
              <template v-slot="{row}">
                <el-button
                    @click.native.prevent="delCode(row)"
                    type="text"
                    size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="op-res">
            {{ codesResult }}
          </div>
          <div class="statistic">
            <el-row :gutter="20">
              <el-col :span="12">
                <div>
                  <el-statistic :value="resultList.length" title="注数"/>
                </div>
              </el-col>
              <el-col :span="12">
                <div>
                  <el-statistic :value="2*resultList.length" title="金额"/>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
        title="条件历史列表"
        :visible.sync="hisShow"
        width="60%"
        center>
      <el-table
          :data="hisList"
          :border="true"
          :header-cell-style="{'text-align':'center'}"
          ref="hisTable"
      >
        <el-table-column
            label="序号"
            type="index"
            align="center">
        </el-table-column>
        <el-table-column
            prop="name"
            label="名称"
            align="center">
        </el-table-column>
        <el-table-column
            prop="label"
            label="条件"
            align="center"
            show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="保存时间"
            align="center"
            width="160">
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            width="200">
          <template v-slot="{$index}">
            <el-button
                @click.native.prevent="applyConfig($index)"
                type="success"
                size="mini">
              使用
            </el-button>
            <el-button
                @click.native.prevent="delConfig($index)"
                type="danger"
                size="mini">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
        title="保存条件"
        :visible.sync="saveRuleShow"
        width="60%"
        center>
      <div>
        <el-input placeholder="输入条件集的名称" v-model="ruleName"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="saveRuleShow=false">取 消</el-button>
      <el-button type="primary" @click="saveConfig">保存</el-button>
    </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  formatDate,
  getIgCounts,
  getNumDirect,
  getNumGroup,
  getNumObjByCodes,
  getSeqArr
} from './utils/index'
import NumChecker from "@/components/Checker/index.vue";
import RuleOption from "@/components/RuleOption/index.vue";

export default {
  name: 'App',
  components: {RuleOption, NumChecker},
  data() {
    return {
      loading: false,
      exporting: false,
      resultList: [],
      checkRules: [],
      igMin: 0,
      igMax: 0,
      codesResult: '',
      hisShow: false,
      configList: [],
      saveRuleShow: false,
      ruleName: '',
      orderType: false
    }
  },
  computed: {
    isGroup() {
      return this.activeTab === 'group'
    },
    igNum() {
      return this.checkRules.reduce((pre, cur) => cur.ignore ? pre + 1 : pre, 0)
    },
    hisList() {
      let hisArr = []
      for (let config of this.configList) {
        let labelArr = []
        for (let ruleItem of config.rule) {
          labelArr.push(ruleItem.title)
        }
        let his = {
          id: config.id,
          name: config.name,
          label: labelArr.join(','),
          createTime: config.createTime
        }
        hisArr.push(his)
      }
      return hisArr
    }
  },
  methods: {
    getResult() {
      this.loading = true
      let codeList
      if (this.isGroup) {
        codeList = getNumGroup(this.groupList, this.groupTypes)
      } else {
        codeList = getNumDirect(this.bitList, this.tenList, this.hundredList)
      }
      let igCounts = getIgCounts(this.igMin, this.igMax) // 默认0-0无容错
      window.electron.filterCodes(codeList, this.checkRules, igCounts, this.orderType).then(filteredCodeList => {
        this.resultList = getNumObjByCodes(filteredCodeList)
        this.codesResult = filteredCodeList.join(' ')
        this.loading = false
        this.$message.success("结果计算成功");
      }).catch(e => {
        this.loading = false
        this.$message.error("结果计算失败:" + e.toString());
      })
    },
    sortChange() {
      let codeList = []
      this.$refs.table.tableData.forEach(item => codeList.push(item.code))
      this.codesResult = codeList.join(' ')
    },
    delCode(row) {
      let index = this.resultList.findIndex(item => item.code === row.code)
      this.resultList.splice(index, 1)
      this.sortChange()
    },
    delRule(index) {
      this.checkRules.splice(index, 1)
      this.igMin = 0
      this.igMax = 0
    },
    changeIgMin(newVal) {
      this.igMax = newVal
    },
    changeIgMax(newVal) {
      if (newVal < this.igMin) {
        this.$message({
          type: 'warning',
          message: '最大容错数不能小于最小容错数!'
        })
      }
    },
    showRuleHis() {
      this.hisShow = true
      this.loadConfigList()
    },
    loadConfigList() {
      window.electron.getConfig('configList').then(configList => {
        this.configList = configList || []
      })
    },
    showSaveRule() {
      this.ruleName = ''
      this.saveRuleShow = true
    },
    saveConfig() {
      let config = {
        id: Date.now(),
        name: this.ruleName,
        rule: structuredClone(this.checkRules),
        hun: structuredClone(this.hundredList),
        ten: structuredClone(this.tenList),
        bit: structuredClone(this.bitList),
        group: structuredClone(this.groupList),
        groupType: structuredClone(this.groupTypes),
        igMin: this.igMin,
        igMax: this.igMax,
        createTime: formatDate(new Date())
      }
      this.configList.unshift(config)
      window.electron.setConfig('configList', this.configList)
      this.saveRuleShow = false
      this.$message.success('保存条件成功')
    },
    delConfig(index) {
      this.configList.splice(index, 1)
      window.electron.setConfig('configList', this.configList)
      this.$message.success('删除条件成功')
    },
    applyConfig(index) {
      let config = structuredClone(this.configList[index])
      this.checkRules = config.rule || []
      this.hundredList = config.hun || []
      this.tenList = config.ten || []
      this.bitList = config.bit || []
      this.groupList = config.group || []
      this.groupTypes = config.groupType || []
      this.igMin = config.igMin || 0
      this.igMax = config.igMax || 0
      this.hisShow = false
      this.$message.success('应用条件成功')
    },
    copyResult() {
      if (this.resultList.length === 0) {
        this.$message.error('结果为空无法复制')
        return
      }
      window.electron.copy2Clipboard(this.codesResult)
      this.$message.success(`已复制${this.resultList.length}个结果`)
    }
  },
  mounted() {
    window.electron.getConfig('configList').then(configList => {
      if (configList && configList.length > 0) {
        this.configList = configList
        let config = structuredClone(this.configList[0])
        this.checkRules = config.rule || []
        this.hundredList = config.hun || []
        this.tenList = config.ten || []
        this.bitList = config.bit || []
        this.groupList = config.group || []
        this.groupTypes = config.groupType || []
        this.igMin = config.igMin || 0
        this.igMax = config.igMax || 0
      }
    })

  }
}
</script>

<style>
#app {
  .header {
    text-align: center;
    background: #0e86c2;
    height: 50px;
    line-height: 50px;
    color: white;
    font-size: 20px;
  }
}

.top-left {
  padding-right: 50px;
}


.check {
  margin-left: 10px;

  .numList {
    margin: 5px;

    .title {
      margin-bottom: 5px;

    }
  }
}

.group-type {
  padding: 0 50px;
  margin-top: 10px
}

.top-right {
  .op {
    margin: 10px;
  }

  .op-res {
    margin-top: 10px;
    padding: 10px;
    font-size: 12px;
    border: 1px solid #e3e3e3;
  }

  .data {
    margin: 10px;
  }

  .statistic {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #e3e3e3;
  }
}

.rule-group {
  margin: 5px 10px;
  padding: 10px;
  border: 1px solid #e3e3e3;

  .rule {
    margin-top: 5px;
  }
}

.rule-item {
  padding: 10px 10px;
  margin: 5px 10px;
  border: 1px solid #e3e3e3;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.ignore-check {
  margin: 5px 10px;
  padding: 10px 10px;
  border: 1px solid #e3e3e3;

  .ig-min {
    margin-bottom: 5px;
  }
}

.item-rule {
  display: flex;
  align-items: center;
  justify-content: start;
  margin-bottom: 10px;

  .title {
    margin: 0 10px;
  }
}

</style>
