import request from '@/utils/request'

let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}

//分页获取拆分代扣列表
export const orderSplitPageList = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/orderSplit/list',
    data
  })
}

//增加拆分代扣配置
export const orderSplitAdd = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/orderSplit/save',
    data
  })
}

//修改拆分代扣配置
export const orderSplitModify = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/orderSplit/edit',
    data
  })
}

//删除拆分代扣配置
export const orderSplitDelete = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/orderSplit/delete',
    data
  })
}

//查询拆分代扣列表
export const orderSplitDetail = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/orderSplit/detail',
    data
  })
}

//添加拆分代扣详细信息配置
export const orderSplitSaveDetail = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/orderSplit/addDetail',
    data
  })
}

//修改拆分代扣详细配置
export const orderSplitModifyDetail = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/orderSplit/editDetail',
    data
  })
}

//删除拆分代扣详细配置
export const orderSplitDeleteDetail = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/orderSplit/deleteDetail',
    data
  })
}

//查询所有的代扣拆分配置
export const orderSplitQueryAllList = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/orderSplit/queryAllList',
    data
  })
}
