/**
 *
 *        此模块用来封装请求和文章相关的数据的方法
 *
 */

import instance from '@/utility/request_config_axios'

// 拉取当前频道数据发送的请求的方法
export var gianCurrentChannelArticles = (params) => {
  return instance({
    url: '/app/v1_1/articles',
    method: 'GET',
    params: params
  })
}
