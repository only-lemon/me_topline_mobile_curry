/**           配置路由规则模块
 *
 *    Author  : 崔文情
 *    Date    : 2019/8/23 08:30 Fri
 *    Email   : 2865653500@qq.com
 *    Version : V1.0.0
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import HOME from '@/views/home/home'
import LOGIN from '@/views/login/login'
import TEST from '@/me_test_export_import/me_test_export_import_for_import'
import IS404 from '@/views/404/404'
import TABBAR from '@/views/tabbar/tabbar'
// import mapMutations from "@/store/store"
import { getUser } from '@/api/storage_user_token'

Vue.use(VueRouter)

// 创建路由管理器的对象router
const router = new VueRouter({
  // 配置me_topline_mobile_curry 路由规则
  routes: [
    // 配置404路由规则
    { path: '*', name: '_404', component: IS404 },

    {
      path: '/',
      // name: 'tabbar',
      component: TABBAR,
      children: [
        { path: '/', name: 'home', component: HOME }
      ]
    },
    { path: '/login', name: 'login', component: LOGIN },
    // 此路由跟项目完全没关系,,,我是为了测试导入导出的现象配置的路由规则
    { path: '/meTestImExport', name: 'test', component: TEST }
  ]
})

// 配置拦截未登录路由跳转
// 导航守卫,,,每次路由跳转前要做的事情在此去做!!!
router.beforeEach((to, from, next) => {
  // ${//to and from are Route Object,next() must be called to resolve the hook}
  // 如果你不是去登录页,但是你还没登录(但是你还没有登录的用户信息,,,但是你还没有token(就代表你还没登录))  --->  你就给我去登录页
  // getUser.token === undefined  说明没有token  取反 取非 !  --->  true   ---> 走if为true
  // getUSer.token === "xxxxxxxxxx" 说明有token  取反 取非 !  --->  false  ---> 走if的else
  if (to.path !== '/login' && !getUser().token) return next('/login')
  next()
})

export default router
