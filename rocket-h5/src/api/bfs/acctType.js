import request from '@/utils/request'
let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}

//查询所有的账户类型
export const acctTypeQueryAllList = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/accttype/queryAllList',
    data
  })
}

export const productAcctTypeList = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/accttype/list',
    data
  })
}

//新增账户类型
export const acctTypeSave = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/accttype/save',
    data
  })
}
