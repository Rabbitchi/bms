import request from '@/utils/request'
let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}

//产品规则列表
export const productRuleList = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product-rule/list',
    data
  })
}

//添加产品规则
export const productRuleAdd = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product-rule/add',
    data
  })
}

//更新产品规则
export const productRuleModify = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product-rule/edit',
    data
  })
}

//删除产品规则
export const productRuleDelete = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product-rule/delete',
    data
  })
}

//查询产品（包含子产品列表）列表
export const ruleProductFeeList = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product-rule/productFee/list',
    data
  })
}

//产品规则字典列表
export const productRuleDict = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/product-rule/dict',
    data
  })
}
