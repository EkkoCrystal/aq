import request from '@/utils/request'

export function login (data) {
  console.log('执行login')
  return request({
    url: 'oauth-service/oauth/admin/login',
    method: 'post',
    data: {
      // organizationCode: data.organizationCode,
      password: data.password,
      userName: data.username,
      tenant: data.tenant
    }
  })
}
// 用户信息
export function getInfo () {
  return request({
    url: 'collect-app-service/admins',
    method: 'get'
  })
}

// -------------------------------首页---------------------------------

// 首页
export function getTotalCount (data) {
  return request({
    url: 'collect-app-service/statistics/totalCount',
    method: 'get',
    params: {
      day: data.day,
      tenant: data.tenant
    }
  })
}
export function getTotalPersonSummary (data) {
  return request({
    url: 'collect-app-service/statistics/totalPersonSummaryDynamic',
    method: 'get',
    params: {
      day: data.day,
      tenant: data.tenant
    }
  })
}
// 首页统计分析
export function getOrganizationSummary (data) {
  return request({
    url: 'collect-app-service/statistics/organizationSummaryDynamic',
    method: 'get',
    params: {
      day: data.day,
      tenant: data.tenant,
      page: data.page,
      size: data.size
    }
  })
}
// -------------------------------用户管理---------------------------------
export function getUsers (data) {
  return request({
    url: 'app-service/users/page',
    method: 'get',
    params: {
      condition: data.condition,
      page: data.page,
      size: data.size
    }
  })
}
// 用户详情
export function getUsersDetail (userID) {
  return request({
    url: 'app-service/users/userInfo',
    method: 'get',
    params: {
      userId: userID
    }
  })
}
// 用户测试列表
export function getUsersRecords (data) {
  return request({
    url: 'app-service/flexcheck/records',
    method: 'get',
    params: {
      userId: data.userId,
      page: data.page,
      size: data.size
    }
  })
}

// -------------------------------风险管理---------------------------------
export function getAffectedRecords (data) {
  return request({
    url: 'collect-app-service/records/queryRecords',
    method: 'get',
    params: {
      condition: data.condition,
      province: data.province,
      city: data.city,
      county: data.county,
      value: data.value,
      tenant: data.tenant,
      beginDate: data.beginDate,
      endDate: data.endDate,
      organizationId: data.organizationId,
      personType: data.personType,
      page: data.page,
      size: data.size
    }
  })
}
export function getPersonTypes () {
  return request({
    url: 'collect-app-service/order/personTypes',
    method: 'get'
  })
}

// -------------------------------组织机构管理---------------------------------
// 组织机构管理
export function getOrganizations (data) {
  return request({
    url: 'collect-app-service/organization/page',
    method: 'get',
    params: {
      tenantCode: data.tenantCode,
      // // province: data.province,
      // // city: data.city,
      // // county: data.county,
      page: data.page,
      size: data.size
    }
  })
}
// 检测结果搜搜
export function getOrganizationsOne (data) {
  return request({
    url: 'collect-app-service/organization/page',
    method: 'get',
    params: {
      tenantCode: data.tenantCode,
      page: 1,
      size: 100
    }
  })
}
// app-service/organization/organizationInfo
// 创建
export function creatOrganization (data) {
  return request({
    url: 'collect-app-service/organization',
    method: 'post',
    data: data
  })
}
// 修改
export function modifyOrganization (data) {
  return request({
    url: 'collect-app-service/organization',
    method: 'put',
    data: data
  })
}
//  分配密码
export function resetPassword (data) {
  return request({
    url: 'collect-app-service/organization/resetPassword',
    method: 'post',
    data: data
  })
}
// 删除
export function deleteOrganization (dataId) {
  return request({
    url: 'collect-app-service/organization',
    method: 'delete',
    params: {
      id: dataId

    }
  })
}
// 获取操作人
export function getAlloperator (data) {
  return request({
    url: 'collect-app-service/operator/all',
    method: 'POST',
    params: {
      organizationCode: data.organizationCode,
      page: data.page,
      size: data.size
    }
  })
}
export function addOperator (data) {
  return request({
    url: 'collect-app-service/operator',
    method: 'POST',
    data: data
  })
}
export function changeOperatorStatus (data) {
  return request({
    url: 'collect-app-service/operator/changeStatus',
    method: 'POST',
    data: data
  })
}
// 删除
export function deledateOperator (dataId) {
  return request({
    url: 'collect-app-service/operator',
    method: 'delete',
    params: {
      id: dataId

    }
  })
}

export function getOperatorSummary (data) {
  return request({
    url: 'collect-app-service/statistics/operatorSummary',
    method: 'get',
    params: {
      day: data.day,
      organizationId: data.organizationId
    }
  })
}

// -------------------------------组织机构管理---------------------------------

// 个园区打卡统计
export function getWorkSectionSummary () {
  return request({
    url: 'app-service/statistics/workSectionSummary',
    method: 'get'
  })
}

// 今日打卡异常记录

export function getUserClockTodayInRecords () {
  return request({
    url: 'app-service/userClockInRecord/todayExcepion',
    method: 'get'
  })
}
// 人员管理
export function allUserQuery (data) {
  return request({
    url: 'app-service/users/query',
    method: 'get',
    params: {
      condition: data.condition,
      dormitoryId: data.dormitoryId,
      workSectionCode: data.workSectionCode,
      page: data.page,
      size: data.size
    }
  })
}
// 查询条件宿舍id
export function getDormitoryList () {
  return request({
    url: 'app-service/dormitory/list',
    method: 'get'

  })
}
// 详情
export function getUserDetal (dataId) {
  return request({
    url: 'app-service/users/detail',
    method: 'get',
    params: {
      userId: dataId

    }
  })
}
// 轨迹
export function getUserTravel (dataId) {
  return request({
    url: 'app-service/userTravel',
    method: 'get',
    params: {
      userId: dataId

    }
  })
}
// 行程码
export function getTrackCodeRecords (dataId) {
  return request({
    url: 'app-service/trackCodeRecords/userTrackCode',
    method: 'get',
    params: {
      userId: dataId

    }
  })
}
// 园区
export function getWorkSections () {
  return request({
    url: 'app-service/workSections/all',
    method: 'get'

  })
}

export function addWorksection (data) {
  return request({
    url: 'app-service/workSections/save',
    method: 'post',
    data: data
  })
}
// 编辑
export function modifyWorkSections (data) {
  return request({
    url: 'app-service/workSections/save',
    method: 'post',
    data: data
  })
}
// 删除

export function deleteWorkSections (dataId) {
  return request({
    url: 'app-service/workSections',
    method: 'delete',
    params: {
      code: dataId

    }
  })
}
// 宿舍管理
// 获取所有宿舍
export function getDormitory (data) {
  return request({
    url: 'app-service/dormitory/queryDormitory',
    method: 'get',
    params: {
      condition: data.condition,
      quarantineArea: data.quarantineArea,
      page: data.page,
      size: data.size
    }
  })
}
// 新增宿舍
export function addDormitory (data) {
  return request({
    url: 'app-service/dormitory',
    method: 'post',
    data: data
  })
}
// 编辑宿舍
export function modifyDormitory (data) {
  return request({
    url: 'app-service/dormitory/updatePost',
    method: 'post',
    data: data
  })
}

// 删除宿舍
export function deleteDormitory (dataId) {
  return request({
    url: 'app-service/dormitory',
    method: 'delete',
    params: {
      id: dataId

    }
  })
}
// 标记风险
export function markWarn (data) {
  return request({
    url: 'app-service/users/markWarn',
    method: 'post',
    params: {
      userId: data.condition

    }
  })
}
// 解除风险
export function relieveWarn (data) {
  return request({
    url: 'app-service/users/relieveWarn',
    method: 'post',
    params: {
      userId: data.id,
      reason: data.reason

    }
  })
}
// users/reliveReasons
// 解除风险原因
export function getReliveReasons (data) {
  return request({
    url: 'app-service/users/reliveReasons',
    method: 'get'
  })
}
// 获取城市
export function getAreasRoot () {
  return request({
    url: 'app-service/areas/root',
    method: 'get'

  })
}
// 获取子城市
export function getAreasSub (dataID) {
  return request({
    url: 'app-service/areas/sub',
    method: 'get',
    params: {
      id: dataID
    }
  })
}
// 获取所有风险区域
export function getAffectedArea (data) {
  return request({
    url: 'app-service/affectedArea/page',
    method: 'get',
    params: {
      province: data.province,
      level: data.dangerLevel,
      page: data.page,
      size: data.size
    }
  })
}

// 新增风险区域/affectedArea
export function addAffectedArea (data) {
  return request({
    url: 'app-service/affectedArea',
    method: 'post',
    data: data

  })
}
// 删除风险区域
export function deleteAffectedArea (dataID) {
  return request({
    url: 'app-service/affectedArea',
    method: 'delete',
    params: {
      id: dataID
    }
  })
}
// 风险人员管理
export function getUserDoubts (data) {
  return request({
    url: 'app-service/affectedArea/query',
    method: 'get',
    params: {
      processed: data.processed,
      reason: data.reason,
      solution: data.solution,
      condition: data.condition,
      page: data.page,
      size: data.size
    }
  })
}
// 风险等级
export function getAffectlevels (data) {
  return request({
    url: 'app-service/affectedArea/levels',
    method: 'get'
  })
}
// 解决方案
export function getAffectSolutions (data) {
  return request({
    url: 'app-service/affectedArea/solutions',
    method: 'get'
  })
}
// 处理
export function getAffectHandle (data) {
  return request({
    url: 'app-service/affectedArea/handle',
    method: 'post',
    data: data
  })
}
// 风险原因
export function getAffectReason (data) {
  return request({
    url: 'app-service/affectedArea/reason',
    method: 'get'
  })
}
// 隔离点
// 分页
export function getQuarantineSites (data) {
  return request({
    url: 'app-service/quarantineSites/query',
    method: 'get',
    params: {
      condition: data.condition,
      page: data.page,
      size: data.size
    }
  })
}
// 获取所有隔离点查询
export function getQuarSites (data) {
  return request({
    url: 'app-service/quarantineSites/list',
    method: 'get'
  })
}
// 新增
export function addQuarantineSites (data) {
  return request({
    url: 'app-service/quarantineSites',
    method: 'post',
    data: data
  })
}
// 修改
export function modifyQuarantineSites (data) {
  return request({
    url: 'app-service/quarantineSites/updatePost',
    method: 'post',
    data: data
  })
}
// 删除
export function deleteQuarantineSites (dataID) {
  return request({
    url: 'app-service/quarantineSites',
    method: 'delete',
    params: {
      id: dataID
    }
  })
}
// 隔离人员

export function getQuarantineUser (data) {
  return request({
    url: 'app-service/quarantineUser/query',
    method: 'get',
    params: {
      quarantineSiteId: data.quarantineSiteId,
      page: data.page,
      size: data.size
    }
  })
}
// 风险管控
export function getaffectedAreaRecord (data) {
  return request({
    url: 'app-service/affectedAreaRecord/query',
    method: 'get',
    params: {
      processed: data.processed,
      reason: data.reason,
      solution: data.solution,
      condition: data.condition,
      page: data.page,
      size: data.size
    }
  })
}
// 异常记录
export function getExceptions (data) {
  return request({
    url: 'app-service/users/exceptions',
    method: 'get',
    params: {
      page: data.page,
      size: data.size
    }
  })
}

