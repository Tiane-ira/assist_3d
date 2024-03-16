<script>
export default {
  name: "OrderCheck",
  data() {
    return {
      orderType: false,
    };
  },
  watch: {
    orderType() {
      this.$store.commit("CHANGE_ORDER_TYPE");
    },
  },
};
</script>

<template>
  <div class="order-type">
    <el-checkbox v-model="orderType">交叉排列</el-checkbox>
  </div>
</template>

<style scoped>
.order-type {
  margin-left: 15px;
}
</style>
