import AppService from '../utils/app.service'

// 发放年假
export function assignHoliday(params) {
  return AppService.getRequest('/admin/vacation/assignAnnualLeave', {...params})
}

// 导出
export function exportExcel(params) {
  return AppService.getRequest('/admin/vacation/exportContracts', {...params})
}

// 查询用户假期详情
export function findByUser(params) {
  return AppService.getRequest('/admin/vacation/findByUser', {...params})
}

// 条件查询-分页
export function getHolidayList(params) {
  return AppService.getRequest('/admin/vacation/search', {...params})
}

// 添加节假日
export function addLegalHoliday(params) {
  return AppService.postRequest('/admin/holiday/addOrUpdateHoliday', {...params})
}

// 查询节假日
export function getLegalHoliday(params) {
  return AppService.postRequest('/admin/holiday/getHoliday', {...params})
}