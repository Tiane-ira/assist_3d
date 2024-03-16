import Vue from "vue";
import App from "./App.vue";
import store from "@/store";
import ElementUI, { Message } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);
Vue.prototype.$message = Message;

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
