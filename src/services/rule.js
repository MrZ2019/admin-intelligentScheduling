import AppService from '../utils/app.service'

// 添加班次
export function addShift(params) {
  return AppService.postRequest(`/admin/shifts/add`, { ...params })
}

// 删除班次
export function deleteShift(params) {
  return AppService.deleteRequest(`/admin/shifts/delete`, { ...params })
}

// 通过班次id获取信息
export function findShiftById(params) {
  return AppService.getRequest(`admin/shifts/find`, { ...params })
}

// 按部门id查询所有班次
export function findAllShiftsByDeptId(params) {
  return AppService.getRequest(`/admin/shifts/findAllShiftsByDeptId`, { ...params })
}

// 按班次id分页查询所有考勤对象
export function findUserByShiftIdPage(params) {
  return AppService.getRequest(`/admin/shifts/getAllUser`, { ...params })
}

// 获取员工下所有班次信息
export function findShiftsByUserId(params) {
  return AppService.getRequest(`/admin/shifts/getShiftsByUserId`, { ...params })
}

// 分页获取所有班次
export function findShiftPage(params) {
  return AppService.getRequest(`/admin/shifts/getShiftsList`, { ...params })
}

// 更改班次
export function updateShift(params) {
  return AppService.putRequest(`/admin/shifts/update`, { ...params })
}