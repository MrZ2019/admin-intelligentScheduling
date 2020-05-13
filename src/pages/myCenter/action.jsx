import AppService from '../../utils/app.service'

export function updatePwd(params) {
  return AppService.postRequest('/admin/system/updatePwd', params)
}