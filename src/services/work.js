import AppService from '../utils/app.service'

// 新增排班(类型1)
export function addShiftTypeOne(params, data) {
  return AppService.postRequest('/admin/scheduling/addByNormal', params, data)
}

// 新增排班(类型2，针对安保部按岗位排班)
export function addShiftTypeTwo(params, data) {
  return AppService.postRequest('/admin/scheduling/addByPost', params, data)
}

// 批量删除排班
export function deleteShiftMore(params) {
  return AppService.postRequest('/admin/scheduling/batchDeleteScheduling', params)
}

// 删除排班
export function deleteShift(params) {
  return AppService.postRequest('/admin/scheduling/deleteScheduling', params)
}

// 排班查询
export function findShiftDetail(params) {
  return AppService.getRequest('/admin/scheduling/find', {...params})
}

// 查询部门下所有班次
export function findAllShifts(params) {
  return AppService.getRequest('/admin/scheduling/findAllShifts', {...params})
}

// 分页查询安保部班组下员工
export function findNameList(params) {
  return AppService.getRequest('/admin/scheduling/findNameList', {...params})
}

// 查询部门下所有岗位
export function findPostAll(params) {
  return AppService.getRequest('/admin/scheduling/findPostAll', {...params})
}

// 通过部门和班组查询员工
export function findStaffByDept(params) {
  return AppService.getRequest('/admin/scheduling/findStaffByDept', {...params})
}

// 分页查询排班
export function findShiftsPage(params) {
  return AppService.getRequest('/admin/scheduling/search', {...params})
}

// 更新排班(类型1)
export function updateShiftTypeOne(params, data) {
  return AppService.postRequest('/admin/scheduling/updateByNormal', params, data)
}

// 更新排班(类型2,针对安保部按岗位排班)
export function updateShiftTypeTwo(params, data) {
  return AppService.postRequest('/admin/scheduling/updateByPost', params, data)
}

// 上传安保部休息表
export function excelList(params) {
  return AppService.postRequest('/admin/scheduling/upload/excel', {...params})
}


// 类型1只查询节假日
// 类型2要查询节假日和休息日
// 判断是否法定节假日, 返回3需要记录，表示为排班日期为法定节假日， work_time_type设置为3
export function validateLegalHoliday(params) {
  return AppService.postRequest('/admin/scheduling/validateLegalHoliday', {...params})
}

// 判断是否休息日, 返回2需要记录，表示为排班日期为休息日, work_time_type设置为2
export function validateRestDay(params) {
  return AppService.postRequest('/admin/scheduling/validateRestDay', {...params})
}

export function saveTemplate(params, data) {
  return AppService.postRequest('/customUser/addWorkTemplate', params, data)
}
export function saveMonthTemplate(params, data) {
  return AppService.postRequest('/customUser/addMonthTemplate', params, data)
}
export function addWorkPageName(params, data) {
  return AppService.postRequest('/customUser/addWorkPageName', params, data)
}
export function addWorkPage(params, data) {
  return AppService.postRequest('/customUser/addWorkPage', params, data)
}
export function getWorkTemplatePageName(params, data) {
  return AppService.postRequest('/customUser/getWorkTemplatePageName', params, data)
}
export function getWorkTemplate(params, data) {
  return AppService.postRequest('/customUser/getWorkTemplate', params, data)
}

export function findAllTpl(params, data) {
  return AppService.postRequest('/customUser/getWorkTemplate', params)
}
export function findAllMonthTpl(params, data) {
  return AppService.postRequest('/customUser/getMonthTemplate', params)
}
