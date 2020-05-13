import AppService from '../utils/app.service'


// 新增员工
export function addUser(params) {
  return AppService.postRequest(`/admin/user/add`, {...params})
}

// 通过id查询员工
export function getUserById(id) {
  return AppService.postRequest(`/admin/user/find/${id}`,)
}

// 获取所有员工
export function getUserFindAll(params) {
  return AppService.getRequest(`/admin/user/findAll`, {...params})
}

// 按部门/班组/岗位查询员工列表
export function findByCondition(params) {
  return AppService.postRequest(`/admin/user/findByCondition`, {...params})
}

// 通过id和权限类型查询员工
export function findByUserIdAndPermType(params) {
  return AppService.postRequest(`/admin/user/findByUserIdAndPermType`, {...params})
}

// 条件查询员工-分页
export function getUserList(params) {
  return AppService.getRequest(`/admin/user/search`, {...params})
}

// 修改员工
export function updateUser(params) {
  return AppService.putRequest(`/admin/user/update`, {...params})
}