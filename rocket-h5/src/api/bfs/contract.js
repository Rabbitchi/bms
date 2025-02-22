import request from '@/utils/request'
let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}
//查询所有的合同模板
export const contractQueryAllList = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/contract/list',
    data
  })
}
