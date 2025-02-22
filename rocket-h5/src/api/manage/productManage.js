/*
 * @Author: ruanyali yali.ruan@dexintec.com
 * @Date: 2022-05-06 09:35:51
 * @LastEditors: ruanyali yali.ruan@dexintec.com
 * @LastEditTime: 2022-05-09 14:23:03
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

// 产品管理-产品-列表查询接口
export function getProductList(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/prod-mgr/product/list',
    method: 'post',
    data
  })
}

// 产品管理-产品-单个查询接口
export function getSingleProductInfo(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/prod-mgr/product/one',
    method: 'post',
    data
  })
}

// 产品管理-产品-新增接口
export function addProduct(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/prod-mgr/product/add',
    method: 'post',
    data
  })
}

// 产品管理-产品-编辑接口
export function editProduct(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/prod-mgr/product/update',
    method: 'post',
    data
  })
}

// 产品管理-产品-上下架接口
export function publishProduct(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/prod-mgr/product/publish',
    method: 'post',
    data
  })
}

// 通用功能-推广员-列表接口
export function getPromoterList(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/admin/promoter/list',
    method: 'post',
    data
  })
}

// 通用功能-甲方-列表接口
export function getCpList(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/admin/cp/list',
    method: 'post',
    data
  })
}

// 通用-发布渠道接口
export function getChannel(data) {
  return request({
    baseURL,
    url: '/ls-mgr-api/admin/publish/channels',
    method: 'post',
    data
  })
}
