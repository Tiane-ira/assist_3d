<script>
export default {
  name: "IgnoreErrorCheck",
  data() {
    return {};
  },
  computed: {
    igNum() {
      return this.$store.getters.igNum;
    },
    igMin: {
      get() {
        return this.$store.state.igMin;
      },
      set(newVal) {
        this.$store.commit("CHANGE_IG_MIN", newVal);
      },
    },
    igMax: {
      get() {
        return this.$store.state.igMax;
      },
      set(newVal) {
        this.$store.commit("CHANGE_IG_MAX", newVal);
      },
    },
  },
  methods: {},
};
</script>

<template>
  <div class="ignore-check">
    <el-form ref="form" inline label-width="100px">
      <el-form-item label="最小容错数:">
        <el-select
          v-model="igMin"
          :disabled="!igNum"
          placeholder="最小容错"
          size="small"
        >
          <el-option
            v-for="n in igNum + 1"
            :key="n"
            :label="n - 1"
            :value="n - 1"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最大容错数: ">
        <el-select
          v-model="igMax"
          :disabled="!igNum"
          placeholder="最大容错"
          size="small"
        >
          <el-option
            v-for="n in igNum + 1"
            :key="n"
            :label="n - 1"
            :value="n - 1"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.ignore-check {
  margin-top: 10px;
}
</style>
