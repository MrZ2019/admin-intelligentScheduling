import AppService from '../utils/app.service'

// 查询后台操作类权限
export function getBackendAuthority(params) {
  return AppService.getRequest(`/admin/perm/find/admin`, { ...params })
}

// 查询审批类权限
export function getApprovalAuthority(params) {
  return AppService.getRequest(`/admin/perm/find/approval`, { ...params })
}

// 查询查看类权限
export function getLookAuthority(params) {
  return AppService.getRequest(`/admin/perm/find/review`, { ...params })
}

// 条件查询员工权限
export function findUserPermission(params) {
  return AppService.getRequest(`/admin/user/findUserPermission`, {...params})
}

// 增加或修改员工权限
export function addOrUpdatePermission(params) {
  return AppService.putRequest(`/admin/user/saveOrUpdatePermission`, {...params})
}