<script setup lang="ts">
import NumChecker from '@/components/NumChecker/index.vue'
import ResultShow from '@/components/ResultShow/index.vue'
import ResultOperator from '@/components/ResultOperator/index.vue'
import RuleOption from '@/components/RuleOption/index.vue'
</script>

<template>
  <div class="main">
    <div class="title">
      <h3>福彩3d选号助手</h3>
    </div>
    <div class="content">
      <el-row>
        <el-col :span="12" class="left-checker">
          <NumChecker />
          <RuleOption />
        </el-col>
        <el-col :span="12" class="right-result">
          <ResultOperator />
          <ResultShow />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
  background: #0e86c2;
  height: 50px;
  line-height: 50px;
  color: white;
  font-size: 20px;
}

.content {
  margin: 20px;
}

.left-checker {
  padding-right: 50px;
}
</style>
