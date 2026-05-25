<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores'

const store = useAppStore()
const igNum = computed(() => store.igNum)

const igMin = computed({
  get: () => store.igMin,
  set: (val: number) => store.changeIgMin(val)
})

const igMax = computed({
  get: () => store.igMax,
  set: (val: number) => store.changeIgMax(val)
})
</script>

<template>
  <div class="ignore-check">
    <el-form inline label-width="90px" size="small">
      <el-form-item label="最小容错">
        <el-select v-model="igMin" :disabled="!igNum" placeholder="最小容错">
          <el-option v-for="n in igNum + 1" :key="n" :label="n - 1" :value="n - 1" />
        </el-select>
      </el-form-item>
      <el-form-item label="最大容错">
        <el-select v-model="igMax" :disabled="!igNum" placeholder="最大容错">
          <el-option v-for="n in igNum + 1" :key="n" :label="n - 1" :value="n - 1" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.ignore-check {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f1f3;
}
</style>
