import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(ElementUI);
new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
