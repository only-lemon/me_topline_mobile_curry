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
