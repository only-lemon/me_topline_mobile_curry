/**
 *
 *        此模块用来封装请求和搜索相关的数据的方法
 *
 */

import instance from '@/utility/request_config_axios'

// 获取后端后台联想建议数据
export var gainSuggestions = (q) => {
  return instance({
    url: '/app/v1_0/suggestion',
    method: 'GET',
    params: {
      q
    }
  })
}
