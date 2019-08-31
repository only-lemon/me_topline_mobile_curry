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

// 举报文章时所需要发送的请求的方法
export var reportArticle = (params) => {
  return instance({
    url: '/app/v1_0/article/reports',
    method: 'POST',
    data: params
  })
}

// 获取新闻文章详情需要发送的请求的方法
export var gainArticleDetail = (articleID) => {
  return instance({
    url: `/app/v1_0/articles/${articleID}`,
    method: 'GET'
  })
}

// 获取评论或评论回复数据需要发送的请求的方法
export var gainCommentORReply = (params) => {
  return instance({
    url: '/app/v1_0/comments',
    method: 'GET',
    params
  })
}

// 添加评论或评论回复需要发送的请求的方法
export var increaseCommentORReplyComment = (params) => {
  return instance({
    url: '/app/v1_0/comments',
    method: 'POST',
    data: params
  })
}
