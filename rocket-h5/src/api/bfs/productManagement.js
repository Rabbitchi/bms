import request from '@/utils/request'
let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}

//查询产品表
export const productPageList = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/list',
    data
  })
}

//增加产品配置信息
export const productAdd = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/save',
    data
  })
}

//更新产品
export const productModify = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/edit',
    data
  })
}

//删除产品配置信息
export const productDelete = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/delete',
    data
  })
}

//激活产品
export const productVisible = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/visible',
    data
  })
}

//禁用产品
export const productDisable = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/disable',
    data
  })
}

//产品配置
export const productQueryProduct = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/detail',
    data
  })
}

//添加产品定价
export const productAddDetail = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/productFee/save',
    data
  })
}

//更新产品定价
export const productFeeUpdate = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/productFee/update',
    data
  })
}

//删除产品定价
export const productFeeDelete = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/productFee/delete',
    data
  })
}

//查询产品相关枚举类型类型
export const productQueryProductRelEnum = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/queryProductFeeRelEnum',
    data
  })
}

export const productFeeForm = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/productFee/form',
    data
  })
}

//查询交易场景
export const queryProductRelEnum = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product/queryProductRelEnum',
    data
  })
}
