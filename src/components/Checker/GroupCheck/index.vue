<script>
import {allNum, allType} from "@/config";

export default {
  name: "GroupCheck",
  data() {
    return {
      numList: allNum,
      groupList: allNum,
      groupTypes: allType
    }
  },
  watch: {
    groupList: {
      deep: true,
      handler(newList) {
        this.$store.commit('CHANGE_GROUP_LIST', newList)
      }
    },
    groupTypes: {
      deep: true,
      handler(newList) {
        this.$store.commit('CHANGE_GROUP_TYPE', newList)
      }
    }
  },
  methods: {
    groupAll() {
      this.groupList = allNum
    },
    groupClear() {
      this.groupList = []
    }
  },
}
</script>

<template>
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
</template>

<style scoped>

</style>