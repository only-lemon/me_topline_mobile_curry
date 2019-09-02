<template>
  <div class="tabbar_container">
    <router-view></router-view>
    <van-tabbar v-model="active" route >
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
