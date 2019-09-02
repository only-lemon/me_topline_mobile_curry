import Vue from 'vue'
import App from './App.vue'
import router from '@/router/router'
import Vant from 'vant'
import 'vant/lib/index.css'
import store from '@/store/store'
import '@/style/common_style.css'
import { relativeTime } from '@/utility/dayjs'
import fastClick from 'fastclick'

// 使用 fastClick 解决移动端 300ms 延迟问题
fastClick.attach(document.body)

Vue.filter('relativeTime', relativeTime)

// 每每要想在Vue项目中使用一个插件进来必须先use注册一下
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
