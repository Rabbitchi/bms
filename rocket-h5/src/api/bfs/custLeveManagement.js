import request from '@/utils/request'
let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}

//查询客户等级列表
export const custLevelList = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/cust-level/list',
    data
  })
}

//添加客户等级
export const custLevelAdd = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/cust-level/add',
    data
  })
}

//更新客户等级
export const custLevelModify = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/cust-level/edit',
    data
  })
}

//查询产品（包含子产品列表）列表
export const productIncludeChildren = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/product-include-children',
    data
  })
}

//查询客户等级关联子产品列表
export const custLevelProductFeeList = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/cust-level/productFee/list',
    data
  })
}
