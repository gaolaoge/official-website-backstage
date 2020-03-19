import api from './index.js'

//keyWords
export function addTag(data) {
  return api({
    url: '/keywords',
    method: 'POST',
    data
  })
}

//获取关键字
export function getList(data) {
  return api({
    url: `/keywords?name=&pageSize=${data.size}&pageIndex=${data.page}`,
    method: 'GET',
  })
}

export function deleteTag(data) {
  return api({
    url: '/keywords',
    method: 'DELETE',
    data
  })
}

export function editTag(id,data) {
  return api({
    url: `/keywords/${id}`,
    method: 'PATCH',
    data
  })
}

export function searchKey(data) {
  return api({
    url: `/keywords?name=${data.name}&pageSize=${data.pageSize}&pageIndex=${data.index}`,
    method: 'GET',
    data
  })
}

//list
// 获取资讯列表
export function getNewsList(data) {
  return api({
    url: `/informations?name=${data.name}&pageSize=${data.size}&pageIndex=${data.page}&hide=${data.hide}`,
    method: 'GET'
  })
}

export function pushNews(data) {
  return api({
    url: `/informations`,
    method: 'POST',
    data
  })
}

// 删除
export function deleteNews(data) {
  return api({
    url: `/informations`,
    method: 'DELETE',
    data
  })
}

// 查看
export function viewsNews(data) {
  return api({
    url: `/informations/${data}`,
    method: 'GET'
  })
}

// 编辑
export function editNews(data) {
  return api({
    url: `/informations`,
    method: 'PUT',
    data
  })
}

// 加入我们
export function joinUsList(data) {
  return api({
    url: `/joins?pageSize=${data.pageSize}&pageIndex=${data.pageIndex}`,
    method: 'GET'
  })
}
