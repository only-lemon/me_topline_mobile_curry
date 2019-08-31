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
import SEARCH from '@/views/search/search'
import SEARCHRESULT from '@/views/search_result/search_result'
import ARTICLE_DETAIL from '@/views/article_detail/article_detail'
// import mapMutations from "@/store/store"
// import { getUser } from '@/api/storage_user_token'

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
    { path: '/meTestImExport', name: 'test', component: TEST },

    // 配置搜索组件的路由规则
    { path: '/search', name: 'search', component: SEARCH },

    // 配置点击搜索按钮后跳转到搜索结果页面的路由规则
    // 解释: path: "/search" 和 path: "/search/120" 和 path: "/search/hello" 是三个路由规则是不同的路由是不同的路径地址
    // 所以 要想当path路径不同的情况下却想要对应上同一个组件时,就需要用到动态路由这一概念了,,,
    // 下面的写法就是动态路由  : 冒号后面的 是key  我们通过路径传参 传过来的就是value  就会被key绑定 key就会截取路径上对应的位置上的值,从而导致路径是没有被截取的那部分,
    // 从而就达到了path路径不同的情况下对应上同一个组件了,,,
    { path: '/search/:keyword', name: 'searchResult', component: SEARCHRESULT },

    // 配置文章详情页路由规则
    { path: '/article_detail/:articleID', name: 'articleDetail', component: ARTICLE_DETAIL }

  ]
})

// 配置拦截未登录路由跳转
// 导航守卫,,,每次路由跳转前要做的事情在此去做!!!

// 暂时需要把导航守卫注释掉,因为当前项目的业务逻辑中,,,是可以在不登录的状态下浏览新闻去做一些事情的,,,

// router.beforeEach((to, from, next) => {
//   // ${//to and from are Route Object,next() must be called to resolve the hook}
//   // 如果你不是去登录页,但是你还没登录(但是你还没有登录的用户信息,,,但是你还没有token(就代表你还没登录))  --->  你就给我去登录页
//   // getUser.token === undefined  说明没有token  取反 取非 !  --->  true   ---> 走if为true
//   // getUSer.token === "xxxxxxxxxx" 说明有token  取反 取非 !  --->  false  ---> 走if的else
//   if (to.path !== '/login' && !getUser().token) return next('/login')
//   next()
// })

export default router
