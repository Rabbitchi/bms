import request from '@/utils/request'

let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}

//添加利率表
export const addInterest = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/interest/save',
    data
  })
}

//删除利率表
export const deleteInterest = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/interest/delete',
    data
  })
}

//更新利率表
export const modifyInterest = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/interest/edit',
    data
  })
}

//查询利率表
export const pageListInterest = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/interest/list',
    data
  })
}

//查询所有的利率配置
export const queryInterestList = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/interest/queryInterestList',
    data
  })
}
