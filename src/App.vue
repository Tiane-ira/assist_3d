<template>
  <div id="app">

    <div class="header">
      <h3>福彩3d选号助手</h3>
    </div>
    <el-row>
      <el-col :span="12" class="top-left">
        <el-tabs v-model="activeTab" @tab-click="tabClick" class="check">
          <el-tab-pane label="组选" name="group">
            <div class="numList">
              <div class="title">
                <span style="margin-right: 5px">组选:</span>
                <el-button type="text" size="mini" @click="groupAll">全选</el-button>
                <el-button type="text" size="mini" @click="groupClear">清空</el-button>
              </div>
              <el-checkbox-group v-model="groupList" size="small" class="num">
                <el-checkbox-button v-for="num in numList" :label="num" :key="num">{{ num }}</el-checkbox-button>
              </el-checkbox-group>
              <el-checkbox-group style="margin-top: 10px" v-model="groupTypes" class="group-type">
                <el-checkbox label="豹子"></el-checkbox>
                <el-checkbox label="组三"></el-checkbox>
                <el-checkbox label="组六"></el-checkbox>
                <el-checkbox label="顺子"></el-checkbox>
                <el-checkbox label="半顺"></el-checkbox>
                <el-checkbox label="杂六"></el-checkbox>
              </el-checkbox-group>
            </div>
          </el-tab-pane>
          <el-tab-pane label="直选" name="direct">
            <div class="numList">
              <div class="title">
                <span style="margin-right: 5px">个位:</span>
                <el-button type="text" size="mini" @click="bitAll">全选</el-button>
                <el-button type="text" size="mini" @click="bitClear">清空</el-button>
              </div>
              <el-checkbox-group v-model="bitList" size="small" class="num">
                <el-checkbox-button v-for="num in numList" :label="num" :key="num">{{ num }}</el-checkbox-button>
              </el-checkbox-group>
            </div>
            <div class="numList">
              <div class="title">
                <span style="margin-right: 5px">十位:</span>
                <el-button type="text" size="mini" @click="tenAll">全选</el-button>
                <el-button type="text" size="mini" @click="tenClear">清空</el-button>
              </div>
              <el-checkbox-group v-model="tenList" size="small" class="num">
                <el-checkbox-button v-for="num in numList" :label="num" :key="num">{{ num }}</el-checkbox-button>
              </el-checkbox-group>
            </div>
            <div class="numList">
              <div class="title">
                <span style="margin-right: 5px">百位:</span>
                <el-button type="text" size="mini" @click="hunAll">全选</el-button>
                <el-button type="text" size="mini" @click="hunClear">清空</el-button>
              </div>
              <el-checkbox-group v-model="hundredList" size="small" class="num">
                <el-checkbox-button v-for="num in numList" :label="num" :key="num">{{ num }}</el-checkbox-button>
              </el-checkbox-group>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="rule-group">
          <div>
            <el-button class="rule" size="small" type="info" @click="showRule('jo')">奇偶</el-button>
            <el-button class="rule" size="small" type="info" @click="showRule('hz')">和值</el-button>
            <el-button class="rule" size="small" type="info" @click="showRule('kd')">跨度</el-button>
            <el-button class="rule" size="small" type="info" @click="showRule('lmh')">两码和</el-button>
            <el-button class="rule" size="small" type="info" @click="showRule('lmc')">两码差</el-button>
            <el-button class="rule" size="small" type="info" @click="showRule('zdz')">最大值</el-button>
            <el-button class="rule" size="small" type="info" @click="showRule('zjz')">中间值</el-button>
            <el-button class="rule" size="small" type="info" @click="showRule('zxz')">最小值</el-button>
          </div>
          <div>
            <el-button class="rule" size="small" type="info" @click="showRule('dzx')">大中小</el-button>
            <el-button class="rule" size="small" type="info" @click="showRule('012l')">012路</el-button>
            <el-button class="rule" size="small" type="info" @click="showRule('dmz')">胆码组</el-button>
          </div>
        </div>
        <div class="rule-check">
          <div v-for="(item,index) in checkRules" :key="item.id">
            <div class="rule-item">
              <div class="top">
                <div>
                  <span>【{{ index + 1 }}】{{ item.title }}</span>
                </div>
                <div>
                  <el-checkbox v-model="item.ignore" v-if="item.label!='dmz'" @change="changeIg"
                               style="margin-right: 10px">容错
                  </el-checkbox>
                  <el-button type="warning" size="small" @click="changeRule(index)">修改</el-button>
                  <el-button type="danger" size="small" @click="delRule(index)">移除</el-button>
                </div>
              </div>
              <div v-if="item.type === 'normal'">
                <span>选定值:{{ item.checks }}</span>
              </div>
              <div v-else-if="item.type === 'dmz'">
                <div v-for="(child,index) in item.checks" :key="index">
                  <span style="margin-right: 5px">{{ child.label }}:</span>
                  <span style="margin-right: 10px">{{ child.values }}</span>
                  <span style="margin-right: 5px">出现次数:</span>
                  <span>{{ child.counts }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      </el-col>
      <el-col :span="12" class="top-right">
        <div class="operate">
          <el-button type="primary" :loading="loading" @click="getResult">获取结果</el-button>
          <el-button type="warning" @click="saveConfig">保存条件</el-button>
          <el-button type="warning" :disabled="!resultList.length" @click="copyResult">复制结果</el-button>
        </div>
        <div class="data">
          <el-table
              :data="resultList"
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
        :title="normalRule.title"
        :visible.sync="normalRule.show"
        width="80%"
        center>
      <div>
        <div v-if="normalRule.ruleTip" style="padding-bottom: 5px"><span>{{ normalRule.ruleTip }}:</span></div>
        <el-checkbox-group v-model="normalRule.checks" size="mini">
          <el-checkbox-button v-for="(item,index) in normalRule.valList" :label="item" :key="index">
            {{ item }}
          </el-checkbox-button>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="cancelRule('normal')">取 消</el-button>
      <el-button type="primary" @click="saveNormalRule">确 定</el-button>
    </span>
    </el-dialog>

    <el-dialog
        :title="dmzRule.title"
        :visible.sync="dmzRule.show"
        width="90%"
        center>
      <div>
        <div class="item-rule" v-for="(rule,index) in dmzRule.checks" :key="index">
          <div class="title"><span>{{ rule.label }}:</span></div>
          <el-checkbox-group v-model="rule.values" size="mini">
            <el-checkbox-button v-for="num in 10" :label="num-1" :key="num">
              {{ num - 1 }}
            </el-checkbox-button>
          </el-checkbox-group>
          <div class="title"><span>出现:</span></div>
          <el-checkbox-group v-model="rule.counts" size="mini">
            <el-checkbox v-for="count in 4" :label="count-1" :key="count-1">{{ count - 1 }}次</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="cancelRule('dmz')">取 消</el-button>
      <el-button type="primary" @click="saveDmzRule">确 定</el-button>
    </span>
    </el-dialog>

  </div>
</template>

<script>
import {filterCodes, getIgCounts, getNumDirect, getNumGroup, getNumObjByCodes, getSeqArr} from './utils/index'

const allNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const allType = ['豹子', '组三', '组六', '顺子', '半顺', '杂六']
const allJiOu = ['3奇', '2奇1偶', '1奇2偶', '3偶']
const allDzx = ['大大大', '大大中', '大中中', '中中中', '中中小', '中小小', '小小小', '大大小', '大小小']
const all012l = ['000', '001', '011', '111', '112', '122', '222', '002', '022']
export default {
  name: 'App',
  data() {
    return {
      loading: false,
      exporting: false,
      numList: allNum,
      bitList: allNum,
      tenList: allNum,
      hundredList: allNum,
      groupList: allNum,
      groupTypes: allType,
      activeTab: 'group',
      resultList: [],
      checkRules: [],
      igMin: 0,
      igMax: 0,
      normalRule: {
        show: false,
        ruleTip: null,
        title: null,
        label: '',
        valList: [],
        id: null,
        checks: []
      },
      dmzRule: {
        show: false,
        title: '',
        label: '',
        id: null,
        checks: [
          {label: '', values: [], counts: []},
          {label: '', values: [], counts: []},
          {label: '', values: [], counts: []},
        ]
      },
      savePath: ''
    }
  },
  computed: {
    isGroup() {
      return this.activeTab === 'group'
    },
    igNum() {
      return this.checkRules.reduce((pre, cur) => cur.ignore ? pre + 1 : pre, 0)
    }
  },
  methods: {
    bitAll() {
      this.bitList = allNum
    },
    bitClear() {
      this.bitList = []
    },
    tenAll() {
      this.tenList = allNum
    },
    tenClear() {
      this.tenList = []
    },
    hunAll() {
      this.hundredList = allNum
    },
    hunClear() {
      this.hundredList = []
    },
    groupAll() {
      this.groupList = allNum
    },
    groupClear() {
      this.groupList = []
    },
    tabClick() {
      if (this.isGroup) {
        this.bitList = allNum
        this.tenList = allNum
        this.hundredList = allNum
      } else {
        this.groupList = allNum
      }
      this.resultList = []
    },
    getResult() {
      this.loading = true
      let codeList
      if (this.isGroup) {
        codeList = getNumGroup(this.groupList, this.groupTypes)
      } else {
        codeList = getNumDirect(this.bitList, this.tenList, this.hundredList)
      }
      let igCounts = getIgCounts(this.igMin, this.igMax) // 默认0-0无容错
      let filteredCodeList = filterCodes(codeList, this.checkRules, igCounts)
      this.resultList = getNumObjByCodes(filteredCodeList)
      this.loading = false
      this.$message.success("结果计算成功");
    },
    delCode(row) {
      let index = this.resultList.findIndex(item => item.code === row.code)
      this.resultList.splice(index, 1)
    },
    delRule(index) {
      this.checkRules.splice(index, 1)
    },
    showRule(label) {
      if (label === 'jo') {
        this.normalRule.show = true
        this.normalRule.label = label
        this.normalRule.title = '奇偶'
        this.normalRule.valList = structuredClone(allJiOu)
      } else if (label === 'hz') {
        this.normalRule.show = true
        this.normalRule.label = label
        this.normalRule.title = '和值'
        this.normalRule.valList = getSeqArr(27)
      } else if (label === 'kd') {
        this.normalRule.show = true
        this.normalRule.label = label
        this.normalRule.title = '跨度'
        this.normalRule.valList = getSeqArr(9)
      } else if (label === 'lmh') {
        this.normalRule.show = true
        this.normalRule.label = label
        this.normalRule.title = '两码和'
        this.normalRule.valList = getSeqArr(18)
      } else if (label === 'lmc') {
        this.normalRule.show = true
        this.normalRule.label = label
        this.normalRule.title = '两码差'
        this.normalRule.valList = getSeqArr(9)
      } else if (label === 'zdz') {
        this.normalRule.show = true
        this.normalRule.label = label
        this.normalRule.title = '最大值'
        this.normalRule.valList = getSeqArr(9)
      } else if (label === 'zjz') {
        this.normalRule.show = true
        this.normalRule.label = label
        this.normalRule.title = '中间值'
        this.normalRule.valList = getSeqArr(9)
      } else if (label === 'zxz') {
        this.normalRule.show = true
        this.normalRule.label = label
        this.normalRule.title = '最小值'
        this.normalRule.valList = getSeqArr(9)
      } else if (label === 'dzx') {
        this.normalRule.show = true
        this.normalRule.label = label
        this.normalRule.title = '大中小'
        this.normalRule.valList = structuredClone(allDzx)
      } else if (label === '012l') {
        this.normalRule.show = true
        this.normalRule.label = label
        this.normalRule.title = '012路'
        this.normalRule.valList = structuredClone(all012l)
      } else if (label === 'dmz') {
        this.dmzRule.show = true
        this.dmzRule.label = label
        this.dmzRule.title = '胆码组'
        this.dmzRule.checks[0].label = '胆组1'
        this.dmzRule.checks[1].label = '胆组2'
        this.dmzRule.checks[2].label = '胆组3'
      }
    },
    changeRule(index) {
      let checkRule = this.checkRules[index];
      if (checkRule.type === 'normal') {
        this.normalRule.id = checkRule.id
        this.normalRule.checks = structuredClone(checkRule.checks)
        this.showRule(checkRule.label)
      } else if (checkRule.type === 'dmz') {
        this.dmzRule.id = checkRule.id
        this.dmzRule.checks = structuredClone(checkRule.checks)
        this.showRule(checkRule.label)
      }
    },
    changeIg(checked) {
      if (!checked) {
        if (this.igMin > this.igNum || this.igMax > this.igNum) {
          this.igMin = 0
          this.igMax = 0
        }
      }
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
    cancelRule(type) {
      if (type === 'normal') {
        Object.assign(this.$data.normalRule, this.$options.data().normalRule)
      } else if (type === 'dmz') {
        Object.assign(this.$data.dmzRule, this.$options.data().dmzRule)
      }
    },
    saveNormalRule() {
      if (this.normalRule.checks.length === 0) {
        this.$message.warning('至少需要选择一个条件才能保存!')
      } else {
        if (this.normalRule.id) {
          let rule = this.checkRules.find(item => item.id === this.normalRule.id)
          rule.checks = this.normalRule.checks
        } else {
          let rule = {
            id: Date.now(),
            title: this.normalRule.title,
            label: this.normalRule.label,
            type: 'normal',
            ignore: false,
            checks: this.normalRule.checks
          }
          this.checkRules.push(rule)
        }
        Object.assign(this.$data.normalRule, this.$options.data().normalRule)
      }
    },
    saveDmzRule() {
      if (this.dmzRule.checks[0].values.length === 0 &&
          this.dmzRule.checks[1].values.length === 0 &&
          this.dmzRule.checks[2].values.length === 0
      ) {
        this.$message.warning('至少需要选择一个条件才能保存!')
        return
      }
      if ((this.dmzRule.checks[0].values.length !== 0 &&
              this.dmzRule.checks[0].counts.length === 0) ||
          (this.dmzRule.checks[1].values.length !== 0 &&
              this.dmzRule.checks[1].counts.length === 0) ||
          (this.dmzRule.checks[2].values.length !== 0 &&
              this.dmzRule.checks[2].counts.length === 0)
      ) {
        this.$message.warning('胆组出现个数必选')
        return
      }
      if (this.dmzRule.id) {
        let rule = this.checkRules.find(item => item.id === this.dmzRule.id)
        rule.checks[0].values = this.dmzRule.checks[0].values
        rule.checks[0].counts = this.dmzRule.checks[0].counts
        rule.checks[1].values = this.dmzRule.checks[1].values
        rule.checks[1].counts = this.dmzRule.checks[1].counts
        rule.checks[2].values = this.dmzRule.checks[2].values
        rule.checks[2].counts = this.dmzRule.checks[2].counts
      } else {
        let rule = {
          id: Date.now(),
          title: this.dmzRule.title,
          label: this.dmzRule.label,
          type: 'dmz',
          ignore: false,
          checks: this.dmzRule.checks
        }
        this.checkRules.push(rule)
      }
      Object.assign(this.$data.dmzRule, this.$options.data().dmzRule)
    },
    saveConfig() {
      let config = {
        rule: this.checkRules,
        hun: this.hundredList,
        ten: this.tenList,
        bit: this.bitList,
        group: this.groupList,
        groupType: this.groupTypes,
        igMin: this.igMin,
        igMax: this.igMax,
        savePath: this.savePath
      }
      window.electron.setConfig('config', config)
      this.$message.success('保存条件成功')
    },
    copyResult() {
      if (this.resultList.length === 0) {
        this.$message.error('结果为空无法复制')
        return
      }
      let orderObjList = this.$refs.table.tableData
      let copyList = []
      for (let obj of orderObjList) {
        copyList.push(obj.code)
      }
      window.electron.copy2Clipboard(copyList.join(' '))
      this.$message.success(`已复制${copyList.length}个结果`)
    }
  },
  mounted() {
    window.electron.getConfig('config').then(config => {
      console.log('读取到系统配置:', config)
      if (!config) config = {}
      this.checkRules = config.rule || []
      this.hundredList = config.hun || []
      this.tenList = config.ten || []
      this.bitList = config.bit || []
      this.groupList = config.group || []
      this.groupTypes = config.groupType || []
      this.igMin = config.igMin || 0
      this.igMax = config.igMax || 0
      this.savePath = config.savePath
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
}

.top-right {
  .operate {
    margin: 10px;
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
