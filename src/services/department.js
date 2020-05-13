import AppService from '../utils/app.service'


// 添加部门-含有班组
export function addDepWithTeam(params) {
  return AppService.postRequest(`/admin/dep/add/hasteam`, {...params})
}

// 添加部门-不含班组
export function addDeptNoTeam(params) {
  return AppService.postRequest(`/admin/dep/add/noteam`, {...params})
}

// 删除部门
export function deleteDep(params) {
  return AppService.deleteRequest(`/admin/dep/delete`, {...params})
}

// 根据部门id查询所有员工数，删除部门时先调用该接口查询人数
export function findAllStaffByDepId(params) {
  return AppService.getRequest(`/admin/dep/findAllStaffByDepId`, {...params})
}

// 根据部门id查询部门
export function findDepByDepId(params) {
  return AppService.getRequest(`/admin/dep/get`, {...params})
}

// 条件查询部门-分页
export function findDepPage(params) {
  return AppService.getRequest(`/admin/dep/search`, {...params})
}

// 编辑部门-含有班组
export function updateDepWithTeam(params) {
  return AppService.postRequest(`/admin/dep/update/hasteam`, {...params})
}

// 编辑部门-不含班组
export function updateDepNoTeam(params) {
  return AppService.postRequest(`/admin/dep/update/noteam`, {...params})
}



// 查询所有部门
export function findAllDept(params) {
  return AppService.getRequest(`/admin/dep/findAllDept`, { ...params })
}

// 根据部门id和班组id查询对应岗位
export function findPostById(params) {
  return AppService.getRequest(`/admin/dep/findDepIdAndTeamId`, { ...params })
}



// 查询所有班组
export function findAllTeam(params) {
  return AppService.getRequest(`/admin/team/find/all`, { ...params })
}

// 通过部门id查询班组
export function findTeamByDepId(params) {
  return AppService.getRequest(`/admin/team/find/depid`, { ...params })
}



// 查询所有岗位
export function findAllPost(params) {
  return AppService.getRequest(`/admin/post/find/all`, { ...params })
}

// 按部门和班组查询岗位
export function findPostByIdPages(params) {
  return AppService.getRequest(`/admin/post/findByDeptId`, { ...params })
}