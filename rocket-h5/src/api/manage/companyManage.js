import request from '@/utils/request'

let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  // 代理
  baseURL = '/baseApi'
} else {
  // baseURL = process.env.VUE_APP_BAS_API
  const host = window.location.host
  baseURL = `https://${host}`
}

// 公司管理-列表查询接口
export function getCompanyList(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/risk-mgr/company/list',
    method: 'post',
    data
  })
}

// 公司管理-单个查询接口
export function getCompanyOne(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/risk-mgr/company/one',
    method: 'post',
    data
  })
}

// 公司管理-保存接口
export function saveComponyInfo(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/risk-mgr/company/save',
    method: 'post',
    data
  })
}

// 公司管理-充值接口
export function recharge(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/risk-mgr/company/recharge',
    method: 'post',
    data
  })
}

// 公司管理-充值流水查询接口
export function getRechargeDetails(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/risk-mgr/company/recharge/details',
    method: 'post',
    data
  })
}
