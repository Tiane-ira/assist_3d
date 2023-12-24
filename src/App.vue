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
              <el-checkbox-group v-model="groupTypes" class="group-type">
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
          <el-button class="rule" size="small" type="info">奇偶</el-button>
          <el-button class="rule" size="small" type="info">和值</el-button>
          <el-button class="rule" size="small" type="info">跨度</el-button>
          <el-button class="rule" size="small" type="info">两码和</el-button>
          <el-button class="rule" size="small" type="info">两码差</el-button>
          <el-button class="rule" size="small" type="info">012路</el-button>
          <el-button class="rule" size="small" type="info">大中小</el-button>
        </div>
        <div class="rule-check">
          <div v-for="(item,index) in checkRules" :key="index">
            <div class="rule-item">
              <div class="top">
                <div>
                  <span>【{{ index + 1 }}】{{ item.name }}</span>
                </div>
                <div>
                  <el-button type="warning" size="small">修改</el-button>
                  <el-button type="danger" size="small">移除</el-button>
                  <el-button type="danger" size="small">容错</el-button>
                </div>
              </div>
              <div>
                <span>选定值:{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12" class="top-right">
        <div class="data">
          <el-table
              :data="resultList"
              max-height="400"
              style="width: 100%;"
              :border="true"
              :header-cell-style="{'text-align':'center'}"
              :default-sort="{prop: 'code', order: 'descending'}"
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
                prop="abs"
                sortable
                label="跨度"
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
        </div>
      </el-col>
    </el-row>
    <div>
      <el-button @click="getResult">获取结果</el-button>
    </div>
  </div>
</template>

<script>
import {getNumDirect, getNumGroup} from './utils/index'

const allNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
export default {
  name: 'App',
  data() {
    return {
      numList: allNum,
      bitList: allNum,
      tenList: allNum,
      hundredList: allNum,
      groupList: allNum,
      groupTypes: ['半顺'],
      activeTab: 'group',
      resultList: [],
      checkRules: [
        {name: '和值', ignore: false, value: [7, 8, 9]},
        {name: '和值', ignore: false, value: [7, 8, 9]},
      ]
    }
  },
  computed: {
    isGroup() {
      return this.activeTab === 'group'
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
      if (this.isGroup) {
        this.resultList = getNumGroup(this.groupList, this.groupTypes)
      } else {
        this.resultList = getNumDirect(this.bitList, this.tenList, this.hundredList)
      }
    },
    delCode(row) {
      let index = this.resultList.findIndex(item => item.code === row.code)
      this.resultList.splice(index, 1)
    }
  },
  mounted() {

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

.data {
  margin-left: 50px;
  margin-right: 50px;
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

</style>
