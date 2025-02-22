import request from '@/utils/request'
let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}

//查询滞纳金
export const pageListLateFee = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/lateFee/list',
    data
  })
}

//查询滞纳金
export const lateFeeLoad = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/lateFee/load',
    data
  })
}

//添加滞纳金
export const addLateFee = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/lateFee/save',
    data
  })
}

//更新滞纳金
export const modifyLateFee = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/lateFee/update',
    data
  })
}

//删除滞纳金
export const deleteLateFee = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/lateFee/delete',
    data
  })
}

//查询所有的滞纳金配置
//export const queryAllListLateFee = function (data) {
//return request({
//  baseURL,
//  method: 'post',
//  url: '/lateFee/queryAllList',
//  data
//})
//}

//获取滞纳金配置的详细列表
//export const queryDetailListByLateFeeIdLateFee = function (data) {
//return request({
//  baseURL,
//  method: 'post',
//  url: '/lateFee/queryDetailListByLateFeeId',
//  data
//})
//}
