<template>
  <div class="login_container">
    <van-nav-bar title="登 录" />
    <van-cell-group>
      <van-field v-model="user.mobile" required clearable label="手机号" placeholder="请输入手机号" />

      <van-field v-model="user.code" type="text" label="验证码" placeholder="请输入验证码" required />
    </van-cell-group>
    <van-button type="warning" :loading="isLoginLoading" @click="login()">登 录</van-button>
  </div>
</template>

<script>
import { login } from '@/api/request_user'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      user: {
        mobile: '16600286830',
        code: '246810'
      },
      isLoginLoading: false
    }
  },

  methods: {
    ...mapMutations(['setUser']),

    // 登录按钮点击触发的事件对应的方法
    async login () {
      // 发送登录请求
      try {
        this.isLoginLoading = true
        const {
          data: { data: userToken }
        } = await login(this.user)

        // 存userToken 存到vuex容器当中去
        this.setUser(userToken)

        // 跳转到首页
        this.$router.push({ name: 'home' })
      } catch (err) {
        if (err.response && err.response.status === 400) {
          // 登录失败,后端响应状态码为400 ,提示用户错误信息
          this.$toast.fail('手机号或验证码错误')
        }
      }

      // console.log('登录成功')
      // 去封装请求的apI去...   已封装完毕
      // 请求回来用用户token信息

      this.isLoginLoading = false
    }

    // utility目录中  去配置好axios发送请求前的一些操作,只负责配置,不在此发送请求,发送请求操作,去apI目录下进行封装
    // 老师写的把存用户token的方法也封装到了工具utility目录下了,我想这应该无所谓,因为这也算是个存用户token的apI
    // 所以我就把它放到apI目录下去,apI目录下不只是存放请求相关的apI,任何操作的apI都是可以放到apI目录下的
    // 如果你把apI理解成一个工具,name你就把它放在utility目录下,
    // 如果你把apI理解成一个apI接口的话,name你就把它放在apI目录下,,,
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  background: plum;
  .van-nav-bar__title {
    color: white;
  }
}
.van-button {
  margin-top: 20px;
  display: inline-block;
  // 此两条语句控制达到和原型图一样的效果,我偏不这么写,我偏100%
  // 就这么傲娇
  // width: 90%;
  // margin-left: 5%;
  width: 100%;
}
</style>
