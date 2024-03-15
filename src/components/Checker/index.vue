<script>
import DirectCheck from "@/components/Checker/DirectCheck/index.vue";
import GroupCheck from "@/components/Checker/GroupCheck/index.vue";

export default {
  name: "NumChecker",
  components: {GroupCheck, DirectCheck},
  data() {
    return {
      activeTab: 'group',
    }
  },
  watch: {
    activeTab(newVal) {
      this.$store.commit('CHANGE_CHECK_TAB',newVal)
    }
  }
}
</script>

<template>
  <div>
    <el-tabs v-model="activeTab" class="check">
      <el-tab-pane label="组选" name="group">
        <group-check/>
      </el-tab-pane>
      <el-tab-pane label="直选" name="direct">
        <direct-check/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>

</style>