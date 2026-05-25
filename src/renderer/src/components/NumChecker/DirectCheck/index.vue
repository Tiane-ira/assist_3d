<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores'
import { allNum } from '@/config'

const store = useAppStore()

const hundredList = computed({
  get: () => store.hundredList,
  set: (val: string[]) => store.changeHunList(val)
})
const tenList = computed({
  get: () => store.tenList,
  set: (val: string[]) => store.changeTenList(val)
})
const bitList = computed({
  get: () => store.bitList,
  set: (val: string[]) => store.changeBitList(val)
})
const groupTypes = computed({
  get: () => store.groupTypes,
  set: (val: string[]) => store.changeGroupType(val)
})

function bitAll() { store.changeBitList(structuredClone(allNum)) }
function bitClear() { store.changeBitList([]) }
function bitReverse() { store.changeBitList(allNum.filter((num: string) => !store.bitList.includes(num))) }
function tenAll() { store.changeTenList(structuredClone(allNum)) }
function tenClear() { store.changeTenList([]) }
function tenReverse() { store.changeTenList(allNum.filter((num: string) => !store.tenList.includes(num))) }
function hunAll() { store.changeHunList(structuredClone(allNum)) }
function hunClear() { store.changeHunList([]) }
function hunReverse() { store.changeHunList(allNum.filter((num: string) => !store.hundredList.includes(num))) }
</script>

<template>
  <div class="direct-checker">
    <el-card>
      <div class="numList">
        <div class="operator">
          <span class="checker-name">百位:</span>
          <el-button type="text" size="medium" @click="hunAll">全选</el-button>
          <el-button type="text" size="medium" @click="hunClear">清空</el-button>
          <el-button type="text" size="medium" @click="hunReverse">反选</el-button>
        </div>
        <el-checkbox-group v-model="hundredList" size="small" class="num-box">
          <el-checkbox-button v-for="num in allNum" :label="num" :key="num">{{ num }}</el-checkbox-button>
        </el-checkbox-group>
      </div>
      <div class="numList">
        <div class="operator">
          <span class="checker-name">十位:</span>
          <el-button type="text" size="medium" @click="tenAll">全选</el-button>
          <el-button type="text" size="medium" @click="tenClear">清空</el-button>
          <el-button type="text" size="medium" @click="tenReverse">反选</el-button>
        </div>
        <el-checkbox-group v-model="tenList" size="small" class="num-box">
          <el-checkbox-button v-for="num in allNum" :label="num" :key="num">{{ num }}</el-checkbox-button>
        </el-checkbox-group>
      </div>
      <div class="numList">
        <div class="operator">
          <span class="checker-name">个位:</span>
          <el-button type="text" size="medium" @click="bitAll">全选</el-button>
          <el-button type="text" size="medium" @click="bitClear">清空</el-button>
          <el-button type="text" size="medium" @click="bitReverse">反选</el-button>
        </div>
        <el-checkbox-group v-model="bitList" size="small" class="num-box">
          <el-checkbox-button v-for="num in allNum" :label="num" :key="num">{{ num }}</el-checkbox-button>
        </el-checkbox-group>
      </div>
      <el-checkbox-group v-model="groupTypes" class="group-type">
        <el-checkbox label="豹子"></el-checkbox>
        <el-checkbox label="组三"></el-checkbox>
        <el-checkbox label="组六"></el-checkbox>
        <el-checkbox label="顺子"></el-checkbox>
        <el-checkbox label="半顺"></el-checkbox>
        <el-checkbox label="杂六"></el-checkbox>
      </el-checkbox-group>
    </el-card>
  </div>
</template>

<style scoped>
.numList {
  margin-bottom: 10px;
}

.numList .checker-name {
  font-size: 16px;
  margin-right: 5px;
  font-weight: bold;
}

.num-box {
  margin-bottom: 20px;
}
</style>
