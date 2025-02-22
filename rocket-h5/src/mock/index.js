// 首先引入Mock
const Mock = require('mockjs')
/**
 * 指定被拦截的 Ajax 请求的响应时间，单位是毫秒。
 * 可以是字符串，400，表示400ms
 * 也可以是'-'连接，400-600，表示响应时间介于 400 和 600 毫秒之间
 *  默认值是'10-100'。
 */
Mock.setup({
  timeout: '1000-3000'
})

let configArray = []

// 使用webpack的require.context()遍历modules下的所有mock文件
const files = require.context('./modules', true, /.js$/)
files.keys().forEach((key) => {
  configArray = configArray.concat(files(key))
})
// 注册所有的mock服务
configArray.forEach((item) => {
  for (const [path, target] of Object.entries(item)) {
    const protocol = path.split('|')
    Mock.mock(new RegExp('^' + protocol[1]), protocol[0].toLowerCase(), target)
  }
})
