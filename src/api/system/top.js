import request from '@/utils/request'

// 查询お知らせメッセージテーブル 列表
export function listMessage(query) {
  return request({
    url: '/system/top/list',
    method: 'get',
    params: query
  })
}

// // 查询お知らせメッセージテーブル 详细
// export function getMessage(oshiraseNo) {
//   return request({
//     url: '/system/message/' + oshiraseNo,
//     method: 'get'
//   })
// }
//
// // 新增お知らせメッセージテーブル
// export function addMessage(data) {
//   return request({
//     url: '/system/message',
//     method: 'post',
//     data: data
//   })
// }
//
// // 修改お知らせメッセージテーブル
// export function updateMessage(data) {
//   return request({
//     url: '/system/message',
//     method: 'put',
//     data: data
//   })
// }
//
// // 删除お知らせメッセージテーブル
// export function delMessage(oshiraseNo) {
//   return request({
//     url: '/system/message/' + oshiraseNo,
//     method: 'delete'
//   })
// }
