import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'



import ol from 'openlayers';
import 'openlayers/css/ol.css'
Vue.prototype.$ol = ol;

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
