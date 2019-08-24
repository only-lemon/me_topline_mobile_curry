import Vue from 'vue'
import App from './App.vue'
import router from '@/router/router'
import Vant from 'vant'
import 'vant/lib/index.css'
import store from '@/store/store'

// 每每要想在Vue项目中使用一个插件进来必须先use注册一下
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
