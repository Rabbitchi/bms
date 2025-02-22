import request from '@/utils/request'

let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = '/baseApi'
} else {
  baseURL = process.env.VUE_APP_BASE_URL
}
//查询冲销列表
export const pageOffsetList = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/offset/list',
    data
  })
}

//添加冲销表
export const offsetAdd = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/offset/save',
    data
  })
}

//更新冲销表
export const offsetModify = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/offset/edit',
    data
  })
}

//删除冲销表
export const offsetDelete = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/offset/delete',
    data
  })
}

//冲销详情
export const offsetDetails = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/offset/detail',
    data
  })
}

//添加冲销详情配置
export const offsetAddDetail = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/offset/balComptAdd',
    data
  })
}

//冲销顺序修改
export const offsetSaveSortTable = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/offset/saveSortTable',
    data
  })
}

//冲销顺序删除
export const offsetDeleteDetail = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/offset/balComptDelete',
    data
  })
}

//查询可新增冲销顺序配置类型
export const offsetQueryComptIdType = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/offset/queryComptIdType',
    data
  })
}

//查询所有的冲销配置
export const offsetQueryAllList = function (data) {
  return request({
    baseURL,
    method: 'post',
    url: '/pfs-web/offset/queryAllList',
    data
  })
}
