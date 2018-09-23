// 引入jsonp插件库
import originJSONP from 'jsonp'
// jsonp封装
export default function jsonp(url, data, option) {
  // 判断URL是否有？无则添加
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    // 使用js插件
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
// 将参数拼到url上
function param(data) {
  let url = '';
  for (var k in data) {
    // 参数不存在时则为空
    let value = data[k] !== undefined ? data[k] : '';
    url += `&${k}=${encodeURIComponent(value)}`;
  }
  // 判断URL有& 有则去除拼接串的&符号
  return url ? url.substring(1) : '';
}
