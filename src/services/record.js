import AppService from '../utils/app.service'

// 分页查询操作日志
export function findLogPage(params) {
  return AppService.getRequest(`/admin/log/searchLog`, { ...params })
}
