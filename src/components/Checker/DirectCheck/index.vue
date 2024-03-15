<script>
import {allNum} from "@/config";

export default {
  name: "DirectCheck",
  data() {
    return {
      numList: allNum,
      bitList: allNum,
      tenList: allNum,
      hundredList: allNum,
    }
  },
  watch: {
    bitList: {
      deep: true,
      handler(newList) {
        this.$store.commit('CHANGE_BIT_LIST', newList)
      }
    },
    tenList: {
      deep: true,
      handler(newList) {
        this.$store.commit('CHANGE_TEN_LIST', newList)
      }
    },
    hundredList: {
      deep: true,
      handler(newList) {
        this.$store.commit('CHANGE_HUN_LIST', newList)
      }
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
    }
  }
}
</script>

<template>
  <div>
    <div class="numList">
      <div class="title">
        <span style="margin-right: 5px">个位:</span>
        <el-button type="text" size="mini" @click="bitAll">全选</el-button>
        <el-button type="text" size="mini" @click="bitClear">清空</el-button>
      </div>
      <el-checkbox-group v-model="bitList" size="small" class="num" @change="changeBitList">
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
  </div>
</template>

<style scoped>

</style>