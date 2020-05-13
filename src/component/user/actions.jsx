import AppService from '../../common/utils/app.service'

// const PRE_URL = 'admin/user'


// /admin/user/search

// export function getUserList(params) {
//   return AppService.getRequest(`${PRE_URL}/getUserList`, {...params})
// }
// export function disable(params) {
//   return AppService.postRequest(`${PRE_URL}/disable`, {...params})
// }
// export function enable(params) {
//   return AppService.postRequest(`${PRE_URL}/enable`, {...params})
// }
// export function getJobType(params) {
//   return AppService.getRequest(`admin/jobType/list`, {...params})
// }
// export function getDetails(params) {
//   return AppService.getRequest(`${PRE_URL}/get`, {...params})
// }

// export function getList(params) {
//   return AppService.getRequest(`admin/jobs/listByEmployee`, {...params})
// }

// export function toDownload(params) {
//   return AppService.getRequest(`admin/user/download`, {...params})
// }

// 用户管理

const user_url = '/admin/user'
// 所有用户search
export function getUserList(params) {
  return AppService.getRequest(`${user_url}/search`, {...params})
}

export function getUser(params) {
  return AppService.getRequest(`${user_url}/findAll`, {...params})
}

export function creatUser(params) {
  return AppService.postRequest(`${user_url}/add`, {...params})
}

export function updateUser(params) {
  return AppService.postRequest(`${user_url}/update`, {...params})
}