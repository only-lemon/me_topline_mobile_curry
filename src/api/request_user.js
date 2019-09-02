/**
 *        此模块用来封装请求和用户相关的数据的方法
 */

import instance from '@/utility/request_config_axios'

// 用户点击登录对应发送的请求方法   --->   获取用户登录信息
export var login = (requestParams) => {
  return instance({
    url: '/app/v1_0/authorizations',
    method: 'POST',
    data: requestParams
  })
}

// 获取当前登录用户的信息
export const getSelf = () => {
  return instance({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}

// 拉黑发表文章的作者
export var addBlackList = (requestParams) => {
  return instance({
    url: '/app/v1_0/user/blacklists',
    method: 'POST',
    data: requestParams
  })
}

// 关注用户需要发送的请求的方法
export var subscriptionUser = userID => {
  return instance({
    url: '/app/v1_0/user/followings',
    method: 'POST',
    data: { target: userID }
  })
}

// 取消关注用户需要发送的请求的方法
export var cancelSubscriptionUser = userID => {
  return instance({
    url: `/app/v1_0/user/followings/${userID}`,
    method: 'DELETE'
  })
}

// 获取用户个人资料
export const getUserProfile = () => {
  return instance({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}

// 更新用户头像所需要发送的请求的方法
export const updateUserPhoto = file => {
  const formData = new FormData()
  formData.append('photo', file)
  return instance({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data: formData
  })
}

// 更新用户其他基本信息需要发送的请求的方法
export const updateUserBaseInfo = ({ // 形参 解构出来,,,调用函数时,,,传递过来的,,,实参,,,参数
  name,
  gender,
  birthday
}) => {
  return instance({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data: {
      name,
      gender,
      birthday
    }
  })
}
