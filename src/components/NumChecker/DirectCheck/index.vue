<script>
import { allNum } from "@/config";

export default {
  name: "DirectCheck",
  data() {
    return {
      numList: allNum,
    };
  },
  computed: {
    bitList: {
      get() {
        return this.$store.state.bitList;
      },
      set(newList) {
        this.$store.commit("CHANGE_BIT_LIST", newList);
      },
    },
    tenList: {
      get() {
        return this.$store.state.tenList;
      },
      set(newList) {
        this.$store.commit("CHANGE_TEN_LIST", newList);
      },
    },
    hundredList: {
      get() {
        return this.$store.state.hundredList;
      },
      set(newList) {
        this.$store.commit("CHANGE_HUN_LIST", newList);
      },
    },
  },
  methods: {
    bitAll() {
      this.$store.commit("CHANGE_BIT_LIST", structuredClone(allNum))
    },
    bitClear() {
      this.$store.commit("CHANGE_BIT_LIST", [])
    },
    bitReverse(){
      this.$store.commit("CHANGE_BIT_LIST", allNum.filter(num => this.bitList.indexOf(num) === -1))
    },
    tenAll() {
      this.$store.commit("CHANGE_TEN_LIST", structuredClone(allNum))
    },
    tenClear() {
      this.$store.commit("CHANGE_TEN_LIST", [])
    },
    tenReverse(){
      this.$store.commit("CHANGE_TEN_LIST", allNum.filter(num => this.tenList.indexOf(num) === -1))
    },
    hunAll() {
      this.$store.commit("CHANGE_HUN_LIST", structuredClone(allNum))
    },
    hunClear() {
      this.$store.commit("CHANGE_HUN_LIST", [])
    },
    hunReverse(){
      this.$store.commit("CHANGE_HUN_LIST", allNum.filter(num => this.hundredList.indexOf(num) === -1))
    },
  },
};
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
          <el-checkbox-button v-for="num in numList" :label="num" :key="num"
          >{{ num }}
          </el-checkbox-button>
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
          <el-checkbox-button v-for="num in numList" :label="num" :key="num"
          >{{ num }}
          </el-checkbox-button>
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
          <el-checkbox-button v-for="num in numList" :label="num" :key="num"
            >{{ num }}
          </el-checkbox-button>
        </el-checkbox-group>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.numList {
  margin-bottom: 10px;

  .checker-name {
    font-size: 16px;
    margin-right: 5px;
    font-weight: bold;
  }
}
</style>
