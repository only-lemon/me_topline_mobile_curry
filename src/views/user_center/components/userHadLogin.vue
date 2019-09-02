<template>
  <van-cell-group class="user-info" @click="$router.push({ path: 'user_edit' })">
    <van-cell class="base-info" is-link :border="false">
      <div slot="title">
        <img class="avatar" :src="userInfo.photo" alt="">
        <span class="title">{{ userInfo.name }}</span>
      </div>
    </van-cell>
    <van-grid class="data-info" :border="false">
      <van-grid-item>
        <span class="count">{{ userInfo.art_count }}</span>
        <span class="text">头条</span>
      </van-grid-item>
      <van-grid-item>
        <span class="count">{{ userInfo.follow_count }}</span>
        <span class="text">关注</span>
      </van-grid-item>
      <van-grid-item>
        <span class="count">{{ userInfo.fans_count }}</span>
        <span class="text">粉丝</span>
      </van-grid-item>
      <van-grid-item>
        <span class="count">{{ userInfo.like_count }}</span>
        <span class="text">获赞</span>
      </van-grid-item>
    </van-grid>
  </van-cell-group>
</template>

<script>
import { getSelf } from '@/api/request_user'

export default {
  name: 'UserInfo',
  data () {
    return {
      userInfo: {}
    }
  },

  created () {
    this.loadUserInfo()
  },

  methods: {
    async loadUserInfo () {
      const { data } = await getSelf()
      this.userInfo = data.data
    }
  }
}
</script>

<style lang="less">
.user-info {
  .base-info {
    display: flex;
    align-items: center;
    div {
      display: flex;
      align-items: center
    }
    .avatar {
      margin-right: 15px;
      width: 50px;
      border-radius: 100%;
    }
  }
  .data-info {
    .text {
      font-size: 14px;
    }
    .count {
      font-size: 12px;
    }
  }
}
</style>
