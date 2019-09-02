<template>
  <div class="user_edit_container">
    <van-nav-bar
      title="个人信息"
      left-text="返回"
      left-arrow
      right-text="保存"
      @click-left="$router.back()"
      @click-right="save"
    />
    <van-cell-group>
      <van-cell title="头像" is-link @click="showFileSelect">
        <van-image round width="30" height="30" :src="userProfile.photo" />
      </van-cell>
      <van-cell title="昵称" is-link :value="userProfile.name" />
      <van-cell title="性别" is-link :value="userProfile.gender === 0 ? '男' : '女'" @click="isGenderShow = true"/>
      <van-cell title="生日" is-link :value="userProfile.birthday" />
    </van-cell-group>

    <!-- 存放文件的表单控件 -->
    <input hidden type="file" ref="file" @change="fileChange" />
    <!-- /存放文件的表单控件 -->

    <!-- 修改性别时的弹出菜单 -->
    <van-action-sheet
      v-model="isGenderShow"
      :actions="genderActions"
      @select="genderSelect"
    />

  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserBaseInfo } from '@/api/request_user'

export default {
  name: 'userEdit',
  data () {
    return {
      userProfile: {},
      isGenderShow: false,
      genderActions: [
        { name: '男', value: 0 },
        { name: '女', value: 1 }
      ]
    }
  },

  created () {
    this.laodUserProfile()
  },

  methods: {

    // 加载当前编辑的用户的信息
    async laodUserProfile () {
      const { data } = await getUserProfile()
      this.userProfile = data.data
    },

    // 点击头像的DOM触发别的(在此是input)DOM对象的事件
    showFileSelect () {
      this.$refs.file.click()
    },

    // 保存提交表单数据的方法
    async save () {
      console.log('提交用户编辑后的个人信息')
      try {
        if (!this.userProfile.photo.startsWith('http')) {
        // 更新用户头像
          await updateUserPhoto(this.$refs.file.files[0])
        }

        // 更新其它基本信息(name、gender、birthday)
        // 解构出来需要传递到后端的参数
        const { name, gender, birthday } = this.userProfile
        await updateUserBaseInfo({ // 传参 传给请求需要携带的参数,当发送请求的时候把参数放进去
          name,
          gender,
          birthday
        })

        this.$toast.success('保存成功')
      } catch (err) {
        console.log(err)
        console.dir(err)
        if (err.response && err.response.status === 409) {
          return this.$toast.fail('保存失败，用户名已存在')
        }
        this.$toast.fail('保存失败')
      }
    },

    // 用来选择图片,,,把图片转换成base64格式的数据,,,进行头像预览操作
    fileChange () {
      // 把图片转换成base64格式的数据
      this.getBase64(this.$refs.file.files[0], (err, data) => {
        if (err) console.log('图片转换失败')

        // 进行头像预览操作
        this.userProfile.photo = data
      })
    },

    // 进行客户端的图片预览 把一个图片转换成一堆数据放到页面上就直接能显示图片,,,因为任何东西在计算机上本质上就是二进制数据
    // 在此转换成base64格式的数据,只是字符少了点,本质还是二进制数据,因为浏览器支持base64的数据格式,所以在此就把图片转换成
    // base64的数据格式放到浏览器中 让浏览器解析出来  把base64格式的字符串数据赋给src属性,,,就会有图片预览的效果了
    // getbase64这个方法 直接去复制过来就行了不用记,知道怎么用即可  知道在干什么即可,,,

    // 讲传过来的图片转换成,,,base64格式,,,的数据
    getBase64 (file, callback) {
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function () {
        console.log('-----------------------------------------此处包裹的是,,,图片转换成base64格式的数据,,,的字符串---------------------------------')
        console.log(reader.result)
        console.log('-----------------------------------------此处包裹的是,,,图片转换成base64格式的数据,,,的字符串---------------------------------')

        callback(null, reader.result)
      }
      reader.onerror = function (error) {
        callback(error)
      }
    },

    // 选择上拉菜单中选项后触发的事件的事件处理程序
    genderSelect (item) {
      this.userProfile.gender = item.value
      this.isGenderShow = false
    }

  }
}
</script>

<style lang="less" scoped>
</style>>
