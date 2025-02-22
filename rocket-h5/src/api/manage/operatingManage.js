/*
 * @Author: ruanyali yali.ruan@dexintec.com
 * @Date: 2022-05-06 09:35:51
 * @LastEditors: ruanyali yali.ruan@dexintec.com
 * @LastEditTime: 2022-05-09 17:25:08
 * @FilePath: \zeusd:\project\ng-product-factory-web\src\api\manage\productManage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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

// 运营管理-产品展示策略-列表查询接口
export function getProductAdsList(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/opr-mgr/product-ads/list',
    method: 'post',
    data
  })
}

// 运营管理-产品展示策略-单个查询接口
export function getSingleProductAdsInfo(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/opr-mgr/product-ads/one',
    method: 'post',
    data
  })
}

//运营管理-产品展示策略-编辑接口
export function editProductAds(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/opr-mgr/product-ads/update',
    method: 'post',
    data
  })
}

// 运营管理-产品余额-列表查询接口
export function getProductBalanceList(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/opr-mgr/product-balance/list',
    method: 'post',
    data
  })
}

// 运营管理-产品余额-充值接口
export function productBalanceRecharge(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/opr-mgr/product-balance/recharge',
    method: 'post',
    data
  })
}

// 运营管理-产品余额-充值明细
export function getChargeDetailList(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/opr-mgr/product-balance/recharge-detail/list',
    method: 'post',
    data
  })
}

// 运营管理-Banner 管理-列表查询接口
export function getBannerList(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/opr-mgr/banner/list',
    method: 'post',
    data
  })
}

// 运营管理-Banner 管理-单个查询接口
export function getSingleBannerInfo(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/opr-mgr/banner/one',
    method: 'post',
    data
  })
}

//  运营管理-Banner 管理-新增接口
export function addBanner(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/opr-mgr/banner/add',
    method: 'post',
    data
  })
}

//  运营管理-Banner 管理-编辑接口
export function editBanner(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/opr-mgr/banner/update',
    method: 'post',
    data
  })
}

//  运营管理-Banner 管理-上下架接口
export function publishBanner(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/opr-mgr/banner/publish',
    method: 'post',
    data
  })
}
