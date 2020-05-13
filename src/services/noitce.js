import AppService from '../utils/app.service'

// 添加通知
export function addNotic(params) {
  return AppService.postRequest(`/admin/notice/addNotice`, { ...params })
}

// 根据通知id删除
export function deleteNotice(params) {
  return AppService.deleteRequest(`/admin/notice/deleteNoticeId`, { ...params })
}

// 根据通知id批量删除
export function deleteNoticeMore(params) {
  return AppService.deleteRequest(`/admin/notice/batchDeleteNoticeId`, { ...params })
}

// 查询所有通知
export function findNoticeAll(params) {
  return AppService.getRequest(`/admin/notice/findAll`, { ...params })
}

// 分页查询通知
export function findNoticePage(params) {
  return AppService.getRequest(`/admin/notice/findNotice`, { ...params })
}

// 根据通知id查询
export function findNoticeById(params) {
  return AppService.getRequest(`/admin/notice/findNoticeId`, { ...params })
}

// 更新通知
export function updateNotice(params) {
  return AppService.putRequest(`/admin/notice/putNotice`, { ...params })
}