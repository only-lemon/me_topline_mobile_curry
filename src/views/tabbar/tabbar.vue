<template>
  <div class="tabbar_container">
    <!-- 更灵活的方式,,,组件缓存 -->

    <keep-alive :include="['home']">
      <router-view></router-view>
    </keep-alive>

    <!-- /更灵活的方式,,,组件缓存 -->

    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="chat">问答</van-tabbar-item>
      <van-tabbar-item icon="video">视频</van-tabbar-item>
      <van-tabbar-item icon="manager" to="/user_center">{{ user ? '我的' : '未登录' }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'tabbar',
  data () {
    return {
      active: 0
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
</style>
