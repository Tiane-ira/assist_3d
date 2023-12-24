<template>
  <div class="numList">
    <div class="title">
      <span style="margin-right: 5px">{{ title }}:</span>
      <el-button size="mini" @click="checkAll">全选</el-button>
      <el-button size="mini" @click="clearAll">清空</el-button>
    </div>
    <el-checkbox-group v-model="checkNums" size="small" class="num">
      <el-checkbox-button v-for="bit in numList" :label="bit" :key="bit">{{ bit }}</el-checkbox-button>
    </el-checkbox-group>
  </div>
</template>

<script>
const allNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
import {} from 'vuex'
export default {
  name: "NumList",
  props: ['type', 'checkNums'],
  data() {
    return {
      numList: allNum,
    }
  },
  computed: {
    title() {
      if (this.type === '1') {
        return '个位'
      } else if (this.type === '2') {
        return '十位'
      } else if (this.type === '3') {
        return '百位'
      } else {
        return '组选'
      }
    }
  },
  methods:{
    checkAll(){
      this.$store.dispatch('checkAll',this.type)
    },
    clearAll(){
      this.$store.dispatch('clearAll',this.type)
    }
  }
}
</script>

<style scoped>
.numList {
  margin: 5px;

  .title {
    margin-bottom: 5px;

  }
}
</style>