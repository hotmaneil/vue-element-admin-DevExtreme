import request from '@/utils/webApiRequest'

/**
 * 取得工作任務列表
 * @returns
 */
export function getTaskList() {
  return request({
    url: 'api/task/GetList',
    method: 'get'
  })
}

/**
 * 取得單一工作
 * @param {*} payload
 * @returns
 */
export function getTask(payload) {
  return request({
    url: 'api/task/GetTask',
    method: 'post',
    data: payload
  })
}

/**
 * 新增或更新工作任務
 * @returns
 */
export function updateTask(payload) {
  return request({
    url: 'api/task/Update',
    method: 'post',
    data: payload
  })
}

/**
 * 刪除工作
 * @param {*} payload
 * @returns
 */
export function deleteTask(payload) {
  return request({
    url: 'api/task/DeleteTask',
    method: 'post',
    data: payload
  })
}

/**
 * 取得工作人員列表
 * @param {*} payload
 * @returns
 */
export function getWorkerList() {
  return request({
    url: 'api/task/GetWorkerList',
    method: 'get'
  })
}

/**
 * 新增或更新指派工作
 * @param {*} payload
 * @returns
 */
export function updateResourceAssignment(payload) {
  return request({
    url: 'api/task/UpdateResourceAssignment',
    method: 'post',
    data: payload
  })
}

/**
 * 取得指派工作列表
 * @param {*} payload
 * @returns
 */
export function getResourceAssignmentList() {
  return request({
    url: 'api/task/GetResourceAssignmentList',
    method: 'get'
  })
}

/**
 * 刪除指派工作
 * @param {*} payload
 * @returns
 */
export function deleteResourceAssignment(payload) {
  return request({
    url: 'api/task/DeleteResourceAssignment',
    method: 'post',
    data: payload
  })
}

/**
 * 取得工作相依(延伸)關係列表
 * @param {*} payload
 * @returns
 */
export function getDependencies() {
  return request({
    url: 'api/task/GetDependencies',
    method: 'get'
  })
}

/**
 * 建立工作相依(延伸)關係
 * @param {*} payload
 * @returns
 */
export function createDependency(payload) {
  return request({
    url: 'api/task/CreateDependency',
    method: 'post',
    data: payload
  })
}

/**
 * 刪除工作相依(延伸)關係
 * @param {*} payload
 * @returns
 */
export function deleteDependency(payload) {
  return request({
    url: 'api/task/DeleteDependency',
    method: 'post',
    data: payload
  })
}
