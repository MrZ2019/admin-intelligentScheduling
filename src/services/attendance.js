import AppService from '../utils/app.service'

// 通过用户id和考勤日期查询考勤详情
export function getAttendanceList(params) {
  return AppService.getRequest('/admin/attend/getOneDayAttendance', {...params})
}

// 个人实时考勤表(按月统计)
export function getPersonAttendance(params) {
  return AppService.getRequest('/admin/attend/getPersonalAttendance', {...params})
}

// 通过用户id查询每天打卡情况
export function getWorkTimeByUserId(params) {
  return AppService.getRequest('/admin/attend/getWorkTimeByUserId', {...params})
}

// 实时考勤条件查询
export function findListPage(params) {
  return AppService.getRequest('/admin/attend/search', {...params})
}

// 临时加班
export function addTime(params) {
  return AppService.getRequest('/admin/attend/temporaryOvertimeAppeal', {...params})
}

// 个人考勤修改
export function updateAttendance(params) {
  return AppService.getRequest('/admin/attend/updateAttendance', {...params})
}
