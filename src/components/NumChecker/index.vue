<script>
import DirectCheck from "@/components/NumChecker/DirectCheck/index.vue";
import GroupCheck from "@/components/NumChecker/GroupCheck/index.vue";

export default {
  name: "NumChecker",
  components: { GroupCheck, DirectCheck },
  data() {
    return {
      activeTab: "group",
    };
  },
  watch: {
    activeTab(newVal) {
      this.$store.commit("CHANGE_CHECK_TAB", newVal);
    },
  },
};
</script>

<template>
  <div class="num-checker">
    <el-tabs v-model="activeTab" class="check">
      <el-tab-pane label="组选" name="group">
        <group-check />
      </el-tab-pane>
      <el-tab-pane label="直选" name="direct">
        <direct-check />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.num-checker {
  margin-bottom: 5px;
}
</style>
