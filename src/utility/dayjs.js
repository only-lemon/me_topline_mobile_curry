/**
 * 封装相对时间模块
 */
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import rTime from 'dayjs/plugin/relativeTime'
dayjs.locale('zh-cn')
dayjs.extend(rTime)

export const relativeTime = time => {
  return dayjs().from(dayjs(time))
}
