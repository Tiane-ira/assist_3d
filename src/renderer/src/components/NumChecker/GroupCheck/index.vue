<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores'
import { allNum } from '@/config'

const store = useAppStore()

const groupList = computed({
  get: () => store.groupList,
  set: (val: string[]) => store.changeGroupList(val)
})

const groupTypes = computed({
  get: () => store.groupTypes,
  set: (val: string[]) => store.changeGroupType(val)
})

function groupAll() { store.changeGroupList(structuredClone(allNum)) }
function groupClear() { store.changeGroupList([]) }
</script>

<template>
  <div class="group-checker">
    <el-card>
      <div class="operator">
        <span class="checker-name">组选:</span>
        <el-button size="medium" type="text" @click="groupAll">全选</el-button>
        <el-button size="medium" type="text" @click="groupClear">清空</el-button>
      </div>
      <el-checkbox-group v-model="groupList" class="num-box" size="small">
        <el-checkbox-button v-for="num in allNum" :key="num" :label="num">{{ num }}</el-checkbox-button>
      </el-checkbox-group>
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
.checker-name {
  font-size: 16px;
  margin-right: 5px;
  font-weight: bold;
}

.num-box {
  margin-bottom: 20px;
}
</style>
