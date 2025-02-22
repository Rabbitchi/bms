import request from '@/utils/request'

let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}

//添加罚息
export const overdueAdd = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/overdue/save',
    data
  })
}

//删除罚息
export const overdueDelete = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/overdue/delete',
    data
  })
}

//更新罚息
export const overdueModify = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/overdue/update',
    data
  })
}

//查询罚息
export const overdueQueryAllList = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/overdue/list',
    data
  })
}

//获取罚息的详细列表
export const queryDetailListByOverdueId = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/overdue/queryDetailListByOverdueId',
    data
  })
}

//查询所有的罚息配置
export const productOverdueQueryAllList = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/overdue/queryAllList',
    data
  })
}

export const overdueDetails = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/overdue/overdueDetails',
    data
  })
}
